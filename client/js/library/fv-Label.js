// Application Module for label element.
var app = angular.module("fv-label", []);
// -------------------------------------------------- //
// I am here to demonstate which callbacks get invoked.
app.directive(
    "fvLabel",
    function ($compile) {
        function link($scope, element, attributes) {
            var maxColor = 'red', minColor = 'orange', nomColor = 'green';
            var rangeLow = 30, rangeHigh = 70;
            var id = '';
            // Observe Maximum Color
            attributes.$observe(
                "fvLabelMaxColor",
                function (i) {
                    maxColor = i;
                }
            );
            // Observe Minimum Color
            attributes.$observe(
                "fvLabelMinColor",
                function (i) {
                    minColor = i;
                }
            );
            // Observe Nominal Color
            attributes.$observe(
                "fvLabelNomColor",
                function (i) {
                    nomColor = i;
                }
            );
            // Observe Maximum Color
            attributes.$observe(
                "fvLabelRangeLow",
                function (i) {
                    rangeLow = i;
                }
            );
            // Observe Minimum Color
            attributes.$observe(
                "fvLabelRangeHigh",
                function (i) {
                    rangeHigh = i;
                }
            );
            // Observe value and do the math for simulation
            attributes.$observe(
                "fvLabelValue",
                function (i) {
                    if (i < rangeLow) {
                        element[0].style.backgroundColor = minColor;
                    }
                    else if (i > rangeHigh) {
                        element[0].style.backgroundColor = maxColor;
                    }
                    else {
                        element[0].style.backgroundColor = nomColor;
                    }
                }
            );
        }
        // Return the directive configuration.
        return ({
            link: link,
            restrict: "A"
        });
    }
);