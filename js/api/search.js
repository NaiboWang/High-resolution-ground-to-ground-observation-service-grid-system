$(function() {
    // $(".indexlink").click(function () {//index target
		// window.location = "index.html";
    // })
	/* index页面的查询功能**/
	function indexSearch(){
		var ApiUrl = 'http://api.cheosgrid.org:8077/service/list/search.do';
		var keyWord = $("#header-srch").val();
		if(keyWord != "") {
			$.ajax({
				type: "get",
				url: ApiUrl,
				data: {
					"keyword": keyWord
				},
				dataType: "json",
				success: function(data) {
					if(status == 0 && data.data.length > 0) {
						window.location.href = "APIMarket.html?keyword=" + keyWord;
					} else {
						alert("您查询的服务不存在或尚未上架");
					}
				}
			});
		} else {
			alert("请输入您要查询的内容");
		}
	}
	$("#header-srch-btn").click(function() {
		indexSearch();
	})
	//捕获回车键
	 $('#header-srch').bind('keydown',function(e){
        if(e.keyCode==13){
            indexSearch();
        }
    });
	
	//APIMarket.html页面的搜索功能 其他暂时不移植
	function ApiMarketSearch(){
		var ApiUrl = 'http://api.cheosgrid.org:8077/service/list/search.do';
		var keyWord = $("#keyword").val();
		if(keyWord != "") {
			$.ajax({
				type: "get",
				url: ApiUrl,
				data: {
					"keyword": keyWord
				},
				dataType: "json",
				success: function(data) {
					if(status == 0 && data.data.length > 0) {
						window.open("APIMarket.html?keyword=" + keyWord);
					} else {
						alert("您查询的服务不存在或尚未上架");
					}
				}
			});
		} else {
			alert("请输入您要查询的内容");
		}
	}
	$(".dib .head-search-btn").click(function() {
		ApiMarketSearch()
	})
	//捕获回车键
	 $('#keyword').bind('keydown',function(e){
        if(e.keyCode==13){
           ApiMarketSearch()
        }
   });
	//最外面	的括号了
});