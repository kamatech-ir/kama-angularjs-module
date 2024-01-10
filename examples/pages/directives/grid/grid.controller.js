(function () {
  angular.module('test').controller('GridController', GridController);

  GridController.$inject = ['ObjectService', '$http'];
  function GridController(ObjectService, $http) {
    var example = this;

    example.test = new ObjectService();

    example.test.grid2HeaderVisibility = true;
    example.test.toggleHeader = toggleHeader;
    example.test.showSelectedItemIds = () => {
      alert(
        example.test.grid.items
          .filter((item) => {
            return item.checked;
          })
          .map((item) => {
            return item.id;
          })
          .toString()
      );
    };
    example.test.grid = {
      bindingObject: example.test,
      initLoad: true,
      columns: [
        { name: 'id', displayName: 'شناسه', fixed: true, fixedWidth: 70, getClass: (value, item) => { return value % 2 === 0 || item.name[0] === 'C' ? 'text-success' : '' } },
        { name: 'name', displayName: 'نام', fixed: true, fixedWidth: 150 },
        { name: 'email', displayName: 'ایمیل', fixed: true, fixedWidth: 200 },
        { name: 'phone', displayName: 'تلفن' },
        { name: 'id', displayName: '2شناسه', getClass: (value, item) => { return value % 2 === 0 || item.name[0] === 'C' ? 'text-success' : '' } },
        { name: 'name', displayName: '2نام' },
        { name: 'email', displayName: '2ایمیل' },
        { name: 'phone', displayName: '2تلفن' },
        { name: 'id', displayName: '3شناسه', getClass: (value, item) => { return value % 2 === 0 || item.name[0] === 'C' ? 'text-success' : '' } },
        { name: 'name', displayName: '3نام' },
        { name: 'email', displayName: '3ایمیل', fixed: true, fixedWidth: 120 },
        { name: 'phone', displayName: '3تلفن', fixed: true, fixedWidth: 100 },
      ],
      readOnly: function () {
        return false;
      },
      selectable: false,
      checkedVisibility: (item) => {
        return parseInt(item.id) % 2 === 0;
      },
      actions: [
        {
          name: 'view',
          title: 'مشاهده',
          class: "fa fa-folder-open-o",
          onclick: (item) => { alert(item.id); },
          onrightclick: (item) => { alert(item.name); },
        }
      ],
      displayNameFormat: ['Name'],
      globalSearch: true,
      listService: universities,
    };
    example.test.grid2 = {
      items: [
        {
          testName: 'John Doe',
          testDate: new Date(),
          testMinutes: 290,
          testMoney: 290500,
          user: { full: { name: 'wow1' } },
        },
      ],
      checkHeaderVisibility: () => {
        return example.test.grid2HeaderVisibility;
      },
      bindingObject: example.test,
      columns: [
        { name: 'user.full.name', displayName: 'چند قسمتی' },
        { name: 'testName', displayName: 'نام' },
        { name: 'testMoney', displayName: 'مبلغ', type: 'money' },
        { name: 'testDate', displayName: 'تاریخ', type: 'date' },
        { name: 'testDate', displayName: 'ساعت', type: 'time' },
        {
          name: 'testMinutes',
          displayName: 'ساعت 2',
          type: 'time',
          callback: function (input) {
            return 'ساعت ' + input;
          },
        },
      ],
      displayNameFormat: (data) => {
        return `کاربر به نام ${data.testName}`;
      },
      rowClass: () => {
        return 'text-danger';
      },
      globalSearch: true,
    };

    function universities(options) {
      return $http({
        method: 'GET',
        url: 'https://jsonplaceholder.typicode.com/users',
        data: options,
      }).then(function (result) {
        return [result.data[0]];
      });
    }
    function toggleHeader() {
      example.test.grid2HeaderVisibility = !example.test.grid2HeaderVisibility;
    }
  }
})();
