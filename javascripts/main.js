angular.module('testMod', ['ngMaterial']).controller('testCtrl', function($scope) {
	return $scope.date = new Date();
});
