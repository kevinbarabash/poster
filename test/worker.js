importScripts("../dist/poster.js");

var poster = new Poster(self);

poster.listen("echo", function (msg) {
  console.log("worker: " + msg);
  poster.post("echo", msg);
});
