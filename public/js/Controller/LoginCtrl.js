
app.controller("LoginCtrl", function ($scope, MyService, $location, LoginService) {

    $scope.goToHome = function () {
        $location.url('/home');
    };

    $scope.registerUser = function () {
        var newUSer = $scope.register;

        LoginService.register(newUSer, function (msg) {

            console.log(msg);


            $location.url("/home");

        });

    };

    $scope.loginUser = function () {

        var user = $scope.login;

        LoginService.login(user, function (msg) {

            if (msg == 'ok') {
                console.log(LoginService.getCurrentUSerProfile());
                $location.url("/home");
            } else if (msg == 'error') {

            }

        });
    };


});
