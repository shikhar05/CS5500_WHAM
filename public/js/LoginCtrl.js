
app.controller("LoginCtrl", function ($scope, MyService,$location) {

    $scope.goToHome = function () {
        $location.url('/home');
    }

});
