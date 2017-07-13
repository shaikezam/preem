class Preem {

    constructor(oConfig) {
        require('colors');
        this._setConfig(oConfig);
        this.setQueue();
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

    explain(sDescription) {
        return {
            equal: function(expected, actual, sPassString, sFailsString) {
                if (!(expected instanceof Object && actual instanceof Object)) {
                    this.oQueue.enqueue({
                        fn: this._fnPrimitiveEquality,
                        args: [expected, actual, sPassString, sFailsString]
                    });
                }
            }.bind(this),
        }
    }

    _fnPrimitiveEquality(expected, actual, sPassString, sFailsString) {
        if (!(expected instanceof Object && actual instanceof Object)) {
            expected === actual ? console.log(sPassString.green) : console.log(sFailsString.red);
        }
    }

    setQueue() {
        this.oQueue = {
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
            }
        }
    }

    getQueue() {
        if (!this.oQueue) {
            this.setQueue();
        }
        return this.oQueue;
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
};

module.exports = Preem;