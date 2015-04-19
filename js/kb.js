
var inspectorApp = angular.module('inspectorApp',[]);
inspectorApp.controller('ArticleController', ['$scope','$sce', function($scope, $sce) {
	$scope.articles = chrome.extension.getBackgroundPage().articleContent.records;
	$scope.haveArticles = ($scope.articles.length > 0);
	for(var i=0 ; i<$scope.articles.length ; i++){
		$scope.articles[i].Hint__c = $sce.trustAsHtml($scope.articles[i].Hint__c);
	}
}]);
