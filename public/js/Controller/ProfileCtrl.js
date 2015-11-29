
app.controller("ProfileCtrl", function ($scope, LoginService, $location) {

    $scope.activeTabIndex = 0;

    $scope.userProfile = null;

    $scope.editPassword = {
        oldPassword: null,
        newPassword: null,
        confirmPassword: null,
        errors: {}
    };

    $scope.init = function () {
        $scope.profileOptionsToggle = false;
    }

    $scope.$watch(function () {
        return LoginService.getCurrentUSerProfile();
    }, function (response) {
        $scope.userProfile = response;
    }, true);

    $scope.goToHome = function () {
        $location.url('/home');
    };

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

   

    //*************************************changePassword*************************************

    $scope.changePassword = function () {
      //  $scope.validateOldPassword();
        $scope.validateNewPassword();
        $scope.validateNewConfirmPassword();

        if (Object.keys($scope.editPassword.errors).length == 0) {

           // var newUSer = $scope.register;
           // LoginService.register(newUSer, function (msg) {
              //  if (msg == 'ok') {
                //    $location.url("/home");
               // }
          //  });
        };
    };
   // $scope.validateOldPassword = function () {
    //}
    $scope.validateNewPassword = function () {
        if ($scope.editPassword.newPassword == null || $scope.editPassword.newPassword == "") {
            $scope.editPassword.errors.newPassword = "Please choose a Password.";
        } else if ($scope.editPassword.newPassword.length < 8 || $scope.editPassword.newPassword.length > 15) {
            $scope.editPassword.errors.newPassword = "Password must be a atlease 8 characters and atmost 15 characters";
        } else {
            if ($scope.editPassword.confirmPassword != null || $scope.editPassword.confirmPassword != "") {
                $scope.validateNewConfirmPassword();
            }
            delete $scope.editPassword.errors.newPassword;
        };
    };

    $scope.validateNewConfirmPassword = function () {
        if ($scope.editPassword.confirmPassword == null || $scope.editPassword.confirmPassword == "") {
            $scope.editPassword.errors.confirmPassword = "Please confirm Password.";
        } else if ($scope.editPassword.confirmPassword != $scope.editPassword.newPassword) {
            $scope.editPassword.errors.confirmPassword = "Passwords does not match.";
        } else {
            delete $scope.editPassword.errors.confirmPassword;
        };
    };
});