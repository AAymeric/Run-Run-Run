
var runrunrun = {};
var sports = {};
runrunrun.indexedDB = {};
runrunrun.indexedDB.db=null;
var db=null;
var DBNAME = 'RunRunRun';
var DBVERSION = 1;
var STORENAME_CONF = 'conf';
var STORENAME_SPORTS = 'sports';
var STORENAME_TAGS= 'tags';
var STORENAME_PARCOURS='parcours';
var STORENAME_RECORDS='records';
var STORENAME_PROFILS='profils';
var current_parcours=null;
var startTime=null; 
var IDBTransaction = window.IDBTransaction || window.webkitIDBTransaction;
var IDBKeyRange = window.IDBKeyRange || window.webkitIDBKeyRange;

  var store_conf=null;
  var store_sports=null;
  var store_parcours=null;
  var store_records=null;
  var store_tags=null;
  var store_profils=null;
  
  var object_store_conf=null;
  var object_store_profils=null;
  var object_store_tags=null;
  var object_store_sports=null;
  var object_store_parcours=null;
  var object_store_records=null;
  var init_add_sport=false;
  var type='readwrite';
runrunrun.indexedDB.open=function(){
	
	if(db){ //DB exists
		console.log("DB existe");
		
	}else{
		//Or not
		//We open a connection to local DB
		 var indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB;

		
		  var openreq = indexedDB.open(DBNAME, DBVERSION);
		  
		  openreq.onerror = function withStoreOnError() {
			  	console.error("asyncStorage: can't open database:", openreq.error.name);
		  };
		  openreq.onupgradeneeded = function withStoreOnUpgradeNeeded() {
        
        		var object_store_conf=openreq.result.createObjectStore(STORENAME_CONF,{keyPath: undefined, autoIncrement: true });
		        var object_store_sports=openreq.result.createObjectStore(STORENAME_SPORTS,{ keyPath: undefined , autoIncrement: true });
		        var object_store_parcours=openreq.result.createObjectStore(STORENAME_PARCOURS,{ keyPath: undefined, autoIncrement: true});
		        var object_store_records=openreq.result.createObjectStore(STORENAME_RECORDS,{keyPath: undefined, autoIncrement: true});
		        var object_store_tags=openreq.result.createObjectStore(STORENAME_TAGS,{keyPath: undefined, autoIncrement: true});
		        var object_store_profils=openreq.result.createObjectStore(STORENAME_PROFILS,{keyPath: undefined, autoIncrement: true});
		        
		        
		        init_add_sport=true;
		        object_store_records.createIndex('parcours_id','parcours_id',{ unique: false });
         };
         
         openreq.onsuccess = function withStoreOnSuccess() {
             
        db = openreq.result;
        
        if(init_add_sport){add_sports();}
        console.log("ici");
       console.log(store_sports);
      
       get_all_tags();
     show_list_profil();
      };

		
	}
	
};


function show_list_profil(){
	
	var select_tags=document.getElementById('profil_edit_list');
	store_profils=db.transaction(STORENAME_PROFILS, type).objectStore(STORENAME_PROFILS);

	var keyRange = IDBKeyRange.lowerBound(0);
    var cursorRequest = store_profils.openCursor(keyRange);
    
      cursorRequest.onsuccess = function(e){
       var result = e.target.result;
       
       	if(result){
	       	     //  console.log(result.value.name+" "+result.key);
	       	       
	       	       
	  var elOptNew = document.createElement('option');
    elOptNew.text = result.value.name;
    elOptNew.value =result.key;
	 select_tags.add(elOptNew, null);
	       	       
	       	result.continue();
       	}
      
       
       
      }
      cursorRequest.onerror=function(e){
      
      console.log("error");
      
      }
	
	 
	
	
}

function fill_edit_profil_form(profil){
	console.log(profil);
	
	document.getElementById("profil_name_edit").value=profil.value.name;
	document.getElementById("profil_weight_edit").value=profil.value.weight;
	document.getElementById("profil_id_edit").value=profil.key;
	if(profil.value.sex=="M"){
		
		document.getElementById('profil_sex_edit').selectedIndex = 0;
	}else{
		
		document.getElementById('profil_sex_edit').selectedIndex = 1;
	}
	
	
	
}


function load_profil(){
	
	console.log(document.getElementById("profil_edit_list").value);
	
	var id=parseInt(document.getElementById("profil_edit_list").value);


	store_profils=db.transaction(STORENAME_PROFILS, type).objectStore(STORENAME_PROFILS);

	var keyRange = IDBKeyRange.only(id);
  var cursorRequest = store_profils.openCursor(keyRange);
  
  cursorRequest.onsuccess = function(e){
	  
	  
	  var result = e.target.result;
	    if(!!result == false){
		    console.log("icie");
		    
		    		   console.log("ok");
		    		   callback(result.value);
		    return result;
	    }else{
		    console.log("lae");
		   console.log(result.value);
		   console.log(typeof(callback));
		   fill_edit_profil_form(result);
		   if(typeof(callback)!="undefined"){
			   
		   }
		    
	    }
	      
	      
	      
	      
	      
  }
  
  
  cursorRequest.onerror=function(e){
  console.log("ou pah");
  
  }
	
}

function edit_profil(){
	console.log(document.getElementById("profil_id_edit").value);
	
	var profil={};
	profil.id=document.getElementById("profil_id_edit").value;
	profil.name=document.getElementById("profil_name_edit").value;
	profil.weight=document.getElementById("profil_weight_edit").value;
	profil.sex=document.getElementById("profil_sex_edit").value;
	profil.active='false';
	
	edition_profil(profil);
	
	
	
}

function edition_profil(profil){
		
			var keyRange = IDBKeyRange.only(parseInt(profil.id));
		store_profils=db.transaction(STORENAME_PROFILS, type).objectStore(STORENAME_PROFILS);

	var cursorRequest = store_profils.openCursor(keyRange);
	
	
	
	cursorRequest.onsuccess = function(evt){
	
	var cursor = evt.target.result;
  //do the update
  var objRequest = cursor.update(profil);
	
	objRequest.onsuccess = function(ev){
    console.log('Success in updating record 88');
    };
  objRequest.onerror = function(ev){
    console.log('Error in updating record 88');
    };
	
	
	
	
	};
	
	cursorRequest.onerror = function(evt){
    console.log('Error in retrieving record 88');
  };
	

	
}



function insert_profil(){
	
	var profil={};
	profil.name=document.getElementById("profil_name_add").value;
	profil.sex=document.getElementById("profil_sex_add").value;
	profil.weight=document.getElementById("profil_weight_add").value;
	profil.active='false';

	add_profil(profil);

}



function add_profil(profil){
	
	store_profils=db.transaction(STORENAME_PROFILS, type).objectStore(STORENAME_PROFILS);
	var req=store_profils.add(profil);
	console.log(store_profils);
	req.onsuccess = function() {
          console.log('ajouté');
          //get_all_sports();
        };
        req.onerror = function() {
          console.log('erreur lors de l\'ajout '+req.error.name);
        };
}



function add_sport(sport){
	
	console.log("Euh ?"+db);
store_sports=db.transaction(STORENAME_SPORTS, type).objectStore(STORENAME_SPORTS);


	var req=store_sports.add(sport);
	console.log(store_sports);
	req.onsuccess = function() {
          console.log('ajouté');
          //get_all_sports();
        };
        req.onerror = function() {
          console.log('erreur lors de l\'ajout '+req.error.name);
        };

	
	
}


function add_sports(){
	
	var sports={};
	var sport={};
	/*Base 50kg 1 minute */
	 
	sport.name='marche';
	sport.h_cal=2;
	sport.f_cal=2;
	add_sport(sport);
	
	sport.name='jogging';
	sport.h_cal=13;
	sport.f_cal=12;
	add_sport(sport);

	sport.name='velo';
	sport.h_cal=4;
	sport.f_cal=4;
	add_sport(sport);
	
	
	
}




function remplir_data(){
	
	
	for(var i=0; i<4000; i++){
		var obj = {};
  obj.latitude=Math.random(0,1000000);
  obj.longitude=Math.random(0,1000000);
  obj.timestamp=Math.random(0,1000000);
  obj.altitude=Math.random(0,1000000);
  obj.accuracy=Math.random(0,1000000);
  obj.altitudeAccuracy=Math.random(0,1000000);
    obj.heading=Math.random(0,1000000);
  obj.speed=Math.random(0,1000000);
    obj.parcours_id=1;
		
		add_record(obj);
	}
	
	
}



function reset_list(){
	var formObj =document.getElementById('list_tags');
for (var loop=0; loop < formObj.mySelect.options.length; loop++) {
  formObj.mySelect.options[loop] = null; // remove the option
}
	
	
}

function add_tag(name){

store_tags=db.transaction(STORENAME_TAGS, type).objectStore(STORENAME_TAGS);


	var req=store_tags.add({name:name});
	console.log(store_tags);
	req.onsuccess = function() {
          console.log('ajouté');
          //get_all_sports();
        };
        req.onerror = function() {
          console.log('erreur lors de l\'ajout '+req.error.name);
        };

	


}


function add_record(obj){

store_records=db.transaction(STORENAME_RECORDS, type).objectStore(STORENAME_RECORDS);


	var req=store_records.add(obj);
	
	req.onsuccess = function() {
          console.log('record ajouté');
          //get_all_sports();
        };
        req.onerror = function() {
          console.log('erreur lors de l\'ajout '+req.error.name);
        };

	


}

function vider_list_tag(index){
	
	
	
}

function render_tags(data, id){
	
	var select_tags=document.getElementById('list_tags');
	var elOptNew = document.createElement('option');
    elOptNew.text = data.name;
    elOptNew.value = id;
	 select_tags.add(elOptNew, null); 
	 
	 var select_tags=document.getElementById('choice_tags');
	var elOptNew = document.createElement('option');
    elOptNew.text = data.name;
    elOptNew.value = id;
	 select_tags.add(elOptNew, null); 
	 
	 
	 
}

var wait10sec=function(){
	
	
	setTimeout(function() { return "hello" ;},1250);
}



function fill_select_tag(){
	
	document.getElementById("choice_tag")
	
	
}


function remove_tag_from_list(id){


	var select_tags=document.getElementById('list_tags');

select_tags.remove(id);

}


function test(){
	wait10sec.onreadystatechange = function () {
	console.log("hello");
	
	}
}

function get_all_tags(){
	
	store_tags=db.transaction(STORENAME_TAGS, type).objectStore(STORENAME_TAGS);

	var keyRange = IDBKeyRange.lowerBound(0);
    var cursorRequest = store_tags.openCursor(keyRange);
    
      cursorRequest.onsuccess = function(e){
       var result = e.target.result;
       
       	if(result){
	       	     //  console.log(result.value.name+" "+result.key);
	       	       render_tags(result.value, result.key);
	       	result.continue();
       	}
      
       
       
      }
      cursorRequest.onerror=function(e){
      
      console.log("error");
      
      }

  
	
}

function see_records(parcours){
	store_records=db.transaction(STORENAME_RECORDS, type).objectStore(STORENAME_RECORDS);
	 var index = store_records.index("parcours_id");
	 //var cursorReq = index.openKeyCursor();
	 var singleKeyRange = IDBKeyRange.only(parcours);
	 
	 delete_table_record("list_records");
	index.openCursor(singleKeyRange).onsuccess = function(event) {
  var cursor = event.target.result;
  if (cursor) {
    // cursor.key is a name, like "Bill", and cursor.value is the SSN.
    // No way to directly get the rest of the stored object.
         render_record(cursor.value);
    cursor.continue();
  }
};
}



function records_to_json(parcours){
var compteur=0;
	store_records=db.transaction(STORENAME_RECORDS, type).objectStore(STORENAME_RECORDS);
	 var index = store_records.index("parcours_id");
	 //var cursorReq = index.openKeyCursor();
	 var json={};
	 var singleKeyRange = IDBKeyRange.only(parcours);
	 
	 delete_table_record("list_records");
	index.openCursor(singleKeyRange).onsuccess = function(event) {
  var cursor = event.target.result;
  if (cursor) {
    // cursor.key is a name, like "Bill", and cursor.value is the SSN.
    // No way to directly get the rest of the stored object.
         json[compteur]=cursor.value;
    cursor.continue();
    compteur++;
  }
  
  var stringifyjson=JSON.stringify(json);
  
  var newtstring=stringifyjson.replace(/\\("|'|\\)/g, "$1");

  document.getElementById('zone_json').value=stringifyjson;
   document.getElementById('input_json').value=stringifyjson;
   document.getElementById('mail').innerHTML='<a href=mailto:simon51100%40gmail.com?body='+newtstring+'>Mail</a>';
};
}

function see_ongmaps(id){




	get_parcours(id,work_on_parcours);

}

function get_parcours(id, callback){
console.log("callback "+callback);
var id=parseInt(id);


	store_parcours=db.transaction(STORENAME_PARCOURS, type).objectStore(STORENAME_PARCOURS);

	var keyRange = IDBKeyRange.only(id);
  var cursorRequest = store_parcours.openCursor(keyRange);
  
  cursorRequest.onsuccess = function(e){
	  
	  
	  var result = e.target.result;
	    if(!!result == false){
		    console.log("icie");
		    
		    		   console.log("ok");
		    		   callback(result.value);
		    return result;
	    }else{
		    console.log("lae");
		   console.log(result.value);
		   console.log(typeof(callback));
		   if(typeof(callback)!="undefined"){
			   callback(result);
		   }
		    
	    }
	      
	      
	      
	      
	      
  }
  
  
  cursorRequest.onerror=function(e){
  
  
  }



}


function get_tags(id, callback, callback2){
	store_tags=db.transaction(STORENAME_TAGS, type).objectStore(STORENAME_TAGS);

	var keyRange = IDBKeyRange.only(parseInt(id));
  var cursorRequest = store_tags.openCursor(keyRange);
  
  cursorRequest.onsuccess = function(e){
	  
	  
	  var result = e.target.result;
	    if(!!result == false){
		    console.log("ici");
		    console.log(result);
		    
	    }else{
		    
		      console.log("la");
	
	      callback(result.value, callback2);
	    }
	   
	    
	      //console.log(result.value);
  }
  
  
  cursorRequest.onerror=function(e){
  
  	console.log(e);
  }
  
  
	
}


function form_edit_tag(form){
	
	var value=form.input_edit_sport.value;
	var selected_index=form.list_tags.selectedIndex;
var id=form.list_tags[selected_index].value;
	var data={name:value};
	update_tag(parseInt(id), data);
	
}


function form_delete_sport(form){

var selIndex=form.elements['list_tags'].selectedIndex;
var newSel=form.elements['list_tags'].options[selIndex].value;


 delete_tag(newSel);
		
	
		
	remove_sport_from_list(selIndex);

		
	return false;

}






function form_get_data(action, referer){
	console.log(referer.add_sport.value);
	

	if(action=="add_sport" && referer.add_sport.value!=""){
		add_sport(referer.add_sport.value);
		
		
	}
	else if(action=="delete_sport" && referer!=""){
		
		
		//delete_sport(referer);
		
		remove_sport_from_list(referer);
	}
	
}


var update_parcours= function(id, data){
	console.log("ID "+id);
	console.log(data);
	var keyRange = IDBKeyRange.only(parseInt(id));
		store_parcours=db.transaction(STORENAME_PARCOURS, type).objectStore(STORENAME_PARCOURS);

	var cursorRequest = store_parcours.openCursor(keyRange);
	
	
	
	cursorRequest.onsuccess = function(evt){
	
	var cursor = evt.target.result;
  //do the update
  var objRequest = cursor.update(data);
	
	objRequest.onsuccess = function(ev){
    console.log('Success in updating record 88');
    };
  objRequest.onerror = function(ev){
    console.log('Error in updating record 88');
    };
	
	
	
	
	};
	
	cursorRequest.onerror = function(evt){
    console.log('Error in retrieving record 88');
  };
	
	
}


function update_tag(id, data){
	
	var keyRange = IDBKeyRange.only(id);
		store_tags=db.transaction(STORENAME_TAGS, type).objectStore(STORENAME_TAGS);

	var cursorRequest = store_tags.openCursor(keyRange);
	
	
	
	cursorRequest.onsuccess = function(evt){
	
	var cursor = evt.target.result;
  //do the update
  var objRequest = cursor.update(data);
	
	objRequest.onsuccess = function(ev){
    console.log('Success in updating record 88');
    };
  objRequest.onerror = function(ev){
    console.log('Error in updating record 88');
    };
	
	
	
	
	};
	
	cursorRequest.onerror = function(evt){
    console.log('Error in retrieving record 88');
  };
	
	
}


function supprimer_parcours(){
	for (var i=0; i<45; i++){
		
		delete_parcours(i);
	}
	
}



function delete_parcours(id){
console.log(typeof(id));
var id=parseInt(id);

//reset_list();
	store_parcours=db.transaction(STORENAME_PARCOURS, type).objectStore(STORENAME_PARCOURS);
	
	var request=store_parcours.delete(id);
	
	request.onsuccess=function (e){
	
	console.log(e+" eok");
	}
	
	
	request.onerror = function(e) {
    console.log(e+"error");
  };


 
 
 



}



function delete_tag(id){
console.log(typeof(id));
var id=parseInt(id);

//reset_list();
	store_tags=db.transaction(STORENAME_TAGS, type).objectStore(STORENAME_TAGS);
	
	var request=store_tags.delete(id);
	
	request.onsuccess=function (e){
	
	console.log(e+" eok");
	}
	
	
	request.onerror = function(e) {
    console.log(e+"error");
  };

//store_sports.delete(id);
	var keyRange = IDBKeyRange.only(id);
  var cursorRequest = store_tags.openCursor(keyRange);
 
 
 



}


function attend10sec(){
	
	
	
}





function save_data(){
	
	
	var req=store_conf.add({data1:"hello", data2:"hello2"});
	req.onsuccess = function() {
          console.log('ajouté');
        };
        req.onerror = function() {
          console.log('erreur lors de l\'ajout '+req.error.name);
        };

	
	
}

function delete_table_record(id_table){
console.log(id_table);
	var table = document.getElementById(id_table);
	var rowCount = table.rows.length;
	
	for (var i=1; i<rowCount; i++){
		
		table.deleteRow(i);
	}
	
	
}

function render_record(data){
	console.log(data);
	var list_field_record=['latitude', 'longitude', 'timestamp', 'accuracy', 'altitudeAccuracy', 'altitude','speed','heading'];
		
	var table = document.getElementById("list_records");
	 var rowCount = table.rows.length;
     var row = table.insertRow(rowCount);
     console.log(rowCount);
      var cnt_row=0;
            //On insere les attributs, mais ordre étrange donc je force avec tableau
            for (var key in list_field_record) {
	            
	            	
	            	
	            	var cell=row.insertCell(cnt_row);
	          
	            	cell.innerHTML=data[list_field_record[key]];
	            	cnt_row++;
			}
			var cell=row.insertCell(cnt_row);
	         
	          cell.innerHTML='';
}

function render_parcours(data, id){
	
	

	list_fields=["name","sport","startTime", "stopTime", "duration", "LatStartPoint", "LongStartPoint"];
	
	
	 
	       var table = document.getElementById("list_parcours");
 
            var rowCount = table.rows.length;
            var row = table.insertRow(rowCount);
            
            var cnt_row=0;
            //On insere les attributs, mais ordre étrange donc je force avec tableau
            for (var key in list_fields) {
	            
	            	console.log("Clé "+key);
	            	
	            	var cell=row.insertCell(cnt_row);
	            	console.log(data[key]);
	            	cell.innerHTML=data[list_fields[key]];
	            	cnt_row++;
			}
			var cell=row.insertCell(cnt_row);
	         
	          cell.innerHTML='<input type="button" value=" Supprimer parcours" onclick="delete_parcours('+id+');" /><input type="button" value=" Voir records" onclick="see_records('+id+');" /><input type="button" value=" Voir records JSON" onclick="records_to_json('+id+');" /><input type="button" value=" Voir sur Gmaps" onclick="see_ongmaps('+id+');" />';
	         
	         
	         
	         
}

function stop_parcours(){
	
	get_parcours(current_parcours, stopper_parcours);
	
}



var stopper_parcours = function(parcours){
	
	
	console.log(parcours);
	

			   

var obj_date=new Date();
	
var obj=parcours;
obj.stopTime=obj_date.getTime();
obj.duration=(obj.stopTime)-(obj.startTime);
	
update_parcours(current_parcours, obj);
//get_parcours(current_parcours);
	//Edit 
	
}

function list_parcours(){
	
	var store_parcours=db.transaction(STORENAME_PARCOURS, type).objectStore(STORENAME_PARCOURS);
	var keyRange = IDBKeyRange.lowerBound(0);
    var cursorRequest = store_parcours.openCursor(keyRange);
    
      cursorRequest.onsuccess = function(e){
       var result = e.target.result;
       
       	if(result){
	       	     //  console.log(result.value.name+" "+result.key);
	       	       render_parcours(result.value, result.key);
	       	result.continue();
       	}
      
       
       
      }
      cursorRequest.onerror=function(e){
      
      console.log("error");
      
      }
	
	
	
}


var work_on_parcours=function(parcours_data){

	console.log(parcours_data);
	store_records=db.transaction(STORENAME_RECORDS, type).objectStore(STORENAME_RECORDS);
	 var index = store_records.index("parcours_id");
	 //var cursorReq = index.openKeyCursor();
	 var singleKeyRange = IDBKeyRange.only(parcours_data.key);
	 
	 delete_table_record("list_records");
	 var distance=null;
	 var vitesse_max=0;
	 var min_ts=null;
	 var max_ts=null;
	 var vitesse_max=0;
	 var alti_max=null;
	  var path_polyline = new Array();

  var old_lati=null;
  var old_longi=null;
	index.openCursor(singleKeyRange).onsuccess = function(event) {
  var cursor = event.target.result;
  
    console.log("ici");
  if (cursor) {

  		//On calcule la distance
  		
  		if(min_ts==null && max_ts==null){
	  		
	  		
	  		min_ts=cursor.value.timestamp;
	  		max_ts=cursor.value.timestamp;
  		}
  		
   		if(old_lati!=null || old_longi!=null){
	   		
	   		
	   		distance=distance+CalcDistanceBetween(old_lati, old_longi,cursor.value.latitude,cursor.value.longitude);
	   		
   		}
   		
   		//On cree la polyline
   		var p = new google.maps.LatLng(cursor.value.latitude, cursor.value.longitude);
		path_polyline.push(p);
   		
   		
   		//On calcule la vitesse max
   		if(cursor.value.speed>=vitesse_max){
	   		vitesse_max=cursor.value.speed;
	   		
   		}
   		
	   	//On calcule le timestamp de debut et le timestamp de fin
	   	
	   	if(cursor.value.timestamp>max_ts){
		   	max_ts=cursor.value.timestamp;
		   	
	   	}
	   		old_lati=cursor.value.latitude;
	   		old_longi=cursor.value.longitude;
	   		console.log(event.target.result);
	   		var retour=cursor.continue();
	   		
	   		
	   		//console.log("Cursor "+cursor.continue());
            //cursor.continue();
  }else{
	  
	   console.log("Distance "+distance);
	    var duree_ms=max_ts-min_ts;
  console.log("Duree "+format_heure(duree_ms));
  console.log("Vitesse maximale "+vitesse_max);
  
   polyline(path_polyline);
   center_map(old_lati,old_longi);
   alert('Fini');
  }
 
  
 
};

	
}


function format_heure(date_ms){
	
	var duree_s=date_ms/1000;
	
	
	var d=new Date(date_ms);
	return d.getHours()+":"+d.getMinutes()+":"+d.getSeconds()+"";
}


function force_insert(){
	
	
	add_parcours("Input force", input_json);
	
}

var input_json=function(pid){
	
	//var myObject=JSON.eval(document.getElementById("input_json").value);
	var objet2=JSON.parse(document.getElementById("input_json").value);
	
	console.log(objet2.hasOwnProperty(length).value);
	//console.log(objet2.length);
	for(var x in objet2){
	console.log(x);
		var record=objet2[x];
		console.log(objet2);
		var new_obj = {};
		new_obj.latitude=record.latitude;
		new_obj.longitude=record.longitude;
		new_obj.timestamp=record.timestamp;
		new_obj.altitude=record.altitutde;
		new_obj.accuracy=record.accuracy;
		new_obj.altitudeAccuracy=record.altitutdeAccuracy;
		new_obj.heading=record.heading;
		new_obj.speed=record.speed;
		new_obj.parcours_id=pid;
		
		
		console.log(new_obj);	
		add_record(new_obj);
		x++;
	}
	
	
}


function start_parcours(form){
	
	var selectedIndex=form.elements['choice_tags'].selectedIndex;
var id=form.elements['choice_tags'].options[selectedIndex].value;
	get_tag(id, add_parcours, start_gps);
	
}


function get_parcours_and_begin(id, obj){
	
	
	
	//We will do a get on the parcours object, take the startTime, make minus with stopTime
	//And we'll do an update with stopTime and duration

	//Creation of a store on parcours object
	store_parcours=db.transaction(STORENAME_PARCOURS, type).objectStore(STORENAME_PARCOURS);
	
	//We define the keyRange with "only" for the query on DB
	var keyRange = IDBKeyRange.only(parseInt(id));
	
	//Creation of cursor with the keyRange
	var cursorRequest = store_parcours.openCursor(keyRange);
  
	//Success of the cursor
	cursorRequest.onsuccess = function(e){
	  
	//Store of the result	
	var result = e.target.result;
	
	if(!!result == false){
		   
		    	console.log("Impossible de recuperer l'objet");
	 }else{
		    
		  		    //Instanciation of new object
		    var newobj = {};
		    
		    //We put the objet passed in parameter to "newobj"
		    newobj=result.value;
		    
		    //We store Lat & Long of start Point
		    newobj.LatStartPoint= obj.LatStartPoint
		    newobj.LongStartPoint=obj.LongStartPoint;		    
		    //Update of the object parcours
		    update_parcours(id, newobj);
	  }
	      
	      
	      
	      
	      
  }
  
  
  cursorRequest.onerror=function(e){
  
  	console.log("Erreur de curseur");
  }

	

	
	
	
}

function get_parcours_and_finish(id, obj){
	//We will do a get on the parcours object, take the startTime, make minus with stopTime
	//And we'll do an update with stopTime and duration

	//Creation of a store on parcours object
	store_parcours=db.transaction(STORENAME_PARCOURS, type).objectStore(STORENAME_PARCOURS);
	
	//We define the keyRange with "only" for the query on DB
	var keyRange = IDBKeyRange.only(parseInt(id));
	
	//Creation of cursor with the keyRange
	var cursorRequest = store_parcours.openCursor(keyRange);
  
	//Success of the cursor
	cursorRequest.onsuccess = function(e){
	  
	//Store of the result	
	var result = e.target.result;
	
	if(!!result == false){
		   
		    	console.log("Impossible de recuperer l'objet");
	 }else{
		    
		   console.log(obj);
		   
		   //Calcul of the duration stopTime (type: timestamp) - startTime (type: timestamp))
		   var duration=(parseInt(obj.StopTime))-(parseInt(result.value.startTime));
		    
		    //Instanciation of new object
		    var newobj = {};
		    
		    //We put the objet passed in parameter to "newobj"
		    newobj=result.value;
		    
		    //We store duration and stopTime
		    newobj.duration=duration;
		    newobj.stopTime=obj.StopTime;
		    
		    //Update of the object parcours
		    update_parcours(id, newobj);
	  }
	      
	      
	      
	      
	      
  }
  
  
  cursorRequest.onerror=function(e){
  
  	console.log("Erreur de curseur");
  }

	


}










var add_parcours=function (sport,callback){

console.log(sport);

store_parcours=db.transaction(STORENAME_PARCOURS, type).objectStore(STORENAME_PARCOURS);
var obj_date=new Date();




var date=obj_date.getDate()+"/"+(obj_date.getMonth()+1)+"/"+obj_date.getFullYear()+"-"+obj_date.getHours()+"h"+obj_date.getMinutes()+"m"+obj_date.getSeconds()+"s";
var name="Parcours "+date;



console.log(sport);
var obj = {};
obj.name=name;
obj.sport=sport.name;
obj.startTime=obj_date.getTime();
obj.duration=null;
obj.stopTime=null;
obj.LatStartPoint='';
obj.LongStartPoint='';


	var req=store_parcours.add(obj);
	  	req.onsuccess = function(e) {
	  	console.log(req);
	  	current_parcours=req.result; //On assigne l'ID retourné à la variable current parcours.
          callback(current_parcours);
                 };
        req.onerror = function() {
          console.log('erreur lors de l\'ajout '+req.error.name);
        };




}


