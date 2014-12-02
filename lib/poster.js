var posters = [];
if (self.document) {
    self.addEventListener("message", function (e) {
        var channel = e.data.channel;
        posters.forEach(function (poster) {
            if (poster.target === e.source) {
                var listeners = poster.listeners[channel];
                if (listeners) {
                    listeners.forEach(function (listener) { return listener.apply(null, e.data.args); });
                }
            }
        });
    });
}
else {
    self.addEventListener("message", function (e) {
        var channel = e.data.channel;
        posters.forEach(function (poster) {
            var listeners = poster.listeners[channel];
            if (listeners) {
                listeners.forEach(function (listener) { return listener.apply(null, e.data.args); });
            }
        });
    });
}
var Poster = (function () {
    function Poster(target, origin) {
        var _this = this;
        if (origin === void 0) { origin = "*"; }
        this.origin = origin;
        this.target = target;
        this.listeners = {};
        if (self.window && this.target instanceof Worker) {
            this.target.addEventListener("message", function (e) {
                var channel = e.data.channel;
                var listeners = _this.listeners[channel];
                if (listeners) {
                    listeners.forEach(function (listener) { return listener.apply(null, e.data.args); });
                }
            });
        }
        posters.push(this);
    }
    Poster.prototype.post = function (channel) {
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        var message = {
            channel: channel,
            args: args
        };
        if (self.document && !(this.target instanceof Worker)) {
            this.target.postMessage(message, this.origin);
        }
        else {
            this.target.postMessage(message);
        }
    };
    Poster.prototype.emit = function (channel) {
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        args.unshift(channel);
        this.post.apply(this, args);
    };
    Poster.prototype.listen = function (channel, callback) {
        var listeners = this.listeners[channel];
        if (listeners === undefined) {
            listeners = this.listeners[channel] = [];
        }
        listeners.push(callback);
        return this;
    };
    Poster.prototype.addListener = function (channel, callback) {
        return this.listen(channel, callback);
    };
    Poster.prototype.on = function (channel, callback) {
        return this.listen(channel, callback);
    };
    Poster.prototype.removeListener = function (channel, callback) {
        var listeners = this.listeners[channel];
        if (listeners) {
            var index = listeners.indexOf(callback);
            if (index !== -1) {
                listeners.splice(index, 1);
            }
        }
    };
    return Poster;
})();
module.exports = Poster;
