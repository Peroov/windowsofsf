// owl carousel
function initOwl() {

	var owl = $('.owl-carousel');

	$("#owl-json").owlCarousel({
		jsonPath : '../assets/js/videos.json',
		jsonSuccess : customDataSuccess
	});

	function customDataSuccess(data){
		var content = "";
		for(var i in data["items"]){
		   
		   var poster = data["items"][i].poster;
		   var source = data["items"][i].source;

		   content += "<video poster=\"" +poster+ "\" src=\"" +source+ "\"></video>"
		}
		$("#owl-json").html(content);
	}
}

// owl carousel
function initOwl() {

	var owl = $('.owl-carousel');

	owl.owlCarousel({
		lazyContent:true,
		nav:true,
		info: getInfo,
		slideBy:'page'

	});

	$.ajax({
		url: '../assets/js/videos.json',
		dataType: 'json',
		success: function(data) {
		var content = '';

		for (i in data.owl) {
		        content += data.owl[i].item;
		    }
			owl.trigger('insertContent.owl',content);
		}

	});

	function getInfo(i){

		var owlInfo = i,prop,value,name;
		var current = i['currentPosition'];
		var all = i['allItems'];

		$('.currentPosition').text(current);
		$('.allItems').text(all);

	}

    // add numbers to dotted nav
    // var i = 1;
    // $('.owl-carousel .owl-dot span').each(function(){
    //   $(this).text(i);
    //   i++;
    // });
}