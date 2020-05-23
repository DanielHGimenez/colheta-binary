
class WsBinary {

    #allSubscribers = [];
    #unsentData = [];
    #subId = 0

    constructor() {
        const WebSocketClient = require('websocket').client;
        this.client = new WebSocketClient();
    }

    #getSubId() {
        let ret = this.#subId;
        this.#subId++;
        return ret;
    }

    subscribe(subscriber) {
        subscriber.id = getSubId();
        this.allSubscribers.push(subscriber);
    }

    unsubscribe(subId) {
        this.allSubscribers = this.allSubscribers.filter((sub, index, arr) => sub.id != subId);
    }

    sendWhenConnected(data) {
        if(this.connection && this.connection.connected) {
            this.connection.sendUTF(data);
        }
        else {
            unsentData.push(data);
        }
    }

    startConnection() {
        var that = this;
        console.log(this);

        function connect() {
            console.info('Conectando...');
            that.client.connect(`wss://ws.binaryws.com/websockets/v3?app_id=${process.env.APP_ID}`);
        }


        function notifySubscribers(data) {
            that.allSubscribers.forEach((subscriber) => {
                subscriber.update(data);
            });
        }

        function sendUnsentData() {
            that.unsentData.forEach((data) => {
                that.connection.sendUTF(data);
            });
        }

        this.client.on('connect', function (connection) {
            console.info('Conectado');
            that.connection = connection;

            sendUnsentData();

            connection.on('message', function (message) {
                if (message.type === 'utf8') {
                    notifySubscribers(message.utf8Data);
                }
            });

            connection.on('error', function (error) {
                console.log("Erro de conexão: " + error.toString());
                connect();
            });

            connection.on('close', function () {
                console.log('echo-protocol Connection Closed');
                connect();
            });
        });

        this.client.on('connectFailed', function (error) {
            console.log('Connect Error: ' + error.toString());
            connect();
        });

        connect();
    }

}

module.exports = WsBinary;