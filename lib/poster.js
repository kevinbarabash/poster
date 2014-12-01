var posters = [];
self.addEventListener("message", function (e) {
    var channel = e.data.channel;
    posters.forEach(function (poster) {
        if (poster.target === e.source) {
            var listener = poster.listeners[channel];
            if (listener) {
                listener.apply(null, e.data.args);
            }
        }
    });
});
var Poster = (function () {
    function Poster(target, origin) {
        var _this = this;
        if (origin === void 0) { origin = "*"; }
        this.origin = origin;
        this.target = target;
        this.listeners = {};
        if (self.window && this.target instanceof Worker) {
            this.target.addEventListener("message", function (e) {
                debugger;
                var channel = e.data.channel;
                var listener = _this.listeners[channel];
                if (listener) {
                    listener.apply(null, e.data.args);
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
        if (self.window) {
            if (this.target instanceof Worker) {
                this.target.postMessage(message);
            }
            else {
                this.target.postMessage(message, this.origin);
            }
        }
        else {
            this.target.postMessage(message);
        }
    };
    Poster.prototype.listen = function (channel, callback) {
        this.listeners[channel] = callback;
    };
    return Poster;
})();
module.exports = Poster;
