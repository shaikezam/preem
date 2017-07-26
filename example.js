// Change './preem' to 'preem' if you use this code outside of this package

"use strict";
let Preem = require('./preem');

let preem = new Preem({
    type: Preem.CONSTANTS.TESTTYPE.SYNC,
    onStart: function() {
        console.log("***TESTS STARTED***");
    },
    onFinish: function() {
        console.log("***TESTS FINISHED***");
    }
});

preem.testModule("Test primitive types", function(beforeEach, checkIf) {

    beforeEach(function() {
        console.log("Before each checkIf");
    });

    checkIf(true).isEqualTo(true, "true is equal to true", "true isn't equal to true"); // true is equal to true

    checkIf('Hello').isNotEqualTo('World', "Strings aren't equal", "Strings are equal"); // Strings aren't equal

});

preem.testModule("Test Arrays", function(beforeEach, checkIf) {

    beforeEach(function() {
        console.log("Before each checkIf");
    });

    checkIf(['Hello', 'World', 'foo']).isIncludes('Hello', "String in array", "String not in array"); // String in array 

    checkIf(['Hello', 'World', 'foo']).isNotIncludes('bla', "String not in array", "String in array"); // String not in array

});

preem.testModule("Test Objects", function(beforeEach, checkIf) {

    beforeEach(function() {
        console.log("Before each checkIf");
    });

    checkIf({
        a1: 'b1',
        a2: 'b2'
    }).isDeepEqualTo({
        a1: 'b1',
        a2: 'b2'
    }, "Object are equal", "Object arn't equal"); // Object are equal

});

preem.testModule("Test by my own criteria", function(beforeEach, checkIf) {

    function fnPositiveNumber(iNum) {
        return iNum > 0;
    };

    function fnComparingNumbers(firstNumber, secondNumber) {
        return firstNumber === secondNumber;
    };

    function fnNegativeNumbers(aNum) {
        for (let i = 0; i < aNum.length; i++) {
            if (aNum[i] > 0) {
                return false;
            }
        }
        return true;
    };

    function fnNumberInArray(aNum, iNum) {
        return aNum.indexOf(iNum) > -1;
    };

    checkIf(1).inMyCriteria(fnPositiveNumber, "Number is positive", "Number isn't positive");

    checkIf(1, 1).inMyCriteria(fnComparingNumbers, "Numbers are equal", "Number arn't equal");

    checkIf([-1, -2, -3]).inMyCriteria(fnNegativeNumbers, "Numbers are negative", "Number arn't negative");

    checkIf([-1, -2, -3], -1).inMyCriteria(fnNumberInArray, "-1 in array", "-1 isn't in array");

});


preem.start();