
app.controller("SidePanelCtrl", function ($rootScope, $scope, MyService) {
    $scope.showSidePanel = false;

    $scope.search = {
        city: null,
        type: null,
        fromDate: null,
        toDate: null,
        errors: {}
    }

    $scope.init = function () {
        MyService.setFilter($scope.search);
    }

    $scope.toggleSidePanel = function () {
        $scope.showSidePanel = !$scope.showSidePanel;
        $rootScope.showSidePanel = $scope.showSidePanel;
    }

    function validate() {
        if (!($scope.search.type == '' || $scope.search.type == null) &&
            isNumeric($scope.search.type)) {
            $scope.search.errors.type = "Invalid Type Name"
        } else {
            delete $scope.search.errors.type;
        };

        if (!($scope.search.fromDate == '' || $scope.search.fromDate == null) &&
            !($scope.search.toDate == '' || $scope.search.toDate == null)) {
            if ($scope.search.toDate < $scope.search.fromDate) {
                $scope.search.errors.toDate = "can not be before from date";
            } else {
                delete $scope.search.errors.toDate;
            }
        }
    };
});

