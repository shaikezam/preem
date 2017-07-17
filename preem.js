"use strict";
class Preem {

    constructor(oConfig) {
        require('colors');
        this._setConfig(oConfig);
        this.setQueue();
        this.aQueues = [];
        Preem.instance = this;
    }

    start() {

        if (this.oConfig.testType === Preem.CONSTANTS.TESTTYPE.SYNC) {
            this._handleSyncTest();
        } else {
            this.oQueue.dequeue().deferred();
        }
    }

    _setConfig(_oConfig) {
        this.oConfig = {
            testType: _oConfig ? _oConfig.testType || Preem.CONSTANTS.TESTTYPE.SYNC : Preem.CONSTANTS.TESTTYPE.SYNC
        };
    }

    _handleSyncTest() {
        while (!this.oQueue.isEmpty()) {
            let oSyncTest = this.oQueue.dequeue();
            oSyncTest.fn.apply(this, oSyncTest.args);
        }
    }

    checkIf(oTestedObject) {
        let oPreem = new Preem();
        return {
            isEqualTo: function(actual, sPassString, sFailsString) {
                this.enqueue({
                    fn: oPreem._fnEqual,
                    args: [oTestedObject, actual, sPassString, sFailsString]
                });
            }.bind(this),
            isNotEqualTo: function(actual, sPassString, sFailsString) {
                this.enqueue({
                    fn: oPreem._fnNotEqual,
                    args: [oTestedObject, actual, sPassString, sFailsString]
                });
            }.bind(this),
            isIncludes: function(args, sPassString, sFailsString) {
                this.enqueue({
                    fn: oPreem._fnInclude,
                    args: [oTestedObject, args, sPassString, sFailsString]
                });
            }.bind(this),
            isNotIncludes: function(args, sPassString, sFailsString) {
                this.enqueue({
                    fn: oPreem._fnNotInclude,
                    args: [oTestedObject, args, sPassString, sFailsString]
                });
            }.bind(this),
            isDeepEqualTo: function(actual, sPassString, sFailsString) {
                this.enqueue({
                    fn: oPreem._fnObjectsEquality,
                    args: [oTestedObject, actual, sPassString, sFailsString]
                });
            }.bind(this)
        }
    }

    _fnNotEqual(expected, actual, sPassString, sFailsString) {
        console.log('asd');
        expected !== actual ? Preem._passTest(sPassString) : Preem._failTest(sFailsString);
    }

    _fnEqual(expected, actual, sPassString, sFailsString) {
        expected === actual ? Preem._passTest(sPassString) : Preem._failTest(sFailsString);
    }

    _fnInclude(oTestedArray, oTestedObject, sPassString, sFailsString) {
        oTestedArray.indexOf(oTestedObject) >= 0 ? Preem._passTest(sPassString) : Preem._failTest(sFailsString);
    }

    _fnNotInclude(oTestedArray, oTestedObject, sPassString, sFailsString) {
        oTestedArray.indexOf(oTestedObject) === -1 ? Preem._passTest(sPassString) : Preem._failTest(sFailsString);
    }

    _fnObjectsEquality(expected, actual, sPassString, sFailsString) {
        JSON.stringify(expected) === JSON.stringify(actual) ? Preem._passTest(sPassString) : Preem._failTest(sFailsString);
    }

    createQueue(sDescription) {
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
            description: sDescription
        }
    }

    setQueue() {
        this.oQueue = this.createQueue('temp');
    }

    describe(sDescription, fn) {
        this.aQueues.push(this.createQueue(sDescription));
        fn(this.checkIf.bind(this.aQueues[this.aQueues.length - 1]))
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
                ASNYC: 'ASYNC'
            }
        };
    }
    
    static _passTest(sPassString) {
        console.log(sPassString.green);
    }
    
    static get getPreemInstance() {
        return Preem.instance;
    }
};

module.exports = Preem;