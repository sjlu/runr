var Geocoder = function()
{
	var exports = {};
	var google_url = 'http://maps.googleapis.com/maps/api/';
	var on_complete = function(){};

	exports.current_location = {};

	function location_success(location)
	{
		$('#location .title span').html(location);
		on_complete();
	}

	function location_error() 
	{
		$('#location .title span').html("Couldn't grab your current location :(");
	}

	function set_location(lat, lon)
	{
		exports.current_location.lat = lat;
		exports.current_location.lon = lon;
	}

	function request_google(data)
	{
		var geocoder = new google.maps.Geocoder();
	
		geocoder.geocode(data, function (results, status)
		{
			if (status == google.maps.GeocoderStatus.OK)
				if (results[1])
					results = results[1];
				else if (results[0])
					results = results[0];
				else
					return location_error();
			else
				return location_error();

			location_success(results.formatted_address);

			if (!exports.current_location.lat)
				set_location(results.geometry.location.lat(), results.geometry.location.lng());
		});
	}

	function reverse_geolocation(lat, lon)
	{
		set_location(lat, lon);

		var latlng = new google.maps.LatLng(lat, lon);
		request_google({'latLng': latlng});
	}

	function geolocation(zipcode)
	{
		exports.current_location = {};
		request_google({'address': zipcode});
	}
	exports.geolocation = geolocation;

	function gps_success(position)
	{
		reverse_geolocation(position.coords.latitude, position.coords.longitude);
	}

	function init(event_handler)
	{
		on_complete = event_handler;

		if (navigator.geolocation)
			navigator.geolocation.getCurrentPosition(gps_success, location_error);
		else
			location_error();
	}
	exports.init = init;

	return exports;
}

var Inputer = function() 
{
	var exports = {};
	var places = [];
	var categories = [];

	function get_categories()
	{
		return categories;
	}
	exports.get_categories = get_categories;

	function get_list()
	{
		return places;
	}
	exports.get_list = get_list;

	function search_error()
	{
		$('#input').effect("shake", {times: 3}, 75).removeAttr('disabled').addClass('error');
		setTimeout(function(){
			$('#input').removeClass('error');
		}, 2000)
	}

	function search_success(term)
	{
		$('#input').attr('value', '').removeAttr('disabled');
		$('#items ul').prepend($('<li data-term="'+term+'">'+term+'<i class="icon-remove" data-term="'+term+'"></i></li>').hide().fadeIn('slow'));

		$('.icon-remove').click(function() {
			$('.icon-remove').unbind();
			remove_result($(this).attr('data-term'));
		});

		if (categories.length > 0)
			$('#button').fadeIn();
		else
			$('#button').fadeOut();
	}

	function search_result(results, term)
	{
		results = results.query.results.Result;

		categories.push(term);

		for (var i in results)
		{
			var result = results[i];
			var element = {
				'lat': result.Latitude,
				'lon': result.Longitude,
				'name': result.Title,
				'category': term,
				'result': result
			};

			places.push(element);
		}
	}

	function search(term)
	{
		var lat = geocoder.current_location.lat;
		var lon = geocoder.current_location.lon;

		YUI().use('node', 'yql', function (Y) {
			Y.YQL('SELECT * FROM local.search WHERE query="'+term+'" and latitude="'+lat+'" and longitude="'+lon+'"', function(r)
			{
				if (!r.query.results || r.query.results.count == 0)
				{
					search_error();
					return;
				}

				search_result(r, term);
				search_success(term);
			});
		});
	}
	exports.search = search;

	function remove_result(term)
	{
		for (var i in categories)
		{
			if (categories[i] == term)
				categories.splice(i, 1);
		}

		for (var i in places)
		{
			if (places[i].category == term)
				places.splice(i, 1);
		}

		$('li[data-term="'+term+'"]').fadeOut(function() { $(this).remove() });
	}

	function init()
	{
		$('#input').unbind().keydown(function(evt) {
			if (evt.keyCode == 13)
			{
				$('#input').attr('disabled', 'disabled');
				search(this.value);
			}
		});

		$('#button').unbind().click(function() {
			requester.request();
		});

		$('#refine').unbind().click(function() {
     		$('html, body').animate({scrollTop:$('#tasks').offset().top}, 'fast');
	     	$('#results').fadeOut();
	     	$('#results ul').html('');
	     	$('#map').css('height', 0).css('width', 0);
		});

		$('#input').removeAttr('disabled');
	}
	exports.init = init;

	return exports;
}

var Requester = function()
{
	var exports = {};
	var endpoint = '/api';

	function request_success(data)
	{
     	// `thedata` is what you get from the routing api

     	// taking the first out of the 10 results I give you
     	data = data[0];

     	var num = 65;
     	for (var i = 0; i < data.locations.length; i++)
     	{	
     		// console.log(data.locations[i]);
     		if (i == 0)
     		{
     			var name = 'Start';
     			var address = '';
     			var category = '';
     		}
     		else
     		{
     			var address = data.locations[i].result.Address+'<br />'+data.locations[i].result.City+', '+data.locations[i].result.State;
     			var name = data.locations[i].name;
     			var category = '"'+data.locations[i].category+'"';
     		}

     		$('#places-container ul')
     			.append('<li><span class="number">'+String.fromCharCode(num)+'</span><i class="icon-map-marker"></i><span class="title">'+name+'</span><span class="category">'+category+'</span><span class="address">'+address+'</span></li>');

     		num++;
     	}

     	//  new google.maps.LatLng(37.869085,-122.254775); to make a new lat lon pt
     	var lastloc = data.locations.pop();

     	// shift of the start location
     	var start = data.locations.shift();

   	var mapOptions = {
      	center: new google.maps.LatLng(Number(start.lat), Number(start.lon)),
       	zoom: 13, // higher is more zoomed in
       	mapTypeId: google.maps.MapTypeId.ROADMAP
     	};
     	var map = new google.maps.Map(document.getElementById("map"), mapOptions);

    	var directionsService = new google.maps.DirectionsService();
     	var directionsDisplay = new google.maps.DirectionsRenderer();

     	directionsDisplay.setMap(map);

     	var query = {
      	// start location
       	origin: new google.maps.LatLng(Number(start.lat), Number(start.lon)),

       	// last destination
       	destination: new google.maps.LatLng(Number(lastloc.lat), Number(lastloc.lon)),

       	travelMode: google.maps.TravelMode.WALKING,
       	unitSystem: google.maps.UnitSystem.IMPERIAL,

       	waypoints: []
     	};

     	for (var i = 0; i < data.locations.length; i++) {
      	query.waypoints.push({
         	location: new google.maps.LatLng(
           		Number(data.locations[i].lat), 
           		Number(data.locations[i].lon)
         	),
         	stopover: true
       	});
     	}

     	directionsService.route(query, function(response, status) {
      	// console.log(status);
       	if (status == google.maps.DirectionsStatus.OK) {
         	directionsDisplay.setDirections(response);
       	}
     	});

     	/**
     	 * HTML
     	 */

     	$('#results').fadeIn();

		$('#map').css('height', window.innerHeight).css('width', window.innerWidth);
		$('#results').css('height', window.innerHeight).css('width', window.innerWidth);

     	$('html, body').animate({scrollTop:$(document).height()}, 'slow');
     	google.maps.event.trigger(map, "resize");

     	$('#button').unbind().html('Submit').click(function() {
			requester.request();
		});
	}

	function request()
	{
		$.post(
			endpoint+'/route', 
			{
    			locations: JSON.stringify(inputer.get_list()),
    			categories: JSON.stringify(inputer.get_categories()),
    			start: JSON.stringify(geocoder.current_location)
  			},
  			request_success,
  			"json"
  		);

  		$('#button').unbind().html('<img src="/assets/img/loader.gif" />');
	}
	exports.request = request;

	function init()
	{
		// something goes here...
	}
	exports.init = init;

	return exports;
}

var geocoder = new Geocoder();
var inputer = new Inputer();
var requester = new Requester();

$(document).ready(function() {
	geocoder.init(function() {
		inputer.init();
	});

	$(window).resize(function(){
		$('#map').css('height', window.innerHeight).css('width', window.innerWidth);
		$('#results').css('height', window.innerHeight).css('width', window.innerWidth);
     	$('html, body').animate({scrollTop:$(document).height()}, 'slow');
	});
});