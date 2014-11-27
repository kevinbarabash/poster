!function(e){if("object"==typeof exports&&"undefined"!=typeof module)module.exports=e();else if("function"==typeof define&&define.amd)define([],e);else{var f;"undefined"!=typeof window?f=window:"undefined"!=typeof global?f=global:"undefined"!=typeof self&&(f=self),f.Poster=e()}}(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
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

},{}]},{},[1])(1)
});