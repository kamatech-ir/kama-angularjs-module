var hashServicePubkey = '';
hashService.$inject = ['globalService'];
export default function hashService(globalService) {
    const service = {
        encode: encode
        , setPublickey: setPublickey
    }

    let maxLength = 55;

    return service;

    function setPublickey(key) {
        hashServicePubkey = key;
    }
    function encode(model) {
        if (globalService.isDeploymentMode())
            return model;

        var json = JSON.stringify(model);

        var hash = "";
        var loopLength = Math.ceil(json.length / maxLength);
        for (let i = 0; i < loopLength; i++) {
            var stratIndex = i * maxLength;
            let modelEncrypt = json.substr(stratIndex, maxLength);
            var encrypt = new JSEncrypt();
            encrypt.setPublicKey(hashServicePubkey);
            var encrypted = encrypt.encrypt(modelEncrypt);
            hash += `${encrypted} `;
        }
        return { Hash: hash };
    }
}