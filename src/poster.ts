/**
 * Simplifies posting messages to another window, iframe, or web worker
 */

var posters:Poster[] = [];

// TODO: add a way to remove a source
// TODO: notify other listeners that a source has been removed

// only need one event listener per Window context
// we'll multiplex it
window.addEventListener("message", function (e: MessageEvent) {
    var channel = e.data.channel;

    // TODO: consider assigning unique ids to each window
    // TODO: another possibility is using WeakMap
    posters.forEach(poster => {
        if (poster.target === e.source) {
            var listener = poster.listeners[channel];
            if (listener) {
                listener.apply(null, e.data.args);
            }
        }
    });
});

class Poster {
    listeners: { [index:string]: (...args) => any };
    target: Window;
    origin: string;

    constructor(target: Window, origin = "*") {
        this.target = target;
        this.origin = origin;
        this.listeners = {};
        posters.push(this);
    }

    post(channel, ...args) {
        var message = {
            channel: channel,
            args: args
        };
        this.target.postMessage(message, this.origin);
    }

    listen(channel: string, callback: (...args) => any) {
        this.listeners[channel] = callback;
    }
}

export = Poster;
