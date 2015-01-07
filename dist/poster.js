!function(e){if("object"==typeof exports&&"undefined"!=typeof module)module.exports=e();else if("function"==typeof define&&define.amd)define([],e);else{var f;"undefined"!=typeof window?f=window:"undefined"!=typeof global?f=global:"undefined"!=typeof self&&(f=self),f.Poster=e()}}(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";

/**
 * Simplifies posting messages to another window, iframe, or web worker.
 *
 * Provides an interface that is similar to the classic EventEmitter API.
 * It differs slightly because listeners can be in a separate context such
 * as an iframe or a separate thread in the case of web workers.  This
 * makes it much hard to know how many listeners are listening to a particular
 * channel (event).
 */

var posters = [];

// TODO: notify other listeners that a source has been removed

if (self.document) {
  // not a web worker
  self.addEventListener("message", function (e) {
    var channel = e.data.channel;
    posters.forEach(function (poster) {
      if (poster.target === e.source) {
        // web workers have source set to nulll
        var listeners = poster.channels[channel];
        if (listeners) {
          listeners.forEach(function (listener) {
            return listener.apply(null, e.data.args);
          });
        }
      }
    });
  });
} else {
  // probably a web worker
  self.addEventListener("message", function (e) {
    var channel = e.data.channel;
    posters.forEach(function (poster) {
      var listeners = poster.channels[channel];
      if (listeners) {
        listeners.forEach(function (listener) {
          return listener.apply(null, e.data.args);
        });
      }
    });
  });
}

var Poster =
/**
 * Construct a new Poster instance which can be used to send
 * messages to/from web workers and iframes.
 *
 * @param {Window|Worker|DedicatedWorkerGlobalScope} target
 * @param [origin] only valid when used with iframes
 */
function Poster(target) {
  var _this = this;
  var origin = arguments[1] === undefined ? "*" : arguments[1];
  if (self.window && target instanceof HTMLIFrameElement) {
    target = target.contentWindow;
  }

  this.origin = origin;
  this.target = target;
  this.channels = {};

  if (self.window && target instanceof Worker) {
    target.addEventListener("message", function (e) {
      var channel = e.data.channel;
      var listeners = _this.channels[channel];
      if (listeners) {
        listeners.forEach(function (listener) {
          return listener.apply(null, e.data.args);
        });
      }
    });
  }
  posters.push(this);
};

/**
 * Posts a message to the target on the given channel.
 *
 * @param channel
 * @param args
 */
Poster.prototype.post = function (channel) {
  var args = [];

  for (var _key = 1; _key < arguments.length; _key++) {
    args[_key - 1] = arguments[_key];
  }

  var message = {
    channel: channel,
    args: args
  };

  if (self.document && !(this.target instanceof Worker)) {
    this.target.postMessage(message, this.origin);
  } else {
    this.target.postMessage(message);
  }
};

/**
 * Alias to 'post'
 *
 * @param channel
 * @param args
 */
Poster.prototype.emit = function (channel) {
  var args = [];

  for (var _key2 = 1; _key2 < arguments.length; _key2++) {
    args[_key2 - 1] = arguments[_key2];
  }

  args.unshift(channel);
  this.post.apply(this, args);
};

/**
 * Add a callback which will get called when events are posted on
 * the given channel.  Multiple callbacks can be added to the same
 * channel.
 *
 * @param channel
 * @param callback
 * @returns {Poster}
 */
Poster.prototype.listen = function (channel, callback) {
  var listeners = this.channels[channel];
  if (listeners === undefined) {
    listeners = this.channels[channel] = [];
  }
  listeners.push(callback);
  return this;
};

/**
 * Alias to 'listen'
 *
 * @param channel
 * @param callback
 * @returns {Poster}
 */
Poster.prototype.addListener = function (channel, callback) {
  return this.listen(channel, callback);
};

/**
 * Alias to 'listen'
 *
 * @param channel
 * @param callback
 * @returns {Poster}
 */
Poster.prototype.on = function (channel, callback) {
  return this.listen(channel, callback);
};

/**
 * Removes a listener from a channel.
 *
 * @param channel
 * @param callback
 */
Poster.prototype.removeListener = function (channel, callback) {
  var listeners = this.channels[channel];
  if (listeners) {
    var index = listeners.indexOf(callback);
    if (index !== -1) {
      listeners.splice(index, 1);
    }
  }
};

/**
 * Remove all listeners for a channel.
 *
 * @param channel
 */
Poster.prototype.removeAllListeners = function (channel) {
  this.channels[channel] = [];
};

/**
 *
 * @param channel
 * @returns {Array}
 */
Poster.prototype.listeners = function (channel) {
  var listeners = this.channels[channel];
  return listeners || [];
};

module.exports = Poster;
},{}]},{},[1])(1)
});