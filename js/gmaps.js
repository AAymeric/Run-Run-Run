function toRad(Value) {
		    /** Converts numeric degrees to radians */
		    return Value * Math.PI / 180;
}
		
		
function CalcDistanceBetween(lat1, lon1, lat2, lon2) {
		    var R = 6378.1; // Radius of earth in Km var R = (6371 / 1.609344);
		    var dLat = toRad(lat2-lat1);
		    var dLon = toRad(lon2-lon1); 
		    var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
		            Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * 
		            Math.sin(dLon/2) * Math.sin(dLon/2); 
		    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
		    var d = R * c;
		    return d;
}
	     
	     
	     
	     function center_map(latitude, longitude){
		     
		     map.setCenter(new google.maps.LatLng(latitude,longitude));
		     
	     }
	     
	     
	      function polyline(path_polyline) {
		    
		    
	        var line = new google.maps.Polyline({
	          path: path_polyline,
	          strokeColor: '#ff0000',
	          strokeOpacity: 1.0,
	          strokeWeight: 3
	        });
	        line.setMap(map);
			
			
			

	     }
	     
	     
	     
	     function initialize() {
	     console.log("init map");
    var latlng = new google.maps.LatLng(48.725623,2.272943);
    var myOptions = {
        zoom: 12,
        center: latlng,
        mapTypeId: google.maps.MapTypeId.ROADMAP
    };
   map = new google.maps.Map(document.getElementById("map"),myOptions);
      
      
}
 
//en haut à gauche 48.758226,2.199986
//en bas à gauche 48.702857,2.206166
//en bas à droite 48.702064,2.325643
//en haut à droite : 48.755397,2.320493


  google.maps.event.addDomListener(window, "load", initialize);
	     
	     