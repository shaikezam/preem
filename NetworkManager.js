let oCalls = [],
        count = 0,
        recordMode;
class NetworkManager {

    static appendCall(obj) {
        oCalls.push(obj);
    }

    static getCall(idx) {
        return oCalls[0];
    }

    static setCalls(obj) {
        oCalls = obj;
        count = obj.length;
    }

    static addFields(response, status) {
        oCalls[count].response = response;
        oCalls[count].status = status;
        NetworkManager.incCount();
    }
    
    static setRecordMode(val) {
        recordMode = val;
    }
    
    static getRecordMode(val) {
        return recordMode;
    }

    static downlaodDataFile() {
        var blob = new Blob([JSON.stringify(oCalls)], {
            type: 'application/octet-stream'
        });

        var url = URL.createObjectURL(blob);
        var link = document.createElement('a');
        link.setAttribute('href', url);
        link.setAttribute('download', 'data.json');

        link.click()

        URL.revokeObjectURL(url)
    }

    static incCount() {
        count++;
    }

    static printCalls() {
        console.log(oCalls);
    }
}

module.exports = global.NetworkManager = NetworkManager;