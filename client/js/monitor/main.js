//Functionality for the screensize fixing
$(document).ready(function () {
  var h_win = $(window).height();
  var w_win = $(window).width();
  realign();
  $(window).resize(function () {
    realign();
    location.reload();
  });
});
/**
 * Realign and resize every component in the body element
 * It resizes/zooms based on the objects 
 * Also the functionality of zoom is provided if the screen size is more than 1366*768px
 * else the scrolling option for the screen is provided
 */
function realign() {
  var h_win = $(window).height();
  var w_win = $(window).width();
  console.log(h_win + "_" + w_win);
  //scroll function if the size is less
  if (h_win < 768) {
    $('body').css('overflow-y', 'scroll');
  }
  if (w_win < 1366) {
    $('body').css('overflow-x', 'scroll');
  }
  //If both height and width vary
  if (h_win > 768 && w_win > 1366) {
    $('body').outerHeight(h_win).outerWidth(w_win);
    $('body').css('overflow-x', 'hidden');
    $('body').css('overflow-y', 'hidden');
    var adjH = h_win / 768;
    var adjW = w_win / 1366;
    $('.ScreenAdj').each(function () {
      var initH = $(this).height();
      var initW = $(this).width();
      console.log(initH + "_" + initW);
      if (initH != 0) {
        $(this).height(Math.round(adjH * initH));
      }
      if (initW != 0) {
        $(this).width(Math.round(adjW * initW));
      }
      if ((initH == 0) && (initW == 0)) {
        var text = 'scale(' + adjW + ',' + adjH + ')';
        $(this).css('transform', text);
        $(this).css('transform-origin', '0px 0px');
      }
      var mL = adjW * parseInt($(this).css('left'));
      var mT = adjH * parseInt($(this).css('top'));
      $(this).css({ 'left': Math.round(mL) }, { 'top': Math.round(mT) });
    });
  } else {
    //If just the Height vary
    if (h_win > 768) {
      $('body').outerHeight(h_win).css({ 'overflow-y': 'hidden' });
      var adjH = h_win / 768;
      $('.ScreenAdj').each(function () {
        var initH = $(this).height();
        var initW = $(this).width();
        if (initH != 0) {
          $(this).height(Math.round(adjH * initH));
        } else {
          var text = 'scale(0,' + adjH + ')';
          $(this).css('transform', text);
          $(this).css('transform-origin', '0px 0px');
        }
        var mT = adjH * parseInt($(this).css('top'));
        $(this).css({ 'top': Math.round(mT) });
      });
    }
    //If just the width vary
    if (w_win > 1366) {
      $('body').outerWidth(w_win).css({ 'overflow-x': 'hidden' });
      var adjW = w_win / 1366;
      $('.ScreenAdj').each(function () {
        var initH = $(this).height();
        var initW = $(this).width();
        if (initW != 0) {
          $(this).width(Math.round(adjW * initW));
        } else {
          var text = 'scale(' + adjW + ',0)';
          $(this).css('transform', text);
          $(this).css('transform-origin', '0px 0px');
        }
        var mL = adjH * parseInt($(this).css('left'));
        $(this).css({ 'left': Math.round(mL) });
      });
    }
  }
}
