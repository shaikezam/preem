let jsonxml = require('jsontoxml');

export default class Utils {
    static isTouced = false;
    static downloadedObject = {};
    static numOfTest = 1;
    static saveResultsInInternalObject(returnTestResults) {
        this.downloadedObject["testNumber" + this.numOfTest.toString()] = returnTestResults;
        this.numOfTest++;
    }

    static setDateAndTitle(title, date) {
        this.downloadedObject['testTitle'] = title;
        this.downloadedObject['testDate'] = date;
    }

    static downloadTestReport(bool, data, downloadReportFormat) {
        if (!(bool && Object.values(Preem.CONSTANTS.DOWNLAODFORMAT).indexOf(downloadReportFormat.toString().toUpperCase()) > -1)) {
            //throw ("Preem: can't find element in array of elements, be more specific!!!");
        }
        let xml = jsonxml(JSON.stringify(data));
        let blobOfXML = new Blob([xml], {
            type: 'application/octet-stream'
        }), blobOfJSON = new Blob([JSON.stringify(data)], {
            type: 'application/octet-stream'
        }), url;
        url = downloadReportFormat === Preem.CONSTANTS.DOWNLAODFORMAT.XML ? URL.createObjectURL(blobOfXML) : URL.createObjectURL(blobOfJSON);
        let link = document.createElement('a');
        link.setAttribute('href', url);
        let suffix, fileName;
        fileName = bool === false ? 'data' : 'test_report';
        suffix = downloadReportFormat;
        link.setAttribute('download', fileName + '.' + suffix);
        console.info("Download file");
        link.click();
        URL.revokeObjectURL(url);
    }

}