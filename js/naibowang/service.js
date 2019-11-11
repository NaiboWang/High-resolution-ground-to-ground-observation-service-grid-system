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
    $("#emaildiv").css("display", "none");
    $("#introdiv").css("display", "none");
    $("#finishdiv").css("display", "none");
    $("#bigImg").attr("required",false);
    $("#email").attr("required",false);
    $("#finishTime").attr("required",false);
    checklogin();
});

function upload(type) {
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
    var data = {
        id: parseInt($("#serviceId").val()),
        serviceName: $("#serviceName").val(),
        categoryId: parseInt($("#categoryId").val()),
        price: parseFloat($("#price").val()),
        format: str,
        introduction: $("#introduction").val(),
        detailIntroduction: $("#detailIntroduction").val(),
        serviceImg: $("#serviceImg").val(),
        email: $("#email").val(),
        bigImg: $("#bigImg").val(),
        finishTime:parseInt($("#finishTime").val())
    };
    if($("#is_Offline").val()=='false'){
        data.email=null;
        data.bigImg=null;
        data.finishTime=null;
    }
    //		console.log(JSON.stringify(data));
    var link = server + "/service/add.do";
    if (type == 0)
        link = server + "/service/update.do";
    fetch(link, {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify(data)
    }).then(res => res.text()).then(function (result) {
        result = $.parseJSON(result);
        console.log(data)
        console.log(result)
        console.log(result.status)
        console.log(result.msg)
        if (result.status) {
            alert(result.msg);
        } else {
            alert(result.msg);
            if (type != 0)
                window.location.href = "index.html";
        }
    });

}

function addcheck(type) {
    var tip = "确认要注册服务吗？";
    if (type == 0)
        tip = "确认要修改服务信息吗？";
    console.log($("#is_Offline").val())
    if (confirm(tip)) {
        //创建FormData对象
        var categoryId=$("#categoryId").val();
        //传两张图
        if($("#is_Offline").val()=='true'&&(type==1||($("#img").val() != ''&&$("#imgbig").val() != ''))){//注册线下服务
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
                    if (data.status){
                        alert(data.msg)
                    }
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
                                    upload(type);
                                }
                            }
                        });
                    }
                }
            });
        }
        //需要修改serviceImg                              
        else if ((type == 1&&$("#is_Offline").val()=='false') ||(type == 0&&$("#img").val() != ''&&(($("#is_Offline").val()=='true'&&$("#imgbig").val() == '')||$("#is_Offline").val()=='false'))) {
            var data = new FormData();
            //为FormData对象添加数据
            $.each($('#img')[0].files, function (i, file) {
                data.append('uploadFile', file);
            });
            console.log(data)
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
                        upload(type);
                    }
                }
            });
        }
        //只传bigImg 线下服务
        else if(type==0&&$("#is_Offline").val()=='true'&&type == 0&&$("#img").val() == ''&&type == 0&&$("#imgbig").val() != ''){
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
                        upload(type);
                    }
                }
            });
        }
        else {
            upload(type);
        }

        return false;
    }
}

function selectid() {
    $.get(server + "/serviceCategory/isOffline.do?categoryId=" + $("#categoryId").val(), function (result1){
        $("#is_Offline").val(result1.data);
    if($("#is_Offline").val()=='true'){
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
});
}