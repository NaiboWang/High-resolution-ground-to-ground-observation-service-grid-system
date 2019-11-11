$(document).ready(function () {
    $('.addel').addel({
        classes: {
            target: 'target'
        },
        animation: {
            duration: 300
        }
    }).on('addel:delete', function (event) {

    });
    $("#img").change(function () {
        if ($("#img").val() != '') {
            document.getElementById("imgPre").src = window.URL.createObjectURL(document.getElementById("img").files.item(0));
        }
    });
    $("#imgbig").change(function () {
        if ($("#imgbig").val() != '') {
            document.getElementById("imgPost").src = window.URL.createObjectURL(document.getElementById("imgbig").files.item(0));
        }
    });
    $.get(server + "/serviceCategory/alllist.do", function (result) {
        var listItemData = result.data;
        var st = "";
        for (var k = 0; k < listItemData.length; k++) {
            // if(k!=6){
                st += `<option value="${listItemData[k].id}">${listItemData[k].categoryName}</option>`;
            // }

        }
        $("#categoryId").html(st);
    });
    if($("#categoryId").val()!=9 && $("#categoryId").val()!=11) {
        $("#emaildiv").css("display", "none");
        $("#introdiv").css("display", "none");
        $("#finishdiv").css("display", "none");
        $("#bigImg").attr("required",false);
        $("#email").attr("required",false);
        $("#finishTime").attr("required",false);
    }
    checklogin();
});

function upload2(type) {
    var st = {};
    var num = 0;
    var str = "";
    $("input[name='time[]']").each(function (e) {
        if ($(this).prop("disabled") == false) //如果被禁用了
            st[num++] = $(this).val();
        else
            st[num++] = "100000";
    });
    var i = 0;
    $("input[name='money[]']").each(function (e) {
        if ($(this).prop("disabled") == false) //如果被禁用了
            str += $(this).val() + "元/" + st[i++] + "次";
        else
            str += "0元/" + st[i++] + "次";
        if (i < num)
            str += ",";
    });

    var getinfo = "http://api.cheosgrid.org:8077/user/getUserInfo.do";
	fetch(getinfo, {
		method: "GET",
		// headers: {
		// 	'Content-Type': 'multipart/form-data'
		// },
		credentials: "include"
	}).then(res => res.text()).then(function (result) {
        result = $.parseJSON(result);
        console.log(result)
        console.log(result)
        console.log(result)
        var data = new FormData()
        data.append('swagger', document.getElementById("jsonfile").files[0])
        data.append('serviceImg', $("#serviceImg").val())
        data.append('userId', result.data.userId)
        data.append('categoryId', parseInt($("#categoryId").val()))
        
        //		console.log(JSON.stringify(data));
        var link = "http://service.cheosgrid.org:8099/v2/swagger2service";
        if (type == 0)
            link = server + "/service/update.do";
        fetch(link, {
            method: "POST",
            // headers: {
            //     'Content-Type': 'multipart/form-data'
            // },
            credentials: 'omit',
            body: data
        }).then(res => res.text()).then(function (result) {
            result = $.parseJSON(result);
            resultdata = $.parseJSON(result.Data);
            console.log(resultdata.fileName)
            var link = "http://service.cheosgrid.org:8099/v1/gencode";
            
            fetch(link, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'omit',
                body: JSON.stringify({
                    "fileName": resultdata.fileName,
                    "language": "java"
                })
            }).then(res => res.text()).then(function (result) {
                result = $.parseJSON(result);
                console.log(result)
                console.log(result.Data)

                var link = "http://service.cheosgrid.org:8099/sdk/add";
                fetch(link, {
                    method: "POST",
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    credentials: 'omit',
                    body: JSON.stringify({
                        "address": result.Data,
                        "sdkCategory": "Java",
                        "serviceId": resultdata.serviceId
                    })
                }).then(res => res.text()).then(function (result) {

                    //自動註冊服務成功之後，數據庫已經更新，此時調刷新路由的接口
                    var link="http://api.cheosgrid.org:8077/refreshRoute";
                    fetch(link,{
                        method:"GET",
                        headers:{
                            'Content-Type': 'application/json'
                        },
                        credentials:"omit"
                    }).then(res => res.text()).then(function (result) {
                        if (result=="refreshRoute") {
                            alert("服务已经添加，待管理员审核");
                            if (type != 0)
                                window.location.href = "index.html";
                        } else {
                            alert("服务添加失败");
                        }
                    });
                    });

        });
	});
});
    

}

function addcheck(type) {
    var tip = "确认要注册服务吗？";
    if (type == 0)
        tip = "确认要修改服务信息吗？";
    if (confirm(tip)) {
        //创建FormData对象
        var categoryId=$("#categoryId").val();
        //传两张图
        if((categoryId==9||categoryId==11)&&(type==1||($("#img").val() != ''&&$("#imgbig").val() != ''))){
            var data = new FormData();
            //为FormData对象添加数据
            $.each($('#img')[0].files, function (i, file) {
                data.append('uploadFile', file);
            });
            $.ajax({
                url: server + "/service/upload.do",
                type: 'POST',
                data: data,
                cache: false,
                contentType: false, //不可缺
                processData: false, //不可缺
                success: function (data) {
                    if (data.status)
                        alert(data.msg)
                    else {
                        var pimg = $("#serviceImg").val();
                        $("#serviceImg").val(data.data.uri);
                        if (type == 0)
                            $.get(server + "/service/image/delete.do?imageName=" + pimg, function (result) {});
                        //第二张
                        var data2 = new FormData();
                        //为FormData对象添加数据
                        $.each($('#imgbig')[0].files, function (i, file) {
                            data2.append('uploadFile', file);
                        });
                        $.ajax({
                            url: server + "/service/upload.do",
                            type: 'POST',
                            data: data2,
                            cache: false,
                            contentType: false, //不可缺
                            processData: false, //不可缺
                            success: function (data) {
                                if (data.status)
                                    alert(data.msg)
                                else {
                                    var pimg2 = $("#bigImg").val();
                                    $("#bigImg").val(data.data.uri);
                                    if (type == 0)
                                        $.get(server + "/service/image/delete.do?imageName=" + pimg2, function (result) {});
                                    upload2(type);
                                }
                            }
                        });
                    }
                }
            });
        }
        //只传serviceImg
        else if ((type == 1&&categoryId!=9&&categoryId!=11) ||(type == 0&&$("#img").val() != ''&&((categoryId==9||categoryId==11)&&$("#imgbig").val() == '')||(categoryId!=9&&categoryId!=11))) {
            var data = new FormData();
            //为FormData对象添加数据
            $.each($('#img')[0].files, function (i, file) {
                data.append('uploadFile', file);
            });
            $.ajax({
                url: server + "/service/upload.do",
                type: 'POST',
                data: data,
                cache: false,
                contentType: false, //不可缺
                processData: false, //不可缺
                success: function (data) {
                    if (data.status)
                        alert(data.msg)
                    else {
                        var pimg = $("#serviceImg").val();
                        $("#serviceImg").val(data.data.uri);
                        if (type == 0)
                            $.get(server + "/service/image/delete.do?imageName=" + pimg, function (result) {});
                        upload2(type);
                    }
                }
            });
        }
        //只传bigImg
        else if(type==0&&(categoryId==9||categoryId==11)&&type == 0&&$("#img").val() == ''&&type == 0&&$("#imgbig").val() != ''){
            var data = new FormData();
            //为FormData对象添加数据
            $.each($('#imgbig')[0].files, function (i, file) {
                data.append('uploadFile', file);
            });
            $.ajax({
                url: server + "/service/upload.do",
                type: 'POST',
                data: data,
                cache: false,
                contentType: false, //不可缺
                processData: false, //不可缺
                success: function (data) {
                    if (data.status)
                        alert(data.msg)
                    else {
                        var pimg = $("#bigImg").val();
                        $("#bigImg").val(data.data.uri);
                        if (type == 0)
                            $.get(server + "/service/image/delete.do?imageName=" + pimg, function (result) {});
                        upload2(type);
                    }
                }
            });
        }
        else {
            upload2(type);
        }

        return false;
    }
}

function selectid() {
    if($("#categoryId").val()==9||$("#categoryId").val()==11){
        $("#email").attr("required",true);
        $("#bigImg").attr("required",true);
        $("#finishTime").attr("required",true);
        $("#emaildiv").css("display","table");
        $("#introdiv").css("display","table");
        $("#finishdiv").css("display","table");
    }else{
        $("#bigImg").attr("required",false);
        $("#email").attr("required",false);
        $("#finishTime").attr("required",false);
        $("#emaildiv").css("display","none");
        $("#introdiv").css("display","none");
        $("#finishdiv").css("display","none");
    }
}