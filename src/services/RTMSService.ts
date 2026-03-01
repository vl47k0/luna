export interface RTMSMessage {
  id: string;
  channel: string;
  text: string;
  timestamp: Date;
  user: string;
}

export interface RTMSStream {
  id: string;
  archive: string;
  meta: string;
  text: string;
  start: Date;
  end: Date;
  user: string;
}

export interface RTMSData {
  command: string;
  context: string;
  id: string;
}

export interface RTMSEvent {
  type: string;
  data: RTMSData;
}

const rtmsEndpoint = 'wss://blue.georgievski.net/rtms/event';

class RTMSService {
  private socket: WebSocket | null = null;
  private url = '';
  public channel: string;
  public token: string;
  private reconnectAttempt = false;
  private reconnectDelay = 1000;
  private maxReconnectDelay = 16000;
  private shouldReconnect = false;
  //public dataIndex: any[] = [];
  private dataListeners: ((data: RTMSEvent[]) => void)[] = [];
  public data: RTMSEvent[] = [];
  private heartbeatInterval: number | undefined;

  constructor(channel: string, token: string) {
    this.channel = channel;
    this.token = token;
    this.url = `${rtmsEndpoint}/${this.channel}/?token=${token}`;
  }

  private uuidv4(): string {
    return '10000000-1000-4000-8000-100000000000'.replace(/[018]/g, (c) =>
      (
        +c ^
        (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (+c / 4)))
      ).toString(16)
    );
  }

  public onConnected(handler: (data: RTMSData) => void): void {
    console.log('RTMSService => Connected');
    handler({ id: this.uuidv4(), context: 'management', command: 'connected' });
  }

  public onDisconnected(handler: (event: RTMSData) => void): void {
    console.log('RTMSService => Disconnected');
    handler({
      id: this.uuidv4(),
      context: 'management',
      command: 'disconnected',
    });
  }

  private reconnect(): void {
    if (!this.shouldReconnect || this.reconnectAttempt) return;
    this.reconnectAttempt = true;
    console.log('RTMSService => Reconnecting');
    setTimeout(() => {
      if (this.shouldReconnect) {
        this.connect();
      }
      this.reconnectDelay = Math.min(
        this.reconnectDelay * 2,
        this.maxReconnectDelay
      );
      this.reconnectAttempt = false;
    }, this.reconnectDelay);
  }

  private startHeartbeat(): void {
    console.log('RTMSService => Heartbeat => Start');
    if (this.heartbeatInterval) clearInterval(this.heartbeatInterval);
    this.heartbeatInterval = window.setInterval((): void => {
      this.sendHeartbeat();
    }, 1800000);
  }

  private sendHeartbeat(): void {
    const heartBeat: RTMSEvent = {
      type: 'ping',
      data: {
        id: this.uuidv4(),
        context: 'management',
        command: 'ping',
      },
    };

    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
      const ping = JSON.stringify(heartBeat);
      this.socket.send(ping);
      console.log('RTMSService => Heartbeat => Ping => Sent: ', ping);
    }
  }

  public connect(): void {
    this.shouldReconnect = true;
    console.log('RTMSService => Connect => Socket: ', this.socket);

    if (this.reconnectAttempt) return;
    if (this.socket && this.socket.readyState < 2) {
      console.log('RTMSService => Connect => Socket: ', this.socket);
      console.log(
        'RTMSService => Connect => Socket => Ready: ',
        this.socket.readyState
      );
      return;
    }

    this.socket = new WebSocket(this.url);

    this.socket.onopen = (): void => {
      console.log('RTMSService => Socket => Connected');
      this.startHeartbeat();
      this.reconnectAttempt = false;
      this.reconnectDelay = 1000;
      this.onConnected((data) => console.log('Connected with data:', data));
    };

    this.socket.onclose = (): void => {
      console.error('RTMSService => Socket => Disconnected');
      this.socket = null;
      this.onDisconnected((data) =>
        console.log('Disconnected with data:', data)
      );
      this.reconnect();
    };

    this.socket.onmessage = (ev: MessageEvent): void => {
      console.log('RTMSService => OnMessage => Event: ', ev);
      if (typeof ev.data === 'string') {
        const x = this.parseData(ev.data);
        console.log('RTMSService => OnMessage => X: ', x);
        if (x) {
          this.data.push(x);
        }
        console.log('RTMSService => OnMessage => Data: ', this.data);
        this.notifyDataListeners();
      }
    };

    this.socket.onerror = (error: Event): void => {
      console.error('RTMSService => Socket => Error: ', error);
      this.socket = null;
      this.reconnect();
    };
  }

  public sendMessage(message: RTMSEvent): void {
    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
      const messageString = JSON.stringify(message);
      console.log('RTMSService => Send => RTMS: ', messageString);
      this.socket.send(messageString);
    } else {
      console.log('RTMSService => Socket => Dead: ', this.socket);
      this.reconnect();
    }
  }

  public disconnect(): void {
    this.shouldReconnect = false;
    if (this.socket) {
      console.log('RTMSService => Disconnect => Socket: ', this.socket);
      this.socket.close();
    }
  }

  private parseData(jsonString: string): RTMSEvent | null {
    console.log('RTMSService => ParseData => JSON: ', jsonString);
    try {
      const message = JSON.parse(jsonString) as RTMSEvent;
      if (
        message?.data?.id &&
        typeof message.data.id === 'string' &&
        message.data?.command &&
        typeof message.data.command === 'string'
      ) {
        console.log('RTMSService => ParseData => OK: ', message.data);
        return message;
      }
    } catch (error) {
      console.error(
        `RTMSService => ParseData ${jsonString} is not an event: ${(error as Error).message} skipping`
      );
    }
    return null;
  }

  public onData(callback: (data: RTMSEvent[]) => void): void {
    console.log('RTMSService => Register => OnData: ', callback);
    this.dataListeners.push(callback);
  }

  private notifyDataListeners(): void {
    this.dataListeners.forEach((listener) => {
      console.log('RTMSService => Notifying => Listener: ', listener);
      console.log('RTMSService => Notifying => Data: ', this.data);
      listener(this.data);
    });
    this.data = [];
  }
}

export { RTMSService };
