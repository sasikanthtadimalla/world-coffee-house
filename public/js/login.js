$(".signup-button").attr("disabled","disabled"),$(".signup-button").click(function(){let a=$(".contact").val().length;""===$(".name").val()||""===$(".contact").val()||""===$(".address").val()||""===$(".username").val()||""===$(".password").val()?alert("Please enter all the fields."):10!==a?(alert("Contact number invalid"),$(".contact").focus()):10===a&&($("#Password1").val().length<8?(alert("Password - Minimum 8 characters"),$("#Password1").focus(),$("#Password2").val("")):$("#Password1").val().length>=8&&($("#Password1").val()!==$("#Password2").val()?(alert("Passwords don't match."),$("#Password2").focus()):$("#Password1").val()===$("#Password2").val()&&$(".signup-form").submit()))}),$('input[type="checkbox"]').click(function(){$(this).is(":checked")?$(".signup-button").removeAttr("disabled"):$(".signup-button").attr("disabled","disabled")});
