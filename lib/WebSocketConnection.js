const EventEmitter = require('events');

const NATIVE_EVENTS = {
	CLOSE: "close",
	ERROR: "error",
	MESSAGE: "message",
};

const EMIT_LOCALLY = "emit_locally";

class SmashWebSocketConnection extends EventEmitter {
	constructor(connection) {
		super();
		this.connection = connection;
		this.connection.on('error', (error) => {
			this.emit('error', error);
		});
		this.connection.on('close', (error) => {
			this.emit('close', error);
		});
		this.connection.on('message', (message) => {
			if (message.type === 'utf8') {
				try {
					const data = JSON.parse(message.utf8Data);
					this.emit(data.action, data.body, EMIT_LOCALLY);
				} catch (error) {

				}
			}
		});
	}

	emit(type, ...args) {
		if (args[args.length - 1] === EMIT_LOCALLY) {
			args.pop();
			super.emit(type, ...args)
		} else if (type === NATIVE_EVENTS.CLOSE || type === NATIVE_EVENTS.ERROR) {
			super.emit(type, ...args)
		} else {
			if (this.connection.connected) {
				this.connection.sendUTF(JSON.stringify({ action: type, body: args[0] }));
			}
		}
	}
}

module.exports = SmashWebSocketConnection;
