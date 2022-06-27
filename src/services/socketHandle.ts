import env from '@config/env';
import { createContext } from 'react';
import { io, Socket } from 'socket.io-client';

interface SocketQuery {
  id: string;
  name: string;
  domain: string;
}

export class SocketIo {
  socket: Socket;
  callBack: any;

  constructor(url: string, query?: SocketQuery) {
    this.socket = io(url, {
      autoConnect: true,
      forceNew: true,
      reconnection: true,
      reconnectionAttempts: 1000,
      reconnectionDelayMax: 10000,
      query: query,
    });
    this.callBack = null;
  }

  connect() {
    this.socket.connect();
  }

  listenEvent(eventName: string, callBack: (event?: any) => void) {
    this.callBack = callBack;
    this.socket.on(eventName, this.callBack);
  }

  listenEventOnce(eventName: string, callBack: (event?: any) => void) {
    this.callBack = callBack;
    this.socket.once(eventName, this.callBack);
  }

  emitEvent(eventName: string, params: any) {
    this.socket.emit(eventName, params);
  }

  offEvent(eventName: string) {
    if (this.callBack) {
      this.socket.off(eventName, this.callBack);
      this.callBack = null;
    }
  }

  disconnect() {
    this.socket.disconnect();
  }
}

export const SocketContext = createContext<SocketIo>(new SocketIo(env.WS_ENDPONIT));
