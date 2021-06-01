$('.signup-button').attr('disabled', 'disabled');

$(".signup-button").click(function() {

  let contactNumber = $(".contact").val().length;

    if ($(".name").val() === "" || $(".contact").val() === "" || $(".address").val() === "" || $(".username").val() === "" || $(".password").val() === "") {
      alert("Please enter all the fields.");
    } else {
      // -----------
      if (contactNumber !== 10) {
        alert("Contact number invalid");
        $(".contact").focus();
      } else if (contactNumber === 10) {
        if ($("#Password1").val().length < 8) {
          alert("Password - Minimum 8 characters");
          $("#Password1").focus();
          $("#Password2").val("");
        } else if ($("#Password1").val().length >= 8) {
          if ($("#Password1").val() !== $("#Password2").val()) {
            alert("Passwords don't match.");
            $("#Password2").focus();
          } else if ($("#Password1").val() === $("#Password2").val()) {
            $(".signup-form").submit();
          }
        }
      }
    }

});

$('input[type="checkbox"]').click(function() {
  if ($(this).is(':checked')) {
    $('.signup-button').removeAttr('disabled');
  } else {
    $('.signup-button').attr('disabled', 'disabled');
  }
});
