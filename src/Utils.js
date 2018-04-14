let jsonxml = require('jsontoxml');

export default class Utils {
    static isTouced = false;
    static downloadedObject = {};
    static numOfTest = 1;
    static saveResultsInInternalObject(returnTestResults) {
        this.downloadedObject["Test number: " + this.numOfTest.toString()] = returnTestResults;
        this.numOfTest++;
    }

    static setDateAndTitle(title, date) {
        this.downloadedObject['Test Title'] = title;
        this.downloadedObject['Test Date'] = date;
    }

    static downloadTestReport(bool, data, downloadReportFormat) {
        if (!(bool && Object.values(Preem.CONSTANTS.DOWNLAODFORMAT).indexOf(downloadReportFormat.toString().toUpperCase()) > -1)) {
            //throw ("Preem: can't find element in array of elements, be more specific!!!");
        }
        let xml = jsonxml(JSON.stringify(data));
        let blob = new Blob([xml], {
            type: 'application/octet-stream'
        }),
                url = URL.createObjectURL(blob),
                link = document.createElement('a');
        link.setAttribute('href', url);
        let suffix, fileName;
        if (!bool) {
            fileName = 'data',
                    suffix = 'json';
        } else {
            fileName = 'test_report',
                    suffix = downloadReportFormat;
        }
        link.setAttribute('download', fileName + '.' + suffix);
        console.info("Download file");
        link.click();
        URL.revokeObjectURL(url);
    }

}