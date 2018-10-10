(function channelBalance() {
  module.exports = function factory($scope, $timeout, lncli, config) {
    $scope.spinner = 0;
    $scope.nextRefresh = null;

    $scope.refresh = () => {
      $scope.spinner += 1;
      $scope.updateNextRefresh();
      lncli.channelBalance().then((response) => {
        $scope.spinner -= 1;
        console.log(response);
        $scope.data = JSON.stringify(response.data, null, '\t');
        $scope.info = response.data;
      }, (err) => {
        $scope.spinner -= 1;
        console.log('Error:', err);
        lncli.alert(err.message || err.statusText);
      });
    };

    $scope.updateNextRefresh = () => {
      $timeout.cancel($scope.nextRefresh);
      $scope.nextRefresh = $timeout($scope.refresh,
        lncli.getConfigValue(config.keys.AUTO_REFRESH, config.defaults.AUTO_REFRESH));
    };

    $scope.refresh();
  };
}());
