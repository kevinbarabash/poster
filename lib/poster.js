var posters = [];
window.addEventListener("message", function (e) {
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
        if (origin === void 0) { origin = "*"; }
        this.target = target;
        this.origin = origin;
        this.listeners = {};
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
        this.target.postMessage(message, this.origin);
    };
    Poster.prototype.listen = function (channel, callback) {
        this.listeners[channel] = callback;
    };
    return Poster;
})();
module.exports = Poster;
