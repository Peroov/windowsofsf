// global variable has a $ prefix
var $window = $(window);
var $windowWidth = $(window).width();
var $closePanels = $(".btnClose");
var $openMaps = $(".map button");
var $openInfo = $(".info button");
var owl = jQuery(".owl-carousel");

// responsive images & breakpoints
var desktopBreak = 1023,
tabletBreak = 700,
mobileBreak = 320,
screenWidth = 0,
screenHeight = 0,
screenType = 'mobile';

$(window).load(function(){
	// fade out overlay
	$('.favicon').addClass('invert').removeClass('fade');
	setTimeout(function(){
		$("body").addClass("loaded");
		fitToScreen();
	}, 500);
	// play video
	setTimeout(function(){
		$(".active video").trigger("play");
	}, 1500);
});

$(document).ready(function(){
	
	// init owl carousel
	initOwl();

	// fade loader
	setTimeout(function(){
		$('.favicon').addClass('fade');
	}, 1000);
	// start laoding animation
	setTimeout(function(){
		$('.favicon.fade').addClass('loading');
	}, 5000);

	// init anti spam
  	$('a[href^="mailto:"]').each(function() {
    	this.href = this.href.replace('(at)', '@').replace(/\(dot\)/g, '.').replace(/\(exc\)/g, '?').replace(/\(eq\)/g, '=');
    	// Remove this line if you don't want to set the email address as link text:
    	//this.innerHTML = this.href.replace('mailto:', '');
  	});

});

// Additional class support for breakpoints
$(window).resize(function () {
	// fit to full screen
	clearTimeout(window.resizedFinished);
    window.resizedFinished = setTimeout(function(){
        console.log('Resized finished.');
		fitToScreen();
		//$(".active video").trigger("play");
    }, 250);
});

// function
// check for screen res
function resetScreenVars() {
	screenWidth = $(window).width();
	screenHeight = $(window).height();
	if (screenWidth > desktopBreak) {
		screenType = 'desktop';
	} else if (screenWidth >= tabletBreak) {
		screenType = 'tablet';
	} else {
		screenType = 'mobile';
	}
}

// swop inline images to background
function swapImgSource() {
	// resetScreenVars();
	$('img.bg').each(function() {
		var src = $(this).attr('src');
		$(this).attr('src', src);
		var p = $(this).parent();
		p.css('background-image', "url(" + src + ")");
		p.addClass("cover");
	});
}

// Convert inline image to background
function swapDataSrc() {
	resetScreenVars();
	//console.log('current screensize : '+ screenType);
	if($('img[data-' + screenType + ']').length) {
		$('img[data-' + screenType + ']').addClass('imgData');
		//var imgData = $('img[data-src-' + screenType + ']');
		$(".imgData").each(function () {
			$(this).attr("src", $(this).data(screenType));
		});
	}
}

// match element with viewport
function fitToScreen() {

	var $toggleHeight = $("video");

	var windowHeight = $(window).height();
	var elemHeight = $toggleHeight.height();

	if (windowHeight > elemHeight) {
		$(".toggleFC").addClass('invert');
		console.log("Window height is greater then video");
	} else {
		$(".toggleFC").removeClass('invert');
		console.log("Window height is less then video");
	}
	console.log("Video size: "+ elemHeight + " vs Window height: " + windowHeight);
}

// owl carousel
function initOwl() {

	owl.owlCarousel({
		//navigation: true,
		singleItem: true,
		addClassActive: true,
		transitionStyle: "goDown",
		rewindNav: false,
		jsonPath: '../assets/js/videos.json',
		jsonSuccess : customDataSuccess,
		afterInit : initVideo,
		beforeMove: pauseVideo,
		afterMove : playVideo,
		afterAction : updateNav
	});

	function customDataSuccess(data){

		var content = "";
		
		for(var i in data["items"]){

		   var poster = data["items"][i].poster;
		   var source = data["items"][i].source;
		   var lat = data["items"][i].lat;
		   var lng = data["items"][i].lng;

		   content += "<div class=\"window toggleFC\" data-id=\"" + i + "\" data-lat=\"" + lat + "\" data-lng=\"" + lng + "\"><div class=\"panel mask-left\" data-poster=\"" +poster+ "\"></div><div class=\"panel mask-right\" data-poster=\"" +poster+ "\"></div><video data-poster=\"" +poster+ "\" class=\"sound\" preload=\"none\" playsinline src=\"" +source+ "\"></video></div>"
		}

		$("#owl-json").html(content);
	}

	// inject vidoe with src
	function injVideo(elem){
		//var video = $('.active video');
		//var videoSrc = video.data('src');
		var videoPoster = $('.active video').data('poster');	
		// inject curent slide with video and poster
		$('.active video').attr('poster', videoPoster);
		$('.active .panel').css('background-image', 'url(' + videoPoster + ')');
		// video.attr({
		// 	src: videoSrc,
		// 	poster: videoPoster
		// });
		var nextVideo = $('.active').next().find('video');
		var nextPanel = $('.active').next().find('.panel');
		//var nextSrc = nextVideo.data('src');
		var nextPoster = nextVideo.data('poster');
		nextVideo.attr('poster', nextPoster);
		nextPanel.css('background-image', 'url(' + nextPoster + ')');
		// nextVideo.attr({
		// 	src: nextSrc,
		// 	poster: nextPoster
		// });
	}
	// 1st play
	function initVideo(){

		injVideo();

		$(".active video").trigger("play");
		// var video = $('.active video').get(0);
  		// video.play();
  		$(".active video").addClass("playing");
		console.log("Video plays");

  		$(".active video").prop('volume', 0);
		fadeinSound();

		$(".owl-page.active span").addClass("played");
		
		// check if video playback is fininshed
		$(".playing").bind("ended", function() {
			console.log("Video ended");
			owl.trigger("owl.next");
		});
		// update map coordinates
		initMap();
		// pause and resume later
		console.log("Video paused");
		$("video").removeClass("playing");
		$("video").trigger("pause");

	}

	// play
	function playVideo(elem){

		injVideo();

		$(".active video").trigger("load");
		$(".active video").trigger("play");
		$(".active video").addClass("playing");
		// var video = $('.active video').get(0);
  //       video.play();
		console.log("Video plays");
		
		// check if video playback is fininshed
		$(".playing").bind("ended", function() {
			console.log("Video ended");
			owl.trigger("owl.next");
		});
		$(".owl-page.active span").addClass("played");
		// update map coordinates
		updateCoordinates();
	}

	// pause
	function pauseVideo(elem){
		console.log("Video paused");
		$("video").removeClass("playing");
		$("video").trigger("pause");
		// var video = $('video').get(0);
  //       video.pause();
	}

	// reload video
	function reloadVideo(elem){
		console.log("Video reloaded");
		// $("video").addClass("playing");
		$(".active video").trigger("load");
		//var video = $('.active video').get(0);
		// setTimeout(function(){
	 //        $(".active video").trigger("load");
  //   	    $(".active video").trigger("pause");
  //   	}, 500);
	}
}

// add keyboard interaction to owl
jQuery(document.documentElement).keyup(function (event) { 

	// handle cursor keys
	if (event.keyCode == 37) {
	   // go left
	   owl.trigger('owl.prev');
	   $('.owl-item').addClass('reverse');
	   $(".owl-page.active + .owl-page span").removeClass("played");
	   console.log('reversing');
	} else if (event.keyCode == 39) {
	   // go right
	   owl.trigger('owl.next');
	   $('.owl-item').removeClass('reverse');
	}

});

var activeMarker;
var newCoordinates; // 1st map is: { lat: 37.778567, lng: -122.513965 };
var coordinates;

function updateCoordinates() {

	newCoordinates = $(".owl-item.active .window");

	//console.log("Get coordinates from data tag: " + newCoordinates);
	coordinates = {
		"lat": newCoordinates.data("lat"),
		"lng": newCoordinates.data("lng")
	};

	var currentMarker = markers[newCoordinates.data("id")];

	console.log("Marker[" + newCoordinates.data("id") + "] " + coordinates.lat + ", " + coordinates.lng);

	if(typeof activeMarker !== 'undefined') {
		activeMarker.setIcon(image);
	}

	activeMarker = currentMarker;

	if(typeof map !== 'undefined') {
		// load updated location
		map.panTo(coordinates);      

		setTimeout(function() {
			currentMarker.setIcon(image_lrg);
			currentMarker.setAnimation(google.maps.Animation.DROP);
		}, 1000);
	}
}

// gmap
var map;
var image;
var image_lrg;
var marker;
var markers = [];

function initMap() {
	console.log("Map initiated");
	// Create the map with no initial style specified.
	// It therefore has default styling.
	map = new google.maps.Map(document.getElementById('map'), {
		center: coordinates, //{lat: 37.778567, lng: -122.513965},
		zoom: 16,
		zoomControl: true,
		mapTypeControl: false,
		streetViewControl: false,
		rotateControl: false,
		fullscreenControl: false,
		styles: [
			{
				elementType: 'geometry',
				stylers: [{color: '#f5f5f5'}]
			},
			{
				elementType: 'labels.icon',
				stylers: [{visibility: 'off'}]
			},
			{
				elementType: 'labels.text.fill',
				stylers: [{color: '#616161'}]
			},
			{
				elementType: 'labels.text.stroke',
				stylers: [{color: '#f5f5f5'}]
			},
			{
				featureType: 'administrative.land_parcel',
				elementType: 'labels.text.fill',
				stylers: [{color: '#bdbdbd'}]
			},
			{
				featureType: 'poi',
				elementType: 'geometry',
				stylers: [{color: '#eeeeee'}]
			},
			{
				featureType: 'poi',
				elementType: 'labels.text.fill',
				stylers: [{color: '#757575'}]
			},
			{
				featureType: 'poi.park',
				elementType: 'geometry',
				stylers: [{color: '#e5e5e5'}]
			},
			{
				featureType: 'poi.park',
				elementType: 'labels.text.fill',
				stylers: [{color: '#9e9e9e'}]
			},
			{
				featureType: 'road',
				elementType: 'geometry',
				stylers: [{color: '#ffffff'}]
			},
			{
				featureType: 'road.arterial',
				elementType: 'labels.text.fill',
				stylers: [{color: '#757575'}]
			},
			{
				featureType: 'road.highway',
				elementType: 'geometry',
				stylers: [{color: '#dadada'}]
			},
			{
				featureType: 'road.highway',
				elementType: 'labels.text.fill',
				stylers: [{color: '#616161'}]
			},
			{
				featureType: 'road.local',
				elementType: 'labels.text.fill',
				stylers: [{color: '#9e9e9e'}]
			},
			{
				featureType: 'transit.line',
				elementType: 'geometry',
				stylers: [{color: '#e5e5e5'}]
			},
			{
				featureType: 'transit.station',
				elementType: 'geometry',
				stylers: [{color: '#eeeeee'}]
			},
			{
				featureType: 'water',
				elementType: 'geometry',
				stylers: [{color: '#c9c9c9'}]
			},
			{
				featureType: 'water',
				elementType: 'labels.text.fill',
				stylers: [{color: '#9e9e9e'}]
			}
		]
	});

	// initiate custom marker
	image = '../assets/svg/marker-circle.svg';
	image_lrg = '../assets/svg/marker.svg';
	// marker = new google.maps.Marker({
	// 	position: coordinates,
	// 	map: map,
	// 	icon: image,
	// 	animation: google.maps.Animation.DROP
	// });

	// marker = new google.maps.Marker({
	// 	position: coordinates,
	// 	map: map,
	// 	icon: image,
	// 	animation: google.maps.Animation.DROP
	// });

	$(".owl-item .window").each(function(index, element) {

		var lat = $(element).data("lat");
		var lng = $(element).data("lng");
		var id = $(element).data("id");

	    var pos = new google.maps.LatLng(lat, lng);
	    //console.log("Get coordinates from loop: " + pos);
	    markers[id] = new google.maps.Marker({
	        position: pos,
	        map: map,
	        icon: image
	    });
	});

	updateCoordinates();
}
	
// Custom Navigation Events
$(".next").click(function(){
	owl.trigger('owl.next');
	$('.owl-item').removeClass('reverse');
});

$(".prev").click(function(){
	owl.trigger('owl.prev');
	$('.owl-item').addClass('reverse');
	$(".owl-page.active + .owl-page span").removeClass("played");
});

function updateNav(){
	var owlCurrent = this.owl.currentItem;
	var windowNumber = $(".num").text(owlCurrent + 1);
	console.log(owlCurrent);
	// previous
	if(owlCurrent == 0){
		$(".prev").addClass("disabled");
	} else {
		$(".prev").removeClass("disabled");
	}
	// next
	if(owlCurrent == 99){
		$(".next").addClass("disabled");
	} else {
		$(".next").removeClass("disabled");
	}
}

// show and hide UI with timeout
var timer
$(".main").mousemove(function(){
	clearTimeout(timer);
	$(this).addClass('hover');
	timer = setTimeout(function(){
		$('.main').removeClass('hover');
	}, 5000);
});

// control sound
function fadeinSound() {
	var video = $("video");
	var newVolume = 1;
	video[0].volume = 0;
	video.prop('muted', false);
	video.animate({volume: newVolume}, 4000);
	console.log("Volume max");
}

function fadeOutSound() {
	var video = $("video");
	var newVolume = 0;
	video[0].volume = 1;
	video.animate({volume: newVolume}, 1000);
	setTimeout(function() {
		video.prop('muted', true);
	}, 1001);
	console.log("Volume min");
}

$(".volume").click(function () {
	if ($("video").prop('muted')) {
		// $("video").prop('muted', false);
		fadeinSound();
		$(this).removeClass('mute');
	} else {
		//$("video").prop('muted', true);
		fadeOutSound();
		$(this).addClass('mute');
	}
	console.log($("video").prop('muted'));
});

$(".play").click(function () {
	// var video = $('.active video').get(0);
 //    video.play();
 	$(".active video").trigger("play");
	$(this).toggleClass('fade');
});

// mute sound
//$("video").prop('muted', true);

// $(".volume").click(function () {
// 	if ($("video.sound").prop('muted')) {
// 		$("video.sound").prop('muted', false);
// 		$(this).removeClass('mute');
// 	} else {
// 		$("video.sound").prop('muted', true);
// 		$(this).addClass('mute');
// 	}
// 	console.log($("video.sound").prop('muted'))
// });

// click events
$closePanels.on("click", function() {
	$('body').removeClass('view-maps view-about');
	$(".active video").trigger("play");
	//console.log('btn clicked');
});

$openMaps.on("click", function() {
	$('body').addClass('view-maps');
	$(".active video").trigger("pause");
});

$openInfo.on("click", function() {
	$('body').addClass('view-about');
	$(".active video").trigger("pause");
});

// control main nav animations
$("nav a, nav > ul").mouseover(function(){
	if ($(window).width() > desktopBreak) {
		$(this).removeClass("out");
	}
});

$("nav a, nav > ul").mouseout(function(){
	if ($(window).width() > desktopBreak) {
		$(this).addClass("out");
	}
});