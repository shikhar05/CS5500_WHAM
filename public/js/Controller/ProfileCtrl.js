
app.controller("ProfileCtrl", function ($scope, LoginService, $location) {

    $scope.activeTabIndex = 0;
    $scope.activeSubTabIndex = 0;

    $scope.userProfile = null;

    $scope.editPassword = {
        oldPassword: null,
        newPassword: null,
        confirmPassword: null,
        errors: {}
    };

    $scope.newPreference = {
        of: $scope.activeSubTabIndex,
        type: null,
        keywords: null,
        errors: {}
    }

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
        $scope.activeSubTabIndex = 0;
        $scope.activeTabIndex = index;

        //Clean input fields
        $scope.editPassword = {
            oldPassword: null,
            newPassword: null,
            confirmPassword: null,
            errors: {}
        };

        $scope.newPreference = {
            of: $scope.activeSubTabIndex,
            type: null,
            keywords: null,
            errors: {}
        }
    }


    //*************************************changePassword*************************************

    $scope.changePassword = function () {
        //$scope.validateOldPassword();
        $scope.validateNewPassword();
        $scope.validateNewConfirmPassword();

        if (Object.keys($scope.editPassword.errors).length == 0) {

            LoginService.changePassword($scope.editPassword, function (msg) {
                $scope.editPassword = {
                    oldPassword: null,
                    newPassword: null,
                    confirmPassword: null,
                    errors: {}
                };

                if (msg == 'ok') {
                    alert("Password changed successfully");
                } else {
                    alert("Incorrect old-password");
                }
            });

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

    $scope.openSubTab = function (index) {
        $scope.activeSubTabIndex = index;
        if ($scope.activeTabIndex == 2) {
            $scope.newPreference.of = index;
        }
    };

    // ****************************************Preferences *************************************************//

    $scope.addPreference = function () {
        if ($scope.newPreference != null) {
            LoginService.updatePreference($scope.newPreference);
            $scope.newPreference = {
                of: $scope.activeSubTabIndex,
                type: null,
                keywords: null,
                errors: {}
            }
        }
    };

    $scope.updatePreference = function (index) {
        var pref = $scope.userProfile.preferences[$scope.activeSubTabIndex][index];
        $scope.newPreference = {
            of: $scope.activeSubTabIndex,
            type: pref.type,
            keywords: pref.keywords,
            errors: {}
        }
    };


    $scope.removePreference = function (index) {
        var conf = confirm("Do you really want to delete your preference?");
        if (conf) {
            var pref = $scope.userProfile.preferences[$scope.activeSubTabIndex][index];
            var deletePref = {
                of: $scope.activeSubTabIndex,
                type: pref.type,
                keywords: pref.keywords,
                errors: {}
            }
            console.log(deletePref);
            LoginService.deletePreference(deletePref);
            $scope.newPreference = {
                of: $scope.activeSubTabIndex,
                type: null,
                keywords: null,
                errors: {}
            }
        }
    }

    $scope.clearNewPreferenceField = function () {
        $scope.newPreference = {
            of: $scope.activeSubTabIndex,
            type: null,
            keywords: null,
            errors: {}
        }
    }
});