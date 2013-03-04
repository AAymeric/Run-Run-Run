'use strict';

var runrunrun = {};
var sports = {};
var current_profil=1; //A enlever
runrunrun.indexedDB={};
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
var db=null;
var IDBTransaction = window.IDBTransaction || window.webkitIDBTransaction;
var IDBKeyRange = window.IDBKeyRange || window.webkitIDBKeyRange;

  var store_conf=null;
  var store_sports=null;
  var store_parcours=null;
  var store_records=null;
  var store_tags=null;
  var store_profils=null;
  
  var object_store_conf;
  var object_store_profils;
  var object_store_tags;
  var object_store_sports;
  var object_store_parcours;
  var object_store_records;
  var init_add_sport=false;
  var type='readwrite';
   var openreq;
  
   var indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB;

		
		 

  
runrunrun.indexedDB.open=function(){
	
	
	log("par la");

	
	if(db){ //DB exists
		log("DB existe");
		
	}else{
	
	//Or not
		//We open a connection to local DB
			var request= indexedDB.open(DBNAME, DBVERSION);
		     request.onupgradeneeded = function(e) {
			  log("upgrade");
			 
       var db =  e.target.result;
       
      
        
        		//object_store_conf=db.createObjectStore(STORENAME_CONF,{keyPath: undefined, autoIncrement: true });
        
		       object_store_sports= db.createObjectStore(STORENAME_SPORTS,{ keyPath:undefined , autoIncrement: true });
		        object_store_parcours=db.createObjectStore(STORENAME_PARCOURS,{ keyPath: undefined, autoIncrement: true});
		        object_store_records=db.createObjectStore(STORENAME_RECORDS,{keyPath: undefined, autoIncrement: true});
		        object_store_tags=db.createObjectStore(STORENAME_TAGS,{keyPath: undefined, autoIncrement: true});
		       object_store_profils=db.createObjectStore(STORENAME_PROFILS,{keyPath: undefined, autoIncrement: true});
		        log(db);
		        
		        init_add_sport=true;
		        object_store_records.createIndex('parcours_id','parcours_id',{unique: false });
		        object_store_sports.createIndex('name','name',{ unique: true });
		       

         };
         request.onsuccess = function (e) {
           
           
           request.result.onversionchange = function(){
           
           log("version change");           
           
        };
      db =  request.result;
        log("puis la");
        
        			
                    if(init_add_sport){add_sports();}; 
      
      get_all_tags();
       get_all_sports();
     show_list_profil();
     update_parcours_list();
      };
		
		  
		  request.onblocked = function (e) {
			  	log("asyncStorage: can't open database:", request.error.name);
		  };
		
        

		
	}
	
};



function refresh_profil_list(){
	
	
	
}

function refresh_tag_list(){
	
	
	
}

function show_list_profil(){
	
	var select_tags=document.getElementById('profil_edit_list');
	store_profils=db.transaction(STORENAME_PROFILS, type).objectStore(STORENAME_PROFILS);

	var keyRange = IDBKeyRange.lowerBound(0);
    var cursorRequest = store_profils.openCursor(keyRange);
    
      cursorRequest.onsuccess = function(e){
       var result = e.target.result;
       
       	if(result){
	       	     //  log(result.value.name+" "+result.key);
	       	       
	       	       
	  var elOptNew = document.createElement('option');
    elOptNew.text = result.value.name;
    elOptNew.value =result.key;
	 select_tags.add(elOptNew, null);
	       	       
	       	result.continue();
       	}
      
       
       
      }
      cursorRequest.onerror=function(e){
      
      log("error");
      
      }
	
	 
	
	
}

var add_parcours_to_list=function(key,item, item2, tag){
	
	var table=document.getElementById('table_parcours');
	var tr = document.createElement("tr");
	var td1=document.createElement("td");
	var td2=document.createElement("td");
	var td3=document.createElement("td");
	
	
	td1.appendChild(document.createTextNode(item.name));
	td2.appendChild(document.createTextNode(item2.name));
	td3.appendChild(document.createTextNode(tag));
	tr.appendChild(td1);
	tr.appendChild(td2);
	tr.appendChild(td3);
	table.appendChild(tr);
	
	tr.addEventListener("click",function(){detail_parcours(key);}, false); 
		
}


function declenchement(item){
	
	
	log("déclenché "+item);
}
var get_info_parcours=function(id){
	
	
	var objet=null;
	log("objet "+typeof(objet));
	while(typeof (objet=detail_parcours(id, this)) !=="undefined"){
		log(objet);
		
	}
	
	setTimeout(function(){log("toto"+objet);declenchement(objet); return "toto";},5000)
	
}


function test1(){
	
	setTimeout(function(){log("ok 1"); return "toto";},5000)
	
}



function test2(){
	
	setTimeout(function(){log("ok 2");return "tata";},5000)
	
}



function detail_parcours(id){

		log("ID "+id);

	store_parcours=db.transaction(STORENAME_PARCOURS, type).objectStore(STORENAME_PARCOURS);

	var keyRange = IDBKeyRange.only(parseInt(id));
	log(keyRange);
  var cursorRequest = store_parcours.openCursor(keyRange);
  
  cursorRequest.onsuccess = function(e){
	  
	  
	  var result = e.target.result;
	  log(result);
	    if(!!result == false){
		   log("ici");
	    }else{
	    
		   fill_parcours_detail(result.value, "parcours", result.key);
			  	    
		    		 
		   }
		    
	    
	      
	      
	      
	      
	      
  }
  
  
  cursorRequest.onerror=function(e){
  log("ou pah");
  
  }
}







function update_parcours_list(){
 var KR= IDBKeyRange;
store_parcours=db.transaction(STORENAME_PARCOURS, type).objectStore(STORENAME_PARCOURS);

	var keyRange = IDBKeyRange.lowerBound(0);
    var cursorRequest = store_parcours.openCursor(keyRange);
    
      cursorRequest.onsuccess = function(e){
       var result = e.target.result;
       	var tag_val='';
       	if(result){
       
       log(result.key+" "+result.value);
	       	  
	
  				get_tag_info(result.key,result.value);
	 	       	   

	       	       	       	result.continue();
       	}
      
       
       
      }
      cursorRequest.onerror=function(e){
      
      
      
      }
	
	
}

function fill_edit_profil_form(profil){
	log(profil);
	
	document.getElementById("profil_name_edit").value=profil.value.name;
	document.getElementById("profil_weight_edit").value=profil.value.weight;
	document.getElementById("profil_id_edit").value=profil.key;
	if(profil.value.sex=="M"){
		
		document.getElementById('profil_sex_edit').selectedIndex = 0;
	}else{
		
		document.getElementById('profil_sex_edit').selectedIndex = 1;
	}
	
	
	
}

function fill_edit_tag_form(tag){
	
	
	document.getElementById("tag_name_edit").value=tag.value.name;
	document.getElementById("tag_id_edit").value=tag.key;

	
	
}



function del_tag(){
var element=document.getElementById("tag_edit_list");
var id=element.value;
var index=element.selectedIndex;
	
	delete_tag(id, delete_option_from_list("tag_edit_list",index));
	
	
	
}

function del_profil(){
var element=document.getElementById("profil_edit_list");
var id=element.value;
var index=element.selectedIndex;
	
	delete_profil(id, delete_option_from_list("profil_edit_list",index));
	
	
	
}

function load_tag(){
	
	
	var id=parseInt(document.getElementById("tag_edit_list").value);


	store_tags=db.transaction(STORENAME_TAGS, type).objectStore(STORENAME_TAGS);

	var keyRange = IDBKeyRange.only(id);
  var cursorRequest = store_tags.openCursor(keyRange);
  
  cursorRequest.onsuccess = function(e){
	  
	  
	  var result = e.target.result;
	    if(!!result == false){
		    log("icie");
		    
		    		   log("ok");
		    		   callback(result.value);
		    return result;
	    }else{
		    log("lae");
		   log(result.value);
		   log(typeof(callback));
		   fill_edit_tag_form(result);
		   flyto("tag_edit");
		   if(typeof(callback)!="undefined"){
			   
		   }
		    
	    }
	      
	      
	      
	      
	      
  }
  
  
  cursorRequest.onerror=function(e){
  log("ou pah");
  
  }
	
}


function load_profil(){
	
	
	var id=parseInt(document.getElementById("profil_edit_list").value);


	store_profils=db.transaction(STORENAME_PROFILS, type).objectStore(STORENAME_PROFILS);

	var keyRange = IDBKeyRange.only(id);
  var cursorRequest = store_profils.openCursor(keyRange);
  
  cursorRequest.onsuccess = function(e){
	  
	  
	  var result = e.target.result;
	    if(!!result == false){
		    log("icie");
		    
		    		   log("ok");
		    		   callback(result.value);
		    return result;
	    }else{
		    log("lae");
		   log(result.value);
		   log(typeof(callback));
		   fill_edit_profil_form(result);
		   flyto("profil_edit");
		   if(typeof(callback)!="undefined"){
			   
		   }
		    
	    }
	      
	      
	      
	      
	      
  }
  
  
  cursorRequest.onerror=function(e){
  log("ou pah");
  
  }
	
}

function edit_tag(){
	
	var tag={};
	tag.id=document.getElementById("tag_id_edit").value;
	tag.name=document.getElementById("tag_name_edit").value;
	
	
	edition_tag(tag);
	
	
	
}



function edition_tag(tag){
		log(tag);
			var keyRange = IDBKeyRange.only(parseInt(tag.id));
		store_tags=db.transaction(STORENAME_TAGS, type).objectStore(STORENAME_TAGS);

	var cursorRequest = store_tags.openCursor(keyRange);
	
	
	
	cursorRequest.onsuccess = function(evt){
	
	var cursor = evt.target.result;
  //do the update
  var objRequest = cursor.update(tag);
	
	objRequest.onsuccess = function(ev){
    flyto("tag_list");    };
  objRequest.onerror = function(ev){
    flyto("tag_list");
    };
	
	
	
	
	};
	
	cursorRequest.onerror = function(evt){
    log('Error in retrieving record 88');
  };
	

	
}


function edit_profil(){
	
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
    flyto("profil_list");    };
  objRequest.onerror = function(ev){
    flyto("profil_list");
    };
	
	
	
	
	};
	
	cursorRequest.onerror = function(evt){
    log('Error in retrieving record 88');
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


function insert_tag(){
	
	var tag={};
	tag.name=document.getElementById("tag_name_add").value;
	

	add_tag(tag.name);

}



function add_profil(profil){
	
	
	
	var transaction = db.transaction(STORENAME_PROFILS, "readwrite");
	var objectStore = transaction.objectStore(STORENAME_PROFILS);
	

	var req=objectStore.add(profil);
	log(store_profils);
	req.onsuccess = function(e) {
	var obj={};
	obj.key=e.target.result;
	obj.name=profil.name;
		
			add_option_to_list("profil_edit_list",obj,flyto("profil_list"));
          log(e.target.result);
          //Update of the list with id and name
          
        };
        req.onerror = function() {
          log('erreur lors de l\'ajout '+req.error.name);
        };
}



function add_sport(sport){
	
	
	//var transaction = db.transaction(["sports"], "readwrite");
	//var store_sports = transaction.objectStore("customers");
	
	
	 //object_store_sports=db.createObjectStore(["sports"],{ keyPath: 'id' , autoIncrement: true });
//store_sports=db.transaction(["sports"], type).objectStore(STORENAME_SPORTS);
	var transaction = db.transaction('sports', "readwrite");
	
	transaction.oncomplete = function(event) {

};

	var objectStore = transaction.objectStore('sports');
	var req=objectStore.add(sport);
	
	req.onsuccess = function() {
          log('sport ajouté');
          //get_all_sports();
        };
        req.onerror = function() {
          log('erreur lors de l\'ajout '+req.error.name);
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

var store_tags=db.transaction(STORENAME_TAGS, type).objectStore(STORENAME_TAGS);


	var req=store_tags.add({name:name});
	req.onsuccess = function(e) {
          var obj={};
	obj.key=e.target.result;
	obj.name=name;
		
			add_option_to_list("tag_edit_list",obj,flyto("tag_list"));
			add_option_to_list("choice-tags",obj);
          
        };
        req.onerror = function() {
         
        };

	


}


function add_record(obj){

store_records=db.transaction(STORENAME_RECORDS, type).objectStore(STORENAME_RECORDS);


	var req=store_records.add(obj);
	
	req.onsuccess = function() {
          log('record ajouté');
          //get_all_sports();
        };
        req.onerror = function() {
          log('erreur lors de l\'ajout '+req.error.name);
        };

	


}

function vider_list_tag(index){
	
	
	
}


function render_sports(data, id){
	
	var select_sports=document.getElementById('choice-sports');
	var elOptNew = document.createElement('option');
    elOptNew.text = data.name;
    elOptNew.value = id;
	 select_sports.add(elOptNew, null); 
	
	 
	 
	 
}



function render_tags(data, id){
	
	var select_tags=document.getElementById('tag_edit_list');
	var elOptNew = document.createElement('option');
    elOptNew.text = data.name;
    elOptNew.value = id;
	 select_tags.add(elOptNew, null); 
	 
	 var select_tags=document.getElementById('choice-tags');
	var elOptNew = document.createElement('option');
    elOptNew.text = data.name;
    elOptNew.value = id;
	 select_tags.add(elOptNew, null); 
	 
	 
	 
}

var wait10sec=function(){
	
	
	setTimeout(function() { return "hello" ;},1250);
}



function fill_select_tag(){
	
	document.getElementById("choice_tag");
	
	
}


function remove_tag_from_list(id){


	var select_tags=document.getElementById('list_tags');

select_tags.remove(id);

}


function test(){
	wait10sec.onreadystatechange = function () {
	log("hello");
	
	}
}

function get_all_tags(){
	
	
	var transaction = db.transaction('tags', "readwrite");
	var objectStore = transaction.objectStore('tags');
	
	
	



	var keyRange = IDBKeyRange.lowerBound(0);
    var cursorRequest = objectStore.openCursor(keyRange);
    
      cursorRequest.onsuccess = function(e){
       var result = e.target.result;
       
       	if(result){
	       	     //  log(result.value.name+" "+result.key);
	       	       render_tags(result.value, result.key);
	       	result.continue();
       	}
      
       
       
      }
      cursorRequest.onerror=function(e){
      
      log("error");
      
      }

  
	
}

function get_all_sports(){
	
	
	
	
	var transaction = db.transaction("sports", "readwrite");
	var objectStore = transaction.objectStore("sports");
	

	var keyRange = IDBKeyRange.lowerBound(0);
    var cursorRequest = objectStore.openCursor(keyRange);
    
      cursorRequest.onsuccess = function(e){
       var result = e.target.result;
       
       	if(result){
	       	     //  log(result.value.name+" "+result.key);
	       	       render_sports(result.value, result.key);
	       	result.continue();
       	}
      
       
       
      }
      cursorRequest.onerror=function(e){
      
      log("error");
      
      }

  
	
}


function see_records(parcours){
	var new_dist=0;
	var cpt_curs=0;
	var last_lat=null;
	var last_long=null;
	store_records=db.transaction(STORENAME_RECORDS, type).objectStore(STORENAME_RECORDS);
	 var index = store_records.index("parcours_id");
	 //var cursorReq = index.openKeyCursor();
	 var singleKeyRange = IDBKeyRange.only(parcours);
	 
	index.openCursor(singleKeyRange).onsuccess = function(event) {
  var cursor = event.target.result;
  if (cursor) {
    // cursor.key is a name, like "Bill", and cursor.value is the SSN.
    // No way to directly get the rest of the stored object.
         render_record(cursor.value);
         
         if(last_lat!=null && last_long!=null){
	         
	         
	         new_dist=new_dist+CalcDistanceBetween(last_lat,last_long,cursor.value.latitude,cursor.value.latitude);
	         
	         
         }
         
         last_lat=cursor.value.latitude;
	         last_lon=cursor.value.latitude;
         
         
         
         
    cursor.continue();
    cpt_curs++;
  }
};

log("Distance : "+new_dist);
}



function records_to_json(parcours){
var compteur=0;
	store_records=db.transaction(STORENAME_RECORDS, type).objectStore(STORENAME_RECORDS);
	 var index = store_records.index("parcours_id");
	 //var cursorReq = index.openKeyCursor();
	 var json={};
	 var singleKeyRange = IDBKeyRange.only(parcours);
	 
	 //delete_table_record("list_records");
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
  console.log(stringifyjson);
  //document.getElementById('zone_json').value=stringifyjson;
   //document.getElementById('input_json').value=stringifyjson;
   //document.getElementById('mail').innerHTML='<a href=mailto:simon51100%40gmail.com?body='+newtstring+'>Mail</a>';
};
}

function see_ongmaps(id){




	get_parcours(id,work_on_parcours);

}

function get_parcours(id, callback){
var id=parseInt(id);


	store_parcours=db.transaction(STORENAME_PARCOURS, type).objectStore(STORENAME_PARCOURS);

	var keyRange = IDBKeyRange.only(id);
  var cursorRequest = store_parcours.openCursor(keyRange);
  
  cursorRequest.onsuccess = function(e){
	  
	  
	  var result = e.target.result;
	    if(!!result == false){
		    log("icie");
		    
		    		   log("ok");
		    		   callback(result.value);
		    return result;
	    }else{
		    
		   if(typeof(callback)!="undefined"){
			   callback(result);
		   }
		    
	    }
	      
	      
	      
	      
	      
  }
  
  
  cursorRequest.onerror=function(e){
  
  
  }



}


function get_profil_name(id){
log("Id "+id+" fin id");
	store_profils=db.transaction(STORENAME_PROFILS, type).objectStore(STORENAME_PROFILS);

	var keyRange = IDBKeyRange.only(parseInt(id));
  var cursorRequest = store_profils.openCursor(keyRange);
  
  cursorRequest.onsuccess = function(e){
	  
	  
	  var result = e.target.result;
	    if(!!result == false){
		    log("ici");
		    log(result);
		    
	    }else{
		    
		      log("la");
	log("PROFIL "+result.value.name);
	     fill_parcours_profil(result.value.name);
	    }
	   
	    
	      //log(result.value);
  }
  
  
  cursorRequest.onerror=function(e){
  
  	log(e);
  }


}

var get_tag_info=function(key, objet){

		store_tags=db.transaction(STORENAME_TAGS, type).objectStore(STORENAME_TAGS);

	var keyRange = IDBKeyRange.only(parseInt(objet.tag));
  var cursorRequest = store_tags.openCursor(keyRange);
  
  cursorRequest.onsuccess = function(e){
	  
	  
	  var result = e.target.result;
	    if(!!result == false){
		    		    
	    }else{
		   
	
	get_sport(objet.sport,objet,add_parcours_to_list, key,result.value.name)
	     
	    }
	  
  }
  
  
  cursorRequest.onerror=function(e){
  
  	return "erreur";
  }



}



function get_tag_name(id){
log("Id "+id+" fin id");
		store_tags=db.transaction(STORENAME_TAGS, type).objectStore(STORENAME_TAGS);

	var keyRange = IDBKeyRange.only(parseInt(id));
  var cursorRequest = store_tags.openCursor(keyRange);
  
  cursorRequest.onsuccess = function(e){
	  
	  
	  var result = e.target.result;
	    if(!!result == false){
		    		    
	    }else{
		    log("TAG "+result.value.name);
	fill_parcours_tag(result.value.name);
	     
	    }
	   	  
	    
	      //log(result.value);
  }
  
  
  cursorRequest.onerror=function(e){
  
  	return "erreur";
  }



}




function get_tags(id, callback, callback2){
	store_tags=db.transaction(STORENAME_TAGS, type).objectStore(STORENAME_TAGS);

	var keyRange = IDBKeyRange.only(parseInt(id));
  var cursorRequest = store_tags.openCursor(keyRange);
  
  cursorRequest.onsuccess = function(e){
	  
	  
	  var result = e.target.result;
	    if(!!result == false){
		    log("ici");
		    log(result);
		    
	    }else{
		    
		      log("la");
	
	      callback(result.value, callback2);
	    }
	   
	    
	      //log(result.value);
  }
  
  
  cursorRequest.onerror=function(e){
  
  	log(e);
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
	log(referer.add_sport.value);
	

	if(action=="add_sport" && referer.add_sport.value!=""){
		add_sport(referer.add_sport.value);
		
		
	}
	else if(action=="delete_sport" && referer!=""){
		
		
		//delete_sport(referer);
		
		remove_sport_from_list(referer);
	}
	
}


var update_parcours= function(id, data){
	log("update_parcours");
	var keyRange = IDBKeyRange.only(parseInt(id));
		store_parcours=db.transaction(STORENAME_PARCOURS, type).objectStore(STORENAME_PARCOURS);

	var cursorRequest = store_parcours.openCursor(keyRange);
	
	
	
	cursorRequest.onsuccess = function(evt){
	
	var cursor = evt.target.result;
  
  var objRequest = cursor.update(data);
	
	objRequest.onsuccess = function(ev){
    log('Success in updating record 88');
    };
  objRequest.onerror = function(ev){
   log('Error in updating record 88');
    };
	
	
	
	
	};
	
	cursorRequest.onerror = function(evt){
    log('Error in retrieving record 88');
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
    log('Success in updating record 88');
    };
  objRequest.onerror = function(ev){
    log('Error in updating record 88');
    };
	
	
	
	
	};
	
	cursorRequest.onerror = function(evt){
    log('Error in retrieving record 88');
  };
	
	
}


function supprimer_parcours(){
	for (var i=0; i<45; i++){
		
		delete_parcours(i);
	}
	
}

function delete_tag(id, callback){
var id=parseInt(id);

//reset_list();
	store_tag=db.transaction(STORENAME_TAGS, type).objectStore(STORENAME_TAGS);
	
	var request=store_tag.delete(id);
	
	request.onsuccess=function (e){
	callback;
	log(e+" eok");
	}
	
	
	request.onerror = function(e) {
    log(e+"error");
  };


 
 
 



}





function delete_profil(id, callback){
log(typeof(id));
var id=parseInt(id);

//reset_list();
	store_profil=db.transaction(STORENAME_PROFILS, type).objectStore(STORENAME_PROFILS);
	
	var request=store_profil.delete(id);
	
	request.onsuccess=function (e){
	callback;
	log(e+" eok");
	}
	
	
	request.onerror = function(e) {
    log(e+"error");
  };


 
 
 



}



function delete_parcours(id){
log(typeof(id));
var id=parseInt(id);

//reset_list();
	store_parcours=db.transaction(STORENAME_PARCOURS, type).objectStore(STORENAME_PARCOURS);
	
	var request=store_parcours.delete(id);
	
	request.onsuccess=function (e){
	
	log(e+" eok");
	}
	
	
	request.onerror = function(e) {
    log(e+"error");
  };


 
 
 



}



function delete_tag(id){
log(typeof(id));
var id=parseInt(id);

//reset_list();
	store_tags=db.transaction(STORENAME_TAGS, type).objectStore(STORENAME_TAGS);
	
	var request=store_tags.delete(id);
	
	request.onsuccess=function (e){
	
	log(e+" eok");
	}
	
	
	request.onerror = function(e) {
    log(e+"error");
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
          log('ajouté');
        };
        req.onerror = function() {
          log('erreur lors de l\'ajout '+req.error.name);
        };

	
	
}

function delete_table_record(id_table){
log(id_table);
	var table = document.getElementById(id_table);
	var rowCount = table.rows.length;
	
	for (var i=1; i<rowCount; i++){
		
		table.deleteRow(i);
	}
	
	
}

function render_record(data){
	log(data);
	var list_field_record=['latitude', 'longitude', 'timestamp', 'accuracy', 'altitudeAccuracy', 'altitude','speed','heading'];
		
	var table = document.getElementById("list_records");
	 var rowCount = table.rows.length;
     var row = table.insertRow(rowCount);
     log(rowCount);
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
	            
	            	log("Clé "+key);
	            	
	            	var cell=row.insertCell(cnt_row);
	            	log(data[key]);
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
	
	
	log(parcours);
	

			   

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
	       	     //  log(result.value.name+" "+result.key);
	       	       render_parcours(result.value, result.key);
	       	result.continue();
       	}
      
       
       
      }
      cursorRequest.onerror=function(e){
      
      log("error");
      
      }
	
	
	
}


var work_on_parcours=function(id){



	var transaction = db.transaction(STORENAME_RECORDS, "readwrite");
	var objectStore = transaction.objectStore(STORENAME_RECORDS);
	
		 var index = objectStore.index("parcours_id");
	 //var cursorReq = index.openKeyCursor();
	 log("ID "+id);
	 var singleKeyRange = IDBKeyRange.only(parseInt(id));
	 
	
	 var distance=null;
	 var vitesse_max=0;
	 var min_ts=null;
	 var max_ts=null;
	 var vitesse_max=0;
	 var alti_max=null;
	  var path_polyline = new Array();

  var old_lati=null;
  var old_longi=null;
  
  var cursorRequest=index.openCursor(singleKeyRange);
  
	cursorRequest.onsuccess = function(event) {
  var cursor = event.target.result;
  
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
	   	
	   		//console.log(cursor.value.latitude+";"+cursor.value.longitude+";"+cursor.value.timeStamp+"");
	   		old_lati=cursor.value.latitude;
	   		old_longi=cursor.value.longitude;
	   		console.log(cursor.value);
	   		
	   		
	   
		   	
		   		   	//On affiche 
	  
	   		
	   		
	   
	   		var retour=cursor.continue();
	   	
	   		//log("Cursor "+cursor.continue());
            //cursor.continue();
  }else{
	  

	   log("Distance "+distance);
	    var duree_ms=max_ts-min_ts;
  log("Duree "+format_heure(duree_ms));
  log("Vitesse maximale "+vitesse_max);
  
  console.log(old_lati+" "+old_longi);
   polyline(path_polyline);
   center_map(old_lati,old_longi);
   
  }
 
  
 
};
cursorRequest.oncomplete=function(e){

console.log("terminadoooss");
};
cursorRequest.onerror=function(e){

log("ERRREUUR");
}

	
}



function get_sport(id,item,callback, key,tag){
		
		
		
	
	//We will do a get on the parcours object, take the startTime, make minus with stopTime
	//And we'll do an update with stopTime and duration

	//Creation of a store on parcours object
	store_sports=db.transaction(STORENAME_SPORTS, type).objectStore(STORENAME_SPORTS);
	
	//We define the keyRange with "only" for the query on DB
	var keyRange = IDBKeyRange.only(parseInt(id));
	
	//Creation of cursor with the keyRange
	var cursorRequest = store_sports.openCursor(keyRange);
  
	//Success of the cursor
	cursorRequest.onsuccess = function(e){
	  
	//Store of the result	
	var result = e.target.result;
	
	if(!!result == false){
		   
		    	log("Impossible de recuperer l'objet");
	 }else{
		   
		  	callback(key, item, result.value,tag);	
		  		
	  }
	      
	      
	      
	      
	      
  }
  
  
  cursorRequest.onerror=function(e){
  
  	log("Erreur de curseur");
  }

	
	
	
	
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
	
	log(objet2.hasOwnProperty(length).value);
	//log(objet2.length);
	for(var x in objet2){
	log(x);
		var record=objet2[x];
		log(objet2);
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
		
		
		log(new_obj);	
		add_record(new_obj);
		x++;
	}
	
	
}


function start_parcours(){
chrono();
	var sport=document.getElementById('choice-sports').value;
	var tag=document.getElementById('choice-tags').value;
	
	log(tag+" "+sport);
	add_parcours(sport,tag, current_profil, start_gps);
//sport,tag,profil,callback


	
}


function get_parcours_and_begin(id, obj){
	//We will do a get on the parcours object, take the startTime, make minus with stopTime
	//And we'll do an update with stopTime and duration
	flyto("trace");
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
		   
		    	log("Impossible de recuperer l'objet");
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
  
  	log("Erreur de curseur");
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
		   
		    	log("Impossible de recuperer l'objet");
	 }else{
		    
		   log(obj);
		   
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
  
  	log("Erreur de curseur");
  }

	


}










var add_parcours=function (sport,tag,profil,callback){

log(sport);

store_parcours=db.transaction(STORENAME_PARCOURS, type).objectStore(STORENAME_PARCOURS);
var obj_date=new Date();




var date=obj_date.getDate()+"/"+(obj_date.getMonth()+1)+"/"+obj_date.getFullYear()+"-"+obj_date.getHours()+"h"+obj_date.getMinutes()+"m"+obj_date.getSeconds()+"s";
var name="Parcours "+date;



log(sport);
var obj = {};
obj.name=name;
obj.sport=sport; //id
obj.tag=tag;//Nom
obj.profil=profil; //id
obj.startTime=obj_date.getTime();
obj.duration=null;
obj.stopTime=null;
obj.LatStartPoint='';
obj.LongStartPoint='';


	var req=store_parcours.add(obj);
	  	req.onsuccess = function(e) {
	  	log(req);
	  	current_parcours=req.result; //On assigne l'ID retourné à la variable current parcours.
          callback(current_parcours);
                 };
        req.onerror = function() {
          log('erreur lors de l\'ajout '+req.error.name);
        };




}


