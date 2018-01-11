trackerApp.config(function($routeProvider, $locationProvider) {
  $routeProvider
    .when('/', {
      templateUrl: 'views/cards.html',
      controller: 'mainController'
    })
    .when('/charts', {
      templateUrl: 'views/charts.html',
      controller: 'chartController'
    });

    $locationProvider.html5Mode(true);
})
