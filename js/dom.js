function log(text){
	
	
	var log_area=document.getElementById("log");
	log_area.innerHTML=text;
	
}


function update_display(geoloc){
	
	document.getElementById("speed").innerHTML=geoloc.speed;
	document.getElementById("distance").innerHTML='';
	document.getElementById("altitude").innerHTML=geoloc.altitude;
	
}


function add_option_to_list(id, objet, callback){
	
	console.log(objet);
	var formObj =document.getElementById(id);
	var elOptNew = document.createElement('option');
    elOptNew.text = objet.name;
    elOptNew.value =objet.key;
	 formObj.add(elOptNew, null);
	 callback;
	 
	
}



var formatter=function (value,type){
	
	
	if(type=="date"){
		var date=new Date(value);
		return date.toLocaleDateString();
		
	}else if(type=="hour"){
			var date=new Date(value);
		
		var hours = date.getHours();
		var minutes = date.getMinutes();
		var seconds = date.getSeconds();
		return hours+":"+minutes+":"+seconds+""
		
	}else if(type="hms"){
		
		//secondes
var s = Math.floor(value / 1000) % 60;
//minutes
var m = Math.floor(value / 60000) % 60;
//affichage
return m+":"+s;
	}
	
}

function reset_parcours_list(){
		
	document.getElementById("ul_parcours").innerHTML='';
	update_parcours_list();
	
	
	
}



function fill_parcours_tag(name){
document.getElementById('parcours_details_tag').innerHTML=name;


}
function fill_parcours_profil(name){
document.getElementById('parcours_details_profil').innerHTML=name;

}


function fill_parcours_detail(item,which){
	console.log(item);
	var assoc=new Object();
	assoc['parcours_name']=[{id:"parcours_details_name"}];
	assoc['parcours_startTime']=[{id:"parcours_details_start_time", type:"hour"},{id:"parcours_details_date", type:"date"}];
	assoc['parcours_stopTime']=[{id:"parcours_details_finsish_time",  type:"date"}];
	assoc['parcours_profil']=[{id:"parcours_details_profil",func:"get_profil_name(id)"}];
	assoc['parcours_tag']=[{id:"parcours_details_tag", func:"get_tag_name(id)"}];
	assoc['parcours_duration']=[{id:"parcours_details_duration", type:"hms"}];
	
	for(x in item){
	console.log(x+" ---"+which+"_"+x+"");
		if(assoc[""+which+"_"+x+""]){
			
						
			for(z in assoc[""+which+"_"+x+""]){
			
			console.log(assoc[""+which+"_"+x+""][z]);
			
				
			if(document.getElementById(assoc[""+which+"_"+x+""][z].id)){
			console.log(which+"_"+x);
			
			var vari=item[x];
			console.log("Début "+assoc[""+which+"_"+x+""][z].type+" _ "+assoc[""+which+"_"+x+""][z].func);
			if(assoc[""+which+"_"+x+""][z].type){
				console.log("1er if");
				vari=formatter(vari,assoc[""+which+"_"+x+""][z].type);
			}
			else if(assoc[""+which+"_"+x+""][z].func){
				console.log("2nd else");
				var id=vari;
				console.log(id+" "+item[x]+"");
			 var fonc=eval(assoc[""+which+"_"+x+""][z].func);
			 vari=fonc;
			 
			}
			
			
			 
			
			
			document.getElementById(assoc[""+which+"_"+x+""][z].id).innerHTML=vari;
		}
		
		
		}
		
		
		
			
		}
		
		
	}
	flyto("detail_parcours");
}




function delete_option_from_list(id,key){
	
	var list=document.getElementById(id);
	list.remove(key);
	
}




function refresh_list(name,id, objet){
	
	//On efface
	var formObj =document.getElementById(id);
	for (var loop=0; loop < formObj.mySelect.options.length; loop++) {
		formObj.mySelect.options[loop] = null; // remove the option
	}
	
	//On recrée
	var select_tags=document.getElementById(id);
	
	
	

}


function lister(){
var menu_items=document.getElementsByClassName("item_paremeters_menu");
	
			for(var i=0; i<menu_items.length; i++){
		var li=menu_items[i];
		
		li.addEventListener("click", changeVisibility, false); 

		//li.addEventListener("click", function(){console.log('clicke '+this.getAttribute("data-role"))}, false); 
		console.log(li.getAttribute("data-role"));
	}
	
}