describe("Poster", function () {

  it("should work", function () {
    var poster = new Poster(window);

    poster.listen("msg", function (msg) {
      console.log(msg);
    });

    poster.post("msg", "hello, world!");
  });
});
