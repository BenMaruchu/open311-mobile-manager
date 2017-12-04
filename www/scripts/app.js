'use strict';

angular
  .module('dawasco', [
    'ionic',
    'angular-echarts',
    'ngAA',
    'pickadate',
    'checklist-model',
    'ngCordova'
  ])
  .run(runFunc);

runFunc.$inject = ['$ionicPlatform'];

function runFunc($ionicPlatform /*, $cordovaSplashscreen , $cordovaStatusbar*/ ) {

  $ionicPlatform.ready(function () {

    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);

    }

    // get network information


    //set status bar colors
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      // $cordovaStatusbar.styleHex('#fff');
      // $cordovaStatusbar.hide();
      // StatusBar.styleDefault();
    }

    //hide splashscreen
    // $cordovaSplashscreen.hide();

  });

}
