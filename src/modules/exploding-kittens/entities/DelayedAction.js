import uuid from 'uuid/v1';

export default class DelayedAction {
  constructor(started, action, onCancel, time) {
    this.id = uuid();
    this.started = started;
    this.action = action;
    this.onCancel = onCancel;
    this.startTimer(time);
  }

  startTimer(time) {
    console.log('start timer:', this.id);
    this.timerId = setTimeout(this.action, time);
    this.started();
  }

  stopTimer() {
    console.log('stop timer:', this.id);
    clearTimeout(this.timerId);
    this.onCancel();
  }
}
