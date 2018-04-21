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

**beforeEach**: receives a callback function that can perform operations before each *when*, *then* functions

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

All tests need to run via HTML page

```html
"use strict";

<!doctype html>

<html lang="en">

    <head>
        <meta charset="utf-8">

        <title>PreemJS</title>
        
        <script src="https://cdn.rawgit.com/shaikezam/preem/master/preem_browser.js"></script> 
        <script src="test.js"></script>

    </head>

    <body>
    </body>
    
    
</html>

```

Please look at [Contacts Application test](https://github.com/shaikezam/Contacts-Application/blob/master/public/test/test.js).


*Stay tuned for more updates soon*

## License

MIT
