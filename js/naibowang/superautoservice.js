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
		credentials: "include",
		body:data
	}).then(res => res.text()).then(function (result) {
		result = $.parseJSON(result);
		console.log(result)
	});


	var data = new FormData()
	data.append('swagger', document.getElementById("jsonfile").files[0])
	data.append('categoryId', 7)
	data.append('serviceImg', $("#serviceImg").val())
	data.append('userId', result.data.userId)
	
	
	//		console.log(JSON.stringify(data));
	var link = "http://service.cheosgrid.org:8099/v2/swagger2service";
	console.log(link);
	if (type == 0)
		link = server + "/service/manage/update.do";
	fetch(link, {
		method: "POST",
		// headers: {
		// 	'Content-Type': 'multipart/form-data'
		// },
		credentials: "omit",
		body:data
	}).then(res => res.text()).then(function (result) {
		result = $.parseJSON(result);
		console.log(result)
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
                    result = $.parseJSON(result);
                    console.log(result)
                    console.log(result.Data)
                    resultdata = $.parseJSON(result.Data);
                    });
				if (result.Status != 200) {
					alert("服务添加失败");
				} else {
					alert("服务已经添加，待管理员审核");
					if (type != 0)
						window.location.href = "serviceothers.html";
				}
	});
})

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
						upload2(type);
					}
				}
			});
		} else {
			upload2(type);
		}

		return false;
	}
}