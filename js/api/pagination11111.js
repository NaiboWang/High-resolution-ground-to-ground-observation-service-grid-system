$(function() {

	//筛选条件
	var meigonglist = {

		search: "",
		/*关键字*/
		trade_id: 0,
		/*行业类型*/
		port_id: 0,
		/*设备类型*/
		star_id: 0,
		/*星级*/
		scene_id: 0,
		/*装修类型*/
		style_id: 0,
		/*设计风格*/
		page: 1,
		/*页码*/
		number: 20,
		/*搜索结果个数*/
		user_id: $.cookie('user_id') || 0,
		type: 0,
		/*排序方式,0为默认,1为人气优先,2为收藏最多,3为最新作品*/

		/*ajax调用接口*/
		getRequest: function() {
			var r =  '<div id="loding" style="position: fixed;top: 0;left: 0;width: 100%;height: 100%;background: rgba(0,0,0,0.6);z-index:99999;">' +
				'<img src="new/img/images/shuju.gif" style="margin: 0 auto;width: 200px;height: 100px;display: block;margin-top: 20%;" />' +
				'</div>'
			$("body").append(r);
			
            var search = meigonglist.search;
            var trade_id = meigonglist.trade_id;
            var port_id = meigonglist.port_id;
            var star_id = meigonglist.star_id;
            var scene_id = meigonglist.scene_id;
            var style_id = meigonglist.style_id;
            var page = arguments[0] || meigonglist.page;
            var number = meigonglist.number;
            var type = meigonglist.type;
            var user_id = meigonglist.user_id;
            $.ajax({
                url: ApiUrl + "cases/casus_list",
                type: "post",
                dataType: "json",
                data: JSON.stringify({
                    search: search,
                    trade_id: trade_id,
                    port_id: port_id,
                    star_id: star_id,
                    scene_id: scene_id,
                    style_id: style_id,
                    page: page,
                    number: number,
                    type: type,
                    user_id: user_id
                }),
                success: function(data) {

                    var r = template.render("cases-tmpl", data);
                    $("#meigonglist").html(r);
                    //分页
                    $(".tcdPageCode").createPage({
                        pageCount: data.count_page,
                        current: page,
                        backFn: function(p) {
                            meigonglist.getRequest(p)
                        }
                    });
                    
                }
            })
		}
	}

});