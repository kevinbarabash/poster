/**
 * Simplifies posting messages to another window, iframe, or web worker
 */

var posters:Poster[] = [];

// TODO: add a way to remove a source
// TODO: notify other listeners that a source has been removed

// only need one event listener per Window context
// we'll multiplex it
self.addEventListener("message", function (e: MessageEvent) {
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
    target: any;
    origin: string;

    constructor(target: any, origin = "*") {
        this.origin = origin;
        this.target = target;
        this.listeners = {};
        if (self.window && this.target instanceof Worker) {
            this.target.addEventListener("message", e => {
                debugger;
                var channel = e.data.channel;
                var listener = this.listeners[channel];
                if (listener) {
                    listener.apply(null, e.data.args);
                }
            });
        }
        posters.push(this);
    }

    post(channel, ...args) {
        var message = {
            channel: channel,
            args: args
        };
        if (self.window) {
            if (this.target instanceof Worker) {
                this.target.postMessage(message);
            } else {
                this.target.postMessage(message, this.origin);
            }
        } else {
            this.target.postMessage(message);
        }
    }

    listen(channel: string, callback: (...args) => any) {
        // TODO: handle web workers differently
        this.listeners[channel] = callback;
    }
}

export = Poster;
