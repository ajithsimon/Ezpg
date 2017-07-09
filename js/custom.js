/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


/*$.ajax({url: "\topics.json", success: function (data) {
        var obj = JSON.parse(data);
    }});*/

var fileUrls = {'menu': 'topics.json'};

$(document).ready(function(){
    $.ajax({
    	url: './js/'+fileUrls['menu'],
    	dataType: 'json',
    	success: function(data){
    		var $menu = $("#menu");
		    $.each(data, function (i, item) {
		        $menu.append(
		            makeMenu(item)
		        );
		    });
		    $menu.children('li').first().addClass('selected').trigger('click');
    	}
    });
});

$(document).on('click', '.mainLink, .subLinks', function(e){
	if (typeof $(this).children('a').data('content') === 'undefined') {
		return false;
	}
	$('.mainLink, .subLinks').removeClass('selected');
	var $element = $(this);
	var contentUrl = './js/'+$element.children('a').data('content');
	$.ajax({
		url: contentUrl,
		dataType: 'json',
		beforeSend: function(){
			$("#content").html("Loading....");
		},
		success: function(data){
			var content = "<div class='textContent'>"+data.content.replace(/\n/g, "<br />")+"</div>";
			if (typeof data.notes !== 'undefined') {
				content += "<div class='notes' style='margin-top:10px;'>*"+data.notes.replace(/\n/g, "<br />")+"</div>";
			}
			$("#content").html(content);
			$element.addClass('selected');
		}
	});
});

function makeMenu(item, isSubItem){
	var hasSubItem = (typeof item.subItems !== 'undefined') ? true : false;
    var menuItem = $("<li>",{
    					class: (typeof isSubItem === 'undefined') ? 'mainLink' : 'subLinks',
    				}).append(
				        $("<a>", {
				            href: 'javascript:void(0)',
				            html: item.title,
				            'data-content': item.contentFile,
	           				'data-keywords': item.keywords,
	           				class: 'nav-link'
				        })
			        );
        if (hasSubItem) {
            var subList = $("<ul>");
            $.each(item.subItems, function (i, subItem) {
                subList.append(makeMenu(subItem, true));
            });
            menuItem.append(subList);
        }
        return menuItem;
}