(function () {

	lnwebcli.controller("ListKnownPeersCtrl", ["$scope", "$timeout", "$uibModal", "lncli", controller]);

	function controller($scope, $timeout, $uibModal, lncli) {

		var $ctrl = this;

		$scope.refresh = function() {
			lncli.listKnownPeers().then(function(response) {
				console.log(response);
				$scope.data = JSON.stringify(response, null, "\t");
				$scope.peers = response;
			}, function(err) {
				console.log('Error: ' + err);
			});
		};

		$scope.connect = function(peer) {
			lncli.connectPeer(peer.pub_key, peer.address).then(function(response) {
				console.log("ConnectKnownPeer", response);
				if (response.data.error) {
					bootbox.alert(response.data.error);
				} else {
					// TODO
				}
			}, function (err) {
				console.log(err);
				bootbox.alert(err.message);
			});
		};

		$scope.edit = function(peer) {
			var modalInstance = $uibModal.open({
				animation: true,
				ariaLabelledBy: "editknownpeer-modal-title",
				ariaDescribedBy: "editknownpeer-modal-body",
				templateUrl: "templates/partials/editknownpeer.html",
				controller: "ModalEditKnownPeerCtrl",
				controllerAs: "$ctrl",
				size: "lg",
				resolve: {
					knownpeer: function () {
						var peerTemp = {};
						angular.copy(peer, peerTemp);
						return peerTemp;
					}
				}
			});

			modalInstance.rendered.then(function() {
				$("#editknownpeer-alias").focus();
			});

			modalInstance.result.then(function (values) {
				console.log("EditKnownPeer updated values", values);
				$scope.refresh();
			}, function () {
				console.log('Modal EditKnownPeer dismissed at: ' + new Date());
			});
		};

		$scope.import = function() {
			var modalInstance = $uibModal.open({
				animation: true,
				ariaLabelledBy: "importknownpeers-modal-title",
				ariaDescribedBy: "importknownpeers-modal-body",
				templateUrl: "templates/partials/importknownpeers.html",
				controller: "ModalImportKnownPeersCtrl",
				controllerAs: "$ctrl",
				size: "lg",
				resolve: {
					defaults: {
						peersjson: angular.toJson($scope.peers, 4)
					}
				}
			});

			modalInstance.rendered.then(function() {
				$("#importknownpeers-peersjson").focus();
			});

			modalInstance.result.then(function (values) {
				console.log("ImportKnownPeers updated values", values);
				$scope.refresh();
			}, function () {
				console.log('Modal ImportKnownPeers dismissed at: ' + new Date());
			});
		};

		$scope.pubkeyCopied = function(peer) {
			peer.pubkeyCopied = true;
			$timeout(function() {
				peer.pubkeyCopied = false;
			}, 500);
		}

		$scope.addressCopied = function(peer) {
			peer.addressCopied = true;
			$timeout(function() {
				peer.addressCopied = false;
			}, 500);
		}

		$scope.refresh();

	}

})();