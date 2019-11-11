$(function() {
	//得到地址栏里面的参数值 用这个来跳页面
	function getUrlParam(name) {
		var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
		var r = window.location.search.substr(1).match(reg);
		if(r != null) return unescape(r[2]);
		return "";
	}
	//总的调用接口
	var ApiUrl = 'http://service.cheosgrid.org:8089/service';
	//点击测试功能从这里开始
	var formList = {
		//得到地址栏中的serviceId值
		apiId: getUrlParam("apiId"),
		//获取对应的option选项并切换参数
		getOptions: function() {
			var apiId = formList.apiId;
			$("#apiId").val(apiId);
			console.log(apiId);
		},
		//获取列表
		getForm: function() {

		},
		getClick: function() {
			$("#testBtn1").on('click', function() {
                var url1 = ""
                //获得对应的serviceId
                if(apiId != '' && apiId != null) {
                    url1 = ApiUrl + '?api_id=' + $("#apiId").val();
                    console.log(url1);
                }
				var url = ""
                $.ajax({
                    type: "get",
                    url: url1,
                    dataType: "json",
                    success: function(data) {
                    	console.log(data.data.api_description)
                        $("#apidesc").val(data.data.api_description);
                        $("#apiname").val(data.data.api_name);
                        $("#apiurl").val(data.data.api_url);
                        url = "http://service.cheosgrid.org:8089/call_service/"+$("#apiId").val();
                        // $("#apiurl").val("222");
                        $("#urlText").html("");
                        $("#testResult").html("");
                        $("#testBtn").html("请求中...").css("background", "gray");
                        $("#testBtn").attr("disabled", "disabled");
                        var request = url;
                        console.log(request);
                        $("#urlText").html(request);
                        $.ajax(
                            { url: url,type:"get",
                                dataType: 'JSON',//here
                                success: function(result){
                                    $("#testResult").html(JSON.stringify(result,null,6));//跨域问题需要解决
                                },
                                error:function (e) {
                                    $("#testResult").html("请输入正确的参数。");//跨域问题需要解决
                                }
                            }
                        );
                        $("#testBtn").html("点击测试").css("background", "#00ABFF");
                        $("#testBtn").removeAttr("disabled");
                    }
                });


			})
		}

	//formList结束
	}
	// formList.getForm();
	formList.getOptions();
	formList.getClick();
})