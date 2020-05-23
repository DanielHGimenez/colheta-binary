module.exports = 
class Coletador {

    #reqId = 0;

    constructor() {
        const WsBinary = require('./ws-binary');
        this.client = new WsBinary();
        this.client.startConnection();
    }

    #getReqId() {
        let ret = this.#reqId;
        this.#reqId = (this.#reqId + 1) % 500;
        return ret;
    }

    getTickOf(timestamp, amount, timeout = 3) {
        let that = this;

        let reqId = getReqId();

        let promise = new Promise(function(resolve, reject) {

            let subscription = new function() {
                
                this.update = function(data) {
                    let jsonData = JSON.parse(data);
                    if (jsonData.reqId == reqId) {
                        that.client.unsubscribe(that.id);
                        resolve(jsonData);
                    }
    
                }
            }

            this.client.subscribe(subscription);
            setTimeout(reject, timeout);
        });

        that.client.sendWhenConnected(JSON.stringify({
            "ticks_history": "frxAUDUSD",
            "adjust_start_time": 1,
            "count": 5000,
            "start": timestamp,
            "end": timestamp + (5000 * 2),
            "style": "ticks",
            "req_id": reqId
        }));

        sendRequestOfPicks(timestamp);

    }

}