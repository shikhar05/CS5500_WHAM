
app.controller("SidePanelCtrl", function ($rootScope,$scope, MyService) {
    $scope.showSidePanel = false;
    
    $scope.$watch(function () {
        return $rootScope.showSidePanel
    }, function (value) {
        $scope.showSidePanel = value;
        $scope.$apply();
    },true)

    $scope.toggleSidePanel = function () {
        $scope.showSidePanel = !$scope.showSidePanel;
        $rootScope.showSidePanel = $scope.showSidePanel;

    }

});