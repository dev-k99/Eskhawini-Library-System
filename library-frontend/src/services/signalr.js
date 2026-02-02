import { HubConnectionBuilder, LogLevel } from '@microsoft/signalr';

const HUB_URL = import.meta.env.VITE_API_URL?.replace('/api', '') || 'https://localhost:7090/api';

class SignalRService {
  constructor() {
    this.connection = null;
    this.listeners = new Map();
  }

  async connect() {
    if (this.connection) {
      return;
    }

    const token = localStorage.getItem('token');
    
    this.connection = new HubConnectionBuilder()
      .withUrl(`${HUB_URL}/hubs/library`, {
        accessTokenFactory: () => token,
      })
      .withAutomaticReconnect()
      .configureLogging(LogLevel.Warning)
      .build();

    this.connection.onreconnecting(() => {
      console.log('SignalR reconnecting...');
    });

    this.connection.onreconnected(() => {
      console.log('SignalR reconnected');
    });

    this.connection.onclose(() => {
      console.log('SignalR connection closed');
    });

    try {
      await this.connection.start();
      console.log('SignalR connected');
    } catch (error) {
      console.error('SignalR connection failed:', error);
    }
  }

  async disconnect() {
    if (this.connection) {
      await this.connection.stop();
      this.connection = null;
    }
  }

  async joinBookGroup(bookId) {
    if (this.connection) {
      await this.connection.invoke('JoinBookGroup', bookId);
    }
  }

  async leaveBookGroup(bookId) {
    if (this.connection) {
      await this.connection.invoke('LeaveBookGroup', bookId);
    }
  }

  async joinUserGroup(userId) {
    if (this.connection) {
      await this.connection.invoke('JoinUserGroup', userId);
    }
  }

  async leaveUserGroup(userId) {
    if (this.connection) {
      await this.connection.invoke('LeaveUserGroup', userId);
    }
  }

  on(event, callback) {
    if (this.connection) {
      this.connection.on(event, callback);
      this.listeners.set(event, callback);
    }
  }

  off(event) {
    if (this.connection && this.listeners.has(event)) {
      this.connection.off(event, this.listeners.get(event));
      this.listeners.delete(event);
    }
  }
}

export const signalRService = new SignalRService();
export default signalRService;
