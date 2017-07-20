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

Preem constructor parameters (**Not mandatory**, can leave it empty):

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

Function to create tests that have a common issue

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

### start function:

```javascript
"use strict";

preem.start();

```

start the test - **need to be called after writing all the tests**

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

*Stay tuned for more updates soon*

## License

MIT
