angular.module('testMod', ['ngMaterial','mdDateTime']).controller('testCtrl', function($scope) {
	return $scope.date = new Date();
});
