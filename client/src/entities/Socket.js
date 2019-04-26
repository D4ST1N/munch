const Socket = {
  core: null,

  connect() {
    this.core = window.io({
      path: '/ws/exploding-kittens',
      reconnection: false,
    });
  },

  on(...payload) {
    this.core.on(...payload);
  },

  emit(...payload) {
    this.core.emit(...payload);
  },

  off(...payload) {
    this.core.off(...payload);
  },
};

export default Socket;
