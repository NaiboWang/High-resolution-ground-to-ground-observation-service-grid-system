//服务器默认参数设置
String.prototype.replaceAll = function(s1,s2){
　　return this.replace(new RegExp(s1,"gm"),s2);
　　}
var server = "http://api.cheosgrid.org:8077";
$.ajaxSetup({xhrFields: { withCredentials: true }});//设置带cookie访问
function getUrlParam(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return decodeURI(r[2]); return null;
}
function checklogin()//登陆检测
{
	var link = server+"/user/manage/list.do?pageNum=1&pageSize=1";
	$.get(link,function(result){
	 if(result.status)
		{
			alert(result.msg);
			window.location.href="login.html";
			return false;
		}
	});
}
function check()
{
if(confirm("确认要提交吗？"))
   return true;
else 
   return false;
}
function formatDate(str)//格式化字符串
{
    var tim = str.split("-");
    var m = parseInt(tim[1]);
    var d = parseInt(tim[2]);
    if(m<10)
        m = "0" + m;
    if(d<10)
        d = "0" + d;
    return tim[0] + "-" + m + "-"+d;
}

$(document).ready(function(){
    var now = new Date();
    var date = new Date(now.getTime() - 7 * 24 * 3600 * 1000);
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    var day = date.getDate();
    var myDate = new Date();
	$(".sidebar-menu").append(`<li id="serviceinfor"><a class="" href="service.html"><i class="icon_table"></i><span>全部服务管理</span></a></li><li id="serviceothers"><a class="" href="serviceothers.html"><i class="icon_desktop"></i><span>相关常用服务管理</span></a></li><li id="servicecategoryinfo"><a class="" href="servicecategory.html"><i class="icon_documents_alt"></i><span>服务类别管理</span></a></li><li id="log"><a class="" href="log.html?startDate=${formatDate(year + '-' + month + '-' + day)}&endDate=${formatDate(myDate.toLocaleDateString().replaceAll("/","-"))}&pageSize=50"><i class="icon_genius"></i><span>日志信息查看</span></a></li><li id="remarkinfo"><a class="" href="remarkinfo.html"><i class="icon_contacts"></i><span>用户留言查看</span></a></li><li id="orderlist"><a class="" href="orderlist.html"><i class="icon_menu-square_alt"></i><span>订单管理</span></a></li>`);
    $("#logout").click(function(){
	if(confirm("确认要注销吗？"))
	{
		 $.get(server+"/user/manage/logout.do", function(result){
             $.cookie('username',null,{path: '/'});
             $.cookie('roleId',-1,{path: '/'});
             window.location.href = "../index.html";
			 // $.cookie('susername',null);//清空cookie

  		});
	}
});
    $("#usname").html($.cookie('username'));
	// $("#usname").html($.cookie('susername'));//显示用户名
});