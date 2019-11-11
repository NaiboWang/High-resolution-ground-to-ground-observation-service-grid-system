$(document).ready(function () {
	$.get(server + "/organization/list.do", function (result) {
		var listItemData = result.data;
		var st = `<option value='0'>暂无组织</option>`;
		for (var k = 0; k < listItemData.length; k++) {
			st += `<option value="${listItemData[k].id}">${k+1}.${listItemData[k].organizationName}</option>`;
		}
		$("#organizationId").html(st);
	});
	checklogin();
});

function upload(type) {
	var st = {};
	var num = 0;
	var str = "";
	
	var data = {
//		id: parseInt($("#serviceId").val()),
		username: $("#username").val(),
		roleId: parseInt($("#roleId").val()),
		organizationId: parseFloat($("#organizationId").val()),
		phone:$("#phone").val(),
		email: $("#email").val(),
		password: $("#password").val(),
		industry:$("#industry").val()
	};
	//		console.log(JSON.stringify(data));
	var link = server + "/user/manage/add.do";
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
	if($("#password").val()!=$("#repassword").val())
		{
			alert("两次输入密码不一致");
			return false;
		}
	var tip = "确认要注册新用户吗？";
	if (type == 0)
		tip = "确认要修改用户信息吗？";
	if (confirm(tip)) {
		//创建FormData对象
		upload(type);
	}
	return false;
}