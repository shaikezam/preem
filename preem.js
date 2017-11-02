"use strict";
class Preem {

    constructor(oConfig) {
        require('jQuery');
        this._setConfig(oConfig);
        this.setQueue();
        this.aQueues = [];
    }

    start() {
        if (this.oConfig.type === Preem.CONSTANTS.TESTTYPE.SYNC) {
            let sAppPath = this.oConfig.appPath;
            if (sAppPath) {
                let oIframe = document.getElementById('iFrameName');
                oIframe.src = sAppPath;
                oIframe.onload = function () {
                    oIframe.onload = null;
                    this.oConfig.appContext = oIframe.contentWindow.document;
                    this._handleSyncTest();
                }.bind(this);
            }
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
        RendererManager.renderTestTitle(this.oConfig.title);
        if (this.oConfig.onStart) {
            this.oConfig.onStart();
        }
    }

    _setConfig(_oConfig) {
        this.oConfig = {
            type: _oConfig ? _oConfig.type || Preem.CONSTANTS.TESTTYPE.SYNC : Preem.CONSTANTS.TESTTYPE.SYNC,
            onFinish: _oConfig ? _oConfig.onFinish || null : null,
            onStart: _oConfig ? _oConfig.onStart || null : null,
            title: _oConfig.title,
            appPath: _oConfig.networkManager && _oConfig.networkManager.appPath ? _oConfig.networkManager.appPath : ""
        };
    }

    _handleSyncTest() {
        this._handleStart();
        for (let i = 0; i < this.aQueues.length; i++) {
            let iTestModuleTime = 0,
                    oQueue = this.aQueues[i],
                    oQueueFnBeforeEach = oQueue.beforeEach;
            console.log(oQueue.description);
            RendererManager.renderTestModule(oQueue.description, i);
            while (!oQueue.isEmpty()) {
                let oSyncTest = oQueue.dequeue();
                if (oQueueFnBeforeEach) {
                    oQueueFnBeforeEach();
                }
                let iStartSingularTestTime = window.performance.now(),
                        bSingularTestResult = oSyncTest.fn.apply(this, oSyncTest.args),
                        iFinishSingularTestTime = (window.performance.now() - iStartSingularTestTime).toFixed(4);
                console.log(bSingularTestResult);
                iTestModuleTime += parseFloat(iFinishSingularTestTime);
                RendererManager.renderSingularTest(bSingularTestResult.description, bSingularTestResult.status, i, iFinishSingularTestTime);
            }
            RendererManager.renderTestModuleTime(i, iTestModuleTime.toFixed(4));
        }
        this._handleDone();
    }

    checkIf(oTestedObject) {
        let aArguments = arguments;
        //this.oQueue.beforeEach ? this.oQueue.beforeEach() : null;
        return {
            isEqualTo: function (actual, sPassString, sFailsString) {
                this.oQueue.enqueue({
                    fn: this.oPreem._fnEqual.bind(this.oPreem),
                    args: [oTestedObject, actual, sPassString, sFailsString]
                });
            }.bind(this),
            isNotEqualTo: function (actual, sPassString, sFailsString) {
                this.oQueue.enqueue({
                    fn: this.oPreem._fnNotEqual.bind(this.oPreem),
                    args: [oTestedObject, actual, sPassString, sFailsString]
                });
            }.bind(this),
            isIncludes: function (args, sPassString, sFailsString) {
                this.oQueue.enqueue({
                    fn: this.oPreem._fnInclude.bind(this.oPreem),
                    args: [oTestedObject, args, sPassString, sFailsString]
                });
            }.bind(this),
            isNotIncludes: function (args, sPassString, sFailsString) {
                this.oQueue.enqueue({
                    fn: this.oPreem._fnNotInclude.bind(this.oPreem),
                    args: [oTestedObject, args, sPassString, sFailsString]
                });
            }.bind(this),
            isDeepEqualTo: function (actual, sPassString, sFailsString) {
                this.oQueue.enqueue({
                    fn: this.oPreem._fnObjectsEquality.bind(this.oPreem),
                    args: [oTestedObject, actual, sPassString, sFailsString]
                });
            }.bind(this),
            inMyCriteria: function (fn, sPassString, sFailsString) {
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

    findDomElement(by) {
        return {
            isBackgroundColorIsEqualTo: function (sColor, sPassString, sFailsString) {
                this.oQueue.enqueue({
                    fn: this.oPreem._isBackgroundColorIsEqualTo.bind(this.oPreem),
                    args: [by, sColor, sPassString, sFailsString]
                });
            }.bind(this),
            isTextEqualTo: function (sText, sPassString, sFailsString) {
                this.oQueue.enqueue({
                    fn: this.oPreem._isTextEqualTo.bind(this.oPreem),
                    args: [by, sText, sPassString, sFailsString]
                });
            }.bind(this)
        }
    }

    when() {
        return {
            iCanSeeElement: function (obj, sPassString, sFailsString) {
                this.oQueue.enqueue({
                    fn: function (obj, sPassString, sFailsString) {
                        var str = "";
                        for (let key in obj) {
                            str = str + obj[key] + ' ';
                        }
                        console.log(this.oConfig.appContext.querySelectorAll(str));

                        //console.log(this.oConfig.appContext.querySelectorAll(str));
                        return this._passTest(sPassString);
                    }.bind(this.oPreem),
                    args: [obj, sPassString, sFailsString]
                });
            }.bind(this)
        }
    }

    beforeEach(fnCallback) {
        this.oQueue.beforeEach = fnCallback;
    }

    _fnNotEqual(expected, actual, sPassString, sFailsString) {
        return expected !== actual ? this._passTest(sPassString) : this._failTest(sFailsString);
    }

    _fnEqual(expected, actual, sPassString, sFailsString) {
        return expected === actual ? this._passTest(sPassString) : this._failTest(sFailsString);
    }

    _fnInclude(oTestedArray, oTestedObject, sPassString, sFailsString) {
        return oTestedArray.indexOf(oTestedObject) >= 0 ? this._passTest(sPassString) : this._failTest(sFailsString);
    }

    _fnNotInclude(oTestedArray, oTestedObject, sPassString, sFailsString) {
        return oTestedArray.indexOf(oTestedObject) === -1 ? this._passTest(sPassString) : this._failTest(sFailsString);
    }

    _fnObjectsEquality(expected, actual, sPassString, sFailsString) {
        return JSON.stringify(expected) === JSON.stringify(actual) ? this._passTest(sPassString) : this._failTest(sFailsString);
    }

    _inMyCriteria(args, fn, sPassString, sFailsString) {
        let bFlag = fn.apply(this, args);
        return bFlag == true ? this._passTest(sPassString) : this._failTest(sFailsString);
    }

    _isBackgroundColorIsEqualTo(by, sColor, sPassString, sFailsString) {
        console.log();
        return this.oConfig.appContext.getElementById('myButton').style.backgroundColor === sColor ? this._passTest(sPassString) : this._failTest(sFailsString);
    }

    _isTextEqualTo(by, sText, sPassString, sFailsString) {
        var oAnchors = this.oConfig.appContext.getElementsByTagName('a');
        for (var i = 0; i < oAnchors.length; i++) {
            if (oAnchors[i].text === sText) {
                return this._passTest(sPassString);
            }
        }
        return this._failTest(sFailsString);
    }

    createQueue(sDescription, beforeEach) {
        return {
            _arr: [],
            enqueue: function (node) {
                this._arr.push(node);
            },
            dequeue: function () {
                let temp = null;
                if (!this.isEmpty()) {
                    temp = this._arr[0];
                    this._arr.shift();
                }
                return temp;
            },
            isEmpty: function () {
                return this._arr.length === 0;
            },
            peek: function () {
                return this._arr[0];
            },
            removeQueue: function () {
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
        }), this.findDomElement.bind({
            oPreem: this,
            oQueue: this.aQueues[this.aQueues.length - 1]
        }), this.when.bind({
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
        console.log(sPassString);
        return {
            status: true,
            description: sPassString
        };
    }

    _failTest(sFailsString) {
        return {
            status: false,
            description: sFailsString
        };
        //throw new Error(sFailsString);
    }

    static get CONSTANTS() {
        return {
            TESTTYPE: {
                SYNC: 'SYNC',
                ASYNC: 'ASYNC'
            }
        };
    }
}
;

class RendererManager {
    static renderTestTitle(title) {
        let oDate = new Date();
        title = title + ' ' + oDate.toLocaleDateString() + ' ' + oDate.toLocaleTimeString();
        $('body').append('<h1>' + title + '</h1>');
    }
    static renderTestModule(description, index) {
        $('body').append('<div class = "runningTestModule" id = "testModule' + index + '"><div class="testModuleTitle" id = "testModuleTitle' + index + '">' + description + '</div></div>');
    }
    static renderTestModuleTime(index, iTestModuleTime) {
        $('#testModuleTitle' + index).text($('#testModuleTitle' + index).text() + ' ' + iTestModuleTime);
    }
    static renderSingularTest(description, bStatus, index, iSingularTestTime) {
        if (bStatus) {
            $('#testModule' + index).append('<div class = "passSingularTest">' + description + ' ' + iSingularTestTime + '</div>');
            return;
        }
        $('#testModule' + index).append('<div class = "faildSingularTest" id = "testModule' + index + '">' + description + ' ' + iSingularTestTime + '</div>');
    }
}
;

module.exports = global.Preem = Preem;