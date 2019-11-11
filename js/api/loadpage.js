$(function(){
	var Url = "http://api.cheosgrid.org:8077/service/list.do";
	function getUrlParam(name){
		var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
		var r = window.location.search.substr(1).match(reg);
		if(r != null) return unescape(r[2]);
		return null;
	}
	function getID(){
		var id = getUrlParam('id');
		if(id == "0" || id == null)
			return " ";
		else
			return "&category=" + id;
	}
	
	// var id = 1;
	// $(".tag").click(function(){
	// 	id = $(this).attr('id');
	// })

	var pageList = {
	    /*页码*/
		page: 1,
		/*搜索结果个数*/
		number: 4,
		categoryID: 1,
		getRequest: function() {
			var page = arguments[0] || pageList.page;
			var number = pageList.number;
			var categoryid = pageList.categoryID || getID();
		
			$.ajax({
				url: Url + '?pageNum='+pageList.page+'&pageSize='+pageList.number,
				type: "get",
				dataType: "json",
				// data:{
				// 	pageNum: page,
				// 	pageSize: number,
				// category: id
				// },
				success: function(data){
					var pageData = data;
					var total = data.data.list;
					var pageNum = data.data.pageNum;
					var pageSize = data.data.pageSize;
					var idd = data.data.list[0].serviceId;

					//渲染页面
			    	var str = "";
					var len = data.data.list.length;
					for(var k = 0; k < len; k++) {
						var imgSrc = total[k]["serviceImg"];
						var serviceName = total[k]["serviceName"];
						var count = total[k]["userCount"];
						var level = total[k]["score"];
						str += '<li class="border-v1 pr" id="border-v1 fl " >' +
							'<a href="detail.html?id='+ idd +'" target="_blank" style="text-decoration: none;">' +
								'<img src="' + imgSrc + '"height="80px" alt="图片" title="图片" />' +
								'<h3 title="' + serviceName + '">' + serviceName + '</h3>' +
								'<p class="price-show" id="price-show"></p>' +
							'</a>' +
							'<div class="icons-div-v1 icons-div zl ">' +
							'<p class="comment1">' + count + '</p>' +
							'</div>'
						'</li>'
					}
					$("#UL").html(str);
					$.fn.raty.defaults.path = "images";
					//添加星星
					$("#UL .price-show").append( '<div  id="star"></div>').raty({score:level, readOnly:true});
					//分页
					$("#abc").pagination(data.data.total,{
						maxentries: data.data.total,
						items_per_page: number,
						num_display_entries:10,
						current_page: pageList.page-1,
						num_edge_entries:2,
						prev_text:"上一页",
						next_text:"下一页",
					});
					createPage();
				}
			
			
			})
		}
	}
	pageList.getRequest();
	//分页调整
	function createPage(){
		$("#abc").find("a").each(function(){
			$(this).click(function(){
				if($(this).text() == "上一页"){
					pageList.page -=1;
				} else if($(this).text() == "下一页") {
					pageList.page +=1;
					
				} else {
					pageList.page = $(this).text();
				}
				pageList.getRequest();
			})
		})
	}





});




	
	
	
	
	
	
	
	
	

	
           



	
//$(function() {
//	var url = "http://api.cheosgrid.org:8077/service/list.do";
//	var currentPage = 1;
//	var number = 10;
//	var pageNum = function(url, data) {
//		$("#sum").text(data);
//		$("#page").children().remove();
//		if(currentPage > 1) $("#page").append("<li><a href='" + url + "'><<</a></li>");
//		var start = 1;
//		var end = 1;
//		if(data <= 5) {
//			start = 1;
//			end = data;
//		} else if(currentPage < 4) {
//			start = 1;
//			end = 5;
//		} else if(data - currentPage < 3) {
//			start = data - 4;
//			end = data;
//		} else {
//			start = currentPage - 2;
//			end = parseInt(currentPage) + 2;
//		}
//		for(var i = start; i <= end; i++) {
//			if(i == currentPage) {
//				$("#page").append("<li><a style='background:#fba976;color:#fff;'  href='" + url + "'>" + i + "</a></li>");
//			} else {
//				$("#page").append("<li><a href='" + url + "'>" + i + "</a></li>");
//			}
//		}
//		if(currentPage < data) $("#page").append("<li><a href='" + url + "'>>></a></li>");
//		$("#page a").click(function() {
//			var page = $(this).text();
//			if(page == "<<") {
//				page = 1;
//			}
//			if(page == ">>") {
//				page = data;
//			}
//			currentPage = page;
//			console.log("当前页数:" + page);
//			pageOpera($(this).attr("href"), page);
//			returnfalse;
//		});
//	}; /*分页查询*/
//	var pageOpera = function(url, startPage){
//		$.ajax({
//			url: url,
//			type: "get",
//			dataType: "json",
//			data: {
//				"start": (startPage - 1) * number,
//				"number": number
//			},
//			success: function(data) {
//				console.log(data);
//				if(data.data.length == 0) {
//					console.log("没有分类");
//				} else {
//					$("#categoryList tr").remove();
//					for(var i = 0; i < data.data.length; i++) {
//						var name = data.data[i].name;
//						var description = data.data[i].description;
//						html = "具体数据的html";
//						$("#categoryList").append(html);
//					}
//				}
//				var count = data.size;
//				var pageCount = parseInt((count - 1) / number + 1); //alert(pageCount);     pageNum(url,pageCount);     },     error : function(data){    
//				console.log(data);
//			}
//		});
//	};
//	pageOpera(url, 1);
//})