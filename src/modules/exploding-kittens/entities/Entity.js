export default class Entity {
  constructor() {
    this.events = {};
  }

  /**
   * Add event listener to events group
   * @param events {String} name of events separated by space
   * @param listener {Function} listener, called when event emitted
   */
  on(events, listener) {
    this.parseEvents(events, this.onEvent.bind(this), listener);
  }

  /**
   * @param event {String}
   * @param listener {Function}
   */
  onEvent(event, listener) {
    let listeners = this.events[event];

    if (!listeners) {
      this.events[event] = listeners = [];
    }

    listeners.push(listener);
  }

  /**
   * Remove event listener from events group
   * @param events {String} name of events separated by space
   * @param [listener] {Function} removed listener, if not passed remove all listeners from events
   */
  off(events, listener) {
    this.parseEvents(events, this.offEvent.bind(this), listener);
  }

  /**
   * @param event {String}
   * @param [listener] {Function}
   */
  offEvent(event, listener) {
    let listeners = this.events[event];

    if (!listener) {
      this.events[event] = [];

      return;
    }

    const index = listeners.indexOf(listener);

    if (index !== -1) {
      listeners.splice(index, 1);
    }
  }

  /**
   * Parse events list string & call correct method for each of them
   * @param events {String} list of events
   * @param method {Function} correct method
   * @param [listener] {Function} listener, optional for off method
   */
  parseEvents(events, method, listener) {
    if (typeof events !== 'string') {
      return;
    }

    const eventsList = events.split(' ');

    eventsList.forEach((event) => {
      method(event, listener);
    });
  }

  /**
   * Emit event & call event listeners with provided payload
   * @param event {String} event name
   * @param [payload] {*} event payload
   */
  emit(event, payload) {
    const listeners = this.events[event];

    if (listeners) {
      listeners.forEach((listener) => {
        listener(payload);
      });
    }
  }
}
