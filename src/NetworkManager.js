
export default class NetworkManager {
    static oCalls = [];
    static count = 0;
    static recordMode = false;
    static appendCall(obj) {
        return NetworkManager.oCalls.push(obj) - 1;
    }

    static getCall(idx) {
        return NetworkManager.oCalls[0];
    }

    static setCalls(obj) {
        NetworkManager.oCalls = obj;
        NetworkManager.count = obj.length;
    }

    static addFields(response, status) {
        NetworkManager.oCalls[NetworkManager.count].response = response;
        NetworkManager.oCalls[NetworkManager.count].status = status;
        NetworkManager.incCount();
    }

    static setRecordMode(val) {
        NetworkManager.recordMode = val;
    }

    static getRecordMode(val) {
        return NetworkManager.recordMode;
    }

    static downlaodDataFile() {
        var blob = new Blob([JSON.stringify(NetworkManager.oCalls)], {
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
        NetworkManager.count++;
    }

    static printCalls() {
        console.log(NetworkManager.oCalls);
    }
}