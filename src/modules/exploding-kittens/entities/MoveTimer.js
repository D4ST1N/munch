import { performance } from 'perf_hooks';

export default class MoveTimer {
  constructor({ time, action, cancel }) {
    this.time = time;
    this.action = action;
    this.cancel = cancel;
    this.startTimer();
  }

  get timeLeft() {
    return Math.max(this.time - (performance.now() - this.timeStart), 0);
  }

  startTimer() {
    this.timeStart = performance.now();
    this.timerId = setTimeout(this.action, this.time);
  }

  stopTimer() {
    this.time = this.timeLeft;
    clearTimeout(this.timerId);
    this.cancel();

  }
}
