
app.controller("HomeCtrl", function ($scope, MyService, $location, LoginService) {
    $scope.userProfile = null;

    $scope.goToLoginPage = function () {
        $location.url("/login");
    };

    $scope.$watch(function () {
        return LoginService.getCurrentUSerProfile();
    }, function (response) {
        console.log(response);
        $scope.userProfile = response;
    }, true);

});
