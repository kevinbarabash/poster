importScripts("../dist/poster.js");

var poster = new Poster(self);

poster.listen("echo", function (msg) {
  poster.post("echo", msg);
});

poster.listen("double", function (msg) {
  poster.post("double", msg + msg);
});

poster.listen("three_args", function (a,b,c) {
  poster.post("three_args", a, b, c);
});

poster.listen("objMsg", function (obj) {
  poster.post("objMsg", obj);
});

poster.post("init");  // let the main thread know we're ready for business
