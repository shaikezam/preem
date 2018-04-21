# preem

Lightweight, easy-to-use JavaScript test library

[![Build Status](http://circleci-badges-max.herokuapp.com/img/shaikezam/preem/master?token=:circle-ci-token)](https://circleci.com/gh/shaikezam/preem/tree/master)
- [Usage](#usage)
    * [Using browser](#using-browser)
    * [Using NPM](#using-npm)
    * [Usage & API](#usage--api)
        + [Preem constructor](#preem-constructor)
        + [testModule function](#testmodule-function)
        + [start function](#start-function)
- [Examples](#examples)
    * [Primitive types testing](#primitive-types-testing)
    * [Array testing](#array-testing)
    * [Objetcs testing](#objetcs-testing)
    * [User's predefined criteria](#users-predefined-criteria)
- [License](#license)

## Usage

### Using browser

```html
<script src="https://cdn.rawgit.com/shaikezam/preem/master/preem_browser.js"></script>
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

#### Preem constructor

Preem constructor parameters:

```javascript
"use strict";

let preem = new Preem({
    networkManager: {
        appPath: //path of the application starting page (probably at '/')
        data: //path of the data file that contains the requests and responses to the server
    },
    downloadReport: {
        format: //Preem.CONSTANTS.DOWNLAODFORMAT.XML or Preem.CONSTANTS.DOWNLAODFORMAT.JSON
    },
    title: //title of the test
    onStart: function () {
        //callback function, fires before starting the test, default null
    },
    onFinish: function () {
        //callback function, fires after finishing the test, default null
    }
});
```

Preem constructor for example:

```javascript
"use strict";

let preem = new Preem({
    type: Preem.CONSTANTS.TESTTYPE.SYNC,
    networkManager: {
        appPath: "/",
        data: "data/data.json"
    },
    downloadReport: {
        format: Preem.CONSTANTS.DOWNLAODFORMAT.XML
    },
    title: "Preem demonstration",
    onStart: function () {
        console.log("***TESTS STARTED***");
    },
    onFinish: function () {
        console.log("***TESTS FINISHED***");
    }
});
```

#### testModule function:

Function for creating tests that have a common topic

```javascript
"use strict";

preem.testModule(/* test module description */, function (beforeEach, when, then) {

    
});

```

testModule for exaxmple:

```javascript
"use strict";

preem.testModule("Test contacts list", function (beforeEach, when, then) {

    beforeEach(function () {
        console.log("Before each checkIf");
    });

    when().iCanSeeElement({
        el: function (app) {
            return app.document.getElementById('main-panel');
        }
    }, "Can see the main panel", "Can't see the main panel");
    
    when().iCanSeeElement({
        el: {
            id: "main-panel",
            class: "btn btn-primary",
            tag: "div"
        }

    }, "Can see the main panel", "Can't see the main panel");

    then().iCanSeeElement({
        el: function (app) {
            return app.$('#contacts-list')[0];
        },
        action: Preem.CONSTANTS.ACTIONS.CLICK
    }, "can see the main panel", "can't see the main panel");
    
});

```

**beforeEach**: receives a callback function that can perform operations before each *when*, *then* function
    
**when** \ **then**: function to perform manipulations on DOM elements, need to called to *iCanSeeElement* that receives:
- el - can be function or element:
   - function - receives as parameter *app* that can serach for element via *jQuery* or with the *document* global object.
   - object - receives three parameters: *id*, *class* and *tag* for searching and element in the DOM
- action - mostley need to be in the then function (for better *TDD*), receives constants's Preem actions (more will come in future):
   - Preem.CONSTANTS.ACTIONS.CLICK
   - Preem.CONSTANTS.ACTIONS.PRESS
   - Preem.CONSTANTS.ACTIONS.TYPE

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
