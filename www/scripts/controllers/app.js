'use strict';

/**
 * @ngdoc
 * @name dawasco.controller:AppController
 * @description
 * # Application Controller
 * Handle application events
 */

angular
  .module('dawasco')
  .controller('AppController', AppController);

AppController.$inject = ['$rootScope', '$cordovaToast', '$cordovaNetwork', '$ionicLoading'];

function AppController($rootScope, $cordovaToast, $cordovaNetwork, $ionicLoading) {

  $rootScope.$on('signinBegin', function () {
    $ionicLoading.show({
      content: 'Loading',
      animation: 'fade-in',
      showBackdrop: true,
      hideOnStateChange: true,
      maxWidth: 200,
      showDelay: 0
    });
  });




  $rootScope.$on('signinError', function (response) {

    // check for network connection and toast if it is offline
    if (!$cordovaNetwork.isOnline()) {
      $cordovaToast.
      showLongBottom('No Network Connection')
        .then(function (success) {
          $ionicLoading.hide();
        }, function (error) {
          console.log(error);
          $ionicLoading.hide();
        });
    } else {

      // show toast when login credentials are invalid
      $cordovaToast
        .showLongBottom('Invalid Email or Password, Please Try Again')
        .then(function (success) {
          $ionicLoading.hide();
        }, function (error) {
          console.log(error);
          $ionicLoading.hide();
        });

    }
  });

}
