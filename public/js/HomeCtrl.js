
app.controller("HomeCtrl", function ($scope, MyService, $location) {

    $scope.goToLoginPage = function () {
        $location.url("/login");
    };

});
