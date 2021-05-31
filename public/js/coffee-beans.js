
let tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'))
let tooltipList = tooltipTriggerList.map(function(tooltipTriggerEl) {
  return new bootstrap.Tooltip(tooltipTriggerEl)
});

let viewportSize = $(window).width();

if (viewportSize < 769) {
  $("h1 span").removeClass("underline");
}

if (viewportSize < 470) {
  $("h4 span").removeClass("underline");
}

if ($("h1").text() === "The Greatest Coffee You'll Ever Have") {
  $(".beans-link").removeClass("beans-link");
} else if ($("h1").text() === "The Purest Coffee Beans You'll Ever Brew") {
  $(".coffee-link").removeClass("coffee-link");
}

$(".dropdown-item").click(function() {
  $(this).parent().parent().find(".dropdown-toggle").text($(this).text());
  $(this).parent().parent().find(".hidden-input").val($(this).parent().parent().find(".dropdown-toggle").text());
});

$(".add-btn").click(function() {
  $(this).parent().parent().find(".hidden-input").val($(this).parent().parent().find(".dropdown-toggle").text());
}); 
