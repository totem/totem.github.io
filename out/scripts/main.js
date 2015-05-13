$(document).ready(function(){

  // Detect mobile layout
  var mobile;

  var mobileDetect = function() {
    var siteWrapBreak = $("html").css("font-size").replace(/[^-\d\.]/g, '') * 48;

    if ($(window).width() < siteWrapBreak) {
      mobile = true;
    } else {
      mobile = false;
    }

    console.log(mobile, $(window).width(), siteWrapBreak);
  }

  // Generate anchors and side nav anchor links
  $('.site-content h1, .site-content h2').each(function(){
    $(this).addClass('anchor').attr('id',$(this).text().toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g,''));
    $('.content-nav .anchor-links').append('<li class="tag-' + this.nodeName.toLowerCase() + '"><a href="#' + $(this).text().toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g,'') + '">' + $(this).text() + '</a></li>');
    $('.content-nav .anchor-links li:first-child a').parent().addClass('active');
  });

  // Set nav anchor links width
  var anchorsWidth = function() {
    var siteWrap = $('.site-wrap').width();

    $('.anchor-links.sticky').width((siteWrap / 4) - 30);
  }

  // Anchor scroll
  $('.content-nav .anchor-links li').on('click', 'a', function(event) {
    var offset;

    if ($(this).parent().hasClass('tag-h1')) {
      offset = 20;
    } else {
      offset = 10;
    }

    var position = $($(this).attr("href")).offset().top - offset;

    $("html, body").animate({scrollTop: position}, 400);
    event.preventDefault();
  });

  // Set anchor sections
  var anchors = $('.anchor');
  var anchorLinks = $('.anchor-links li');

  var sectionHeight = function() {
    var total    = $(window).height(),
        $section = $('.site-content').css('height','auto');

    if ($section.outerHeight(true) < total) {
      var margin = $section.outerHeight(true) - $section.height();
      $section.height(total - margin - 20);
    } else {
      $section.css('height','auto');
    }
  }

  var resizeHandler = function(){
    mobileDetect();
    anchorsWidth();
    sectionHeight();
  }

  var scrollHandler = function() {
    $(document).scroll(function() {
      console.log(anchors.length);
      if (mobile === false && $(document).scrollTop() >= $('.site-content').offset().top) {
        $('.anchor-links').addClass('sticky');
        anchorsWidth();
        for (var i = 0; i < anchors.length; i++){
          if (i < anchors.length - 1 && $(document).scrollTop() > $(anchors[i]).offset().top - 30 && $(document).scrollTop() < $(anchors[i + 1]).offset().top - 30) {
            $(anchorLinks[i]).addClass('active');
          } else if ($(document).scrollTop() > $(anchors).last().offset().top - 30) {
            $(anchorLinks).removeClass('active');
            $(anchorLinks).last().addClass('active');
          } else {
            $(anchorLinks[i]).removeClass('active');
          }
        }
      } else {
        $('.anchor-links').removeClass('sticky');
        $('.anchor-links').width('auto');
      }
    });
  }

  $(window).resize(resizeHandler);

  resizeHandler();
  scrollHandler();
});
