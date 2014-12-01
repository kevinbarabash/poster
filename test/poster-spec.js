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
      //iframe.remove();
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

  describe.skip("Web Worker", function () {
    var worker;

    beforeEach(function () {
      worker = new Worker("worker.js");
      debugger;
      poster = new Poster(worker);
    });

    afterEach(function () {

    });

    it("should echo message back to the main window", function (done) {
      poster.listen("echo", function (msg) {
        expect(msg).to.be("hello, world!");
        done();
      });
      debugger;
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

});
