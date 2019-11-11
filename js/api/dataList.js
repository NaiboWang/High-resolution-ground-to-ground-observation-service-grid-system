$(function(){
function getUrlParam(name) {
            var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); 
            var r = window.location.search.substr(1).match(reg); 
            if (r != null) return unescape(r[2]); return null; 
        }
function getID() {
           var id = getUrlParam('id');
           if(id == "0" || id == null)
           		return " " ;
           	else
           		return "&category="+id;
       }
//加载分类列表
function loadCategoryName(){
	$.ajax({
	type:"get",
	url:"http://api.cheosgrid.org:8077/serviceCategory/alllist.do",
	dataType: "json",
	success: function(data){
			var categoryName = data.data;
			$("#tags").append('<a href= "APIMarket.html"><span class="tag sel ">全部</span></a>');
			for(var i = 0; i < categoryName.length; i++ ){
				var spans = categoryName[i];
				$("#tags").append('<a href= "APIMarket.html?id='+spans["id"]+'" style="color:#666666;"><span class="tag" id="' + spans["id"] + '">' + spans["categoryName"] + '</span></a>');
			}
			//loadList();
	}
    });
};
loadCategoryName();

//点击展示对应项的内容	
function loadList(){
		$.ajax({
			type: "get",
			url: "http://api.cheosgrid.org:8077/service/list.do?pageNum=1&pageSize=40"+getID(),
			dataType: "json",
			success: function(data){
				var listItems = $("#border-v1");
				var str = '';
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
		});
}






})