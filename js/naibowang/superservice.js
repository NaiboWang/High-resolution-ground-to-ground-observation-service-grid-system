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
		categoryId: 7,
		price: parseFloat($("#price").val()),
		format: str,
		introduction: $("#introduction").val(),
		detailIntroduction: $("#detailIntroduction").val(),
		serviceImg: $("#serviceImg").val()
	};
	//		console.log(JSON.stringify(data));
	var link = server + "/service/manage/add.do";
	if (type == 0)
		link = server + "/service/manage/update.do";
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
				window.location.href = "serviceothers.html";
		}
	});

}

function addcheck(type) {
	var tip = "确认要注册服务吗？";
	if (type == 0)
		tip = "确认要修改服务信息吗？";
	if (confirm(tip)) {
		//创建FormData对象
		if (type == 1 || $("#img").val() != '') {
			var data = new FormData();
			//为FormData对象添加数据
			$.each($('#img')[0].files, function (i, file) {
				data.append('uploadFile', file);
			});
			$.ajax({
				url: server + "/service/manage/upload.do",
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
							$.get(server + "/service/manage/image/delete.do?imageName=" + pimg, function (result) {});
						upload(type);
					}
				}
			});
		} else {
			upload(type);
		}

		return false;
	}
}