$(document).ready(function () {
    checklogin();
    $('.addel').addel({
        classes: {
            target: 'target'
        },
        animation: {
            duration: 300
        }
    }).on('addel:added', function (event) {
        $("select[name='type[]']").val("string");
        $("select[name='musttype[]']").val("是");
    });
    $('.addel2').addel({
        classes: {
            target: 'target'
        },
        animation: {
            duration: 300
        },
    }).on('addel:added', function (event) {
        $("select[name='type2[]']").val("string");//绑定默认选择项
    });
    $('.addel3').addel({
        classes: {
            target: 'target'
        },
        animation: {
            duration: 300
        }
    }).on('addel3:delete', function (event) {

    });
});

function addcheck(type) {
    var tip = "确认要添加API吗？";
    if (type == 0)
        tip = "确认要修改API信息吗？";
    if (confirm(tip)) {
        var num = $("input[name='name[]']").length;
        var i = 0;
        var argu = new Array();
        for (i = 0; i < num; i++) {
            if ($("input[name='name[]']")[i].disabled == true)
                break;
            var ar = {
                "名称": $("input[name='name[]']")[i].value,
                "类型": $("select[name='type[]']")[i].value,
                "必填": $("select[name='musttype[]']")[i].value,
                "示例值": $("input[name='example[]']")[i].value,
                "描述": $("input[name='descip[]']")[i].value
            };
            argu.push(ar);
        }
        var arg = JSON.stringify(argu);
        num = $("input[name='name2[]']").length;
        var argu2 = new Array();
        for (i = 0; i < num; i++) {
            if ($("input[name='name2[]']")[i].disabled == true)
                break;
            var ar = {
                "名称": $("input[name='name2[]']")[i].value,
                "类型": $("select[name='type2[]']")[i].value,
                "示例值": $("input[name='example2[]']")[i].value,
                "描述": $("input[name='descip2[]']")[i].value
            };
            argu2.push(ar);
        }
        var arg2 = JSON.stringify(argu2);
        num = $("input[name='wrongnum[]']").length;
        var argu3 = new Array();
        for (i = 0; i < num; i++) {
            if ($("input[name='wrongnum[]']")[i].disabled == true)//addel控件空值判定
                break;
            var ar = {
                "错误码": $("input[name='wrongnum[]']")[i].value,
                "说明": $("input[name='wrongdes[]']")[i].value
            };
            argu3.push(ar);
        }
        var arg3 = JSON.stringify(argu3);
        var apiCallWay = $("#linkmethod").val() + " " + $("#apiCallWay").val();
        var data = {
            serviceId: parseInt($("#serviceId").val()),
            name: $("#apiname").val(),
            mark: $("#mark").val(),
            apiAddress: $("#apiAddress").val(),
            path: $("#path").val(),
            // stripPrefix: parseInt($("#stripPrefix").val()),
            description: $("#description").val(),
            apiCallWay: apiCallWay,
            apiIntroduction: $("#apiIntroduction").val(),
            arguments: arg,
			appKey:$("#keyapp").val(),
            callLimit: parseInt($("#callLimit").val()),
            callIpLimit: parseInt($("#callIpLimit").val()),
            resultArguments: arg2,
            errorCode: arg3,
            callExample: $("#callExample").val(),
            returnStyle: $("#returnStyle").val(),
            result: $("#rresult").val(),
            id:parseInt($("#apiId").val())
        };
        // console.log(JSON.stringify(data));
        var links = server + "/api/manage/add.do";
        if (type == 0)
            links = server + "/api/manage/update.do";
        fetch(links, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include',
            body: JSON.stringify(data)
        }).then(res => res.text()).then(function (result) {
            result = $.parseJSON(result);
            if (result.status) {
                alert(result.msg);
            } else {
                alert(result.msg);
                if (type == 0)
                    window.location.reload();
                else
                    window.location.href = "apimanageothers.html?id=" + sid;
            }
        })
    }

    return false;
};