/**
 * Simplifies posting messages to another window, iframe, or web worker
 */
var posters = [];
// TODO: add a way to remove a source
// TODO: notify other listeners that a source has been removed
// only need one event listener per Window context
// we'll multiplex it
window.addEventListener("message", function (e) {
    var channel = e.data.channel;
    // TODO: consider assigning unique ids to each window
    // TODO: another possibility is using WeakMap
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
    function Poster(target) {
        this.origin = "*";
        this.target = target;
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
