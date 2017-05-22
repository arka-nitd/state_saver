
var storage = chrome.storage.local;

$(".tiles").click(function(){
	var id = $(this).attr('id');
	$("#choice").hide();
	$("#action"+id).fadeIn("fast");
});

$("#savestate").click(function(){
	var value = $(this).parent().find("input:text").val();
	var body = $(this).parent().parent();
	
	var arr= new Array();
	var i=0;

	chrome.tabs.query({},function(tabs){     
		tabs.forEach(function(tab){
		  arr.push(tab.url);
		  i++;
		});

		var obj = {};
		obj[value]=arr;

		storage.set(obj, function(){
			body.hide();
			$("#status").fadeIn("medium").css("background","#1B9EC8");
			$("#statustext").text('State Saved !!');
			setTimeout(function() {window.close();},1500);
		});
	});
});


storage.get(null, function(data){
	
	var arr=[];
	$.each(data, function(k,v){
		arr.push(k);
	});
	var msg="";
	$.each(data, function(k,v){
		msg+="<li>"+k+"<button class='optionbutton delete'>Delete</button><button class='optionbutton load'>Load</button></li>";
	});
	
	$("#view ul").append(msg);
	$("#view").show();

	$(".optionbutton").click(function(){
		
		var key = $(this).parent().contents().get(0).nodeValue;
		var elem = $(this).parent();

		if($(this).hasClass('delete')){
			storage.remove(key, function(){
				console.log("State Removed");
				elem.fadeOut("fast");
			});
		}
		else if($(this).hasClass('load')){
			storage.get(key, function(data){
				chrome.windows.create({url:data[key]});
				window.close();
			});
		}
	});

	$('input[name=searchstate]').on('input',function(){
		
		var search = $(this).val();

		var matches =[];
		matches = $.grep(arr, function(str,i){
			return str.indexOf(search)>=0;

		});
		if(search!='')
		{
			$("#view").hide();
			var msg='';
			$.each(matches, function(k,v){
				msg+="<li>"+v+"<button class='optionbutton delete'>Delete</button><button class='optionbutton load'>Load</button></li>";
			});
			$("#searchview ul > li").remove();
			$("#searchview ul").append(msg);
			$("#searchview").show();
		}
		else
		{
			$('#searchview').hide();
			$("#view").show();
		}
	});

});
