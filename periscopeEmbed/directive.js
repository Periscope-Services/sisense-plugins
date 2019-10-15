mod.directive('periscopeEmbed', [
    function () {
    	return {
    		priority: 0,
    		replace: false,
    		transclude: false,
    		restrict: 'E',
    		link: function link($scope, lmnt, attrs) {
				var $frame = $("<iframe></iframe>");
        apiKey = $scope.widget.style.authtoken
  			dashboardId = $scope.widget.style.dashboardid
  			chartId = $scope.widget.style.chartid
        url = generateUrl(apiKey, dashboardId, chartId)
				$frame.attr("src", url);
				$frame.attr("marginwidth", 10);
				$(lmnt).append($frame);
    		}
    	}
    }]);
