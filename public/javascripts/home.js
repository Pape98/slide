/* global $ */
/* global CircleType */
/* global jQuery */


$('.circular').mouseenter(function () {
  $(this).transition('pulse');
});

$('.ui.embed').embed();

//=======================================================================

new CircleType(document.getElementById('bottom'))
  .dir(-1)
  .radius(254);

new CircleType(document.getElementById('top'))
  .dir(1)
  .radius(249);

new CircleType(document.getElementById('line1'))
  .dir(1)
  .radius();

new CircleType(document.getElementById('line2'))
  .dir(1)
  .radius();

//=======================================================================
$('.sidebar.icon').click(function () {
  $('.ui.sidebar')
    .sidebar('toggle')
});