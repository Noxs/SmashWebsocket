const WebSocketConnection = require("../lib/WebSocketConnection");
const EventEmitter = require('events');

describe('WebSocketConnection', () => {
	beforeEach(() => {
		jest.resetAllMocks();
	});

	it('Test new instance', () => {
		expect(() => new WebSocketConnection(new EventEmitter())).not.toThrow();
	});

	it('Test error', done => {
		const wsc = new WebSocketConnection(new EventEmitter());
		wsc.on("error", error => {
			done();
		});
		expect(() => { wsc.connection.emit("error", new Error("error")); }).not.toThrow();
	});

	it('Test close', done => {
		const wsc = new WebSocketConnection(new EventEmitter());
		wsc.on("close", () => {
			done();
		});
		expect(() => { wsc.connection.emit("close"); }).not.toThrow();
	});

	it('Test message', done => {
		const wsc = new WebSocketConnection(new EventEmitter());
		wsc.on("foobar", data => {
			expect(data).toEqual({ value1: "1" });
			done();
		});
		expect(() => { wsc.connection.emit("message", { type: "utf8", utf8Data: JSON.stringify({ action: "foobar", body: { value1: "1" } }) }); }).not.toThrow();
	});

	it('Test empty body message', done => {
		const wsc = new WebSocketConnection(new EventEmitter());
		wsc.on("foobar", data => {
			expect(data).toEqual(undefined);
			done();
		});
		expect(() => { wsc.connection.emit("message", { type: "utf8", utf8Data: JSON.stringify({ action: "foobar" }) }); }).not.toThrow();
	});

	it('Test empty message', () => {
		const wsc = new WebSocketConnection(new EventEmitter());
		expect(() => { wsc.connection.emit("message", { type: "utf8" }); }).not.toThrow();
	});

	it('Test empty string message', () => {
		const wsc = new WebSocketConnection(new EventEmitter());
		expect(() => { wsc.connection.emit("message", { type: "utf8", utf8Data: "" }); }).not.toThrow();
	});

	it('Test emit', done => {
		const wsc = new WebSocketConnection(new EventEmitter());
		wsc.connection.connected = true;
		wsc.connection.sendUTF = jest.fn(data => {
			expect(data).toBe(JSON.stringify({ action: "identify", body: { userId: "1" } }));
			done();
		});
		expect(() => { wsc.emit("identify", { userId: "1" }); }).not.toThrow();
	});

	it('Test emit not connected', () => {
		const wsc = new WebSocketConnection(new EventEmitter());
		expect(() => { wsc.emit("identify", { userId: "1" }); }).not.toThrow();
	});
});
