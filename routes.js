trackerApp.config(function($routeProvider, $locationProvider) {
  $routeProvider
    .when('/', {
      templateUrl: 'CryptoTickerAngular/views/cards.html',
      controller: 'mainController'
    })
    .when('/charts', {
      templateUrl: 'CryptoTickerAngular/views/charts.html',
      controller: 'chartController'
    });

    $locationProvider.html5Mode(true);
})
