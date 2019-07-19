const WebSocketClient = require('websocket').client;
const EventEmitter = require('events');
const SmashWebSocketConnection = require('./WebSocketConnection');

const NATIVE_EVENTS = {
	CLOSE: "close",
	ERROR: "error",
	MESSAGE: "message",
};

class SmashWebSocketClient extends EventEmitter {
	constructor() {
		super();
		this.client = new WebSocketClient();
		this.client.on('connectFailed', error => {
			this.emit('connectFailed', error);
		});

		this.client.on('connect', connection => {
			this.emit('connect', new SmashWebSocketConnection(connection));
		});
	}

	connect(url, protocol) {
		return this.client.connect(url, protocol);
	}
}

module.exports = SmashWebSocketClient;
