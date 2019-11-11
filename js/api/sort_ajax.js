$(function(){
	//工具方法
	var title = "";
	function getUrlParam(name) {
		var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
		var r = window.location.search.substr(1).match(reg);
		if(r != null) return unescape(decodeURI(r[2]));
		return "";
	}
	function getID() {
		var id = getUrlParam('id');
		var a = ""
		if(id == "0" || id == null || id == "")
			a =  "";
		else
			a =  "&category=" + id;
		console.log(a)
		return a
	}
	
	//加载分类列表
	function loadCategoryName(){
		$.ajax({
			type: "get",
			url: "http://api.cheosgrid.org:8077/serviceCategory/alllist.do",
			dataType: "json",
			success: function(data){
				var categoryName = data.data;
				$("#tags").append('<a href= "APIMarket.html" id="0" data-i="0"><span class="tag sel " >全部</span></a>');
				var arrays = new Array()
				arrays[0] = 0;
				for(var i = 0; i < categoryName.length; i++){
					var k = 1;
					var names = categoryName[i];
					$("#tags").append('<a id="'+ (i+k) +'" data-i="' + names["id"]  + '"><span class="tag">' + names["categoryName"] + '</span></a>');
					arrays[i+k]=names["id"];//创建一个数组储存id和data-id的对应值
				};
				//不点击只在地址栏中更改id跳转页面的样式高亮
				var dataid = getUrlParam('id');
				var datanum = 0;
				while(arrays[datanum]<dataid){
					datanum++
				}
				sessionStorage.setItem('indexNum', datanum);
				sessionStorage.setItem('data-id', dataid);
				sessionStorage.setItem('Name', $("#tags a").eq(sessionStorage.getItem('indexNum')).find('span').text());
				console.log(sessionStorage)
				
				$("#tags a").eq(getUrlParam("id")).find("span").addClass("sel");
				$("#tags a").eq(getUrlParam("id")).siblings().children("span").removeClass("sel");
				//$("#tl").text($("span.sel").text());

				//点击后样式高亮
				$("#tags a").on('click', function(){
					var i = $(this).attr("data-i");
					var j = $(this).attr("id");
					pageList.categoryID = i;
					sessionStorage.setItem('indexNum', j);
					sessionStorage.setItem('data-id', i);
					sessionStorage.setItem('Name', $(this).find("span").text());
					window.location.href = 'APIMarket.html?id=' + pageList.categoryID;
				});
				//session用来保存当前被选中标签的data-i值；修复了标签错位的问题
				if(sessionStorage.getItem('indexNum')){
					$("#tags a").find('span').removeClass('sel');
					$("#tags a").eq(sessionStorage.getItem('indexNum')).find('span').addClass('sel');
					$("#tl").text(sessionStorage.getItem('Name'));
				}else{
					$("#tags a").eq(0).find('span').addClass('sel');
				};
			}
		});
	};
	loadCategoryName();
	var Url = "http://api.cheosgrid.org:8077/service/list.do";
	var pageList = {
		/*页码*/
		page: 1,
		/*搜索结果个数*/
		number: 10,
		categoryID: 1,
		getRequest: function() {
			var page = pageList.page;
			var number = pageList.number;
			var categoryid = getID();
			url = Url + '?pageNum=' + pageList.page + '&pageSize=' + pageList.number;
			if(categoryid != null) {
				url = url  + categoryid;
			}
			console.log(url)
			$.ajax({
				url: url,
				type: "get",
				dataType: "json",
				success: function(data){
					$("#UL").empty();
					var pageData = data;
					var total = data.data.list;
					var pageNum = data.data.pageNum;
					var pageSize = data.data.pageSize;
					//渲染页面
					var str = "";
					var len = data.data.list.length;
					for(var k = 0; k < len; k++) {
						var imgSrc = total[k]["serviceImg"];
						var serviceName = total[k]["serviceName"];
						var count = total[k]["userCount"];
						var commentCount = total[k]["commentCount"];
						var level = total[k]["score"];
						var createTime = total[k]["createTime"];
						var serviceId = total[k]["serviceId"];
						
						str += '<li  class="border-v1 pr" id="border-v1 fl "  data-item="'+ serviceId +'" >' +
							'<a href="detail.html?serviceId='+ serviceId +'" onclick=setData(' + serviceId + ') target="_blank" style="text-decoration: none;">' +
							'<img src="' + imgSrc + '"height="222px""  alt="图片" title="图片" />' +
							'<h3 title="' + serviceName + '">' + serviceName + '</h3>' +
							'<p class="price-show" id="price-show" data-level="'+ level +'" ></p>' +
							'<p class="createTime">'+ createTime +'</p>'+
							'</a>' 
							// +
							// '<div class="icons-div-v1 icons-div zl ">' +
							// '<span class="comment1"><img src="images/user.png" style="margin-bottom:0;margin-right:4px" />' + count + '</span>' +
							// '<span class="commentCount"><img src="images/comment.png" style="margin-bottom:0;margin-right:4px" />'+ commentCount +'</span>'+
							// '</div>'
						'</li>'
					}
					$("#UL").html(str);
					$.fn.raty.defaults.path = "images";
					$("#UL .price-show").raty({
						score: function(){
							return $(this).attr('data-level');
						},
						readOnly: true
					});
					//分页
					if(data.data.total > 5) {
						$("#abc").css("display", "block");
						$("#abc").pagination(data.data.total, {
							maxentries: data.data.total,
							items_per_page: number,
							num_display_entries: 5,
							current_page: pageList.page - 1,
							num_edge_entries: 2,
							prev_text: "上一页",
							next_text: "下一页",
						});
						createPage();
					} else {
						$("#abc").css("display", "none");
					}
				}
			})
		}
	}
	//分页调整	
	function createPage() {
		$("#abc").find("a").each(function() {
			$(this).click(function() {
				if($(this).text() == "上一页") {
					pageList.page -= 1;
				} else if($(this).text() == "下一页") {
					pageList.page += 1;
				} else {
					pageList.page = $(this).text();
				}
				pageList.getRequest();
			})
		})
	}

	//添加搜索功能
	function doServiceSearch(){
		var keyword = getUrlParam("keyword");
		if(keyword != "" && keyword != null && keyword != undefined){
			var ApiUrl1 = 'http://api.cheosgrid.org:8077/service/list/search.do';
			$.ajax({
				type: 'get',
				url: ApiUrl1 + '?keyword=' + keyword + '?pageNum=' + pageList.page + '&pageSize=' + pageList.number,
				dataType: 'json',
				success: function(data){
					var status = data.status;
					if(status == 0) {
						$("#UL").empty();
						var pageData = data;
//						var total = data.data.list;
//						var pageNum = data.data.pageNum;
//						var pageSize = data.data.pageSize;
						var total = data.data;
						//渲染页面
						var str = "";
						for(var k = 0; k < total.length; k++) {
							var imgSrc = total[k]["serviceImg"];
							var serviceName = total[k]["serviceName"];
							var count = total[k]["userCount"];
							var commentCount = total[k]["commentCount"];
							var level = total[k]["score"];
							var createTime = total[k]["createTime"];
							var serviceId = total[k]["serviceId"];
							str += '<li class="border-v1 pr" id="border-v1 fl " >' +
								'<a href="detail.html?serviceId='+ serviceId +'"  onclick=setData(' + serviceId + ') target="_blank" style="text-decoration: none;">' +
								'<img src="' + imgSrc + '"height="222px"" alt="图片" title="图片" />' +
								'<h3 title="' + serviceName + '">' + serviceName + '</h3>' +
								'<p class="price-show" id="price-show" data-level="'+ level +'" ></p>' +
								'<p class="createTime">'+ createTime +'</p>'+
								'</a>' 
								// +
								// '<div class="icons-div-v1 icons-div zl ">' +
								// '<span class="comment1"><img src="images/user.png" style="margin-bottom:0;margin-right:4px" />' + count + '</span>' +
							    // '<span class="commentCount"><img src="images/comment.png" style="margin-bottom:0;margin-right:4px" />'+ commentCount +'</span>'+
								// '</div>'
							'</li>'
						}
						$("#UL").html(str);
						$.fn.raty.defaults.path = "images";
						$("#UL .price-show").raty({
							score: function(){
								return $(this).attr('data-level');
							},
							readOnly: true
						});
						//分页
						if(data.data.total > 5) {
							$("#abc").css("display", "block");
							$("#abc").pagination(data.data.total, {
								maxentries: data.data.total,
								items_per_page: 10,
								num_display_entries: 5,
								current_page: pageList.page - 1,
								num_edge_entries: 2,
								prev_text: "上一页",
								next_text: "下一页",
							});
							createPage1();
						} else {
							$("#abc").css("display", "none")
						}
					}
				}
			})
		} else {
			pageList.getRequest();
		}
	}
	if(getUrlParam("keyword").length >1)//如果有搜索关键字的话
		doServiceSearch();//做搜索，否则不搜索
	
	function createPage1() {
		$("#abc").find("a").each(function() {
			$(this).click(function() {
				if($(this).text() == "上一页") {
					pageList.page -= 1;
				} else if($(this).text() == "下一页") {
					pageList.page += 1;
				} else {
					pageList.page = $(this).text();
				}
				doServiceSearch();
			})
		})
	}
	
	
//重写排序功能    
	//按添加时间升序
	
	function getSortByTimeAsc(number) {
		var url = 'http://api.cheosgrid.org:8077/service/list.do';
        var categoryid = getID();
		if(categoryid != null){
			var url1 = url + '?orderBy=create_time_asc'+ categoryid +'&pageNum=' + number + '&pageSize=' + pageList.number;
		}else{
			url1 = url + '?orderBy=create_time_asc&pageNum=' + number + '&pageSize=' + pageList.number;
		}
		$.ajax({
			type: 'get',
			url: url1,
			dataType: 'json',
			success: function(data) {
				var status = data.status;
				if(status == 0) {
					$("#UL").empty();
					var pageData = data;
					var total = data.data.list;
					var pageNum = data.data.pageNum;
					var pageSize = data.data.pageSize;
					//渲染页面
					var str = "";
					var len = data.data.list.length;
					for(var k = 0; k < len; k++) {
						var imgSrc = total[k]["serviceImg"];
						var serviceName = total[k]["serviceName"];
						var count = total[k]["userCount"];
						var commentCount = total[k]["commentCount"];
						var level = total[k]["score"];
						var createTime = total[k]["createTime"];
						var serviceId = total[k]["serviceId"];
						str += '<li class="border-v1 pr" id="border-v1 fl " >' +
							'<a href="detail.html?serviceId='+ serviceId +'"  onclick=setData(' + serviceId + ') target="_blank" style="text-decoration: none;">' +
							'<img src="' + imgSrc + '"height="222px"" width="90px" alt="图片" title="图片" />' +
							'<h3 title="' + serviceName + '">' + serviceName + '</h3>' +
							'<p class="price-show" id="price-show" data-level="'+ level +'" ></p>' +
							'<p class="createTime">'+ createTime +'</p>'+
							'</a>' 
							// +
							// '<div class="icons-div-v1 icons-div zl ">' +
							// '<span class="comment1"><img src="images/user.png" style="margin-bottom:0;margin-right:4px" />' + count + '</span>' +
							// '<span class="commentCount"><img src="images/comment.png" style="margin-bottom:0;margin-right:4px" />'+ commentCount +'</span>'+
							// '</div>'
						'</li>'
					}
					$("#UL").html(str);
					$.fn.raty.defaults.path = "images";
					$("#UL .price-show").raty({
						score: function(){
							return $(this).attr('data-level');
						},
						readOnly: true
					});
					//分页
					if(data.data.total > 5) {
						$("#abc").css("display", "block");
						$("#abc").pagination(data.data.total, {
							maxentries: data.data.total,
							items_per_page: 10,
							num_display_entries: 5,
							current_page: number - 1,
							num_edge_entries: 2,
							prev_text: "上一页",
							next_text: "下一页",
						});
						createPage2(number);
					} else {
						$("#abc").css("display", "none")
					}

				}
			}
		})
	}
	$("#query_time_asc").click(function() {
		getSortByTimeAsc(1);
	});
	function createPage2(number) {
		$("#abc").find("a").each(function() {
			$(this).click(function() {
				if($(this).text() == "上一页") {
					pageList.page = number - 1;
				} else if($(this).text() == "下一页") {
					pageList.page = number + 1;
				} else {
					pageList.page = $(this).text();
				}
				getSortByTimeAsc(pageList.page);
			})
		})
	}
	

	//按添加时间降序
	function getSortByTimeDesc(number) {
		var url = 'http://api.cheosgrid.org:8077/service/list.do';
        var categoryid = getID();
		if(categoryid != null){
			var url1 = url + '?orderBy=create_time_desc'+ categoryid +'&pageNum=' + number + '&pageSize=' + pageList.number;
		}else{
			url1 = url + '?orderBy=create_time_desc&pageNum=' + number + '&pageSize=' + pageList.number;
		}
		$.ajax({
			type: 'get',
			url: url1,
			dataType: 'json',
			success: function(data) {
				var status = data.status;
				if(status == 0) {
					$("#UL").empty();
					var pageData = data;
					var total = data.data.list;
					var pageNum = data.data.pageNum;
					var pageSize = data.data.pageSize;
					//渲染页面
					var str = "";
					var len = data.data.list.length;
					for(var k = 0; k < len; k++) {
						var imgSrc = total[k]["serviceImg"];
						var serviceName = total[k]["serviceName"];
						var count = total[k]["userCount"];
						var commentCount = total[k]["commentCount"];
						var createTime = total[k]["createTime"];
						var level = total[k]["score"];
						var serviceId = total[k]["serviceId"];
						str += '<li class="border-v1 pr" id="border-v1 fl " >' +
							'<a href="detail.html?serviceId='+ serviceId +'"  onclick=setData(' + serviceId + ') target="_blank" style="text-decoration: none;">' +
							'<img src="' + imgSrc + '"height="222px"" width="90px" alt="图片" title="图片" />' +
							'<h3 title="' + serviceName + '">' + serviceName + '</h3>' +
							'<p class="price-show" id="price-show" data-level="'+ level +'" ></p>' +
							'<p class="createTime">'+ createTime +'</p>'+
							'</a>' 
							// +
							// '<div class="icons-div-v1 icons-div zl ">' +
							// '<span class="comment1"><img src="images/user.png" style="margin-bottom:0;margin-right:4px" />' + count + '</span>' +
							// '<span class="commentCount"><img src="images/comment.png" style="margin-bottom:0;margin-right:4px" />'+ commentCount +'</span>'+
							// '</div>'
						'</li>'
					}
					$("#UL").html(str);
					$.fn.raty.defaults.path = "images";
					$("#UL .price-show").raty({
						score: function(){
							return $(this).attr('data-level');
						},
						readOnly: true
					});
					//分页
					if(data.data.total > 5) {
						$("#abc").css("display", "block");
						$("#abc").pagination(data.data.total, {
							maxentries: data.data.total,
							items_per_page: 10,
							num_display_entries: 5,
							current_page: number - 1,
							num_edge_entries: 2,
							prev_text: "上一页",
							next_text: "下一页",
						});
						createPage3(number);
					} else {
						$("#abc").css("display", "none")
					}
				}
			}
		})
	}
	
	$("#query_time_desc").click(function() {
		getSortByTimeDesc(1);
	});
	function createPage3(number) {
		$("#abc").find("a").each(function() {
			$(this).click(function() {
				if($(this).text() == "上一页") {
					pageList.page = number - 1;
				} else if($(this).text() == "下一页") {
					pageList.page = number + 1;
				} else {
					pageList.page = $(this).text();
				}
				getSortByTimeDesc(pageList.page);
			})
		})
	}
	

	//按照评分降序    
	function getSortByScoreDesc(number) {
		var url = 'http://api.cheosgrid.org:8077/service/list.do';
		var categoryid = getID();
		if(categoryid != null){
			var url1 = url + '?orderBy=score_desc'+ categoryid +'&pageNum=' + number + '&pageSize=' + pageList.number;
		}else{
			url1 = url + '?orderBy=score_desc&pageNum=' + number + '&pageSize=' + pageList.number;
		}

		$.ajax({
			type: 'get',
			url: url1,
			dataType: 'json',
			success: function(data) {
				var status = data.status;
				if(status == 0) {
					$("#UL").empty();
					var pageData = data;
					var total = data.data.list;
					var pageNum = data.data.pageNum;
					var pageSize = data.data.pageSize;
					//渲染页面
					var str = "";
					var len = data.data.list.length;
					for(var k = 0; k < len; k++) {
						var imgSrc = total[k]["serviceImg"];
						var serviceName = total[k]["serviceName"];
						var count = total[k]["userCount"];
						var commentCount = total[k]["commentCount"];
						var level = total[k]["score"];
						var createTime = total[k]["createTime"];
						var serviceId = total[k]["serviceId"];
						str += '<li class="border-v1 pr" id="border-v1 fl " >' +
							'<a href="detail.html?serviceId='+ serviceId +'"  onclick=setData(' + serviceId + ') target="_blank" style="text-decoration: none;">' +
							'<img src="' + imgSrc + '"height="222px"" width="90px" alt="图片" title="图片" />' +
							'<h3 title="' + serviceName + '">' + serviceName + '</h3>' +
							'<p class="price-show" id="price-show" data-level="'+ level +'" ></p>' +
							'<p class="createTime">'+ createTime +'</p>'+
							'</a>' 
							// +
							// '<div class="icons-div-v1 icons-div zl ">' +
							// '<span class="comment1"><img src="images/user.png" style="margin-bottom:0;margin-right:4px" />' + count + '</span>' +
							// '<span class="commentCount"><img src="images/comment.png" style="margin-bottom:0;margin-right:4px" />'+ commentCount +'</span>'+
							// '</div>'
						'</li>'
					}
					$("#UL").html(str);
					$.fn.raty.defaults.path = "images";
					$("#UL .price-show").raty({
						score: function(){
							return $(this).attr('data-level');
						},
						readOnly: true
					});
					//分页
					if(data.data.total > 5) {
						$("#abc").css("display", "block");
						$("#abc").pagination(data.data.total, {
							maxentries: data.data.total,
							items_per_page: 10,
							num_display_entries: 5,
							current_page: number - 1,
							num_edge_entries: 2,
							prev_text: "上一页",
							next_text: "下一页",
						});
						createPage4(number);
					} else {
						$("#abc").css("display", "none")
					}
				}
			}
		})
	}

	function createPage4(number) {
		$("#abc").find("a").each(function() {
			$(this).click(function() {
				if($(this).text() == "上一页") {
					pageList.page = number - 1;
				} else if($(this).text() == "下一页") {
					pageList.page = number + 1;
				} else {
					pageList.page = $(this).text();
				}
				getSortByScoreDesc(pageList.page);
			})
		})
	}
	$("#query_score_asc").click(function() {
		getSortByScoreDesc(1);
	});

	//按照评分升序    
	function getSortByScoreAsc(number) {
		var url = 'http://api.cheosgrid.org:8077/service/list.do';
		var categoryid = getID();
		if(categoryid != null){
			var url1 = url + '?orderBy=score_asc'+ categoryid +'&pageNum=' + number + '&pageSize=' + pageList.number;
		}else{
			url1 = url + '?orderBy=score_asc&pageNum=' + number + '&pageSize=' + pageList.number;
		}

		$.ajax({
			type: 'get',
			url: url1,
			dataType: 'json',
			success: function(data) {
				var status = data.status;
				if(status == 0) {
					$("#UL").empty();
					var pageData = data;
					var total = data.data.list;
					var pageNum = data.data.pageNum;
					var pageSize = data.data.pageSize;
					//渲染页面
					var str = "";
					var len = data.data.list.length;
					for(var k = 0; k < len; k++) {
						var imgSrc = total[k]["serviceImg"];
						var serviceName = total[k]["serviceName"];
						var count = total[k]["userCount"];
						var commentCount = total[k]["commentCount"];
						var createTime = total[k]["createTime"];
						var level = total[k]["score"];
						var serviceId = total[k]["serviceId"];
						str += '<li class="border-v1 pr" id="border-v1 fl " >' +
							'<a href="detail.html?serviceId='+ serviceId +'"  onclick=setData(' + serviceId + ') target="_blank" style="text-decoration: none;">' +
							'<img src="' + imgSrc + '"height="222px"" width="90px" alt="图片" title="图片" />' +
							'<h3 title="' + serviceName + '">' + serviceName + '</h3>' +
							'<p class="price-show" id="price-show" data-level="'+ level +'" ></p>' +
							'<p class="createTime">'+ createTime +'</p>'+
							'</a>' 
							// +
							// '<div class="icons-div-v1 icons-div zl ">' +
							// '<span class="comment1"><img src="images/user.png" style="margin-bottom:0;margin-right:4px" />' + count + '</span>' +
							// '<span class="commentCount"><img src="images/comment.png" style="margin-bottom:0;margin-right:4px" />'+ commentCount +'</span>'+
							// '</div>'
						'</li>'
					}
					$("#UL").html(str);
					$.fn.raty.defaults.path = "images";
					$("#UL .price-show").append('<div  id="star"></div>').raty({
						score: function(){
							return $(this).attr('data-level');
						},
						readOnly: true
					});
					//分页
					if(data.data.total > 5) {
						$("#abc").css("display", "block");
						$("#abc").pagination(data.data.total, {
							maxentries: data.data.total,
							items_per_page: 10,
							num_display_entries: 5,
							current_page: number - 1,
							num_edge_entries: 2,
							prev_text: "上一页",
							next_text: "下一页",
						});
						createPage5(number);
					} else {
						$("#abc").css("display", "none")
					}
				}
			}
		})
	}

	function createPage5(number) {
		$("#abc").find("a").each(function() {
			$(this).click(function() {
				if($(this).text() == "上一页") {
					pageList.page = number - 1;
				} else if($(this).text() == "下一页") {
					pageList.page = number + 1;
				} else {
					pageList.page = $(this).text();
				}
				getSortByScoreAsc(pageList.page);
			})
		})
	}
	$("#query_score_desc").click(function() {
		getSortByScoreAsc(1);
	});
//排序点击高亮
$(".choice span").click(function(){
	$(this).addClass("current").siblings().removeClass("current");
})
    if(getUrlParam("keyword").length <1)//如果没有搜索关键字的话
    	getSortByTimeDesc(1);

//最外面的括弧
})