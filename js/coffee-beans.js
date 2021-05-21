
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
