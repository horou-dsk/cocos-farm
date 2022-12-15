import { Component, isValid } from "cc";
import { DEFAULT_HEADERS } from "db://assets/Scripts/utils/request";

const BASE_WS = "ws://35.247.144.129:8888/farm";
// const BASE_WS = "wss://socketfarm.transformers.vip/farm";

class EventEmitter {
  private _listener: {
    type: string;
    method: Function;
  }[] = [];

  public on(type: string, callback: Function) {
    this._listener.push({
      type,
      method: callback,
    });
  }

  public emit(type: string, data?: any) {
    for (let listener of this._listener) {
      if (listener.type === type) {
        listener.method(data);
      }
    }
  }

  public off(type: string, callback?: Function) {
    this._listener = this._listener.filter((v) => {
      return v.type !== type || (!!callback && callback !== v.method);
    });
  }
}

export const eventEmitter = new EventEmitter();

export class NetSocket {
  private socket: WebSocket;

  private opening = false;

  private _sendQueue: Record<string, any>[] = [];

  private _sendTimer = null;

  private _heartbeatTimer = null;

  constructor() {}

  public send(data: Record<string, any>) {
    this._sendQueue.push({
      token: DEFAULT_HEADERS.token,
      ...data,
    });
    this._dispatchQueue();
  }

  public connect() {
    if (this.opening) return;
    this.socket = new WebSocket(BASE_WS);
    this.socket.onmessage = this.onMessage;
    this.socket.onopen = this.onOpen;
    this.socket.onerror = this.onError;
    this.socket.onclose = this.onClose;
  }

  private _dispatchQueue() {
    if (!this.opening) {
      clearTimeout(this._sendTimer);
      this._sendTimer = setTimeout(() => {
        this._dispatchQueue();
      }, 100);
      return;
    }
    while (this._sendQueue.length) {
      const data = this._sendQueue.shift();
      const _data = JSON.stringify(data);
      this.socket.send(_data);
    }
  }

  private onMessage = ({ data }) => {
    const jsonMsg = JSON.parse(data);
    if (jsonMsg.method === "ERROR") return;
    eventEmitter.emit(jsonMsg.method, jsonMsg.data);
  };

  private onOpen = () => {
    console.log("WS 连接成功");
    // this.socket.send(JSON.stringify({token: DEFAULT_HEADERS.token}));
    this.opening = true;
    this._heartbeat();
  };

  private onClose = () => {
    console.log("WS Close!");
    this.opening = false;
  };

  private onError = () => {
    console.log("WS Error!");
    this.opening = false;
  };

  private _heartbeat() {
    clearTimeout(this._heartbeatTimer);
    this._heartbeatTimer = setTimeout(() => {
      if (this.opening) {
        this.socket.send(new ArrayBuffer(0));
        this._heartbeat();
      }
    }, 20000);
  }
}

export const net = new NetSocket();

export const RequestController = function classDecorator<
  T extends {
    new (...args: any[]): {
      __requestController?: boolean;
      __requestControllerInit?: () => {};
    } & Component;
  }
>(constructor: T) {
  return class extends constructor {
    constructor(...args: any[]) {
      super(...args);
      this.__requestController = true;
      this?.__requestControllerInit();
    }
  };
};

export const RequestMapping = function (method: string) {
  return function (
    target: any,
    propertyKey: string,
    _descriptor: PropertyDescriptor
  ) {
    const onDestroy = target.onDestroy;
    target.onDestroy = function () {
      if (onDestroy) {
        onDestroy.call(this);
      }
      if (!this.__requestController) return;
      eventEmitter.off(method, this[propertyKey]);
    };
    const start = target.__requestControllerInit;
    target.__requestControllerInit = function () {
      if (!this.__requestController) return;
      if (start) {
        start.call(this);
      }
      const callMethod = this[propertyKey];
      const _eventMethod = (...args) => {
        if (isValid(this)) callMethod.apply(this, args);
        else eventEmitter.off(method, _eventMethod);
      };
      this[propertyKey] = _eventMethod;
      eventEmitter.on(method, this[propertyKey]);
    };
  };
};

if (typeof window !== "undefined") {
  (window as any).CCE = eventEmitter;
}
