// $(document).ready(function() {
//    var username = $('#username');
//    username.keyup(function() {
//       var value = username.val();
//       socket.emit('find_user', value);
//    });
// });

// socket.on('find_user_result', function(user) {
//     // treat result here
// });

$(document).ready(function () {

    $('.first-button').on('click', function () {
  
      $('.animated-icon1').toggleClass('open');
    });
});