//显示角色信息页面
$(document).ready(function(){
    if($.cookie("roleId")==2){
        $("#tips").append(`<li style="background: url('../../images/top/user.png') no-repeat;">欢迎您，${$.cookie("username")}！</li>
            <a href="javascript:void(0)" id="logout"><li style="background: url('../../images/top/logout.png') no-repeat;">注销</li></a>`)
        $("#buttons").append(`<a href="http://183.129.253.170:8010" target="_blank"><li style="background: url('../../images/top/service.png') no-repeat;">在线IDE</li></a>
<a href="self/index.html" target="_blank"><li style="background: url('../../images/top/self.png') no-repeat;">个人中心</li></a>`);
    }
    else if($.cookie("roleId") == 3 ||$.cookie("roleId")== 4||$.cookie("roleId")==5) {
        $("#tips").append(`<li style="background: url('../../images/top/user.png') no-repeat;">欢迎您，${$.cookie("username")}！</li>
            <a href="javascript:void(0)" id="logout"><li style="background: url('../../images/top/logout.png') no-repeat;">注销</li></a>`)
        $("#buttons").append(`<a href="serviceadmin/index.html" target="_blank"><li style="background: url('../../images/top/service.png') no-repeat;">服务发布中心</li></a>
<a href="self/index.html" target="_blank"><li style="background: url('../../images/top/self.png') no-repeat;">个人中心</li></a>
<a href="http://service.cheosgrid.org:8090" target="_blank"><li style="background: url('../../images/top/service.png') no-repeat;">在线IDE</li></a>`);
    }else if($.cookie("roleId")==1){
        $("#tips").append(`<li style="background: url('../../images/top/user.png') no-repeat;">欢迎您，${$.cookie("username")}!</li>
<a href="javascript:void(0)" id="logout"><li style="background: url('../../images/top/logout.png') no-repeat;">注销</li></a>`)
        $("#buttons").append(`<a href="superadmin/index.html" target="_blank"><li style="background: url('../../images/top/self.png') no-repeat;">管理中心</li></a>
<a href="http://service.cheosgrid.org:8090" target="_blank"><li style="background: url('../../images/top/service.png') no-repeat;">在线IDE</li></a>`);
    }
    else{
        $.cookie('username', "");
        $.cookie('roleId', -1);//记录用户角色,注意第三个参数
        $("#tips").append(`<a href="serviceadmin/login.html"><li style="background: url('../../images/top/user.png') no-repeat;">点击登录</li></a>
            <a href="superadmin/login.html"><li style="background: url('../../images/top/logout.png') no-repeat;">管理员入口</li></a>`)
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
});