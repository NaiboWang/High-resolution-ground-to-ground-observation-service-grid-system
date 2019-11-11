//ajax for APIMarket.html
//加载list列表
$.ajax({
	type: "get",
	url: "http://api.cheosgrid.org:8077/service/list.do?pageNum=1&pageSize=40",
	dataType: "json",
	success: function(data){
		var listItems = $("#border-v1");
		var str = '';
		var i = 0;
		var listItemData = data.data.list;
		for(var k = 0 ; k < listItemData.length; k++ ){
				var imgSrc = listItemData[k]["serviceImg"];
				var serviceName = listItemData[k]["serviceName"]; 
				var count = listItemData[k]["userCount"];
				var level = listItemData[k]["score"];
		str += '<li class="border-v1 pr" id="border-v1 fl " >'
					+'<a href="javascript:;" target="_blank" style="text-decoration: none;">'
						+ '<img src="' + imgSrc + '"  width="135px" height="61px" alt="图片" title="图片" />'
						+ '<h3 title="'+ serviceName +'">'+ serviceName +'</h3>'
						+ '<p class="price-show">' + level + '星  </p>'
					+'</a>'
					+'<div class="icons-div-v1 icons-div zl ">'
						+ '<p class="comment1">' + count + '</p>'
					+'</div>'
				'</li>'	
		}
		var ulWrapper = $("#UL");
		ulWrapper.append(str);
	}
})
