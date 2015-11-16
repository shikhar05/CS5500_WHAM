
app.controller("LoginCtrl", function ($scope, MyService, $location, LoginService) {

    $scope.goToHome = function () {
        $location.url('/home');
    };

    $scope.registerUser = function () {

        if ($scope.register.confirmPassword == $scope.register.password) {
            var newUSer = $scope.register;
            console.log(newUSer);
            LoginService.register(newUSer, function (msg) {

                $location.url("/home");

            });
        } else {

        };

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
