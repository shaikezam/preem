
export default class NetworkManager {
    static oCalls = [];
    static count = 0;
    static recordMode;
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

    static addFields(response, status, callIndex) {
        NetworkManager.oCalls[callIndex].response = response;
        NetworkManager.oCalls[callIndex].status = status
        NetworkManager.incCount();
    }

    static setRecordMode(val) {
        NetworkManager.recordMode = val;
    }

    static getRecordMode(val) {
        return NetworkManager.recordMode;
    }

    static downlaodDataFile() {
        let blob = new Blob([JSON.stringify(NetworkManager.oCalls)], {
            type: 'application/octet-stream'
        }),
                url = URL.createObjectURL(blob),
                link = document.createElement('a');
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

    static startPlayMode(data) {
        NetworkManager.setCalls(data);
        let server = sinon.fakeServer.create();
        server.respondImmediately = true;
        $('#iFrameName')[0].contentWindow.XMLHttpRequest = window.XMLHttpRequest;
        for (var i = 0; i < data.length; i++) {
            server.respondWith(data[i].method, data[i].url,
                    [data[i].status, null,
                        data[i].response]);
        }
    }
    static startRecordMode() {
        let open = $('#iFrameName')[0].contentWindow.XMLHttpRequest.prototype.open;
        $('#iFrameName')[0].contentWindow.XMLHttpRequest.prototype.open = function (sMethod, sURI) {
            let callIndex = NetworkManager.appendCall({url: sURI, method: sMethod});
            this.onreadystatechange = function () {
                if (this.readyState === 4) {
                    NetworkManager.addFields(this.response, this.status, callIndex);
                }
            };
            return open.apply(this, arguments);
        };
    }

    static get CONSTANTS() {
        return {
            RECORD_MODE: {
                PLAY: 'Play',
                RECORD: 'Record'
            }
        };
    }
}