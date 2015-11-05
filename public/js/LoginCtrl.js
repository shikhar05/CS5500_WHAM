
app.controller("LoginCtrl", function ($scope, MyService, $location) {

    $scope.goToHome = function () {
        $location.url('/home');
    };

    $scope.registerUser = function () {
        var newUSer = $scope.register;

        MyService.register(newUSer, function (msg) {

            console.log(msg);


            $location.url("/home");

        });

    };

    $scope.loginUser = function () {

        var user = $scope.login;

        MyService.login(user, function (msg) {

            if (msg == 'ok') {
                console.log(MyService.getCurrentUSerProfile());
                $location.url("/home");
            } else if (msg == 'error') {

            }

        });
    };


});
