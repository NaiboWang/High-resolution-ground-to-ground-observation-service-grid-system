$(function() {
    function getUrlParam(name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
        var r = window.location.search.substr(1).match(reg);
        if(r != null) return unescape(r[2]);
        return null;
    }
    function formatXml(xml) {
        var formatted = '';
        var reg = /(>)(<)(\/*)/g;
        xml = xml.replace(reg, '$1\r\n$2$3');
        var pad = 0;
        jQuery.each(xml.split('\r\n'), function(index, node) {
            var indent = 0;
            if (node.match( /.+<\/\w[^>]*>$/ )) {
                indent = 0;
            } else if (node.match( /^<\/\w/ )) {
                if (pad != 0) {
                    pad -= 1;
                }
            } else if (node.match( /^<\w([^>]*[^\/])?>.*$/ )) {
                indent = 1;
            } else {
                indent = 0;
            }

            var padding = '';
            for (var i = 0; i < pad; i++) {
                padding += '  ';
            }

            formatted += padding + node + '\r\n';
            pad += indent;
        });

        return formatted;
    }
    //接口URL
    var server = "http://api.cheosgrid.org:8077";
    // server = "http://api.cheosgrid.org:8077";
    var ApiUrl = server+"/service/search.do";
    var serviceId = getUrlParam("serviceId");
    var urlAdress = ApiUrl + '?serviceId=' + serviceId;

    var detailList = {

        getTitle: function() {
            //发起请求
            $.ajax({
                type: "get",
                url: urlAdress,
                dataType: "json",
                success: function(data) {
                    var status = data.status;
                    var str = "";
                    var str1 = "";
                    var optionUl = $("#optionUl");
                    if(status == 0) {
                        var categoryId = data.data.categoryId;
                        if(categoryId == 9 || categoryId == 11){
                            $("#testButton").css("display","none");
                            $("#api-detail-money").css("display","none");
                            $("#api-detail-error").css("display","none");
                            $("#email").text(data.data.email);
                            $("#finishTime").text(data.data.finishTime+"天");
                            $("#bigImg").attr("src",data.data.bigImg);
                        }else{
                            $("#emaildiv").css("display","none");
                            $("#finishtimediv").css("display","none");
                            $("#buyerEmailDiv").css("display","none");
                            $("#bigImg").css("display","none");
                            $("#loginbtn").css("tabindex","3");
                        }
                        var list = data.data.apiInfoList;
                        var imgInfo = data.data["serviceImg"];
                        $("#detail-img").attr("src", imgInfo);
                        var format = data.data.format;
                        format = format.split(',');
                        for(var t = 0;t<format.length;t++)
                            $("#format").append(`<option value="${format[t]}">${format[t]}</option>`);
                        $("#title").text(data.data.serviceName);
                        $("#sname").val(data.data.serviceName);
                        $("#serviceId").val(data.data.id);
                        $("#serviceName").text(data.data.serviceName);
                        $("#categoryName").text(data.data.categoryName);
                        $("#categoryId").val(data.data.categoryId);
                        $("#service-title").text(data.data.serviceName);
                        $("#record-value").text(data.data.categoryName);
                        $("#categoryclass").text(data.data.categoryName);
                        $("#price").text(data.data.format);
                        $("#introduction").text(data.data.introduction);
                        $("#service-intro").text(data.data.detailIntroduction);
                        $(".service-counts-data").text(data.data.commentCount);
                        $("#users").text(data.data.userCount);
                        $("#pm-login-apikey").text(data.data.enterpriseName);
                        //点击跳转
                        $("#categoryName").on('click',function(){
                            window.open("APIMarket.html?id="+ data.data.categoryId);
                        })
                        if(list.length == 0){
                            $(".testApi").css("background","lightgrey");
                            $(".testApi").attr("disabled",'disabled');
                        }else{
                            $(".testApi").click(function(){
                                window.open( "gftest.html?serviceId=" + serviceId);
                            })
                        }
                        for(var i = 0; i < list.length; i++) {
                            //加载侧栏选项
                            var optionName = list[i]["name"];
                            str += '<li class="navi-item pr">' +
                                '<h5 class="navi-title text-overflow-fix" data-service-menu="' + i + '"  data-api-menu="' + i + '" id="IPC" title="' + optionName + '">' + optionName + '</h5>' +
                                '<i></i>' +
                                '</li>'
                            optionUl.html(str);
                            //加载页面内容
                            $(".navi-item:first").addClass("active");
                            $("#detail-img").attr("alt", data.data.serviceName);
                            var itemsWrapper = $(".interface-item")
                            var mark = list[i]["mark"];
                            var desc = list[i]["description"];
                            var address = list[i]["apiUrl"];
                            var way = list[i]["apiCallWay"];
                            var callExample = list[i]["callExample"];
                            var example = list[i]["apiUrl"];
                            var outPutExample = list[i]["result"];
                            if(list[i]['returnStyle'] == "JSON"){
                                try
                                {
                                    outPutExample = JSON.stringify(JSON.parse(list[i]["result"]), null, 24);
                                }
                                catch (e)
                                {
                                }
                            }
                            else if(list[i]['returnStyle'] == "XML")//显示XML
                                outPutExample = `${formatXml(outputExample).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/ /g, '&nbsp;').replace(/\n/g,'<br />')}`;
                            // console.log(outPutExample);
                            //拼接主体结构
                            str1 += '<div class="interface-detail db clearfix" data-api-detail="' + i + '">' +
                                '<div class="interface-line clearfix">' +
                                '<span class="api-content-left title" style="color: #333; font-size:16px; font-Weight: 600;width: 100% " >' + optionName + '</span>' +
                                '</div>' +
                                '<p class="interface-line clearfix">' +
                                '<span class="api-content-left title ">标识</span>' +
                                '<span id="mark" class="api-content-right" data-api-link="3653">' + mark + '</span></p>' +
                                '<p class="interface-line clearfix">' +
                                '<span class="api-content-left title">接口描述 :</span>' +
                                '<span id="desc" class="api-content-right" data-api-link="3653">' + desc + '</span></p>' +
                                '<p class="interface-line clearfix">' +
                                '<span class="api-content-left title">接口地址 :</span>' +
                                '<span id="address" class="api-content-right" data-api-link="3653">' + address + '</span></p>' +
                                '<p class="interface-line clearfix">' +
                                '<span class="api-content-left title">请求方法 :</span>' +
                                '<span id="way" class="api-content-right" data-api-req-method="3653">' + way + '</span>' +
                                '</p>' +
                                '<p class="interface-line clearfix">' +
                                '<span class="api-content-left title">请求示例 :</span>' +
                                '<span id="example" class="api-content-right" data-api-req-method="3653">' + callExample + '</span>' +
                                '</p>' +
                                '<div class="interface-line clearfix">' +
                                '<span class="api-content-left title" style = "font-size: 17px;font-weight:600">请求参数 :</span>' +
                                '</div>' +
                                '<div class="interface-line clearfix">' +
                                '<span class="api-content-left title">系统级请求参数 :</span>' +
                                '</div>' +
                                '<div class="interface-line clearfix">' +
                                '<table>' +
                                '<thead>' +
                                '<tr>' +
                                '<th class="td-1">名称</th>' +
                                '<th class="td-2">类型</th>' +
                                '<th class="td-3">必填</th>' +
                                '<th class="td-1">示例值</th>' +
                                '<th class="td-5">描述</th>' +
                                '</tr>' +
                                '</thead>' +
                                '<tbody id="qtbody' + i + '" data-api-param="' + i + '"></tbody>' +
                                '</table>' +
                                '</div>' +
                                '<div class="interface-line clearfix">' +
                                '<span class="api-content-left title">应用级请求参数 :</span>' +
                                '</div>' +
                                '<div class="interface-line clearfix">' +
                                '<table>' +
                                '<thead>' +
                                '<tr>' +
                                '<th class="td-1">名称</th>' +
                                '<th class="td-2">类型</th>' +
                                '<th class="td-3">必填</th>' +
                                '<th class="td-1">示例值</th>' +
                                '<th class="td-5">描述</th>' +
                                '</tr>' +
                                '</thead>' +
                                '<tbody id="yytbody' + i + '" data-api-param="' + i + '"></tbody>' +
                                '</table>' +
                                '</div>'+
                                '<div class="interface-line clearfix">' +
                                '<span class="api-content-left title" style = "font-size: 17px;font-weight:600">返回参数 :</span>' +
                                '</div>' +
                                '<div class="interface-line clearfix">' +
                                '<span class="api-content-left title">系统级返回参数 :</span>' +
                                '</div>' +
                                '<div class="interface-line clearfix">' +
                                '<table>' +
                                '<thead>' +
                                '<tr>' +
                                '<th class="td-1">名称</th>' +
                                '<th class="td-2">类型</th>' +
                                '<th class="td-4">示例值</th>' +
                                '<th class="td-5">描述</th>' +
                                '</tr>' +
                                '</thead>' +
                                '<tbody id="fhtbody1' + i + '" data-api-param="' + i + '"></tbody>' +
                                '</table>' +
                                '</div>' +
                                '<div class="interface-line clearfix">' +
                                '<span class="api-content-left title">应用级返回参数 :</span>' +
                                '</div>' +
                                '<div class="interface-line clearfix">' +
                                '<table>' +
                                '<thead>' +
                                '<tr>' +
                                '<th class="td-1">名称</th>' +
                                '<th class="td-2">类型</th>' +
                                '<th class="td-4">示例值</th>' +
                                '<th class="td-5">描述</th>' +
                                '</tr>' +
                                '</thead>' +
                                '<tbody id="fhtbody2' + i + '" data-api-param="' + i + '"></tbody>' +
                                '</table>' +
                                '</div>' +
                                '<div class="interface-line clearfix clearfix">' +
                                '<span class="api-content-left title">返回示例 :</span>' +
                                '<div class="api-content-right' + i + '"><pre>' + outPutExample + '</pre></div>' +
                                '</div>' +
                                '</div>'

                            itemsWrapper.html(str1);
                            $(".interface-detail:first").siblings().css("display", "none");
                        }
                        //点击动态加载过来的展示不同的结果
                        $(".navi-item").on("click", function() {
                            $(".navi-item").removeClass("active");
                            $(this).addClass("active");
                            var tid2 = $(this).find(".navi-title").attr("data-service-menu");
                            var tid3 = $(this).find(".navi-title").attr("data-api-menu");
                            $(".interface-detail").hide();
                            $(".interface-detail[data-service-detail='" + tid2 + "']").show();
                            $(".interface-detail[data-api-detail='" + tid3 + "']").show();
                        })

                    } else {
                        $("#optionUl").html("");
                        $(".interface-detail").html("");
                    }
                }
            })
        },

        getResponse: function() {
            //系统级别的请求参数
            $.ajax({
                type: "get",
                url: urlAdress,
                dataType: "json",
                success: function(data) {
                    var status = data.status;
                    if(status == 0) {
                        var list = data.data.apiInfoList;
                        for(var i = 0; i < list.length; i++) {
                            var json = list[i];
                            var str = ("str" + i);
                            for(var j = 0; j < 1; j++) {
                                str += '<tr id="tr">' +
                                    '<td class="td-1" data-param-name>' + data.data.systemRequestParam.name + '</td>' +
                                    '<td class="td-2">string'+ '</td>' +
                                    '<td class="td-3">' + data.data.systemRequestParam.isNecessary + '</td>' +
                                    '<td class="td-5 pr">' +
                                    '' + data.data.systemRequestParam.example + '' +
                                    '</td>' +
                                    '<td class="td-1 api-param-ellipsis" >' +
                                    data.data.systemRequestParam.desc +
                                    '</td>' +
                                    '</tr>'
                                $("#qtbody" + i).html(str);
                            }
                        }
                    } else {
                        alert(data.msg);
                    }
                }
            });
            //应用级别输入参数
            $.ajax({
                type: "get",
                url: urlAdress,
                dataType: "json",
                success: function(data) {
                    var status = data.status;
                    if(status == 0) {
                        var list = data.data.apiInfoList;
                        for(var i = 0; i < list.length; i++) {
                            var json = list[i];
                            var str = ("str" + i);
                            var jsonObj =$.parseJSON(json.arguments);
                            for(var j = 0; j < jsonObj.length; j++) {
                                var paraName = jsonObj[j]["名称"];
                                var paraType = jsonObj[j]["类型"];
                                var required = jsonObj[j]["必填"];
                                var exampleValue = jsonObj[j]["示例值"];
                                var description = jsonObj[j]["描述"];
                                str += '<tr id="tr">' +
                                    '<td class="td-1" data-param-name>' + paraName + '</td>' +
                                    '<td class="td-2">' + paraType + '</td>' +
                                    '<td class="td-3">' + required + '</td>' +
                                    '<td class="td-5 pr">' +
                                    '' + exampleValue + '' +
                                    '</td>' +
                                    '<td class="td-1 api-param-ellipsis" >' +
                                    '' + description + '' +
                                    '</td>' +
                                    '</tr>'
                            }
                            $("#yytbody" + i).html(str);
                            if(jsonObj.length<=0)
                                $("#yytbody" + i).html("<tr><td>暂无</td><td>暂无</td><td>暂无</td><td>暂无</td><td>暂无</td></tr>");
                        }
                    } else {
                        alert(data.msg);
                    }
                }
            });
            //系统级返回参数
            $.ajax({
                type: "get",
                url: urlAdress,
                dataType: "json",
                success: function(data) {
                    var status = data.status;
                    if(status == 0) {
                        var list = data.data.apiInfoList;
                        for(var i = 0; i < list.length; i++) {
                            var str = '<tr><td>status</td><td class="td-2">int</td><td class="td-4">10000</td><td class="td-5 pr">返回的状态码</td></tr><tr><td>msg</td><td class="td-2">string</td><td class="td-4">请求成功</td><td class="td-5 pr">返回的结果信息</td><tr><td>data</td><td class="td-2">json</td><td class="td-4">null</td><td class="td-5 pr">返回的实际数据</td></tr></tr>'
                            $("#fhtbody1" + i).html(str);
                        }
                    } else {
                        alert(status.msg)
                    }
                }
            });
            //应用级返回参数
            $.ajax({
                type: "get",
                url: urlAdress,
                dataType: "json",
                success: function(data) {
                    var status = data.status;
                    if(status === 0) {
                        var list = data.data.apiInfoList;
                        for(var i = 0; i < list.length; i++) {
                            var json = list[i];
                            var str = "";
                            var jsonObj = $.parseJSON(json.resultArguments);
                            for(var j = 0; j < jsonObj.length; j++) {
                                var paraName = jsonObj[j]["名称"];
                                var paraType = jsonObj[j]["类型"];
                                var exampleValue = jsonObj[j]["示例值"];
                                var description = jsonObj[j]["描述"];
                                str += '<tr>' +
                                    '<td class="td-1" data-param-name>' + paraName + '</td>' +
                                    '<td class="td-2">' + paraType + '</td>' +
                                    '<td class="td-4">' + exampleValue + '</td>' +
                                    '<td class="td-5 pr">' +
                                    ''+ description +''
                                '</td>' +
                                '</tr>';
                            }
                            $("#fhtbody2" + i).html(str);
                            if(jsonObj.length<=0)
                                $("#fhtbody2" + i).html("<tr><td>暂无</td><td>暂无</td><td>暂无</td><td>暂无</td></tr>");
                        }
                    } else {
                        alert(status.msg);
                    }
                }
            });
        },

        getErrorCode: function() {
            //常用的错误码
            $.ajax({
                type: "get",
                url: urlAdress,
                dataType: "json",
                success: function(data) {
                    var status = data.status;
                    if(status == 0) {
                        var list = data.data.systemErrorCode;
                        var str = '';
                        for(var i = 0; i < list.length; i++) {
                            var code = list[i]["code"];
                            var desc = list[i]["desc"];
                            str += '<tr>' +
                                '<td class="record-col-15">' + code + '</td>' +
                                '<td class="record-col-45">' + desc + '</td>' +
                                '</tr>'
                        }
                        $("#errorBoddy").html(str);
                        if(list.length<=0)
                            $("#errorBoddy").html(`<tr><td class="record-col-15">暂无</td><td>暂无</td></tr> `);
                    } else {
                        alert("请求失败")
                    }
                }
            });

        },
        //加载sdk得内容
        getSdk: function() {
            $.ajax({
                type: "get",
                url: urlAdress,
                dataType: "json",
                success: function(data) {
                    var status = data.status;
                    if(status == 0) {
                        var list = data.data.sdkVoList;
                        var str = '';
                        for(var i = 0; i < list.length; i++) {
                            var category = list[i]["category"];
                            var detail = list[i]["detail"];
                            var createTime = list[i]["createTime"];
                            var fileName = list[i]["fileName"];
                            var linking = list[i]["url"];
                            str += '<tr>' +
                                '<td width="20%" class="col-2" >' + category + '</td>' +
                                '<td width="20%" class="col-2">' + detail + '</td>' +
                                '<td width="20%" class="col-2">' + createTime + '</td>' +
                                '<td width="20%" class="col-2">' + fileName + '</td>' +
                                '<td width="20%" class="col-2">' + linking + '</td>' +
                                '</tr>'
                            $("#js-order-list-table").html(str);
                        }
                        if(list.length <= 0)
                            $("#js-order-list-table").html("<tr><td>暂无</td><td>暂无</td><td>暂无</td><td>暂无</td><td>暂无</td></tr>");
                    } else {
                        alert("请求失败")
                    }
                }
            });
        }

    }
    detailList.getTitle();
    detailList.getResponse();
    detailList.getErrorCode();
    detailList.getSdk();

})