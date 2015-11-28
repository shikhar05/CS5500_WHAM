
app.controller("ProfileCtrl", function ($scope, LoginService, $location) {

    $scope.activeTabIndex = 0;

    $scope.init = function () {
        $scope.profileOptionsToggle = false;
    }

    $scope.goToHome = function () {
        $location.url('/home');
    };

    $scope.userProfile = null;

    $scope.$watch(
        function () { return LoginService.getCurrentUSerProfile() },
        function (resp) {
            $scope.userProfile = resp;
        }, true);

    $scope.setProfileOptionsToggle = function () {
        $scope.profileOptionsToggle = !$scope.profileOptionsToggle;
    };

    $scope.logout = function () {
        LoginService.logout();
    };

    $scope.goToProfile = function () {
        $location.url("/profile");
    };

    $scope.openTab = function (index) {
        $scope.activeTabIndex = index;
    }
});