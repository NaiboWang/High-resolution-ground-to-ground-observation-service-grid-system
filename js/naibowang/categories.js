$(document).ready(function () {

    $.get(server + "/serviceCategory/listparent.do", function (result) {
		console.log(result)
		var listItemData = result.data;
        var st = "";
        for (var k = 0; k < listItemData.length; k++) {
            // if(k!=6){
                st += `<option value="${listItemData[k].id}">${listItemData[k].name}</option>`;
            // }

        }
		$("#pcategoryId").html(st);
    });
    checklogin();
});

function upload(type) {
	var st = {};
	var num = 0;
	var str = "";
	
	
	var data = {
//		id: parseInt($("#serviceId").val()),
        //httpSession:0,
		categoryName: $("#categoryName").val(),
		parentId: $("#pcategoryId").val()
	};
	console.log(JSON.stringify(data));
	var link = server + "/manage/serviceCategory/addCategory.do";
	// if (type == 0)
	// 	link = server + "/service/update.do";
	fetch(link, {
		method: "POST",
		headers: {
			'Content-Type': 'application/json'
		},
		credentials: 'include',
		body: JSON.stringify(data)
	}).then(res => res.text()).then(function (result) {
		console.log(result);
		result = $.parseJSON(result);
		if (result.status) {
			alert(result.msg);
		} else {
			alert(result.msg);
			if (type != 0)
				window.location.href = "servicecategory.html";
		}
	});

}

function addorganization(type) {
	if($("#password").val()!=$("#repassword").val())
		{
			alert("两次输入密码不一致");
			return false;
		}
	var tip = "确认要添加新服务类别吗？";
	if (type == 0)
		tip = "确认要修改类别信息吗？";
	if (confirm(tip)) {
		//创建FormData对象
		upload(type);
	}
	return false;
}