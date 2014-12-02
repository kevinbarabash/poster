/**
 * Simplifies posting messages to another window, iframe, or web worker.
 *
 * Provides an interface that is similar to the classic EventEmitter API.
 * It differs slightly because listeners can be in a separate context such
 * as an iframe or a separate thread in the case of web workers.  This
 * makes it much hard to know how many listeners are listening to a particular
 * channel (event).
 */

var posters:Poster[] = [];

// TODO: notify other listeners that a source has been removed

if (self.document) {    // not a web worker
    self.addEventListener("message", function (e: MessageEvent) {
        var channel = e.data.channel;
        posters.forEach(poster => {
            if (poster.target === e.source) {   // web workers have source set to nulll
                var listeners = poster.channels[channel];
                if (listeners) {
                    listeners.forEach(listener => listener.apply(null, e.data.args));
                }
            }
        });
    });
} else {                // probably a web worker
    self.addEventListener("message", function (e: MessageEvent) {
        var channel = e.data.channel;
        posters.forEach(poster => {
            var listeners = poster.channels[channel];
            if (listeners) {
                listeners.forEach(listener => listener.apply(null, e.data.args));
            }
        });
    });
}

class Poster {
    channels: { [channel:string]: any[] };
    target: any;    // Window | Worker | DedicatedWorkerGlobalScope
    origin: string;

    /**
     * Construct a new Poster instance which can be used to send
     * messages to/from web workers and iframes.
     *
     * @param {Window|Worker|DedicatedWorkerGlobalScope} target
     * @param [origin] only valid when used with iframes
     */
    constructor(target: any, origin = "*") {
        this.origin = origin;
        this.target = target;
        this.channels = {};

        if (self.window && this.target instanceof Worker) {
            this.target.addEventListener("message", e => {
                var channel = e.data.channel;
                var listeners = this.channels[channel];
                if (listeners) {
                    listeners.forEach(listener => listener.apply(null, e.data.args));
                }
            });
        }
        posters.push(this);
    }

    /**
     * Posts a message to the target on the given channel.
     *
     * @param channel
     * @param args
     */
    post(channel, ...args) {
        var message = {
            channel: channel,
            args: args
        };

        if (self.document && !(this.target instanceof Worker)) {
            this.target.postMessage(message, this.origin);
        } else {
            this.target.postMessage(message);
        }
    }

    /**
     * Alias to 'post'
     *
     * @param channel
     * @param args
     */
    emit(channel, ...args) {
        args.unshift(channel);
        this.post.apply(this, args);
    }

    /**
     * Add a callback which will get called when events are posted on
     * the given channel.  Multiple callbacks can be added to the same
     * channel.
     *
     * @param channel
     * @param callback
     * @returns {Poster}
     */
    listen(channel: string, callback: (...args) => any) {
        var listeners = this.channels[channel];
        if (listeners === undefined) {
            listeners = this.channels[channel] = [];
        }
        listeners.push(callback);
        return this;
    }

    /**
     * Alias to 'listen'
     *
     * @param channel
     * @param callback
     * @returns {Poster}
     */
    addListener(channel: string, callback: (...args) => any) {
        return this.listen(channel, callback);
    }

    /**
     * Alias to 'listen'
     *
     * @param channel
     * @param callback
     * @returns {Poster}
     */
    on(channel: string, callback: (...args) => any) {
        return this.listen(channel, callback);
    }

    /**
     * Removes a listener from a channel.
     *
     * @param channel
     * @param callback
     */
    removeListener(channel: string, callback: (...args) => any) {
        var listeners = this.channels[channel];
        if (listeners) {
            var index = listeners.indexOf(callback);
            if (index !== -1) {
                listeners.splice(index, 1);
            }
        }
    }

    /**
     * Remove all listeners for a channel.
     *
     * @param channel
     */
    removeAllListeners(channel: string) {
        this.channels[channel] = [];
    }

    /**
     *
     * @param channel
     * @returns {Array}
     */
    listeners(channel: string) {
        var listeners = this.channels[channel];
        return listeners || [];
    }
}

export = Poster;
