[![Build Status](https://travis-ci.org/kevinb7/poster.svg?branch=master)](https://travis-ci.org/kevinb7/poster)

# Poster #

EventEmitter style wrapper around postMessage.  Works with windows,
iframes, and web workers.

## API ##

post/emit and listen/addListener/on can be chained.  Each channel is
defined by string.  There can be multiple listeners per channel.

- *post(channel, ...args)* - arguments after channel are passed to all listeners for that channel
- *emit(channel, ...args)* - alias for *post*
- *listen(channel, callback)*
- *addListener(channel, callback)*
- *on(channel, callback)*
- *removeListener(channel, callback)*
- *removeAllListeners(channel)*
- *listeners(channel)* - returns all listeners on the channel

**Note:** The API is not stable.  I'm still trying to decide how close to make it to the
EventEmitter API seeing as it differs in the following substatial ways:
- posting a message to an instance will not trigger the listeners on that instance
- post/emit does not return the number of listeners becuase it's hard to know how listeners
  are connected to the matching Poster instance in the other context and return the number
  of local listeners isn't useful because they won't receive the message anyways.

## Howto ##

In order to communicate with another context (window, iframe, or web worker) two
instances of Poster must be created.  One in the source context and one in the
destination context.  The source/desintation labels are arbitrary as Poster facilitates
bidirectional communication out of the box.

### index.js ###
    var iframe = document.getElementById("myIframe");
    var poster = new Poster(iframe.contentWindow);

    poster.post("msg", "hello, world!");

### iframe.js ###
    var poster = new Poster(wdinow.parent);

    poster.on("msg", function (msg) {
        console.log("msg = " + msg);    // "msg = hello, world"
    });

## Future Work ##

- add *once(channel, callback)*
- automatically use iframe.contentWindow when passed an iframe
- some sort of handshaking to when the Poster instance in the other context
  is ready for business
