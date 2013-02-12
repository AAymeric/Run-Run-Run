var centi = 0
var secon = 0;
var minu = 0;

function chrono() {




	centi++;
	if (centi > 9) {
		centi = 0;
		secon++;
		
	}
	if (secon > 59) {
		secon = 0;
		minu++;
	}
	
	if(secon < 10)
		document.getElementById('time-sec').innerHTML = "0" + secon;
	else
		document.getElementById('time-sec').innerHTML = secon;
		
	if(minu < 10)
		document.getElementById('time-min').innerHTML = "0" + minu;
	else
		document.getElementById('time-min').innerHTML = minu;
		
	compte = setTimeout('chrono()', 100);
}

function rasee() {
	clearTimeout(compte);
	centi = 0;
	secon = 0;
	minu = 0;
	document.getElementById('time-min').innerHTML = minu;
	document.getElementById('time-sec').innerHTML = secon;
}