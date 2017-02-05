// Application Module for label element.
var app = angular.module("fv-map", []);
// -------------------------------------------------- //
// I am here to demonstate which callbacks get invoked.
app.directive(
    "fvMap",
    function ($compile, $timeout) {
        function link($scope, element, attributes) {

            var nomColor = 'green', successColor = 'red', dangerColor = 'red';
            var nomValue = 1, successValue = 2, dangerValue = 0;
            var count = 0, blinkColor = 'white', currentColor = 'white';
            
            // Observe Normal Color
            attributes.$observe(
                "fvMapNomColor",
                function (i) {
                    nomColor = i;
                }
            );

            // Observe Success Color
            attributes.$observe(
                "fvMapSucColor",
                function (i) {
                    successColor = i;
                }
            );

            // Observe Danger Color
            attributes.$observe(
                "fvMapDangrColor",
                function (i) {
                    dangerColor = i;
                }
            );

            // Observe Normal Value
            attributes.$observe(
                "fvMapNomValue",
                function (i) {
                    nomValue = i;
                }
            );

            // Observe Success Value
            attributes.$observe(
                "fvMapSucValue",
                function (i) {
                    successValue = i;
                }
            );

            // Observe Danger Value
            attributes.$observe(
                "fvMapDangrValue",
                function (i) {
                    dangerValue = i;
                }
            );

            // Observe value and do the math for simulation
            attributes.$observe(
                "fvMapStatus",
                function (i) {
                    // Based on the value status, the background is changed between normal, success and danger color
                    if (i == nomValue) {
                        currentColor = nomColor; //Set the color to be the current color (Normal color)
                        count = 0; //Inorder to disable the blinking function
                        element[0].style.backgroundColor = nomColor;
                    }
                    else if(i == successValue){
                        currentColor = successColor; //Set the color to be the current color (Success color)
                        count = 0; //Inorder to disable the blinking function
                        element[0].style.backgroundColor = successColor;
                    }
                    else if(i == dangerValue){
                        element[0].style.backgroundColor = dangerColor;
                        count = 1; //Inorder to enable the blinking function
                        $scope.statusBlink();
                    }
                }
            );
            /**
             * Function which performs the blinking operation
             * the blinking is performed by changing the opacity of the fill
             * 
             */
            $scope.statusBlink = function () {
                (function myLoop(index) {
                    $timeout(function () {
                        if (blinkColor === 'white') {
                            element[0].style.backgroundColor = dangerColor;
                            blinkColor = dangerColor;
                        } else {
                            element[0].style.backgroundColor = 'white';
                            blinkColor = 'white';
                        }
                        if (count === 1) {
                            myLoop(index);
                        } else {
                            element[0].style.backgroundColor = currentColor;
                        }
                    }, 300);
                })(count);
            };
        }
        // Return the directive configuration.
        return ({
            scope: {},
            link: link,
            restrict: "A"
        });
    }
);