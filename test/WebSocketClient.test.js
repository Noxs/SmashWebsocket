const WebSocketClient = require("../lib/WebSocketClient");
const EventEmitter = require('events');

describe('WebSocketClient', () => {
	beforeEach(() => {
		jest.resetAllMocks();
	});

	it('Test new instance', () => {
		expect(() => new WebSocketClient()).not.toThrow();
	});

	it('Test connect', () => {
		const ws = new WebSocketClient();
		ws.client.connect = jest.fn((url, protocol) => {
			expect(url).toBe("wss://localhost");
			expect(protocol).toBe("protocol");
		});
		expect(() => { ws.connect("wss://localhost", "protocol"); }).not.toThrow();
	});

	it('Test connectionFailed', (done) => {
		const ws = new WebSocketClient();
		ws.on("connectFailed", (error) => {
			done();
		});
		expect(() => { ws.client.emit("connectFailed"); }).not.toThrow();
	});

	it('Test connect', (done) => {
		const ws = new WebSocketClient();
		ws.on("connect", (error) => {
			done();
		});
		expect(() => { ws.client.emit("connect", new EventEmitter()); }).not.toThrow();
	});
});
