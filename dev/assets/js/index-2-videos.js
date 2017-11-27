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
	}, 500);
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

});

// Additional class support for breakpoints
$(window).resize(function () {
	// fit to full screen
	clearTimeout(window.resizedFinished);
    window.resizedFinished = setTimeout(function(){
        console.log('Resized finished.');
		fitToScreen();
		$(".active video").trigger("play");
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

	var $toggleHeight = $(".active video");

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

var tag = document.createElement('script');
tag.src = "https://www.youtube.com/iframe_api";
var firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

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

		   var poster  = data["items"][i].poster;
		   var source = data["items"][i].source;
		   var lat = data["items"][i].lat;
		   var lng = data["items"][i].lng;

		   // content += "<div class=\"window toggleFC\" data-lat=\"" + lat + "\" data-lng=\"" + lng + "\"><div class=\"panel mask-left\"><iframe id=\"yt-" + vidID + "\" src=\"https://www.youtube.com/embed/" + source + "?autoplay=0&controls=0&showinfo=0&rel=0&enablejsapi=1\" width=\"640\" height=\"360\" frameborder=\"0\" allowfullscreen=\"1\"></iframe></div><div class=\"panel mask-right\"><iframe id=\"yt-" + vidID + "\" src=\"https://www.youtube.com/embed/" + source + "?autoplay=0&controls=0&showinfo=0&rel=0&enablejsapi=1\" width=\"640\" height=\"360\" frameborder=\"0\" allowfullscreen=\"1\"></iframe></div></div>"

		   content += "<div class=\"window toggleFC\" data-lat=\"" + lat + "\" data-lng=\"" + lng + "\"><div class=\"panel mask-left\"><video data-poster=\"" +poster+ "\" class=\"sound\" preload=\"none\" src=\"" +source+ "\"></video></div><div class=\"panel mask-right\"><video data-poster=\"" +poster+ "\" muted preload=\"none\" src=\"" +source+ "\"></video></div></div>"
		}

		$("#owl-json").html(content);
	}

	// inject vidoe with src
	function injVideo(elem){
		//var video = $('.active video');
		//var videoSrc = video.data('src');
		var videoPoster = $('.active video').data('poster');
		console.log("Video poster: " + videoPoster);
		// inject curent slide with video and poster
		$('.active video').attr('poster', videoPoster);
		// video.attr({
		// 	src: videoSrc,
		// 	poster: videoPoster
		// });
		var nextVideo = $('.active').next().find('video');
		//var nextSrc = nextVideo.data('src');
		var nextPoster = nextVideo.data('poster');
		nextVideo.attr('poster', nextPoster);
		// nextVideo.attr({
		// 	src: nextSrc,
		// 	poster: nextPoster
		// });
		//console.log(nextVideo);
	}
	// 1st play
	function initVideo(){

		//injVideo();

		$(".active video").trigger("play");
		$(".active video").addClass("playing");
		console.log("Video plays");
		$(".owl-page.active span").addClass("played");
		
		// check if video playback is fininshed
		$(".playing").first().bind("ended", function() {
			console.log("Video ended");
			owl.trigger("owl.next");
		});
		// update map coordinates
		initMap();
		updateCoordinates();
		//fitToScreen();
	}

	// play
	function playVideo(elem){

		//injVideo();
		
		$(".active video").trigger("play");
		$(".active video").addClass("playing");
		console.log("Video plays");
		
		// check if video playback is fininshed
		$(".playing").first().bind("ended", function() {
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
	}
}

function onPlayerReady(event) {
  
  // bind events
  var playButton = $('.').attr('id');
  playButton.addEventListener("click", function() {
    player.playVideo();
  });
  
  var pauseButton = document.getElementById("pause-button");
  pauseButton.addEventListener("click", function() {
    player.pauseVideo();
  });
  
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

var newCoordinates; // 1st map is: { lat: 37.778567, lng: -122.513965 };
var coordinates;

function updateCoordinates() {
	newCoordinates = $(".owl-item.active .window");
	//console.log("Get coordinates from data tag: " + newCoordinates);
	coordinates = {
		"lat": newCoordinates.data("lat"),
		"lng": newCoordinates.data("lng")
	};
	console.log("Updated coordinates: " + coordinates);

	if(typeof map !== 'undefined') {

		map.panTo(coordinates);
		marker = new google.maps.Marker({
			position: coordinates,
			map: map,
			icon: image_lrg,
			animation: google.maps.Animation.DROP
		});
	}
}

// gmap
var map;
var image;
var image_lrg;
var marker;

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
	image = '../assets/svg/marker-sml.svg';
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

	var markers = [];
	$(".owl-item .window").each(function(index, element) {

		var lat = $(element).data("lat");
		var lng = $(element).data("lng");

	    var pos = new google.maps.LatLng(lat, lng);
	    console.log("Get coordinates from loop: " + pos);
	    markers[index] = new google.maps.Marker({
	        position: pos,
	        map: map,
	        icon: image
	    });
	});

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

// mute sound
$("video").prop('muted', true);

$(".volume").click(function () {
	if ($("video.sound").prop('muted')) {
		$("video.sound").prop('muted', false);
		$(this).removeClass('mute');

	} else {
		$("video.sound").prop('muted', true);
		$(this).addClass('mute');
	}
	console.log($("video.sound").prop('muted'))
});

// click events
$closePanels.on("click", function() {
	$('.main').removeClass('view-maps view-about');
	$(".active video").trigger("play");
	//console.log('btn clicked');
});

$openMaps.on("click", function() {
	$('.main').addClass('view-maps');
	$(".active video").trigger("pause");
});

$openInfo.on("click", function() {
	$('.main').addClass('view-about');
	$(".active video").trigger("pause");
});

// control main nav animations
$("nav a").mouseover(function(){
	if ($(window).width() > desktopBreak) {
		$(this).removeClass("out");
	}
});

$("nav a").mouseout(function(){
	if ($(window).width() > desktopBreak) {
		$(this).addClass("out");
	}
});