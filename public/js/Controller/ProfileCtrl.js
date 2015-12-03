
app.controller("ProfileCtrl", function ($scope, LoginService, $location, $http) {

    $scope.types = ["music", "conference", "comedy",
                        "learning education", "family fun kids", "festivals parades", "movies film", "food",
                        "fundraisers", "art ", "support", "holiday", "books", "attractions", "community",
                        "business", "singles social", "schools alumni", "clubs associations",
                        "outdoors recreation", "performing arts", "animals", "politics activism", "sales", "science",
                        "religion spirituality", "sports", "technology", "other"];

    $scope.history = [];
    $scope.ratings = [];

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

        if ($scope.activeTabIndex == 1) {
            getHistoryDetails();
            getVenueDetails();
        }
    }


    //*************************************changePassword*************************************

    $scope.changePassword = function () {
        $scope.validateOldPassword();
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
    $scope.validateOldPassword = function () {
        if ($scope.editPassword.oldPassword == null || $scope.editPassword.oldPassword == "") {
            $scope.editPassword.errors.oldPassword = "Please enter your old Password.";
        } else {
            delete $scope.editPassword.errors.oldPassword;
        }
    }
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
        if ($scope.newPreference.type == null && $scope.newPreference.keywords == null) {
            $scope.newPreference.errors.type = "Please choose a category or keyword";
        } else {
            delete $scope.newPreference.errors.type;
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
    };

    $scope.clearNewPreferenceField = function () {
        $scope.newPreference = {
            of: $scope.activeSubTabIndex,
            type: null,
            keywords: null,
            errors: {}
        }
    };

    //*********************************************** Going to Event *******************************************//

    var getHistoryDetails = function () {
        $scope.loading = true;
        $scope.history = [];
        for (var i in $scope.userProfile.history) {
            var eventId = $scope.userProfile.history[i];
            var url = "http://api.eventful.com/json/events/get?app_key=k6C5qrCrdBgZMSkw&id=" + eventId + '&callback=JSON_CALLBACK';

            $http.jsonp(url)
                 .success(function (data) {
                     console.log(data.start_time);
                     var eventData = {
                         eventId: data.id,
                         eventName: data.title,
                         address: data.address + ", " + data.city + ", " + data.region + ", " + data.country,
                         venueId: data.venue_id,
                         venueName: data.venue_name
                     }

                     if (data.start_time) {

                         eventData.eventDate = data.start_time.split(" ")[0];
                     }

                     $scope.history.unshift(eventData);
                 }).error(function (err) {
                     $scope.loading = false;
                 });
        }

        $scope.loading = false;
    };

    $scope.deleteHistory = function (index) {
        var event = $scope.history[index];
        LoginService.deleteHistory(event.eventId, function (res) {
            if (res == 'ok') {
                $scope.history.splice(index, 1);
                alert("Successfully deleted from History");
            };
        });
    };

    //*********************************************** Rating *******************************************//

    $scope.rateVenue = function (venueId, rate) {
        LoginService.rateVenue(venueId, rate, function (resp) {

        });
    };

    var getVenueDetails = function () {

        $scope.loading = true;
        $scope.ratings = [];
        console.log($scope.userProfile);
        for (var i in $scope.userProfile.ratings) {
            var venueId = $scope.userProfile.ratings[i].venue_id;
            var url = "http://api.eventful.com/json/venues/get?app_key=k6C5qrCrdBgZMSkw&id=" + venueId + '&callback=JSON_CALLBACK';

            $http.jsonp(url)
                 .success(function (data) {
                     venueData = {
                         name: data.name,
                         address: data.address + ", " + data.city + ", " + data.region + ", " + data.country,
                         rating: $scope.userProfile.ratings[i].liked
                     };
                     $scope.ratings.unshift(venueData);
                 }).error(function (err) {
                     $scope.loading = false;
                 });
        }

        $scope.loading = false;
    };

});