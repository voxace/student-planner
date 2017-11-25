jQuery(document).ready(function(){

  $("#login-screen").animate({ opacity: 1 }, 500 );

  $("#submit-button").click(function(e) {
    e.preventDefault();
    $("#login-screen").animate({ opacity: 0 }, 500, function() {
      $("#login-form").submit();
    });
  });

});
