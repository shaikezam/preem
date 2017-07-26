# preem

Lightweight, easy-to-use JavaScript test library

[![Build Status](http://circleci-badges-max.herokuapp.com/img/shaikezam/preem/master?token=:circle-ci-token)](https://circleci.com/gh/shaikezam/preem/tree/master)
- [Usage](#usage)
## Usage

### Using browser \ client

```html
<script src="https://raw.githubusercontent.com/shaikezam/preem/master/preem_browser.js"></script>
```

### Using NPM
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
### Usage & API

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

#### testModule function:

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

#### start function:

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

    beforeEach(function() {
        console.log("Before each checkIf");
    });

    checkIf(true).isEqualTo(true, "true is equal to true", "true isn't equal to true"); // true is equal to true

    checkIf('Hello').isNotEqualTo('World', "Strings aren't equal", "Strings are equal"); // Strings aren't equal

});

preem.start();
```
### Array testing:

```javascript
"use strict";

preem.testModule("Test Arrays", function(beforeEach, checkIf) {

    beforeEach(function() {
        console.log("Before each checkIf");
    });

    checkIf(['Hello', 'World', 'foo']).isIncludes('Hello', "String in array", "String not in array"); // String in array 

    checkIf(['Hello', 'World', 'foo']).isNotIncludes('bla', "String not in array", "String in array"); // String not in array

});

preem.start();
```
    
### Objetcs testing:

```javascript
"use strict";

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

preem.start();
```

### User's predefined criteria:

```javascript
"use strict";

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
```

*Stay tuned for more updates soon*

## License

MIT
