if ($(".h1-1").text() === "Your Cart" || $("h1").text() === "Your Cart") {
  $(".orders-link").removeClass("orders-link");
} else if ($(".h1-1").text() === "Your Orders" || $("h1").text() === "Your Orders") {
  $(".cart-link").removeClass("cart-link");
}

if ($(".numberOfItems").text() === "0 Items") {
  $(".proceed-btn").prop("disabled", true);
} else {
  $(".proceed-btn").prop("disabled", false);
}

if ($(".order").text() === "Order") {
  $(".orders-link").removeClass("orders-link");
  $(".cart-link").removeClass("cart-link");
}
