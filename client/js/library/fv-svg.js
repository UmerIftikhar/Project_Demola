// Application Module for label element.
var app = angular.module("fv-svg", []);
// -------------------------------------------------- //
// I am here to demonstate which callbacks get invoked.
app.directive(
    "fvSvg",
    function ($compile, $timeout) {
        function link($scope, element, attributes) {

            var nomColor = 'green', dangerColor = 'red', count = 0, currentColor = 'white';
            // Observe Nominal Color
            attributes.$observe(
                "fvSvgNomColor",
                function (i) {
                    nomColor = i;
                }
            );

            // Observe Danger Color
            attributes.$observe(
                "fvSvgDangerColor",
                function (i) {
                    dangerColor = i;
                }
            );

            // Observe value and do the math for simulation
            attributes.$observe(
                "fvSvgStatus",
                function (i) {
                    // Based on the value status, the background is changed between normal and danger color
                    if (i === "true") {
                        element[0].style.fill = dangerColor;
                        count = 1; //Inorder to enable the blinking function
                        $scope.statusBlink();
                    }
                    else {
                        count = 0; //Inorder to disable the blinking function
                        element[0].style.fill = nomColor;
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
                        if (currentColor === 'white') {
                            element[0].style.fillOpacity = '1';
                            currentColor = dangerColor;
                        } else {
                            element[0].style.fillOpacity = '0.0';
                            currentColor = 'white';
                        }
                        if (count === 1) {
                            myLoop(index);
                        } else {
                            element[0].style.fillOpacity = '1';
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