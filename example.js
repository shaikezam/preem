// Change './preem' to 'preem' if you use this code outside of this package

"use strict";
let Preem = require('./preem');

let preem = new Preem({
    testType: Preem.CONSTANTS.TESTTYPE.SYNC
});

let s1 = "Hello",
    s2 = "World",
    n1 = 1,
    n2 = 1,
    arr = ['Hello', 'World', 'foo'],
    o1 = {
        a1: 'b1',
        a2: 'b2'
    },
    o2 = {
        a1: 'b1',
        a2: 'b2'
    };

preem.checkIf(s1).isNotEqualTo(s2, "Strings aren't equal", "Strings are equal"); // Strings aren't equal

preem.checkIf(n1).isEqualTo(n2, "Numbers are equal", "Numbers aren't equal"); // Numbers are equal

preem.checkIf(arr).isIncludes(s1, arr + " includes " + s1, arr + " isn't includes " + s1); // Hello,World,foo includes Hello 

preem.checkIf(o1).isDeepEqualTo(o2, "Object are equal", "Object arn't equal"); // Object are equal 

preem.start();
