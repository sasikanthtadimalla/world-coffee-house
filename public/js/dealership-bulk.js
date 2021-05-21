let viewportSize = $(window).width();

if (viewportSize < 400) {
  $("h1 span").removeClass("coffee");
}

if ($("h1").text() === "Contact For Dealership") {
  $(".bulk-link").removeClass("bulk-link");
} else if ($("h1").text() === "Contact For Bulk Ordering") {
  $(".dealership-link").removeClass("dealership-link");
}
