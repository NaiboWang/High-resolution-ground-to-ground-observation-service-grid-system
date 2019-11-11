$(function(){
	//头部悬浮
	(function(){
		var submenu = $(".has-sub-menu");
		var aLi = $(".has-sub-menu p");
		var menu_list =  $(".dropdown-menu1");
		var ev = ev || window.event;
		aLi.each(function(index){
			$(this).parent().mouseover(function(ev){
				submenu.eq(index).css("background","white");
				submenu.eq(index).addClass("box_shadow");
				menu_list.addClass("dn").eq(index).removeClass("dn");
				ev.stopPropagation();
			}).mouseout(function(){
				menu_list.addClass("dn")
				submenu.css("background","#f1f1f1");
				submenu.removeClass("box_shadow");
			})
		});
	})()
	
	
})