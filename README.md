[![Build Status](http://circleci-badges-max.herokuapp.com/img/shaikezam/preem/master?token=:circle-ci-token)](https://circleci.com/gh/shaikezam/preem/tree/master)

# preem

Lightweight, easy-to-use JavaScript test library

## Usage

Installing requirening and using with npm:

```
"use strict";
npm install preem
    
let Preem = require('preem');

let preem = new Preem();
```

### Primitive types testing:

```javascript
"use strict";
let s1 = "Hello",
    s2 = "World",
    n1 = 1,
    n2 = 1;
            
preem.checkIf(s1).isNotEqualTo(s2, "Strings aren't equal", "Strings are equal"); // Strings aren't equal

preem.checkIf(n1).isEqualTo(n2, "Numbers are equal", "Numbers aren't equal"); // Numbers are equal

preem.start();
```
### Array testing:

```javascript
"use strict";
let arr = ['Hello', 'World', 'foo'];

preem.checkIf(arr).isIncludes(s1, arr + " includes " + s1, arr + " isn't includes " + s1); // Hello,World,foo includes Hello 

preem.start();
```
    
### Objetcs testing:

```javascript
"use strict";
let o1 = {
        a1: 'b1',
        a2: 'b2'
    },
    o2 = {
        a1: 'b1',
        a2: 'b2'
    };

preem.checkIf(o1).isDeepEqualTo(o2, "Object are equal", "Object arn't equal"); // Object are equal 

preem.start();
```

*Stay tuned for more updates soon*

## License

MIT
