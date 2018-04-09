"use strict";
window.$ = window.jQuery = require("jquery");
window.sinon = require('sinon');
import RendererManager from './RendererManager';
import NetworkManager from './NetworkManager';
import Utils from './Utils';
import './style/preem.css';

let instance = null;
class Preem {
    constructor(oConfig) {
        if (!instance) {
            instance = this;
        }
        this._setConfig(oConfig);
        this.aQueues = [];
        this.results = {};
    }

    start() {
        let sAppPath = this.oConfig.appPath;
        if (sAppPath) {
            $(window).load(function () {
                let oIframe = RendererManager.createIframeAndAppendSrc(sAppPath);
                oIframe.load(function () {
                    $.get(this.oConfig.data, function (data) {
                        this.oConfig.recordMode = NetworkManager.CONSTANTS.RECORD_MODE.PLAY;
                        NetworkManager.startPlayMode.call(this, data);
                    }.bind(this)).fail(function (data) {
                        this.oConfig.recordMode = NetworkManager.CONSTANTS.RECORD_MODE.RECORD;
                        NetworkManager.startRecordMode.call(this);
                    }.bind(this)).always(function () {
                        NetworkManager.setRecordMode(this.oConfig.recordMode);
                    }.bind(this));
                    this._start();
                }.bind(this));
            }.bind(this));
        }
    }

    _handleDone() {
        if (this.oConfig.onFinish) {
            this.oConfig.onFinish();
        }
        if (NetworkManager.getRecordMode() === NetworkManager.CONSTANTS.RECORD_MODE.RECORD) {
            Utils.downloadTestReport(false, NetworkManager.oCalls);
        }
        Utils.downloadTestReport(true, Utils.downloadedObject);
    }

    _handleStart() {
        RendererManager.renderTestTitle(this.oConfig.title);
        if (this.oConfig.onStart) {
            this.oConfig.onStart();
        }
    }

    _setConfig(_oConfig) {
        this.oConfig = {
            onFinish: _oConfig ? _oConfig.onFinish || null : null,
            onStart: _oConfig ? _oConfig.onStart || null : null,
            title: _oConfig.title,
            appPath: _oConfig.networkManager && _oConfig.networkManager.appPath ? _oConfig.networkManager.appPath : "",
            data: _oConfig.networkManager && _oConfig.networkManager.data ? _oConfig.networkManager.data : "",
            downloadReportFormat: _oConfig.downloadReport && _oConfig.downloadReport.format ? _oConfig.downloadReport.format : false,
            downloadReportName: _oConfig.downloadReport && _oConfig.downloadReport.name ? _oConfig.downloadReport.name : false
        };
    }

    _start() {
        this._handleStart();
        this.testRunner(0, this.aQueues, 0);
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

    when() {
        return {
            iCanSeeElement: function (obj, sPassString, sFailsString) {
                this.oQueue.enqueue(this.oPreem.addDeferred(function (obj, sPassString, sFailsString) {
                    let applicationCtx = $('#iFrameName')[0];
                    if (obj.el && obj.el instanceof Function) { //handle function
                        let applicationObj = obj.el(applicationCtx.contentWindow);
                        if (applicationObj) {
                            if (obj.action) {
                                Preem.trigger(applicationObj, obj.action);
                            }
                            return this._passTest(sPassString);
                        }
                    } else if (obj.el && obj.el instanceof Object) { // handle Object (ID, Class, Tag)

                        if (this._handleObject(obj.el, applicationCtx.contentWindow.document)) {
                            return this._passTest(sPassString);
                        }
                    }
                    return this._failTest(sFailsString);
                }.bind(this.oPreem), [obj, sPassString, sFailsString]));
            }.bind(this),
            isObject: function (obj, sPassString, sFailsString) {
                this.oQueue.enqueue(this.oPreem.addDeferred(function (obj, sPassString, sFailsString) {
                    let applicationJquery = document.getElementById('iFrameName').contentWindow.$,
                            applicationObj = applicationJquery('#' + obj.id);
                    if (applicationObj !== null) {
                        if (applicationObj.is(obj.property)) {
                            return this._passTest(sPassString);
                        }
                        return this._failTest(sFailsString);
                    }

                }.bind(this.oPreem), [obj, sPassString, sFailsString]));
            }.bind(this),
            isElementTextEquals: function (obj, sPassString, sFailsString) {
                this.oQueue.enqueue(this.oPreem.addDeferred(function (obj, sPassString, sFailsString) {
                    let applicationObj = document.getElementById('iFrameName').contentWindow.document.getElementById(obj.id);
                    if (applicationObj !== null) {
                        if (applicationObj.innerHTML === obj.text) {
                            return this._passTest(sPassString);
                        }
                        return this._failTest(sFailsString);
                    }
                }.bind(this.oPreem), [obj, sPassString, sFailsString]));
            }.bind(this),
            isElementContainsText: function (obj, sPassString, sFailsString) {
                this.oQueue.enqueue(this.oPreem.addDeferred(function (obj, sPassString, sFailsString) {
                    let applicationObj = document.getElementById('iFrameName').contentWindow.document.getElementById(obj.id);
                    if (applicationObj !== null) {
                        let sApplicationObj = applicationObj.innerHTML;
                        if (sApplicationObj.includes(obj.text)) {
                            return this._passTest(sPassString);
                        }
                        return this._failTest(sFailsString);
                    }
                }.bind(this.oPreem), [obj, sPassString, sFailsString]));
            }.bind(this)
        };
    }

    _handleObject(obj, applicationCtx) {
        let objID = applicationCtx.getElementById(obj.id), //if id is sending, find it, else obj is set for true for return false\true later on
                objClass = applicationCtx.getElementsByClassName(obj.class),
                objTag = applicationCtx.getElementsByTagName(obj.tag);
        if (objID === null && objClass === null && objTag === null) { //if non of the elements found we return false - obj not found!
            return false;
        }
        let arrClass = Array.prototype.slice.call(objClass, 0), //convert getElementsByClassName and getElementsByTagName to array
                arrTag = Array.prototype.slice.call(objTag, 0);
        if (arrClass.length === 0 && arrTag.length === 0 && objID === null) {
            return false;
        }
        let isElementFound = true;
        if (arrClass.length > 0 && objID !== null) {
            isElementFound = arrClass.includes(objID);
        }
        if (arrTag.length > 0 && objID !== null) {
            isElementFound = arrTag.includes(objID) && isElementFound;
        }
        if (objID !== null) {
            return objID && isElementFound;
        }
        if ((arrClass.length > 1 && arrTag.length === 0) || (arrTag.length > 1 && arrClass.length === 0)) {
            //throw ("Preem: can't find element in array of elements, be more specific!!!");
            return false;
        }
        let numOfMatchedObjects = 0;
        for (let i = 0; i < arrClass.length; i++) {
            let elem = arrClass[i];
            if (arrTag.includes(elem)) {
                numOfMatchedObjects++;
            }
        }
        return numOfMatchedObjects === 1 && isElementFound;
    }

    _handleFunction(obj, applicationCtx) {
        console.log(this);
    }

    beforeEach(fnCallback) {
        this.oQueue.beforeEach = fnCallback;
    }

    testRunner(currentTestModuleIndex, testModules, currentTestModuleDuration) {
        let currentTestModule = testModules[currentTestModuleIndex];
        !currentTestModule.isTouched ? RendererManager.renderTestModule(currentTestModule.description, currentTestModuleIndex) : null;
        let currentTest = currentTestModule.dequeue(),
                currentTestDeferred = currentTest.deferred();
        currentTestDeferred.done(function () {
            this.clearTimeout();
        }.bind(currentTest)).fail(function () {
            this.clearTimeout();
        }.bind(currentTest)).always(function () {
            this.currentTest.iFinishSingularTestTime = (window.performance.now() - this.currentTest.iStartSingularTestTime).toFixed(4);
            //console.log(this.preem.oConfig.downloadReportFormat);
            //console.log(this.preem.oConfig.downloadReportName);
            Utils.saveResultsInInternalObject(this.currentTest.returnTestResults);
            RendererManager.renderSingularTest(this.currentTest.returnTestResults.description, this.currentTest.returnTestResults.status, currentTestModuleIndex, this.currentTest.iFinishSingularTestTime);
            if (currentTestModule.isEmpty()) {
                RendererManager.renderTestModuleTime(currentTestModuleIndex, currentTestModuleDuration + parseFloat(this.currentTest.iFinishSingularTestTime));
                if (currentTestModuleIndex === testModules.length - 1) {
                    this.preem._handleDone();
                    return;
                } else {
                    currentTestModuleIndex++;
                    this.preem.testRunner(currentTestModuleIndex, testModules, 0);
                    return;
                }
            }
            this.preem.testRunner(currentTestModuleIndex, testModules, (currentTestModuleDuration + parseFloat(this.currentTest.iFinishSingularTestTime)));
        }.bind({
            currentTest: currentTest,
            preem: this
        }));
        currentTest._startTimeout();
    }

    addDeferred(fn, args) {
        return {
            deferred: function () {
                this.oDeferred = $.Deferred();
                return this.oDeferred;
            },
            _startInterval: function () {
                this.iIntervalId = setInterval(function () {
                    this.iStartSingularTestTime = window.performance.now();
                    this.returnTestResults = this.fn.apply(this, this.args);
                    if (this.returnTestResults.status) {
                        this.oDeferred.resolve();
                    }
                }.bind(this), 200);
            },
            _startTimeout: function () {
                this._startInterval();
                this.iTimeoutId = setTimeout(function () {
                    window.clearInterval(this.iIntervalId);
                    this.oDeferred.reject();
                }.bind(this), 6000);
            },
            clearTimeout: function () {
                window.clearInterval(this.iIntervalId);
                window.clearTimeout(this.iTimeoutId);
            },
            fn: fn,
            args: args
        };
    }

    createQueue(sDescription, beforeEach) {
        return {
            _arr: [],
            enqueue: function (node) {
                this._arr.push(node);
            },
            dequeue: function () {
                if (!this.isTouched) {
                    this.isTouched = true;
                }
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
            isTouched: false,
            description: sDescription,
            beforeEach: beforeEach
        };
    }

    testModule(sDescription, fn) {
        this.aQueues.push(this.createQueue(sDescription));
        fn(this.beforeEach.bind({
            oPreem: this,
            oQueue: this.aQueues[this.aQueues.length - 1]
        }), this.checkIf.bind({
            oPreem: this,
            oQueue: this.aQueues[this.aQueues.length - 1]
        }), this.when.bind({
            oPreem: this,
            oQueue: this.aQueues[this.aQueues.length - 1]
        }), this.when.bind({
            oPreem: this,
            oQueue: this.aQueues[this.aQueues.length - 1]
        }));
    }

    _passTest(sPassString) {
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
    }

    static get CONSTANTS() {
        return {
            TESTTYPE: {
                SYNC: 'SYNC',
                ASYNC: 'ASYNC'
            },
            ACTIONS: {
                CLICK: 'CLICK',
                PRESS: 'PRESS',
                TYPE: 'TYPE'
            },
            DOWNLAODFORMAT: {
                JSON: 'JSON',
                HTML: 'HTML',
                XML: 'XML'
            }
        };
    }

    static trigger(obj, action) {
        switch (action) {
            case Preem.CONSTANTS.ACTIONS.CLICK:
                obj.click();
                break;
            case Preem.CONSTANTS.ACTIONS.TYPE:
                obj.value = obj.text;
                break;
            default:

                break;
        }
    }
}
;
module.exports = global.Preem = Preem;