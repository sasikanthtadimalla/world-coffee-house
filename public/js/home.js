let viewportSize = $(window).width();

if (viewportSize < 1025) {
  $(".top-div span").removeClass("coffee");
  $("#bottom-section span").removeClass("coffee");
  $("h1").removeClass("move-right");
  $("h1").removeClass("move-left");
}

if (viewportSize < 321) {
  $("#coffee-section h1 span").removeClass("coffee");
}
