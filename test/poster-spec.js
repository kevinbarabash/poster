/*global describe, beforeEach, afterEach, it */

describe("Poster", function () {
  var poster;

  describe("same Window", function () {
    beforeEach(function () {
      poster = new Poster(window);
    });

    it("should echo message back to the main window", function (done) {
      poster.listen("echo", function (msg) {
        expect(msg).to.be("hello, world!");
        done();
      });
      poster.post("echo", "hello, world!");
    });

    it("should work with multiple arguments", function (done) {
      poster.listen("three_args", function (a,b,c) {
        expect(a).to.be("one");
        expect(b).to.be("two");
        expect(c).to.be("three");
        done();
      });
      poster.post("three_args", "one", "two", "three");
    });

    it("should work with objects", function (done) {
      poster.listen("objMsg", function (obj) {
        expect(obj.x).to.be(5);
        expect(obj.y).to.be(10);
        done();
      });
      poster.post("objMsg", { x:5, y:10 });
    });
  });

  describe("Iframe", function () {
    var iframe;

    beforeEach(function (done) {
      iframe = document.createElement("iframe");
      iframe.src = "iframe.html";
      iframe.onload = function () {
        done();
      };
      document.body.appendChild(iframe);

      poster = new Poster(iframe.contentWindow);
    });

    afterEach(function () {
      document.body.removeChild(iframe);
    });

    it("should echo message back to the main window", function (done) {
      poster.listen("echo", function (msg) {
        expect(msg).to.be("hello, world!");
        done();
      });
      poster.post("echo", "hello, world!");
    });

    it("should eouble the message when sending it back to the main window", function (done) {
      poster.listen("double", function (msg) {
        expect(msg).to.be("hello, world!hello, world!");
        done();
      });
      poster.post("double", "hello, world!");
    });

    it("should work with multiple arguments", function (done) {
      poster.listen("three_args", function (a,b,c) {
        expect(a).to.be("one");
        expect(b).to.be("two");
        expect(c).to.be("three");
        done();
      });
      poster.post("three_args", "one", "two", "three");
    });

    it("should work with objects", function (done) {
      poster.listen("objMsg", function (obj) {
        expect(obj.x).to.be(5);
        expect(obj.y).to.be(10);
        done();
      });
      poster.post("objMsg", { x:5, y:10 });
    });
  });

  describe("Iframe – on/emit", function () {
    var iframe;

    beforeEach(function (done) {
      iframe = document.createElement("iframe");
      iframe.src = "iframe.html";
      iframe.onload = function () {
        done();
      };
      document.body.appendChild(iframe);

      poster = new Poster(iframe.contentWindow);
    });

    afterEach(function () {
      document.body.removeChild(iframe);
    });

    it("should echo message back to the main window", function (done) {
      poster.on("echo", function (msg) {
        expect(msg).to.be("hello, world!");
        done();
      });
      poster.emit("echo", "hello, world!");
    });

    it("should eouble the message when sending it back to the main window", function (done) {
      poster.on("double", function (msg) {
        expect(msg).to.be("hello, world!hello, world!");
        done();
      });
      poster.emit("double", "hello, world!");
    });

    it("should work with multiple arguments", function (done) {
      poster.on("three_args", function (a,b,c) {
        expect(a).to.be("one");
        expect(b).to.be("two");
        expect(c).to.be("three");
        done();
      });
      poster.emit("three_args", "one", "two", "three");
    });

    it("should work with objects", function (done) {
      poster.on("objMsg", function (obj) {
        expect(obj.x).to.be(5);
        expect(obj.y).to.be(10);
        done();
      });
      poster.emit("objMsg", { x:5, y:10 });
    });

    it("should work with multiple listeners", function (done) {
      var complete = false;

      poster.on("echo", function (msg) {
        expect(msg).to.be("hello, world!");
        if (complete) {
          done();
        } else {
          complete = true;
        }
      });

      poster.on("echo", function (msg) {
        expect(msg).to.be("hello, world!");
        if (complete) {
          done();
        } else {
          complete = true;
        }
      });

      poster.emit("echo", "hello, world!");
    });

    it("should remove listeners", function (done) {
      var listener1 = function (msg) {
        // intentionally empty
      };
      var listener2 = function (msg) {
        expect(msg).to.be("hello, world!");
        done();
      };

      poster.on("echo", listener1);
      poster.on("echo", listener2);
      poster.removeListener(listener1);

      poster.emit("echo", "hello, world!");
    });
  });

  describe("Web Worker", function () {
    var worker;

    beforeEach(function (done) {
      worker = new Worker("worker1.js");
      poster = new Poster(worker);
      poster.listen("init", function () {
        done();
      });
    });

    afterEach(function () {

    });

    it("should echo message back to the main window", function (done) {
      poster.listen("echo", function (msg) {
        expect(msg).to.be("hello, world!");
        done();
      });
      poster.post("echo", "hello, world!");
    });

    it("should eouble the message when sending it back to the main window", function (done) {
      poster.listen("double", function (msg) {
        expect(msg).to.be("hello, world!hello, world!");
        done();
      });
      poster.post("double", "hello, world!");
    });

    it("should work with multiple arguments", function (done) {
      poster.listen("three_args", function (a,b,c) {
        expect(a).to.be("one");
        expect(b).to.be("two");
        expect(c).to.be("three");
        done();
      });
      poster.post("three_args", "one", "two", "three");
    });

    it("should work with objects", function (done) {
      poster.listen("objMsg", function (obj) {
        expect(obj.x).to.be(5);
        expect(obj.y).to.be(10);
        done();
      });
      poster.post("objMsg", { x:5, y:10 });
    });
  });

  describe("Web Worker - on/emit", function () {
    var worker;

    beforeEach(function (done) {
      worker = new Worker("worker1.js");
      poster = new Poster(worker);
      poster.on("init", function () {
        done();
      });
    });

    afterEach(function () {

    });

    it("should echo message back to the main window", function (done) {
      poster.on("echo", function (msg) {
        expect(msg).to.be("hello, world!");
        done();
      });
      poster.emit("echo", "hello, world!");
    });

    it("should eouble the message when sending it back to the main window", function (done) {
      poster.on("double", function (msg) {
        expect(msg).to.be("hello, world!hello, world!");
        done();
      });
      poster.emit("double", "hello, world!");
    });

    it("should work with multiple arguments", function (done) {
      poster.on("three_args", function (a,b,c) {
        expect(a).to.be("one");
        expect(b).to.be("two");
        expect(c).to.be("three");
        done();
      });
      poster.emit("three_args", "one", "two", "three");
    });

    it("should work with objects", function (done) {
      poster.on("objMsg", function (obj) {
        expect(obj.x).to.be(5);
        expect(obj.y).to.be(10);
        done();
      });
      poster.emit("objMsg", { x:5, y:10 });
    });

    it("should work with multiple listeners", function (done) {
      var complete = false;

      poster.on("echo", function (msg) {
        expect(msg).to.be("hello, world!");
        if (complete) {
          done();
        } else {
          complete = true;
        }
      });

      poster.on("echo", function (msg) {
        expect(msg).to.be("hello, world!");
        if (complete) {
          done();
        } else {
          complete = true;
        }
      });

      poster.emit("echo", "hello, world!");
    });

    it("should remove listeners", function (done) {
      var listener1 = function (msg) {
        // intentionally empty
      };
      var listener2 = function (msg) {
        expect(msg).to.be("hello, world!");
        done();
      };

      poster.on("echo", listener1);
      poster.on("echo", listener2);
      poster.removeListener(listener1);

      poster.emit("echo", "hello, world!");
    });
  });

  describe("multiple Web Workers", function () {
    var worker1, worker2, poster1, poster2;

    beforeEach(function (done) {
      worker1 = new Worker("worker1.js");
      worker2 = new Worker("worker2.js");
      poster1 = new Poster(worker1);
      poster2 = new Poster(worker2);

      var ready = false;

      poster1.listen("init", function () {
        if (ready) {
          done();
        } else {
          ready = true;
        }
      });

      poster2.listen("init", function () {
        if (ready) {
          done();
        } else {
          ready = true;
        }
      });
    });

    afterEach(function () {

    });

    it("shouldn't confuse messages between multiple workers", function (done) {
      var complete = false;

      poster1.listen("echo", function (msg) {
        expect(msg).to.be("hello, world!");
        if (complete) {
          done();
        } else {
          complete = true;
        }
      });

      poster2.listen("echo", function (msg) {
        expect(msg).to.be("goodbye world.");
        if (complete) {
          done();
        } else {
          complete = true;
        }
      });

      poster1.post("echo", "hello, world!");
      poster2.post("echo", "goodbye world.");
    });

    it("should work with a common listener", function (done) {
      var complete = false;
      var listener = function (msg) {
        expect(msg).to.be("hello, world!");
        if (complete) {
          done();
        } else {
          complete = true;
        }
      };

      poster1.listen("echo", listener);
      poster2.listen("echo", listener);

      poster1.post("echo", "hello, world!");
      poster2.post("echo", "hello, world!");
    })
  });

  describe("Web Workers and Iframes", function () {
    var poster1, poster2, iframe;

    beforeEach(function (done) {
      var ready = false;

      poster1 = new Poster(new Worker("worker1.js"));
      poster1.listen("init", function () {
        if (ready) {
          done();
        } else {
          ready = true;
        }
      });

      iframe = document.createElement("iframe");
      iframe.src = "iframe.html";
      iframe.onload = function () {
        if (ready) {
          done();
        } else {
          ready = true;
        }
      };
      document.body.appendChild(iframe);

      poster2 = new Poster(iframe.contentWindow);
    });

    afterEach(function () {
      document.body.removeChild(iframe);
    });

    it("shouldn't confuse messages between workers and iframes", function (done) {
      var complete = false;

      poster1.listen("echo", function (msg) {
        expect(msg).to.be("hello, world!");
        if (complete) {
          done();
        } else {
          complete = true;
        }
      });

      poster2.listen("echo", function (msg) {
        expect(msg).to.be("goodbye world.");
        if (complete) {
          done();
        } else {
          complete = true;
        }
      });

      poster1.post("echo", "hello, world!");
      poster2.post("echo", "goodbye world.");
    });
  });
});
