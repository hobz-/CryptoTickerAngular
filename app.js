var trackerApp = angular.module('trackerApp', []);

trackerApp.controller('mainController', ['$scope', '$http',
  function($scope, $http) {
    $scope.greeting = "Hello Out There";

    //list of popular currencies
    //all available currencies from api can be found:
    //https://www.cryptonator.com/api/currencies
    $scope.cryptos = {
      BTC: 'Bitcoin',
      ETH: 'Ethereum',
      XRP: 'Ripple',
      LTC: 'Litecoin',
      DASH: 'Dash',
      XMR: 'Monero',
      DOGE: 'Doge',
      ZEC: 'Zcash'
    }

    $scope.currencySymbols = {
      'CAD': '$',
      'USD': '$',
      'GBP': '£'
    }

    $scope.selectedCurrency = 'USD';
    $scope.$watch('selectedCurrency', function(newValue, oldValue) {
      $scope.getMarketData();
    })

    var getCrypto = function(crypto, currency) {
      return new Promise((resolve, reject) => {
        $http({
          method: 'GET',
          url: `https://api.cryptonator.com/api/ticker/${crypto}-${currency}`
        }).then(function(res) {
          resolve(res.data.ticker);
        }, function(err) {
          reject(err);
        });
      })
    }

    $scope.formatNum = function(num, precision) {
      if (num == '')
        return '--';
      return parseFloat(num, 10).toFixed(precision);
    }

    //Returns volume-weighted price, total trade volume,
    //change in the last hour for a given crypto and base currency
    $scope.getMarketData = function() {
      let promises = [];
      Object.keys($scope.cryptos).map((symbol) => {
        promises.push(getCrypto(symbol, $scope.selectedCurrency));
      });
      Promise.all(promises).then((values) => {
        $scope.$apply(function() {
          $scope.marketData = values;
        })
      });
    }

    $scope.getMarketData();

}]);
trackerApp.directive('cryptoCard', function() {
  return {
    restrict: 'EA',
    templateUrl: '/directives/cryptocard.html',
    replace: true,
    scope: {
      crypto: '=',
      marketData: '=',
      index: '=',
      formatNum: "&",
      currencySymbol: '='
    }
  }
})
