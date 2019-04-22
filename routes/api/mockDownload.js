const fs = require('fs');
const data = require('../../emitter');
const mock = {}
mock.listeners = {}
mock.on = (name, fn) => {
    console.log("Wants", name, fn);
    if (mock.listeners[name]) {
        mock.listeners[name].push(fn);
    }
    else {
        mock.listeners = [fn];
    }
}
mock.start = () => {
    data.forEach(event => {
        setTimeout(() => {

            console.log(event.name);
            let listeners = mock.listeners[event.name];
            if (listeners) {
                listeners.forEach(listener => {
                    console.log("Have listener");
                    listener(event(...Array(event.params)));
                })
            } else {
                console.log("No listener for that.")
            }
        }, event.time)
    })
}
module.exports = mock;
