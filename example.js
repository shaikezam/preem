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

    let s1 = "Hello",
        s2 = "World",
        n1 = 1,
        n2 = 1;

    beforeEach(function() {
        console.log("Before each checkIf");
    });

    checkIf(s1).isNotEqualTo(s2, "Strings aren't equal", "Strings are equal"); // Strings aren't equal

    checkIf(n1).isEqualTo(n2, "Numbers are equal", "Numbers aren't equal"); // Numbers are equal
});

preem.testModule("Test Arrays", function(beforeEach, checkIf) {

    let arr = ['Hello', 'World', 'foo'],
        s1 = "Hello",
        s2 = "Hello";

    beforeEach(function() {
        console.log("Before each checkIf");
    });

    checkIf(arr).isIncludes(s1, arr + " includes " + s1, arr + " isn't includes " + s1); // Hello,World,foo includes Hello 

    checkIf(arr).isNotIncludes(s2, arr + " doesn't includes " + s2, arr + " includes " + s2); // Hello,World,foo includes Hello 

});

preem.testModule("Test Objects", function(beforeEach, checkIf) {

    let o1 = {
            a1: 'b1',
            a2: 'b2'
        },
        o2 = {
            a1: 'b1',
            a2: 'b2'
        };

    beforeEach(function() {
        console.log("Before each checkIf");
    });

    checkIf(o1).isDeepEqualTo(o2, "Object are equal", "Object arn't equal"); // Object are equal

});

preem.testModule("Test by my own criteria", function(beforeEach, checkIf) {

    let number = 1,
        numebrs = [-1, -2, -3];

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

    checkIf(number).inMyCriteria(fnPositiveNumber, "Number is positive", "Number isn't positive");

    checkIf(number, 1).inMyCriteria(fnComparingNumbers, "Numbers are equal", "Number arn't equal");

    checkIf(numebrs).inMyCriteria(fnNegativeNumbers, "Numbers are negative", "Number arn't negative");

    checkIf(numebrs, -1).inMyCriteria(fnNumberInArray, "-1 in array", "-1 isn't in array");

});


preem.start();