var trackerApp = angular.module('trackerApp', []);

trackerApp.controller('mainController', ['$scope', '$http',
  function($scope, $http) {

    //list of popular currencies
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

    //symbols used in the drop down list
    $scope.currencySymbols = {
      'CAD': '$',
      'USD': '$',
      'GBP': '£'
    }

    //initialize currency (set to USD as there is more data associated with it)
    //and setup a watcher to update the market data on currency change
    $scope.selectedCurrency = 'USD';
    $scope.$watch('selectedCurrency', function(newValue, oldValue) {
      $scope.getMarketData();
    })

    var getCrypto = function(crypto, currency) {
      return new Promise((resolve, reject) => {

        $http({
          method: 'GET',
          //url: `https://api.cryptonator.com/api/ticker/${crypto}-${currency}`
          url: `https://min-api.cryptocompare.com/data/histoday?fsym=${crypto}&tsym=${currency}&limit=1`
        }).then(function(res) {
          resolve(res.data.Data[1]);
        }, function(err) {
          reject(err);
        });
      })
    }

    // formats a number to a given precision
    // returns two dashes if the number is blank
    $scope.formatNum = function(num, precision) {
      if (num == '')
        return '--';
      return parseFloat(num, 10).toFixed(precision);
    }

    //Returns open, close, high, low, volumes
    $scope.getMarketData = function() {
      let promises = [];
      Object.keys($scope.cryptos).map((symbol) => {
        promises.push(getCrypto(symbol, $scope.selectedCurrency));
      });
      Promise.all(promises).then((values) => {
        $scope.$apply(function() {
          //marketData order will be the same order of the cryptos list above
          //which is needed for when they are iterated through on the DOM
          $scope.marketData = values;
        })
      })
    }

    //Calculates change from open and close of marketData
    $scope.getDailyChange = function(open, close) {
      return $scope.formatNum(open - close, 2);
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
      getDailyChange: "&",
      formatNum: "&",
      currencySymbol: '='
    }
  }
})
