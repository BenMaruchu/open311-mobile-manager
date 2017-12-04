'use strict';

/**
 * @ngdoc function
 * @name dawasco.controller:DashboardOverviewCtrl
 * @description
 * # DashboardOverviewCtrl
 * Service Request controller of dawasco
 */
angular
  .module('dawasco')
  .controller('DashboardOverviewCtrl', DashboardOverviewCtrl);

DashboardOverviewCtrl.$inject = ['$q', '$rootScope', '$scope', '$state', '$ionicModal', '$ionicLoading', '$filter', 'Summary', 'endpoints'];

function DashboardOverviewCtrl($q, $rootScope, $scope, $state, $ionicModal, $ionicLoading, $filter, Summary, endpoints) {

  //initialize scope attributes
  $scope.maxDate = new Date();

  //bind states
  $scope.priorities = endpoints.priorities.priorities;
  $scope.statuses = endpoints.statuses.statuses;
  $scope.services = endpoints.services.services;
  $scope.servicegroups = endpoints.servicegroups.servicegroups;
  $scope.jurisdictions = endpoints.jurisdictions.jurisdictions;
  // $scope.workspaces = party.settings.party.relation.workspaces;

  //bind filters
  var defaultFilters = {
    startedAt: moment().utc().startOf('year').toDate(),
    endedAt: moment().utc().endOf('date').toDate(),
    statuses: [],
    services: [],
    priorities: [],
    servicegroups: [],
    jurisdictions: [],
    workspaces: []
  };

  $scope.filters = defaultFilters;

  // initialize overviews
  $scope.overviews = {};
  // $scope.issues = {};
  $scope.visualizationPieConfig = {
    height: 300,
    forceClear: true
  };


  function init() {

    $scope.modalTitle = 'Overview Reports - Filters';

    $ionicModal.fromTemplateUrl('views/templates/filters/filters.html', {
      scope: $scope,
      animation: 'slide-in-up'
    }).then(function (modal) {
      $scope.modal = modal;
    });
  }


  // Open filters modal Window
  $scope.openModal = function () {
    $scope.modal.show();
  };



  // Close Filter modal window
  $scope.closeModal = function () {
    $scope.modal.hide();
  };


  /**
   * Filter overview reports based on on current selected filters
   * @param {Boolean} [reset] whether to clear and reset filter
   */
  $scope.filter = function (reset) {
    if (reset) {
      $scope.filters = defaultFilters;
    }

    //prepare query
    $scope.params = Summary.prepareQuery($scope.filters);

    //load reports
    $scope.reload();

    //close current modal
    $scope.closeModal();
  };


  /**
   * Filter service based on selected service group
   */
  $scope.filterServices = function () {
    var filterHasServiceGroups =
      ($scope.filters.servicegroups && $scope.filters.servicegroups.length >
        0);
    //pick only service of selected group
    if (filterHasServiceGroups) {
      //filter services based on service group(s)
      $scope.services =
        _.filter(endpoints.services.services, function (service) {
          return _.includes($scope.filters.servicegroups, service.group
            ._id);
        });
    }
    //use all services
    else {
      $scope.services = endpoints.services.services;
    }
  };


  $scope.prepare = function () {
    //prepare charts
    $scope.prepareJurisdictionsVisualization();
    $scope.prepareServiceGroupsVisualization();
    $scope.prepareServicesVisualization();
    $scope.prepareJurisdictionVisualization();
    $scope.prepareServiceGroupVisualization();
    $scope.prepareServiceVisualization();
    $scope.prepareMethodVisualization();
    $scope.prepareWorkspaceVisualization();
    $scope.prepareJurisdictionsRanks();
    $scope.prepareServiceGroupsRanks();
    $scope.prepareServicesRanks();
  };


  /**
   * prepare jurisdiction overview visualization
   * @return {object} echart bar chart configurations
   * @version 0.1.0
   * @since  0.1.0
   * @author lally elias<lallyelias87@gmail.com>
   */
  $scope.prepareJurisdictionsVisualization = function (column) {

    //ensure column
    column = column || 'count';


    //prepare chart series data
    var data = _.map($scope.overviews.jurisdictions, function (group) {
      return {
        name: group.name,
        value: group[column]
      };
    });

    //prepare chart config
    $scope.perJurisdictionConfig = {
      height: 400,
      forceClear: true
    };

    //prepare chart options
    $scope.perJurisdictionOptions = {
      textStyle: {
        fontFamily: 'Lato'
      },
      title: {
        text: column === 'count' ? 'Total' : _.upperFirst(column.toLowerCase()),
        subtext: $filter('number')(_.sumBy(data, 'value'), 0),
        x: 'center',
        y: 'center',
        textStyle: {
          fontWeight: 'normal',
          fontSize: 16
        }
      },
      // tooltip: {
      //   show: true,
      //   trigger: 'item',
      //   formatter: "{b}:<br/> Count: {c} <br/> Percent: ({d}%)"
      // },
      series: [{
        type: 'pie',
        selectedMode: 'single',
        radius: ['35%', '45%'],
        color: _.map($scope.overviews.jurisdictions, 'color'),

        label: {
          normal: {
            formatter: '{b}\n{d}%\n( {c} )',
          }
        },
        data: data
      }]
    };

  };


  /**
   * prepare service group overview visualization
   * @return {object} echart bar chart configurations
   * @version 0.1.0
   * @since  0.1.0
   * @author lally elias<lallyelias87@gmail.com>
   */
  $scope.prepareServiceGroupsVisualization = function (column) {

    //ensure column
    column = column || 'count';


    //prepare chart series data
    var data = _.map($scope.overviews.groups, function (group) {
      return {
        name: group.name,
        value: group[column]
      };
    });

    //prepare chart config
    $scope.perServiceGroupConfig = {
      height: 400,
      forceClear: true
    };

    //prepare chart options
    $scope.perServiceGroupOptions = {
      textStyle: {
        fontFamily: 'Lato'
      },
      title: {
        text: column === 'count' ? 'Total' : _.upperFirst(column.toLowerCase()),
        subtext: $filter('number')(_.sumBy(data, 'value'), 0),
        x: 'center',
        y: 'center',
        textStyle: {
          fontWeight: 'normal',
          fontSize: 14
        }
      },
      // tooltip: {
      //   show: true,
      //   trigger: 'item',
      //   formatter: "{b}:<br/> Count: {c} <br/> Percent: ({d}%)"
      // },
      series: [{
        type: 'pie',
        selectedMode: 'single',
        radius: ['30%', '40%'],
        color: _.map($scope.overviews.groups, 'color'),
        label: {
          normal: {
            formatter: '{b}\n{d}%\n( {c} )',
          }
        },
        data: data
      }]
    };

  };


  /**
   * prepare per service bar chart
   * @return {object} echart bar chart configurations
   * @version 0.1.0
   * @since  0.1.0
   * @author lally elias<lallyelias87@gmail.com>
   */
  $scope.prepareServicesVisualization = function (column) {

    //ensure column
    column = column || 'count';

    //prepare unique service groups for bar chart categories
    var categories = _.chain($scope.overviews)
      .map('services')
      .uniqBy('name')
      .value();

    //prepare bar chart series data
    var data =
      _.map($scope.overviews.services, function (service) {

        var serie = {
          name: service.name,
          value: service[column],
          itemStyle: {
            normal: {
              color: service.color
            }
          }
        };

        return serie;

      });

    //sort data by their value
    data = _.orderBy(data, 'value', 'asc');

    //prepare chart config
    $scope.perServiceConfig = {
      height: '1100',
      forceClear: true
    };

    //prepare chart options
    $scope.perServiceOptions = {
      color: _.map(data, 'itemStyle.normal.color'),
      textStyle: {
        fontFamily: 'Lato'
      },
      tooltip: {
        trigger: 'item',
        formatter: '{b} : {c}'
      },
      toolbox: {
        show: true,
        feature: {
          saveAsImage: {
            name: 'Services Overview - ' + new Date().getTime(),
            title: 'Save',
            show: true
          }
        }
      },
      calculable: true,
      yAxis: [{
        type: 'category',
        data: _.map(data, 'name'),
        boundaryGap: true,
        axisTick: {
          alignWithLabel: true
        },
        axisLabel: {
          rotate: 60,
        },
        axisLine: {
          show: true
        }
      }],
      xAxis: [{
        type: 'value',
        scale: true,
        position: 'top',
        boundaryGap: true,
        axisTick: {
          show: false,
          lineStyle: {
            color: '#ddd'
          }
        },
        splitLine: {
          show: false
        }
      }],
      series: [{
        type: 'bar',
        barWidth: '55%',
        label: {
          normal: {
            show: true,
            position: 'right'
          }
        },
        data: data
      }]
    };

  };


  /**
   * prepare per jurisdiction pie chart options
   * @return {object} echart pie options configurations
   * @version 0.1.0
   * @since 0.1.0
   * @author Benson Maruchu<benmaruchu@gmail.com>
   */
  $scope.prepareJurisdictionVisualization = function () {

    $scope.overviews.jurisdictions = _.map($scope.overviews.jurisdictions, function (jurisdiction) {

      var data = [{
        name: 'Pending',
        value: jurisdiction.pending
      }, {
        name: 'Resolved',
        value: jurisdiction.resolved
      }];

      return _.merge({}, jurisdiction, {
        pie: {
          textStyle: {
            fontFamily: 'Lato'
          },
          title: {
            text: 'Total',
            subtext: jurisdiction.count,
            x: 'center',
            y: 'center',
            textStyle: {
              fontWeight: 'normal',
              fontSize: 16
            }
          },
          // tooltip: {
          //   show: true,
          //   trigger: 'item',
          //   formatter: "{b}:<br/> Count: {c} <br/> Percent: ({d}%)"
          // },
          series: [{
            type: 'pie',
            selectedMode: 'single',
            radius: ['30%', '40%'],
            color: ['#00acee',
              '#52cdd5',
              '#79d9f1',
              '#a7e7ff',
              '#c8efff'
            ],
            label: {
              normal: {
                formatter: '{b}\n{d}%\n ( {c} )'
              }
            },
            data: data
          }]
        }
      });
    });
  };


  /**
   * prepare per service group pie chart options
   * @return {object} echart pie options configurations
   * @version 0.1.0
   * @since 0.1.0
   * @author Benson Maruchu<benmaruchu@gmail.com>
   */
  $scope.prepareServiceGroupVisualization = function () {
    $scope.overviews.groups = _.map($scope.overviews.groups, function (group) {

      var data = [{
        name: 'Pending',
        value: group.pending
      }, {
        name: 'Resolved',
        value: group.resolved
      }];

      return _.merge({}, group, {
        pie: {
          textStyle: {
            fontFamily: 'Lato'
          },
          title: {
            text: 'Total',
            subtext: group.count,
            x: 'center',
            y: 'center',
            textStyle: {
              fontWeight: 'normal',
              fontSize: 12
            }
          },
          // tooltip: {
          //   show: true,
          //   trigger: 'item',
          //   formatter: "{b}:<br/> Count: {c} <br/> Percent: ({d}%)"
          // },
          series: [{
            type: 'pie',
            selectedMode: 'single',
            radius: ['30%', '40%'],
            color: ['#00acee',
              '#52cdd5',
              '#79d9f1',
              '#a7e7ff',
              '#c8efff'
            ],
            label: {
              normal: {
                formatter: '{b}\n{d}%\n( {c} )'
              }
            },
            data: data
          }]
        }
      });
    });
  };


  /**
   * prepare per service pie chart options
   * @return {object} echart pie options configurations
   * @version 0.1.0
   * @since 0.1.0
   * @author Benson Maruchu<benmaruchu@gmail.com>
   */
  $scope.prepareServiceVisualization = function () {
    $scope.overviews.services = _.map($scope.overviews.services, function (service) {

      var data = [{
        name: 'Pending',
        value: service.pending
      }, {
        name: 'Resolved',
        value: service.resolved
      }];

      return _.merge({}, service, {
        pie: {
          textStyle: {
            fontFamily: 'Lato'
          },
          title: {
            text: 'Total',
            subtext: service.count,
            x: 'center',
            y: 'center',
            textStyle: {
              fontWeight: 'normal',
              fontSize: 16
            }
          },
          // tooltip: {
          //   show: true,
          //   trigger: 'item',
          //   formatter: "{b}:<br/> Count: {c} <br/> Percent: ({d}%)"
          // },
          series: [{
            type: 'pie',
            selectedMode: 'single',
            radius: ['30%', '40%'],
            color: [
              '#00acee',
              '#52cdd5',
              '#79d9f1',
              '#a7e7ff',
              '#c8efff'
            ],
            label: {
              normal: {
                formatter: '{b}\n{d}%\n( {c} )',
              }
            },
            data: data
          }]
        }
      });
    });
  };


  /**
   * prepare ranks based on total issues per jurisdiction
   * @return {Object} with jurisdictions<Array> objects with rank field
   * @version 0.1.0
   * @since 0.1.0
   * @author Benson Maruchu<benmaruchu@gmail.com>
   */
  $scope.prepareJurisdictionsRanks = function () {

    $scope.overviews.jurisdictions = _.chain($scope.overviews.jurisdictions)
      .orderBy('count', 'desc')
      .map(function (jurisdiction, index) {
        return _.merge({}, jurisdiction, {
          rank: (index + 1)
        });
      })
      .sortBy('name')
      .value();
  };


  /**
   * prepare ranks based on total issues per service group
   * @return {Object} with groups<Array>  objects with rank field
   * @version 0.1.0
   * @since 0.1.0
   * @author Benson Maruchu<benmaruchu@gmail.com>
   */
  $scope.prepareServiceGroupsRanks = function () {
    $scope.overviews.groups = _.chain($scope.overviews.groups)
      .orderBy('count', 'desc')
      .map(function (group, index) {
        return _.merge({}, group, {
          rank: (index + 1)
        });
      })
      .sortBy('name')
      .value();
  };


  /**
   * prepare ranks based on total issues per service
   * @return {Object} with services<Array> objects with rank field
   * @version 0.1.0
   * @since 0.1.0
   * @author Benson Maruchu<benmaruchu@gmail.com>
   */
  $scope.prepareServicesRanks = function () {
    $scope.overviews.services = _.chain($scope.overviews.services)
      .orderBy('count', 'desc')
      .map(function (service, index) {
        return _.merge({}, service, {
          rank: (index + 1)
        });
      })
      .sortBy('name')
      .value();
  };


  /**
   * prepare method overview visualization
   * @return {object} echart pie chart configurations
   * @version 0.1.0
   * @since  0.1.0
   * @author lally elias<lallyelias87@gmail.com>
   */
  $scope.prepareMethodVisualization = function (column) {

    //ensure column
    column = column || 'count';


    //prepare chart series data
    var data = _.map($scope.overviews.methods, function (method) {
      return {
        name: method.name,
        value: method[column]
      };
    });

    //prepare chart config
    $scope.perMethodConfig = {
      height: 300,
      forceClear: true
    };

    //prepare chart options
    $scope.perMethodOptions = {
      textStyle: {
        fontFamily: 'Lato'
      },
      title: {
        text: column === 'count' ? 'Total' : _.upperFirst(column.toLowerCase()),
        subtext: $filter('number')(_.sumBy(data, 'value'), 0),
        x: 'center',
        y: 'center',
        textStyle: {
          fontWeight: 'normal',
          fontSize: 16
        }
      },

      series: [{
        type: 'pie',
        selectedMode: 'single',
        radius: ['35%', '45%'],
        color: _.map($scope.overviews.services, 'color'),
        label: {
          normal: {
            formatter: '{b}\n{d}%\n( {c} )',
          }
        },
        data: data
      }]
    };

  };

  /**
   * prepare workspace overview visualization
   * @return {object} echart pie chart configurations
   * @version 0.1.0
   * @since  0.1.0
   * @author lally elias<lallyelias87@gmail.com>
   */
  $scope.prepareWorkspaceVisualization = function (column) {

    //ensure column
    column = column || 'count';


    //prepare chart series data
    var data = _.map($scope.overviews.workspaces, function (workspace) {
      return {
        name: workspace.name,
        value: workspace[column]
      };
    });

    //prepare chart config
    $scope.perWorkspaceConfig = {
      height: 300,
      forceClear: true
    };

    //prepare chart options
    $scope.perWorkspaceOptions = {
      textStyle: {
        fontFamily: 'Lato'
      },
      title: {
        text: column === 'count' ? 'Total' : _.upperFirst(column.toLowerCase()),
        subtext: $filter('number')(_.sumBy(data, 'value'), 0),
        x: 'center',
        y: 'center',
        textStyle: {
          fontWeight: 'normal',
          fontSize: 16
        }
      },
      series: [{
        type: 'pie',
        selectedMode: 'single',
        radius: ['35%', '45%'],
        color: _.reverse(_.map($scope.overviews.services,
          'color')),
        label: {
          normal: {
            formatter: '{b}\n{d}%\n( {c} )',
          }
        },
        data: data
      }]
    };

  };


  /**
   * Reload overview reports
   */
  $scope.reload = function () {

    $scope.params = Summary.prepareQuery($scope.filters);

    $ionicLoading.show({
      content: 'Loading',
      animation: 'fade-in',
      showBackdrop: true,
      maxWidth: 200,
      showDelay: 0
    });

    Summary
      .overviews({
        query: $scope.params
      })
      .then(function (overviews) {
        $scope.overviews = overviews;
        $scope.prepare();
        $ionicLoading.hide();

      }).catch(function (error) {
        $ionicLoading.hide();
      });


  };


  //listen for refresh event and reload overview accordingly
  $scope.refresh = function () {

    Summary
      .overviews({
        query: $scope.params
      })
      .then(function (overviews) {
        $scope.overviews = overviews;
        $scope.prepare();
        $scope.$broadcast('scroll.refreshComplete');
      });

  };

  init();

  //pre-load reports
  $scope.reload();

  $rootScope.$on('overviews:reload', function () {
    $scope.reload();
  });

  $scope.$on('$destroy', function () {
    if ($scope.modal) {
      $scope.modal.remove();
    }
  });

}
