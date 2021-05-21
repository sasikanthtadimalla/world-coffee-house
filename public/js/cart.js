if ($(".h1-1").text() === "Your Cart" || $("h1").text() === "Your Cart") {
  $(".orders-link").removeClass("orders-link");
} else if ($(".h1-1").text() === "Your Orders" || $("h1").text() === "Your Orders") {
  $(".cart-link").removeClass("cart-link");
}
