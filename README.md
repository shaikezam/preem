# preem

Lightweight, easy-to-use JavaScript test library

[![Build Status](http://circleci-badges-max.herokuapp.com/img/shaikezam/preem/master?token=:circle-ci-token)](https://circleci.com/gh/shaikezam/preem/tree/master)

## Usage
Install preem:

```javascript
npm install preem
```

Requirening and using:

```javascript
"use strict";
    
let Preem = require('preem');

let preem = new Preem();
```

Preem constructor parameters (**Not mandatory** to pass an object, have default values):

```javascript
"use strict";

let preem = new Preem({
    type: //type of the test: [Preem.CONSTANTS.TESTTYPE.SYNC || Preem.CONSTANTS.TESTTYPE.ASYNC], default Preem.CONSTANTS.TESTTYPE.SYNC
    onStart: function() {
        //callback function, fires before starting the test, default null
    },
    onFinish: function() {
        //callback function, fires after finishing the test, default null
    }
});
```

### testModule function:

Function for creating tests that have a common topic

```javascript
"use strict";

preem.testModule(/* test module description */, function(beforeEach, checkIf) {

    
});

```

**beforeEach**: receives a callback function that can perform operations before each CheckIf function
    
**checkIf**: receives the tested parameter, returns an object of predefined functions:
- isEqualTo - test *checkIf* paramter is equal to another parameter (only Primitive types).
- isNotEqualTo - test *checkIf* paramter is not equal to another parameter (only Primitive types).
- isIncludes - test *checkIf* array contains a parameter.
- isNotIncludes - test *checkIf* array don't contains a parameter.
- isDeepEqualTo - test *checkIf* object is equal to another object.
- isNotDeepEqualTo - test *checkIf* object is not equal to another object.
- **inMyCriteria** - test *checkIf* object\s is not in predefined condition, need to pass the function as the 1st argument - see example in next.

### start function:

```javascript
"use strict";

preem.start();

```

Function for starting the test - **need to be called after writing all the tests**

## Examples

### Primitive types testing:

```javascript
"use strict";

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

preem.start();
```
### Array testing:

```javascript
"use strict";

preem.testModule("Test Arrays", function(beforeEach, checkIf) {

    let arr = ['Hello', 'World', 'foo'],
        s1 = "Hello",
        s2 = "bla";
        
    beforeEach(function() {
        console.log("Before each checkIf");
    });

    checkIf(arr).isIncludes(s1, arr + " includes " + s1, arr + " isn't includes " + s1); // Hello,World,foo includes Hello 

    checkIf(arr).isNotIncludes(s2, arr + " doesn't includes " + s2, arr + " includes " + s2); // Hello,World,foo doesn't includes Hello 
});

preem.start();
```
    
### Objetcs testing:

```javascript
"use strict";

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
```

### User's predefined criteria:

```javascript
"use strict";

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
    
    beforeEach(function() {
        console.log("User's predefined functions must return true to pass tests");
    });

    checkIf(number).inMyCriteria(fnPositiveNumber, "Number is positive", "Number isn't positive");

    checkIf(number, 1).inMyCriteria(fnComparingNumbers, "Numbers are equal", "Number arn't equal");

    checkIf(numebrs).inMyCriteria(fnNegativeNumbers, "Numbers are negative", "Number arn't negative");

    checkIf(numebrs, -1).inMyCriteria(fnNumberInArray, "-1 in array", "-1 isn't in array");

});
```

*Stay tuned for more updates soon*

## License

MIT
