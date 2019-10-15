
mod.controller('periscopeEmbedStylerController', ['$scope',
    function ($scope) {

        /**
         * variables
         */


        /**
         * watches
         */
        $scope.$watch('widget', function (val) {

            $scope.model = $$get($scope, 'widget.style');
        });
        
        // $scope.setStyle = function (propertyName, propertyValue) {
        //     // Set the style property
        //     $scope.model[propertyName] = propertyValue;
        // }

        /**
         * public methods
         */

        $scope.onBlur = function($event){
            _.defer(function () { $scope.$root.widget.redraw(); });
        };

    }
]);
