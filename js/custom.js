/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


/*$.ajax({url: "\topics.json", success: function (data) {
        var obj = JSON.parse(data);
    }});*/

var fileUrls = {'menu': 'topics.json'};
var $menuItems;


$(document).ready(function(){
    $.ajax({
    	url: './js/'+fileUrls['menu'],
    	dataType: 'json',
    	success: function(data){
    		var $menu = $("#menu");
		    $.each(data, function (i, item) {
		    	var elem = makeMenu(item)
		        $menu.append(elem);
		    });
		    $menuItems = $("#menu li");
		    $menu.children('li').first().trigger('click');
    	}
    });
});

//search functionality
$(document).on('keyup', '#search', function(e){
	var inputVal = $(this).val().trim();
	if (inputVal == '' || inputVal.length == 1) {
		$("#menu").show();
		$("#hiddenMenu").hide();
		return false;
	}
	var $appendElements;
	$("#menu").hide();$("#hiddenMenu").empty();
	$menuItems.each(function(i, elem){
		var hasKeyword = (typeof $(elem).data('keywords') !== 'undefined') ? true : false;
		var hasSubmenu = ($(elem).find('ul').length > 0) ? true : false;
		var keywordValue = $(elem).data('keywords');
		var contentText = $(elem).children('a').text();
		if (!hasSubmenu) {
			if ((hasKeyword && keywordValue.toLowerCase().indexOf(inputVal.toLowerCase()) > -1) || contentText.toLowerCase().indexOf(inputVal.toLowerCase()) > -1) {
				$("#hiddenMenu").append($(elem).clone());
			}
		}
	});
	$("#hiddenMenu").show();
});


$(document).on('click', '.mainLink, .subLinks, .mainNode', function(e){
	if (typeof $(this).children('a').data('content') === 'undefined') {
		return false;
	}
	$('.mainLink, .subLinks').removeClass('selected');
	var $element = $(this);
	var isSubItem = ($element.attr('class') == 'subLinks') ? true : false;
	var contentJsonFile = $element.children('a').data('content');
	var contentUrl = './js/'+contentJsonFile;
	$.ajax({
		url: contentUrl,
		dataType: 'json',
		beforeSend: function(){
			$("#content").html("Loading....");
		},
		success: function(data){
			var content = "<div class='content-title'><h1>"+data.title+"</h1></div>";
			content += "<div class='textContent'>"+data.content.replace(/\n/g, "<br />")+"</div>";
			if (typeof data.notes !== 'undefined') {
				content += "<div class='notes' style='margin-top:10px;'>*"+data.notes.replace(/\n/g, "<br />")+"</div>";
			}
			if (isSubItem) {
				console.log($element.parent('ul').parent('li'));
				$(".mainNode").html("<a href='javascript:void(0)'>"+$element.parent('ul').parent('li').children('a').text()+"</a>");
				$(".subNode").addClass('active').html($element.children('a').text()).show();
			}else{
				$(".mainNode").addClass('active').html($element.children('a').text());
				$(".subNode").hide();
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
    					'data-keywords': item.keywords
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