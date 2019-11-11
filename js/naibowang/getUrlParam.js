//服务器默认参数设置
String.prototype.replaceAll = function(s1,s2){
    return this.replace(new RegExp(s1,"gm"),s2);
}
var server = "http://api.cheosgrid.org:8077";
$.ajaxSetup({xhrFields: { withCredentials: true }});//设置带cookie访问
function getUrlParam(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象
    var r = window.location.search.substr(1).match(reg);  //匹配目标参数
    if (r != null) return unescape(r[2]); return null; //返回参数值
}
function checklogin()//登陆检测
{
    var link = server+"/service/list/self.do?pageNum=1&pageSize=1";
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
function getsiderbar()//加载侧边栏
{
    $.get("sidebar.html", function(result){
        console.log(result);
        $("#container").prepend(result);
    });
}
$(document).ready(function(){
    $(".sidebar-menu").append(
        `<li id="orderinfor"><a class="" href="orderlist.html"><i class="icon_table"></i><span>普通订单信息</span></a></li>
		<li id="offlineorderinfor"><a class="" href="offlineorderlist.html"><i class="icon_table"></i><span>线下订单信息</span></a></li>`);
    if($.cookie('roleId') != 3)//用户信息列表
    {
        $(".sidebar-menu").append(`<li id="usinfor"><a class="" href="users.html"><i class="icon_document_alt"></i><span>组内用户信息</span></a></li>`);
    }
    $("#logout").click(function(){
        if(confirm("确认要注销吗？"))
        {
            $.get(server+"/user/logout.do", function(result){
                $.cookie('username',null,{path: '/'});
                $.cookie('roleId',-1,{path: '/'});
                window.location.href = "../index.html";
            });
        }
    });
    $("#usname").html($.cookie('username'));//显示用户名
});