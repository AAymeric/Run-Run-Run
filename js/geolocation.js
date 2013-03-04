var parcours_id=null;
var cpt=0;
var watchId=null;
var distance=0;
var start_gps=function(parcours){



	parcours_id=parcours;
	watchId = navigator.geolocation.watchPosition(successCallback, errorCallback, {enableHighAccuracy:true});
	
	
}



function successCallback(position){
		console.log("ici");
  if(cpt==0){
	  
	  var newobj={};
	  newobj.LatStartPoint=position.coords.latitude;
	  newobj.LongStartPoint=position.coords.longitude;
	  newobj.startTime=new Date().getTime();
	
	 
	 get_parcours_and_begin(parcours_id,newobj);
	 
	  //get_parcours(parcours_id,update_parcours(parcours_id,newobj));
	 
  }else{
	  if(cpt==1){
		  old_lati=position.coords.latitude;
		  old_longi=position.coords.longitude;
		  
	  }else{
		if(old_lati!=null || old_longi!=null){
	   		
	   		
	   		
				distance=distance+CalcDistanceBetween(old_lati,old_longi,position.coords.latitude,position.coords.longitude);
	   		
	   		
   		}  
		  
	  }
	   if(position.coords.accuracy<30){
	  
	   var obj = {};
  obj.latitude=position.coords.latitude;
  obj.longitude=position.coords.longitude;
  obj.timestamp=position.timestamp;
  obj.altitude=position.coords.altitude;
  obj.accuracy=position.coords.accuracy;
  obj.altitudeAccuracy=position.coords.altitudeAccuracy;
  obj.heading=position.coords.heading;
  obj.speed=position.coords.speed;
  obj.parcours_id=parcours_id;
  obj.distance=distance;
  update_display(obj);
  console.log(obj);
  add_record(obj)
	  
  }else{
	  console.log("par iciiii");
	  	warn_accuracy_not_ok(position.coords.accuracy);
	  
  }
	  
	  
	  
	  
  }
  
  
  
  
 
  
 
  
  
  
  
  
  
  
cpt++;
};  
 
function errorCallback(error){
  switch(error.code){
    case error.PERMISSION_DENIED:
      console.log("L'utilisateur n'a pas autorisé l'accès à sa position");
      break;      
    case error.POSITION_UNAVAILABLE:
       console.log("L'emplacement de l'utilisateur n'a pas pu être déterminé");
      break;
    case error.TIMEOUT:
       console.log("Le service n'a pas répondu à temps");
      break;
    }
};
 
  function stopWatch(compte){
  clearTimeout(compte);
    var newobj={};
	  newobj.StopTime=new Date().getTime();	  
	  
	 
  get_parcours_and_finish(parcours_id,newobj);
  
  navigator.geolocation.clearWatch(watchId);
  reset_parcours_list();
  flyto("parcours_list");
  } 


