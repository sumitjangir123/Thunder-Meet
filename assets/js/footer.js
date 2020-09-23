// boxClass: Class name that reveals the hidden box when user scrolls
// animateClass: Class name that triggers the CSS animations
// offset: Define the distance between the bottom of browser viewport and the top of the hidden box. When the user scrolls and reaches this distance, the hidden box is revealed.
// mobile: Turn on/off animations on mobile devices.
// live: constantly check for new animated elements on the page

//for Reveal Animations When Scrolling
wow = new WOW({
  boxClass: 'wow', // default
  animateClass: 'animated', // default
  offset: 0, // default
  mobile: true, // default
  live: true // default
})
wow.init();