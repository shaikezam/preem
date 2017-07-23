"use strict";
class Preem {

    constructor(oConfig) {
        require('colors');
        this._setConfig(oConfig);
        this.setQueue();
        this.aQueues = [];
    }

    start() {

        if (this.oConfig.type === Preem.CONSTANTS.TESTTYPE.SYNC) {
            this._handleSyncTest();
        } else {
            this.oQueue.dequeue().deferred();
        }
    }

    _handleDone() {
        if (this.oConfig.onFinish) {
            this.oConfig.onFinish();
        }
    }

    _handleStart() {
        if (this.oConfig.onStart) {
            this.oConfig.onStart();
        }
    }

    _setConfig(_oConfig) {
        this.oConfig = {
            type: _oConfig ? _oConfig.type || Preem.CONSTANTS.TESTTYPE.SYNC : Preem.CONSTANTS.TESTTYPE.SYNC,
            onFinish: _oConfig ? _oConfig.onFinish || null : null,
            onStart: _oConfig ? _oConfig.onStart || null : null
        };
    }

    _handleSyncTest() {
        this._handleStart();
        for (let i = 0; i < this.aQueues.length; i++) {
            let oQueue = this.aQueues[i];
            let oQueueFnBeforeEach = oQueue.beforeEach;
            console.log(oQueue.description);
            while (!oQueue.isEmpty()) {
                let oSyncTest = oQueue.dequeue();
                if (oQueueFnBeforeEach) {
                    oQueueFnBeforeEach();
                }
                oSyncTest.fn.apply(this, oSyncTest.args);
            }
        }
        this._handleDone();
    }

    checkIf(oTestedObject) {
        let aArguments = arguments;
        return {
            isEqualTo: function(actual, sPassString, sFailsString) {
                this.oQueue.enqueue({
                    fn: this.oPreem._fnEqual.bind(this.oPreem),
                    args: [oTestedObject, actual, sPassString, sFailsString]
                });
            }.bind(this),
            isNotEqualTo: function(actual, sPassString, sFailsString) {
                this.oQueue.enqueue({
                    fn: this.oPreem._fnNotEqual.bind(this.oPreem),
                    args: [oTestedObject, actual, sPassString, sFailsString]
                });
            }.bind(this),
            isIncludes: function(args, sPassString, sFailsString) {
                this.oQueue.enqueue({
                    fn: this.oPreem._fnInclude.bind(this.oPreem),
                    args: [oTestedObject, args, sPassString, sFailsString]
                });
            }.bind(this),
            isNotIncludes: function(args, sPassString, sFailsString) {
                this.oQueue.enqueue({
                    fn: this.oPreem._fnNotInclude.bind(this.oPreem),
                    args: [oTestedObject, args, sPassString, sFailsString]
                });
            }.bind(this),
            isDeepEqualTo: function(actual, sPassString, sFailsString) {
                this.oQueue.enqueue({
                    fn: this.oPreem._fnObjectsEquality.bind(this.oPreem),
                    args: [oTestedObject, actual, sPassString, sFailsString]
                });
            }.bind(this),
            inMyCriteria: function(fn, sPassString, sFailsString) {
                let aParameters = [];
                for (var i = 0; i < aArguments.length; i++) {
                    aParameters.push(aArguments[i]);
                }
                this.oQueue.enqueue({
                    fn: this.oPreem._inMyCriteria.bind(this.oPreem),
                    args: [aParameters, fn, sPassString, sFailsString]
                });
            }.bind(this)
        }
    }

    beforeEach(fnCallback) {
        this.oQueue.beforeEach = fnCallback;
    }

    _fnNotEqual(expected, actual, sPassString, sFailsString) {
        expected !== actual ? this._passTest(sPassString) : this._failTest(sFailsString);
    }

    _fnEqual(expected, actual, sPassString, sFailsString) {
        expected === actual ? this._passTest(sPassString) : this._failTest(sFailsString);
    }

    _fnInclude(oTestedArray, oTestedObject, sPassString, sFailsString) {
        oTestedArray.indexOf(oTestedObject) >= 0 ? this._passTest(sPassString) : this._failTest(sFailsString);
    }

    _fnNotInclude(oTestedArray, oTestedObject, sPassString, sFailsString) {
        oTestedArray.indexOf(oTestedObject) === -1 ? this._passTest(sPassString) : this._failTest(sFailsString);
    }

    _fnObjectsEquality(expected, actual, sPassString, sFailsString) {
        JSON.stringify(expected) === JSON.stringify(actual) ? this._passTest(sPassString) : this._failTest(sFailsString);
    }

    _inMyCriteria(args, fn, sPassString, sFailsString) {
        let bFlag = fn.apply(this, args);
        bFlag == true ? this._passTest(sPassString) : this._failTest(sFailsString);
    }

    createQueue(sDescription, beforeEach) {
        return {
            _arr: [],
            enqueue: function(node) {
                this._arr.push(node);
            },
            dequeue: function() {
                let temp = null;
                if (!this.isEmpty()) {
                    temp = this._arr[0];
                    this._arr.shift();
                }
                return temp;
            },
            isEmpty: function() {
                return this._arr.length === 0;
            },
            peek: function() {
                return this._arr[0];
            },
            removeQueue: function() {
                this._arr.length = 0;
            },
            description: sDescription,
            beforeEach: beforeEach
        }
    }

    setQueue() {
        this.oQueue = this.createQueue('temp');
    }

    testModule(sDescription, fn) {
        this.aQueues.push(this.createQueue(sDescription));
        fn(this.beforeEach.bind({
            oPreem: this,
            oQueue: this.aQueues[this.aQueues.length - 1]
        }), this.checkIf.bind({
            oPreem: this,
            oQueue: this.aQueues[this.aQueues.length - 1]
        }));
    }

    getQueue() {
        if (!this.oQueue) {
            this.setQueue();
        }
        return this.oQueue;
    }

    _passTest(sPassString) {
        console.log(sPassString.green);
    }

    _failTest(sFailsString) {
        throw new Error(sFailsString);
    }

    addDeferred(fn, arg) {
        let _dft = {
            deferred: function() {
                this.oDeferred = $.Deferred().done(function() {
                    this.clearTimeout();
                    console.log("Fail");
                    let oQueue = Preem.getInstance().oQueue;
                    if (!oQueue.isEmpty()) {
                        Preem.getInstance().oQueue.dequeue().deferred();
                    } else {
                        Preem.getInstance().stopNetworkManager();
                    }

                }.bind(this)).fail(function() {
                    this.clearTimeout();
                    console.error("Fail");
                }.bind(this));
                this._startTimeout();
                return this.oDeferred;
            },
            _startInterval: function() {
                this.iIntervalId = setInterval(function() {
                    let returnBool = this.fn.apply(this, this.arg);

                    if (returnBool) {
                        this.oDeferred.resolve();
                    }
                }.bind(this), 200);
            },
            _startTimeout: function() {
                this._startInterval();
                this.iTimeoutId = setTimeout(function() {
                    window.clearInterval(this.iIntervalId);
                    this.oDeferred.reject();
                }.bind(this), 8000);
            },
            clearTimeout: function() {
                window.clearInterval(this.iIntervalId);
                window.clearTimeout(this.iTimeoutId);
            },
            fn: fn,
            arg: arg
        };
        this.oQueue.enqueue(_dft);
    }

    static get CONSTANTS() {
        return {
            TESTTYPE: {
                SYNC: 'SYNC',
                ASYNC: 'ASYNC'
            }
        };
    }
};

module.exports = global.Preem = Preem;