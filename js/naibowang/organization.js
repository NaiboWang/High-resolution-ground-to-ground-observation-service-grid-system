function upload(type) {
	var st = {};
	var num = 0;
	var str = "";
	
	var data = {
//		id: parseInt($("#serviceId").val()),
        organizationName: $("#organizationName").val(),
		organizationAddress:$("#organizationAddress").val(),
        description: $("#description").val(),
		checked : 1,
		parentId : 0,
		phone:$("#phone").val(),
        email:$("#email").val()
	};
			console.log(JSON.stringify(data));
	var link = server + "/organization/add.do";
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
				window.location.href = "organization.html";
		}
	});

}

function addorganization(type) {
	if($("#password").val()!=$("#repassword").val())
		{
			alert("两次输入密码不一致");
			return false;
		}
	var tip = "确认要添加新组织吗？";
	if (type == 0)
		tip = "确认要修改组织信息吗？";
	if (confirm(tip)) {
		//创建FormData对象
		upload(type);
	}
	return false;
}