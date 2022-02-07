﻿authService.$inject = ['$http', '$q', '$state', '$localStorage', '$sessionStorage', '$rootScope'];
export default function authService($http, $q, $state, $localStorage, $sessionStorage, $rootScope) {
    const service = {
        login: login
        , logOut: logOut
        , fillAuthData: fillAuthData
        , authentication: authentication
        , authHeader: authHeader
        , checkToken: checkToken
        , redirectToLogin: redirectToLogin
        , getRoles: getRoles
    }

    let serviceBase = NG_PDD.apis.auth
        , authentication = { isAuth: false, userName: '' };

    return service;

    function login(loginData) {
        let data = `grant_type=password&username=${loginData.userName}&password=${loginData.password}&client_id=${ngPanelSettings.clientId}`
            , deferred = $q.defer();

        $http.post(serviceBase + "token", data, {
            headers: { "Content-Type": "application/x-www-form-urlencoded" }
        }).then(function (response) {

            if ($rootScope.appInfo.type === 'intranet') {
                if (loginData.useRefreshTokens)
                    $localStorage["authorizationData"] = { token: response.data.access_token, userName: loginData.userName, refreshToken: response.data.refresh_token, useRefreshTokens: true }
                else
                    $localStorage["authorizationData"] = { token: response.data.access_token, userName: loginData.userName, refreshToken: "", useRefreshTokens: false }
            }
            else {
                if (loginData.useRefreshTokens)
                    $sessionStorage["authorizationData"] = { token: response.data.access_token, userName: loginData.userName, refreshToken: response.data.refresh_token, useRefreshTokens: true }
                else
                    $sessionStorage["authorizationData"] = { token: response.data.access_token, userName: loginData.userName, refreshToken: "", useRefreshTokens: false }
            }

            authentication.isAuth = true;
            authentication.userName = loginData.userName;
            authentication.useRefreshTokens = loginData.useRefreshTokens;

            deferred.resolve(response.data);
        }, function (err, status) {
            logOut();
            deferred.reject(err);
        });

        return deferred.promise;
    }
    function logOut() {
        $localStorage["authorizationData"] = '';
        $sessionStorage["authorizationData"] = '';
        authentication.isAuth = false;
        authentication.userName = "";
    }
    function fillAuthData() {
        var authData;
        if ($rootScope.appInfo.type === 'intranet')
            authData = $localStorage["authorizationData"];
        else
            authData = $sessionStorage["authorizationData"];

        if (authData) {
            authentication.isAuth = true;
            authentication.userName = authData.userName;
        }
    }
    function authHeader() {
        var authData;
        if ($rootScope.appInfo.type === 'intranet')
            authData = $localStorage["authorizationData"];
        else
            authData = $sessionStorage["authorizationData"];

        let data = { key: 'Authorization', value: null }
            , authData = authData;

        if (authData) {
            data.value = 'Bearer ' + authData.token;
            return data;
        }
        else
            return null;
    }
    function checkToken() {
        var authData;
        if ($rootScope.appInfo.type === 'intranet')
            authData = $localStorage["authorizationData"];
        else
            authData = $sessionStorage["authorizationData"];

        if (authData) {
            let expToken = authData.token;

            if (expToken == null) {
                logOut();
                redirectToLogin();
            }

            let tokenPayLoad = jwtHelper.decodeToken(expToken);
            let isExpired = jwtHelper.isTokenExpired(expToken);

            if (isExpired) {
                logOut();
                redirectToLogin();
            }
        }
        else
            redirectToLogin();
    }
    function redirectToLogin() {
        $state.go('auth.signin');
    }
    function getRoles() {
        authData
        var authData;
        if ($rootScope.appInfo.type === 'intranet')
            authData = $localStorage["authorizationData"];
        else
            authData = $sessionStorage["authorizationData"];

        let expToken = authData.token
            , tokenPayload = jwtHelper.decodeToken(expToken);

        return tokenPayload.role;
    }
}