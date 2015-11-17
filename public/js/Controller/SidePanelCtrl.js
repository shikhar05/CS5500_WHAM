
app.controller("SidePanelCtrl", function ($rootScope, $scope, MyService) {
    $scope.showSidePanel = false;

    $scope.search = {
        city: null,
        type: null,
        fromDate: null,
        toDate: null,
        errors: {}
    }

    //$scope.$watch(function () {
    //    return $rootScope.showSidePanel
    //}, function (value) {
    //    $scope.showSidePanel = value;
    //    $scope.$apply();
    //},true)

    $scope.toggleSidePanel = function () {
        $scope.showSidePanel = !$scope.showSidePanel;
        $rootScope.showSidePanel = $scope.showSidePanel;
    }

    $scope.applyFilters = function () {
        validate();
    };

    function validate() {
        console.log($scope.search);
        if ($scope.search.city == '' ||
            $scope.search.city == null ||
            isNumeric($scope.search.city)) {
            $scope.search.errors.city = "Invalid City Name"
        } else {
            delete $scope.search.errors.city;
        };

        if ($scope.search.type == '' ||
            $scope.search.type == null ||
            isNumeric($scope.search.type)) {
            $scope.search.errors.type = "Invalid Type Name"
        } else {
            delete $scope.search.errors.type;
        };

        if ($scope.search.fromDate == '' ||
            $scope.search.fromDate == null) {
            $scope.search.errors.fromDate = "Invalid From Date"
        } else {
            delete $scope.search.errors.fromDate;
        };

        if ($scope.search.toDate == '' ||
            $scope.search.toDate == null) {
            $scope.search.errors.toDate = "Invalid To Date"
        } else {
            delete $scope.search.errors.toDate;
        };

        if ($scope.search.toDate != '' && $scope.search.toDate != null &&
            $scope.search.fromDate != '' && $scope.search.fromDate != null &&
            $scope.search.toDate < $scope.search.fromDate) {
            $scope.search.errors.toDate = "To Date can not be before from date"
        } else if ($scope.search.toDate != '' && $scope.search.toDate != null &&
            $scope.search.fromDate != '' && $scope.search.fromDate != null) {
            delete $scope.search.errors.toDate;
        };

    };

});

function isNumeric(n) {
    return !isNaN(parseFloat(n)) && isFinite(n);
}
