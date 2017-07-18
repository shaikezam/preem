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
        s2 = "bla";

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


preem.start();