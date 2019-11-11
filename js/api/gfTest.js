$(function() {
	//得到地址栏里面的参数值 用这个来跳页面
	function getUrlParam(name) {
		var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
		var r = window.location.search.substr(1).match(reg);
		if(r != null) return unescape(r[2]);
		return "";
	}
	//总的调用接口
	var ApiUrl = 'http://api.cheosgrid.org:8077/service/search.do';
	//点击测试功能从这里开始
	var formList = {
		//得到地址栏中的serviceId值
		serviceId: getUrlParam("serviceId"),
		//获取对应的option选项并切换参数
		getOptions: function() {
			var serviceId = formList.serviceId;
			if(serviceId != '' && serviceId != null) {
				url1 = ApiUrl + '?serviceId=' + serviceId;
				// console.log(url1);
			}
			$.ajax({
				type: "get",
				url: url1,
				datType: "json",
				success: function(data) {
					$("#categoryName1").text(data.data.serviceName);
					var list = data.data.apiInfoList;
					//加载对应的option					
					for(var i = 0; i < list.length; i++) {
						var optionName = list[i]["name"];
						$("#endpointName").append('<option value=' + i + ' data-value="' + list[i].id + '"  >' + optionName + '</option>');
                        var apiCallWay = list[i].apiCallWay;
                        apiCallWay = apiCallWay.split(" ");
                        var apicall = apiCallWay[1];
						$("#interface-wrapper").append(`<input type="hidden" id="apiurl${list[i].id}" value="${list[i].apiUrl}"><input type="hidden" id="apicall${list[i].id}" value="${apicall}">`);
					}
					//切换option
					$("select#endpointName").on("change", function() {
						$(".testLeft ul.endpointData").hide();
						var value = this.options[this.options.selectedIndex].value
						if(value) {
							$(".endpointData[data-input-detail=" + value + "]").show().not($(".endpointData[data-input-detail=" + value + "]")).hide();
						}
					})
				}
			});
		},
		//获取列表
		getForm: function() {
			//获得对应的serviceId
			var serviceId = formList.serviceId;
			if(serviceId != null && serviceId != "" && serviceId != "undefined") {
				url1 = ApiUrl + '?serviceId=' + serviceId;
			}
			$.ajax({
				type: "get",
				url: url1,
				dataType: "json",
				success: function(data) {
					var list = data.data.apiInfoList;
					for(var i = 0; i < list.length; i++) {
						var ApiUrl = list[i]["apiUrl"];
						var json = list[i];
						var str = '';
						var form = $("#form-7727");
                        var apiCallWay = list[i].apiCallWay;
                        apiCallWay = apiCallWay.split(" ");
                        var apicall = apiCallWay[1];
						// var arrData = json.arguments.replace(/\\/g, '');
						var jsonObj = $.parseJSON(json.arguments);
						str += '<ul id="ul' + i + '" class="endpointData clearfix" data-input-detail="' + i + '" >' +
							'<form id="form-' + i + '" enctype="multipart/form-data" method="post">' +
							'<input type="hidden" id="name_0" name="queryUIs[0].queryName" value="city"><li name="queryItem" index="0">' +
							'<span class="tt" style="white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">apiKey ：</span>' +
							'<div class="con" >' +
							'<p class="fl">' +
							'<input type="text" class="inputMode api'+list[i]["id"]+'" name="apiKey"  value="'+getUrlParam("apikey")+'" condition="Required">' +
							'</p>' +
							'<div class="help-tip">' +
							'<a href="#" class="sp-icon" id="help"></a>' +
							'<div class="caption-item dn ">' +
							'<p>输入您的apiKey（apiKey请在购买页面购买后，通过后台查看）。</p>' +
							'<i class="sp-icon"></i>' +
							'</div>' +
							'</div>' +
							'<input type="hidden" id="condition_0" name="queryUIs[0].queryCondition" value="Required">' +
							'</div>' +
							'</li>' +
							'</form>' +
							'</ul>';
						for(var j = 0; j < jsonObj.length; j++) {
							var paraName = jsonObj[j]["名称"];
							var exampleValue = jsonObj[j]["示例值"];
							var description = jsonObj[j]["描述"];
							str += '<ul id="ul' + i + '" class="endpointData clearfix" data-input-detail="' + i + '" >' +
								'<form id="form-' + i + '" enctype="multipart/form-data" method="post">' +
								'<input type="hidden" id="name_0" name="queryUIs[0].queryName" value="city"><li name="queryItem" index="0">' +
								'<span class="tt" style="white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">' + paraName + ' ：</span>' +
								'<div class="con" >' +
								'<p class="fl">' +
								'<input type="text" class="inputMode api'+list[i]["id"]+'" name="'+paraName+'" data-name="' + exampleValue + '"  value="' + exampleValue + '" condition="Required">' +
								'</p>' +
								'<div class="help-tip">' +
								'<a href="#" class="sp-icon" id="help"></a>' +
								'<div class="caption-item dn ">' +
								'<p>' + description + '</p>' +
								'<i class="sp-icon"></i>' +
								'</div>' +
								'</div>' +
								'<input type="hidden" id="condition_0" name="queryUIs[0].queryCondition" value="Required">' +
								'</div>' +
								'</li>' +
								'</form>' +
								'</ul>';
						}
						$(".title1").after(str);
						$(".testLeft ul.endpointData").hide();
						$(".testLeft #ul0").css("display", "block");
					}
				}
			});
		},
		getClick: function() {
			var serviceId = formList.serviceId;
			if(serviceId != null && serviceId != "" && serviceId != "undefined") {
				url1 = ApiUrl + '?serviceId=' + serviceId;
			}
			$("#testBtn").on('click', function() {
				$("#urlText").html("");
				$("#testResult").html("");
                var apiid = $("#endpointName").find("option:selected").attr("data-value");
				$("#testBtn").html("请求中...").css("background", "gray");
				$("#testBtn").attr("disabled", "disabled");
				var param = {};
				// var count=0;
				// for(var i in param.buttons){
				// 	count++;
				// }
				// if(count==1){
				// 	console.log("一个");
				// }
                var request = $("#apiurl"+apiid).val();
                var count=0;
                var tempparam={};
                var apikey={};
                $(".api"+apiid).each(function (e,s) {
					count++;
					if(count==1){
						apikey=s.value;
					}
					tempparam=s.value;
				})
				var isJson=false;
				if(count==2){
					try{
						JSON.parse(tempparam);
						isJson=true;
					}catch (e) {
						console.log(e);
						isJson=false;
					}

				}
				if(isJson==true){
					param=tempparam;
					if($("#apicall"+apiid).val() == "GET"){
						var tempcount=0;
						for(var p in param){
							if(tempcount==0){
								request+='?${p}=${param[p}';
							}else{
								request+='&${p}=${param[p}';
							}
							tempcount++;
						}
						$("#urlText").html(request);
						$.ajax(
							{ url: $("#apiurl"+apiid).val(),type:$("#apicall"+apiid).val(),data:param,
								// dataType: 'JSON',//here
								dataType:'JSON',

								success: function(result){
									$("#testResult").html(JSON.stringify(result,null,6));//跨域问题需要解决
								},
								error:function (e) {
									$("#testResult").html("请输入正确的参数。");//跨域问题需要解决
								}
							}
						);
					}else{
						var myurl=$("#apiurl"+apiid).val()+'?apiKey='+apikey;
						$("#urlText").html(myurl);
						$.ajax(
							{ url:myurl ,type:$("#apicall"+apiid).val(),data:param,
								// dataType: 'JSON',//here
								dataType:'JSON',
								contentType:'application/json',
								success: function(result){
									$("#testResult").html(JSON.stringify(result,null,6));//跨域问题需要解决
								},
								error:function (e) {
									$("#testResult").html("请输入正确的参数。");//跨域问题需要解决
								}
							}
						);
					}
				}else{
					if($("#apicall"+apiid).val() == "GET"){
						$(".api"+apiid).each(function (e,s) {
							param[s.name] = s.value;
							if(e == 0){
								request+=`?${s.name}=${s.value}`;
							}
							else{
								request+=`&${s.name}=${s.value}`;
							}
						})
						$("#urlText").html(request);
						$.ajax(
							{ url: $("#apiurl"+apiid).val(),type:$("#apicall"+apiid).val(),data:param,
								// dataType: 'JSON',//here
								dataType:'JSON',

								success: function(result){
									$("#testResult").html(JSON.stringify(result,null,6));//跨域问题需要解决
								},
								error:function (e) {
									$("#testResult").html("请输入正确的参数。");//跨域问题需要解决
								}
							}
						);
					}
					else{
						$(".api"+apiid).each(function (e,s){
							// if(e!=0){
							param[s.name] = s.value;
							// }
						})
						var myurl=$("#apiurl"+apiid).val()+'?apiKey='+apikey;
						$("#urlText").html(myurl);
						$.ajax(
							{ url: myurl,type:$("#apicall"+apiid).val(),data:JSON.stringify(param),
								// dataType: 'JSON',//here
								dataType:'JSON',
								contentType:'application/json',
								success: function(result){
									$("#testResult").html(JSON.stringify(result,null,6));//跨域问题需要解决
								},
								error:function (e) {
									$("#testResult").html("请输入正确的参数。");//跨域问题需要解决
								}
							}
						);
					}

				}


                $("#testBtn").html("点击测试").css("background", "#00ABFF");
                $("#testBtn").removeAttr("disabled");
			})
		}

	//formList结束
	}
	formList.getForm();
	formList.getOptions();
	formList.getClick();
})