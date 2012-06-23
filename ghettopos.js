function setprice(itemid,price){
  inv[itemid]['price'] = price;
  updateorder(itemid,0);
}
function updateinv() {
  $.getJSON('back?cmd=inv', function(data){
    $('#cats').empty();
    //setup cats
    $.each(data[0], function(catid, cat){
	  $("<li>"+cat+"<ul id=\"cat"+catid+"\"></ul></li>").appendTo("#cats");
	});
	//setup inv
    $.each(data[1], function(itemid, item){
	  html = '<li>'+
           '<input onclick="updateorder('+itemid+',1);" type="button" value="+1" id="'+itemid+'">'+
           '<input onkeyup="setprice('+itemid+',this.value)" type="text" size="3" value="'+item['price']+'" />'+
           item['name']+
           ' :: <small>(stock: '+item['stock']+')</small>'+
           '</li>';
      $(html).appendTo("#cat"+item['cat_id']);
	  curorder[itemid] = 0;
	  updateorder(itemid,0);
	});
	inv = data[1];
  //PUT TESTING CODE HERE
  //updateorder(2,1);
  //updateorder(3,1);
  //setprice(3,0);
  //END AUTO THEY DELL ME DO THINGS AND I DONE RUNNING
  });
}

function updateorder(i,c) {
  $('#orderul').empty();
  cost = 0.0
  curorder[i] += c
  $.each(curorder, function(id, cnt){
    if (cnt != 0) {
	  cost += cnt * inv[id]['price'];
	  $('<li><input onclick="updateorder('+id+',-1);" type="button" value="-1" id="'+id+'">'+inv[id]['name']+' :: qty '+cnt+' :: $'+cnt * inv[id]['price']+'</li>').appendTo('#orderul')
	}
  });
  //if (cost) {
  $('<font size="6">Total Cost: $'+cost+'</font><input onclick="submitorder();" type="button" value="Submit!"/>').appendTo('#orderul');
  //}
}

function submitorder() {
  $.post('back?cmd=submit', {'order': curorder,'inv':inv}, function(d){
    console.log(d);
    updateinv();
  })
}

$(document).ready(function(){
  curorder = {};
  updateinv();
});
