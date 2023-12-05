// AuthEventEmitter.js
class AuthEventEmitter {
    constructor() {
      this.listeners = {};
    }
  
    on(event, listener) {
      if (!this.listeners[event]) {
        this.listeners[event] = [];
      }
      this.listeners[event].push(listener);
    }
  
    off(event, listener) {
      if (this.listeners[event]) {
        const index = this.listeners[event].indexOf(listener);
        if (index > -1) {
          this.listeners[event].splice(index, 1);
        }
      }
    }
  
    emit(event, ...args) {
        if (this.listeners[event]) {
          const promises = this.listeners[event].map((listener) => {
            return new Promise((resolve) => {
              listener(...args, resolve);
            });
          });
    
          return Promise.all(promises);
        } else {
          return Promise.resolve();
        }
      }
    }
    
    export const authEventEmitter = new AuthEventEmitter();