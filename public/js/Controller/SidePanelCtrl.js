
app.controller("SidePanelCtrl", function ($rootScope,$scope, MyService) {
    $scope.showSidePanel = false;
    
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

    $scope.search = function () {
        validate();
    };

    function isNumeric(n) {
        return !isNaN(parseFloat(n)) && isFinite(n);
    }

    function validate() {
        if ($scope.search.place == '' &&
            $scope.search.place == undefined &&
            isNumeric($scope.search.place)) {
            $scope.error.place = "Invalid Place Name"
        }

        if ($scope.search.type == '' &&
            $scope.search.type == undefined &&
            isNumeric($scope.search.type)) {
            $scope.error.place = "Invalid Type Name"
        }

        console.log($scope.error.place+$scope.search.fromDate);

        //$scope.search.fromDate
        //$scope.search.toDate
    };

});