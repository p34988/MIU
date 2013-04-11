/* 
	Warren Morris
	MIU 1304
	Project 1
*/


window.addEventListener("DOMContentLoaded", function () {

	// get element function
	function getID (x) {
		var element = document.getElementById(x);
		return element;
	}
	
	//get the checked state for radios
	function getMarked () {
		var marked = document.getElementsByName("bmarked");
		for (i=0, j=marked.length; i<j; i++) {
			if(marked[i].checked) {
				markedVal = marked[i].value;
			}
		}
	}
	
	//populate create and populate a select tag
	function popType () {
		var theform = getID("addbike");
		var theli = getID("bt");
		var theselect = document.createElement("select");
		theselect.setAttribute("id", "biketype");
		for(i=0, j=bikeTypes.length; i<j; i++){
			var bikeOption = document.createElement("option");
			var theOption = bikeTypes[i];
			bikeOption.setAttribute("value", theOption);
			bikeOption.innerHTML = theOption;
			theselect.appendChild(bikeOption);
		}		
		theli.appendChild(theselect);
	}
	/* having issues with my item display div creating a second div with the same id. this fixes that */
	function remDiv () {
		var xBikeDiv = getID("bikes");
		xBikeDiv.parentNode.removeChild(xBikeDiv);		
	}
	
	// hides/shows display div
	function switchView (x) {
		switch(x){
			case "0": //form  visible
				getID("addbike").style.display = "block";
				getID("clear").style.display = "inline";
				getID("displayLink").style.display = "inline";
				getID("ab").style.display = "none";
			    break;
			case "1": //form hidden
				getID("addbike").style.display = "none";
				getID("clear").style.display = "inline";
				getID("displayLink").style.display = "none";
				getID("ab").style.display = "inline";
				getID("h1").innerHTML = "List of bikes";
				break;
		}
	}

	function resetForm () {
		getID("assembler").value = "";
		getID("assdate").value = "";
		grabDate();
		getID("asstext").innerHTML = "1";
		getID("comments").value = "";
		getID("biketype").selectedIndex = "0";
		getID("h1").innerHTML = "Add a bike";	
	}
	
	//clear local storage
	function dumpLocal () {
		var cPrompt = confirm("Are you sure you would like to clear all entries?");
		if (cPrompt){
			localStorage.clear();
			alert('Bike list cleared!');
			window.location.reload();
		} else {
			alert("Entries were not cleared!");
		}
	}

	//displaydata
	function showData () {
		//was having multiple of the list showing up, this deletes the div if it exists
		if (getID("bikes")){
			remDiv();
		}
		if (localStorage.length<1) {
			getID("ab").innerHTML = "Add bike";
			var pBikes = confirm("There is no bikes to display. Would you like to populate the list?");
			/*
			alert("No bike entries to display. Add a bike!!");
			return;
			*/
			if (pBikes) {   /* i didn't really like the idea of forcing it to populate without giving   */  
				popBikes(); /* me the coice to decline. sometimes i click things not thinking about it. */
			} else {
				return;
			}

			/* this would be a really good spot for a box that informs the user that the displaylist is empty.
			no one likes obnoxious alerts that pop up, so adding a box when its empty would be better.
			i might add it later if i have time. */
		} else {
			getID("ab").innerHTML = "Add another bike";
		}
		var makeDiv = document.createElement("div");
		makeDiv.setAttribute("id", "bikes");
		var makeList = document.createElement("ul");
		makeDiv.appendChild(makeList);
		document.body.appendChild(makeDiv);
		getID("bikes").style.display = "block";
		for(var i=0, j=localStorage.length; i<j; i++){
	       var makeLi = document.createElement("li");
	       if (i%2 === 0) {
		       makeLi.setAttribute("class", "altcolor");
	       } 
	       makeList.appendChild(makeLi);
	       var key = localStorage.key(i);
	       var useless = localStorage.getItem(key);
	       var item = JSON.parse(useless);
	       var makeNextList = document.createElement("ul");
	       makeLi.appendChild(makeNextList);
	       grabImg(item.type[1], makeNextList);
	       for(var k in item){
	           var makeNextLi = document.createElement("li");
	           makeNextList.appendChild(makeNextLi);
	           makeNextLi.innerHTML = "<b>"+item[k][0]+"</b> "+item[k][1];
	       }
	       var linksLi = document.createElement("li");
	       makeNextList.appendChild(linksLi);
	       makeItemControls(key, linksLi);
	    }
		switchView("1");
	}
	
	//get the img for the item
	function grabImg (tName, makeNextList) {
		var pNum;
		console.log(tName);
		switch(tName){
			case "BMX":
				pNum = "i1";
				break;
			case "Mountain":
				pNum = "i2";
				break;
			case "Cruiser":
				pNum = "i3";
				break;
			case "Road":
				pNum = "i4";
				break;
		}
		var picLi = document.createElement("li");
		makeNextList.appendChild(picLi);
		var newPic = document.createElement("div");
		var picSrc = newPic.setAttribute("class", pNum + " tilt");
		picLi.appendChild(newPic);
		
		
	}
	
	// Creates links for edit/delete items
	function makeItemControls (key, linksLi) {
		var eLink = document.createElement("a");
		eLink.href = "#";
		eLink.key = key;
		eLink.setAttribute("class", "button");
		var eText = "Edit Bike";
		eLink.addEventListener("click", editItem);
		eLink.innerHTML = eText; //not sure why we are using a variable here, seems redundant and adds one extra line of code
		linksLi.appendChild(eLink);
		var dLink = document.createElement("a");
		dLink.href = "#";
		dLink.key = key;
		dLink.setAttribute("class", "button");
		var dText = "Delete Bike";
		dLink.addEventListener("click", deleteItem);
		dLink.innerHTML = dText;
	    linksLi.appendChild(dLink);
	}
	
	//add to local storage
	function storeData (key) {
		getMarked();
		/* i have never been one to use a random number for a key without having a letter or something
		 at the front, which is why my key starts with a k. personal preference maybe, not sure but it 
		 makes more sense to me */
		var newbike;
		if (getID("submit").value == "Submit bike"){
		var uid = "k" + Math.floor(Math.random()*123456);
		newbike = true;
		} else {
			uid = key;
			newbike = false;
		}
		var bike = {};
	    bike.assembler = ["Assembler: ", getID("assembler").value];
	    bike.date = ["Date: ", getID("assdate").value];
	    bike.type = ["Type: ", getID("biketype").value];
	    bike.marked = ["Marked: ", markedVal];
	    bike.time = ["Time: ", getID("asstime").value];
	    bike.comments = ["Comments: ", getID("comments").value];
	    markedVal = "";
		localStorage.setItem(uid, JSON.stringify(bike));
		resetForm ();
		if (newbike === false) {
			showData();
		}
	}

	//edit item
	function editItem () {
		remDiv(); // removing the bikelist while editing
		var value = localStorage.getItem(this.key);
		var bike = JSON.parse(value);
		switchView("0");
		getID("assembler").value = bike.assembler[1];
		getID("assdate").value = bike.date[1];
		getID("biketype").value = bike.type[1];
		getID("asstime").value = bike.time[1];
		getID("asstext").innerHTML = bike.time[1];
		getID("comments").value = bike.comments[1];
		var marked = document.getElementsByName("bmarked");
		for (i=0;i<marked.length; i++){
			if (marked[i].value === "yes" && bike.marked[1] === "yes"){
				marked[i].checked = true;
				console.log(bike.marked + " - " + marked[i].value);
			} else if (marked[i].value === "no" && bike.marked[1] === "no"){
				marked[i].checked = true;
				console.log(bike.marked + " - " + marked[i].value);
			}
		}
		save.removeEventListener("click", checkBike);
		getID("submit").value = "Edit Bike";
		getID("h1").innerHTML = "Edit Bike";
		getID("biketype").style.border = "1px solid #626262";
		getID("assembler").style.border = "1px solid #626262";
		getID("assdate").style.border = "1px solid #626262";
		eMsg.style.border = "0px solid red";
		eMsg.innerHTML = "";
		var eSubmit = getID("submit");
		eSubmit.addEventListener("click", checkBike);
		eSubmit.key = this.key;
	}
	
	//delete item
	function deleteItem () {
		var delPrompt = confirm("Are you sure you would like to remove this entry?");
		if (delPrompt){
			localStorage.removeItem(this.key);
			alert("Entry was deleted!");
			window.location.reload();
		} else {
			alert("Entry was not deleted!");
		}
	}
	
	function checkBike (e) {
		var getAssembler = getID("assembler");
		var getDate = getID("assdate");
		var getType = getID("biketype")
		eMsg.innerHTML = "";
		getType.style.border = "1px solid #626262";
		getAssembler.style.border = "1px solid #626262";
		getDate.style.border = "1px solid #626262";
		var errorMsgs = [];
		if (getType.value === "--Select Bike Type--") {
			var typeError = "&bull; Please choose a bike type.";
			getType.style.border = "1px solid red";
			errorMsgs.push(typeError);
		}
		if (getAssembler.value === "") {
			var assError = "&bull; Please enter Assemblers name."
			getAssembler.style.border = "1px solid red";
			errorMsgs.push(assError);	
		}
		if (getDate.value === "") {
			var dateError = "&bull; Please enter a date."
			getDate.style.border = "1px solid red";
			errorMsgs.push(dateError);	
		}
		/*I don't have an email field but for practice, adding the line from the video
			var re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;			
		*/
		if (errorMsgs.length>=1) {
			for (i=0, j=errorMsgs.length; i<j; i++) {
				var txt = document.createElement("li");
				txt.innerHTML = errorMsgs[i];
				eMsg.appendChild(txt);
				eMsg.style.border = "1px solid red";
			}
			e.preventDefault();
			return false;
		} else {
			getType.style.border = "1px solid #626262";
			getAssembler.style.border = "1px solid #626262";
			getDate.style.border = "1px solid #626262";
			eMsg.style.border = "0px solid red";
			storeData(this.key);
		}
	}
	
	function popBikes () {
		for (var i in json)	{
			var uid = "k" + Math.floor(Math.random()*123456);	
			localStorage.setItem(uid, JSON.stringify(json[i]));
		}	
	}
	
	function grabDate () {
	/* i wanted my date input to pre populate with a date, but as far as i can tell 
	there isn't a preset method, so i'm working around it O_o */
	
		//months return in single digits for 1-9 but the date input uses 2 digits
		//also seems that the month is 0 based not 1 based
		var mArray = ["01","02","03","04","05","06","07","08","09","10","11","12"];
		var dArray = ["00","01","02","03","04","05","06","07","08","09","10",
					 "11","12","13","14","15","16","17","18","19","20","21",
					 "22","23","24","25","26","27","28","29","30","31"];
		var tDate = new Date()
		var m = mArray[tDate.getMonth()];
		var d = dArray[tDate.getDate()];
		//var di = getID("assdate");
		getID("assdate").value = tDate.getFullYear() + "-" + m + "-" + d;
	}
	// variables & run functions
	
	/* i'm not really sure why we are doing the select portion dynamically, as if changes needed to be made
	it would be just as simple to change the html file and if the javascript is done right, there should be no need
	for extra coding to use the new option tag. */
	var bikeTypes = [
			"--Select Bike Type--",
			"BMX",
			"Mountain",
			"Cruiser",
			"Road"
	];
	var markedVal;
	var eMsg = getID("errors");
	popType();
	grabDate();
	var displayData = getID('displayLink');
	displayData.addEventListener("click", showData);
	var clearData = getID('clear');
	clearData.addEventListener("click", dumpLocal);
	var save = getID('submit');
	save.addEventListener("click", checkBike);
	
});