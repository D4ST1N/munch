export default class Watcher {
    constructor({ name, id }) {
        this.id = id;
        this.name = name;
    }

    reconnect(id) {
        this.id = id;
    }
}
