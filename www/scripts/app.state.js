'use strict';

/**
 *@description Application States
 */

angular
  .module('dawasco')
  .config(configFunc);

configFunc.$inject = ['$stateProvider', '$urlRouterProvider',
  '$ionicConfigProvider', '$authProvider', 'ENV'
];

function configFunc($stateProvider, $urlRouterProvider, $ionicConfigProvider, $authProvider, ENV) {

  //center view title always
  $ionicConfigProvider.navBar.alignTitle('center');
  //disable previous title to be used in back button
  $ionicConfigProvider.backButton.previousTitleText(false);

  //remove back button text
  $ionicConfigProvider.backButton.text('');

  //position tabs on the top
  $ionicConfigProvider.tabs.position('bottom');

  //use standard tabs style
  $ionicConfigProvider.tabs.style('standard');

  //enable js scrolling
  $ionicConfigProvider.scrolling.jsScrolling(true);

  // configurations for ngAA
  $authProvider.afterSigninRedirectTo = 'app.dashboard.overviews';

  $authProvider.profileKey = 'party';

  $authProvider.signinTemplateUrl = 'views/auth/signin.html';

  $authProvider.signinUrl = '/signin';

  $authProvider.tokenPrefix = 'dawasco';

  $authProvider.signinUrl = [ENV.apiEndPoint.web, 'signin'].join('/');


  //provide fallback state
  // this is a hack for fix an issue with ui router
  $urlRouterProvider.otherwise(function ($injector, $location) {
    var $state = $injector.get("$state");
    $state.go('app.dashboard.overviews');
  });

  //base application state
  $stateProvider
    .state('app', {
      abstract: true,
      templateUrl: 'views/layouts/app.html'
    })

    // Dashboard states
    .state('app.dashboard', {
      abstract: true,
      templateUrl: 'views/layouts/tabs.html',
      controller: function ($rootScope, $scope) {
        $scope.refresh = function (event) {
          console.log('reload', event);
          $rootScope.$broadcast(event);
        };
      },
      resolve: {
        party: function ($auth) {
          return $auth.getProfile();
        }
      }
    })
    .state('app.dashboard.overviews', {
      url: '/overviews',
      views: {
        'overviews': {
          templateUrl: 'views/dashboards/overviews.html',
          controller: 'DashboardOverviewCtrl'
        }
      },
      data: {
        authenticated: true
      },
      resolve: {
        endpoints: function (Summary) {
          return Summary.endpoints({
            query: {
              deletedAt: {
                $eq: null
              }
            }
          });
        }
      }
    })
    // view jurisdiction performance from overview report
    .state('app.dashboard.jurisdiction', {
      url: '/jurisdiction',
      views: {
        'overviews': {
          templateUrl: 'views/dashboards/performances.html',
          controller: 'DashboardPerformanceCtrl'
        }
      },
      params: {
        jurisdiction: null,
        startedAt: null,
        endedAt: null
      },
      data: {
        authenticated: true
      },
      resolve: {
        endpoints: function (Summary) {
          return Summary.endpoints({
            query: {
              deletedAt: {
                $eq: null
              }
            }
          });
        }
      }
    })
    .state('app.dashboard.performance', {
      url: '/performance',
      views: {
        'performance': {
          templateUrl: 'views/dashboards/performances.html',
          controller: 'DashboardPerformanceCtrl'
        }
      },
      data: {
        authenticated: true
      },
      resolve: {
        endpoints: function (Summary) {
          return Summary.endpoints({
            query: {
              deletedAt: {
                $eq: null
              }
            }
          });
        }
      }
    })
    .state('app.dashboard.standing', {
      url: '/standing',
      views: {
        'standing': {
          templateUrl: 'views/dashboards/standing.html',
          controller: 'DashboardStandingCtrl'
        }
      },
      data: {
        authenticated: true
      },
      resolve: {
        endpoints: function (Summary) {
          return Summary.endpoints({
            query: {
              deletedAt: {
                $eq: null
              }
            }
          });
        }
      }
    })
    .state('app.dashboard.productivity', {
      url: '/productivity',
      views: {
        'productivity': {
          templateUrl: 'views/dashboards/productivity.html'
        }
      },
      data: {
        authenticated: true
      }
    });
}
