'use strict';

/**
 * @ngdoc function
 * @name dawasco.controller:DashboardPerformanceCtrl
 * @description
 * # DashboardPerformanceCtrl
 * Service Request controller of dawasco
 */
angular
  .module('dawasco')
  .controller('DashboardPerformanceCtrl', DashboardPerformanceCtrl);


DashboardPerformanceCtrl.$inject = ['$rootScope', '$scope', '$stateParams', '$filter', '$ionicLoading', '$ionicModal', 'endpoints', 'Summary'];

function DashboardPerformanceCtrl($rootScope, $scope, $stateParams, $filter, $ionicLoading, $ionicModal, endpoints, Summary) {

  // initialize scope attributes
  $scope.maxDate = new Date();


  //bind states
  $scope.priorities = endpoints.priorities.priorities;
  $scope.statuses = endpoints.statuses.statuses;
  $scope.services = endpoints.services.services;
  $scope.servicegroups = endpoints.servicegroups.servicegroups;
  $scope.jurisdictions = endpoints.jurisdictions.jurisdictions;


  //set default jurisdiction
  $scope.jurisdiction =
    ($stateParams.jurisdiction || _.first($scope.jurisdictions));

  //bind filters
  var defaultFilters = {
    // startedAt: moment().utc().startOf('date').toDate(),
    startedAt: moment().utc().startOf('year').toDate(),
    endedAt: moment().utc().endOf('date').toDate(),
    jurisdictions: [].concat($scope.jurisdiction._id)
  };


  //TODO persist filter to local storages
  $scope.filters = defaultFilters;

  // initialize performances
  $scope.performances = [];

  $scope.visualizationPieConfig = {
    height: 300,
    forceClear: true
  };

  function init() {

    $scope.modalTitle = 'Performance Reports - Filters';

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

    //reset area
    var _id = _.first($scope.filters.jurisdictions);
    $scope.jurisdiction = _.find($scope.jurisdictions, {
      '_id': _id
    });

    //load reports
    $scope.reload();

    //close current modal
    $scope.closeModal();
  };


  /**
   * @name prepare
   * @description Prepare All performances charts
   * @type {function}
   * @version 0.1.0
   * @since 0.1.0
   * @author Benson Maruchu<benmaruchu@gmail.com>
   */
  $scope.prepare = function () {

    // shaping data
    $scope.prepareSummaries();

    // prepare summary visualization
    $scope.prepareSummaryVisualization();
    $scope.prepareStatusesVisualization();
    $scope.prepareServiceGroupsVisualization();
    $scope.prepareServiceGroupVisualization();
    $scope.prepareServiceVisualization();
    $scope.prepareServiceGroupsRanks();
    $scope.prepareServicesRanks();
  };


  /*
   * Shape data
   * TODO update to pull data from the server
   */
  $scope.prepareSummaries = function () {
    //prepare summary
    //prepare summary
    $scope.performances.summaries = [{
      name: 'Resolved',
      count: $scope.performances.overall.resolved,
      color: '#8BC34A'
    }, {
      name: 'Pending',
      count: $scope.performances.overall.pending,
      color: '#00BCD4'
    }, {
      name: 'Late',
      count: $scope.performances.overall.late,
      color: '#009688'
    }];
  };


  /**
   * prepare summary visualization
   * @return {object} echart donut chart configurations
   * @version 0.1.0
   * @since  0.1.0
   * @author lally elias<lallyelias87@gmail.com>
   */
  $scope.prepareSummaryVisualization = function () {

    //prepare chart series data
    var data = _.map($scope.performances.summaries, function (summary) {
      return {
        name: summary.name,
        value: summary.count
      };
    });


    //prepare chart options
    $scope.perSummaryOptions = {
      textStyle: {
        fontFamily: 'Lato'
      },
      title: {
        text: 'Total',
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
        radius: ['45%', '55%'],
        color: _.map($scope.performances.summaries, 'color'),
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
   * prepare statuses visualization
   * @return {object} echart donut chart configurations
   * @version 0.1.0
   * @since  0.1.0
   * @author lally elias<lallyelias87@gmail.com>
   */
  $scope.prepareStatusesVisualization = function () {
    //prepare chart series data
    var data = _.map($scope.performances.statuses, function (status) {
      return {
        name: status.name,
        value: status.count
      };
    });

    //prepare chart options
    $scope.perStatusesOptions = {
      textStyle: {
        fontFamily: 'Lato'
      },
      title: {
        text: 'Total',
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
        radius: ['45%', '55%'],
        color: _.map($scope.performances.statuses, 'color'),
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
   * prepare service group performance visualization
   * @return {object} echart bar chart configurations
   * @version 0.1.0
   * @since  0.1.0
   * @author lally elias<lallyelias87@gmail.com>
   */
  $scope.prepareServiceGroupsVisualization = function (column) {

    //ensure column
    column = column || 'count';


    //prepare chart series data
    var data = _.map($scope.performances.groups, function (group) {
      return {
        name: group.name,
        value: group[column]
      };
    });

    //prepare chart config
    $scope.perServiceGroupConfig = {
      height: 300,
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
          fontSize: 16
        }
      },
      series: [{
        type: 'pie',
        selectedMode: 'single',
        radius: ['30%', '40%'],
        color: _.map($scope.performances.groups, 'color'),

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

    //prepare unique services for bar chart categories
    var categories = _.chain($scope.performances)
      .map('services')
      .uniqBy('name')
      .value();

    //prepare bar chart series data
    var data =
      _.map($scope.performances.services, function (service) {

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
            name: 'Area Services Overview - ' + new Date().getTime(),
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
   * prepare per service group pie chart options
   * @return {object} echart pie options configurations
   * @version 0.1.0
   * @since 0.1.0
   * @author Benson Maruchu<benmaruchu@gmail.com>
   */
  $scope.prepareServiceGroupVisualization = function () {
    $scope.performances.groups = _.map($scope.performances.groups, function (group) {

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
    $scope.performances.services = _.map($scope.performances.services, function (service) {

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
   * prepare ranks based on total issues per service
   * @return {Object} with services<Array> objects with rank field
   * @version 0.1.0
   * @since 0.1.0
   * @author Benson Maruchu<benmaruchu@gmail.com>
   */
  $scope.prepareServicesRanks = function () {
    $scope.performances.services = _.chain($scope.performances.services)
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
   * prepare ranks based on total issues per service group
   * @return {Object} with groups<Array>  objects with rank field
   * @version 0.1.0
   * @since 0.1.0
   * @author Benson Maruchu<benmaruchu@gmail.com>
   */
  $scope.prepareServiceGroupsRanks = function () {
    $scope.performances.groups = _.chain($scope.performances.groups)
      .orderBy('count', 'desc')
      .map(function (group, index) {
        return _.merge({}, group, {
          rank: (index + 1)
        });
      })
      .sortBy('name')
      .value();
  };


  /*
   * Reload performance reports
   */
  $scope.reload = function () {

    // pre-load reports
    // prepare performance details
    $scope.params = Summary.prepareQuery($scope.filters);


    $ionicLoading.show({
      content: 'Loading',
      animation: 'fade-in',
      showBackdrop: true,
      maxWidth: 200,
      showDelay: 0
    });

    Summary
      .performances({
        query: $scope.params
      })
      .then(function (performances) {

        $scope.performances = performances;

        //ensure status are sorted by weight
        $scope.performances.statuses =
          _.orderBy(performances.statuses, 'weight', 'asc');

        $scope.prepare();
        $ionicLoading.hide();
      }).catch(function (error) {
        $ionicLoading.hide();
      });
  };


  $scope.refresh = function () {
    Summary
      .performances({
        query: $scope.params
      })
      .then(function (performances) {

        $scope.performances = performances;

        //ensure status are sorted by weight
        $scope.performances.statuses =
          _.orderBy(performances.statuses, 'weight', 'asc');

        $scope.prepare();

        $scope.$broadcast('scroll.refreshComplete');
      });
  };

  init();

  $rootScope.$on('performances:reload', function () {
    $scope.reload();
  });

  $scope.$on('$destroy', function () {
    if ($scope.modal) {
      $scope.modal.remove();
    }
  });


  $scope.reload();
}
