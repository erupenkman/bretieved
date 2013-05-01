var peopleArray = new Array();
var personDomId = 1;
var openPerson;
var NUM_FIELDS = 30;
/** Only works with dbId*/
Array.prototype.containsPerson = function ( openPerson ) {
	if(openPerson === undefined || openPerson.domId === undefined){
		return false;
	}
	for (i in this) {
		if (this[i].domId === openPerson.domId) return true;
	}
	return false;
};
Array.prototype.getPerson = function ( dbId ) {
	if(!dbId){
		return false;
	}
	for (i in this) {
		if (this[i].dbId === dbId) return this[i].dbId;
	}
};
function startSpinner(){
	$('#profile-loading').fadeIn({duration:100});
}

function stopSpinner(){
	$('#profile-loading').fadeOut({duration:100});
}

$(document).ready( function(){
	getItems();
	showItem('',new Array(NUM_FIELDS));
	search('match_all');
	$('#profile-loading').hide();
	
	$('#add-new').click( function(){
		startSpinner();
		showItem('',new Array(NUM_FIELDS));
		//unselect whatever item was selected
		setSelected(null);
		openPerson = undefined;
		stopSpinner();
	});
	$('#details').keypress(function(e){
		if(e.which === 13){
			$('#save-button').click();
		}
	});
	$('#save-button').click(function(){
		var allValues = [];
		$('#details input').each(function() { allValues.push($(this).val()) });
		var newName = $('#name').val();
		//determine wther to save or add
		if(openPerson !== undefined && peopleArray.containsPerson(openPerson)){
			//dosave
			console.log('save');
			saveItem(openPerson.dbId, openPerson.domId, newName, allValues);
		}
		else{
			addItem(newName, allValues, function(res){
				console.log(res.dbId);
				//indicate that save has happened
				var newPerson = new Person(res.dbId, newName);
				$('#' + newPerson.domId).ready( function(){
					setSelected(newPerson.domId);
				});
				openPerson = newPerson;
			});
		}
		return false;
	});
	
});

function getItems(){
	$.ajax({  
		//Get shalt have no effect and be safe to crawl
		type: "GET",  
		url: "/items",  
		dataType: 'json',
		contentType:'application/json',
		success: function (res) {
			console.log('got all');
			console.log(res);
			for(i=0; i< res.length; i++){
				 new Person(res[i]._id, res[i].name);
			}
		} ,
		error: function(res){
			console.log("lose"); 
			console.log(res);
		}
	}); 
}

function search(query){
	$.ajax({  
		//Get shalt have no effect and be safe to crawl
		type: "GET",  
		url: "/search/" + query,  
		dataType: 'json',
		contentType:'application/json',
		success: function (res) {
			console.log('search done');
			console.log(res);
		} ,
		error: function(res){
			console.log("lose"); 
			console.log(res);
		}
	}); 
}
function showItem(name, details){

	$('#details').empty();
	for(i=0; i< details.length; i++){
		var template = $('#person-details-tpl').html();
		var html = Mustache.to_html(template, {'value': details[i]});
		var editForm = $('#details');
		editForm.append(html);
	}
	$('#name').val(name);
}
function editItem(person){
	$.ajax({  
		//Get shalt have no effect and be safe to crawl
		type: "GET",  
		url: "/items/" + person.dbId,  
		dataType: 'json',
		contentType:'application/json',
		beforeSend: function() {
			startSpinner();
		},
		complete: function(){
			stopSpinner();
		},
		success: function (res) {
			showItem(res.name, res.detail);
			setSelected(person.domId);
			openPerson = person;
		} ,
		error: function(res){
			console.log("lose"); 
			console.log(res);
		}
	}); 
}

function saveItem(dbId, domId, name, detail){
	$.ajax({  
		//put idempotently just updeates the details to match.. 
		//what about race conditions eru?
		// we don't care about race condition toothy, this is a single user webapp
		type: "PUT",  
		url: "/items/" + dbId,  
		data:  JSON.stringify({name: name, detail: detail}),  
		dataType: 'json',
		contentType:'application/json',
		beforeSend: function() {
			startSpinner();
		},
		complete: function(){
			stopSpinner();
		},
		success: function (res) {
			$('#name-' + domId).text(name)
				.attr('title', name);
			console.log("savid" + dbId); 
		} ,
		error: function(res){
			console.log("lose"); 
			console.log(res);
		}
	}); 
}

function addItem(name, detail, onSuccess){
	console.log('adding ' + name);
	$.ajax({  
		type: "POST",  
		url: "/add",  
		data:  JSON.stringify({name: name, detail: detail}),  
		dataType: 'json',
		contentType:'application/json',
		beforeSend: function() {
			startSpinner();
		},
		complete: function(){
			stopSpinner();
		},
		success: function (res) {
			onSuccess(res);
			console.log("added" + name); 
		} ,
		error: function(res){
			console.log("lose"); 
			console.log(res);
		}
	});  
}

function setSelected(domId){
	$('#listboxul li').removeClass('selected');
	$('#' + domId).addClass('selected');
}

Person = function(id, name){
	this.dbId = id;
	this.domId = personDomId;
	var self = this;
	
	var template = $('#person-tpl').html();
	var html = Mustache.to_html(template, {'domId': personDomId, 'name':name, 'img' : personDomId});
	var peopleList = $('#listboxul');
	peopleList.prepend(html);
	personDomId += 1;
	
	peopleList.ready( function(e){
		$('#' + self.domId).click(function(e){
			editItem(self);
		});
	});
	
	peopleArray.push(this);
};