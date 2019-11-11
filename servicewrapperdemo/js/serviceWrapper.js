//analyse.html
$(document).ready(function(){
    let server="http://183.129.170.180:18088/";
    let logUrl="";
    let logTask;
    let isStaticWrap=true;
    let api_url="";
    function getUrlParam(name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
        var r = window.location.search.substr(1).match(reg);
        if(r != null) return unescape(r[2]);
        return "";
    }
    function staticWrap(){
        isStaticWrap=true;
        api_url=$("#url_text").val();
        let  url= encodeURIComponent(api_url);
        let form_info=JSON.parse(sessionStorage.getItem("form_info"+api_url));
        form_info.form_check=0;
        $.ajax({
                url:'http://183.129.170.180:18088/servicewrapper_update/',
                type:"POST",
                data:JSON.stringify(form_info),
                contentType:"application/json; charset=utf-8",
                //dataType:"json",写上这行则服务器必须返回JSON，否则触发error function
                success: (result)=>{
                    console.log("日志地址",result);
                    logUrl=result;
                    time = 70;
                    logTask=setInterval(()=>{
                        $.get(logUrl)
                            .done((logResult)=>{
                                time = time - 1;
                                $("#logResult").html(logResult);
                                document.getElementById("logText").scrollTop = $("#logResult")[0].scrollHeight; //始终保持日志滚动条在最下方
                                let logArray=logResult.split("\n");
                                logArray.pop();
                                if (logArray.length<=1)
                                    $("#logs").text("Statically wrapping： Seconds left："+time+"s")
                                else
                                    $("#logs").text("Statically wrapping：Please wait")
                                let lastLine=logArray.pop();
                                console.log("lastLine",lastLine);
                                if(lastLine.startsWith("200")){//分析结束
                                    clearInterval(logTask);//停止请求日志
                                    let jsonUrl=lastLine.split(" ").pop();
                                    $.get(jsonUrl).done((result)=>{//获取API信息
                                        sessionStorage.setItem("api_info"+api_url,JSON.stringify(result));
                                        $("#nextBtn").css('display','block');//显示下一步按钮
                                        finished=true;
                                        $("#logs").text("Log")

                                    })
                                }
                                else if(lastLine.startsWith("503") || lastLine.startsWith("504")|| (time <=0 && logArray.length<=1))
                                {
                                    $("#logs").text("Log: Wrapping failed. Please click the 'wrap' button again.")
                                    clearInterval(logTask);
                                }
                            })
                            .fail((errorResult)=>{
                                $("#logText").text("Failed to retrieve log");
                                console.log("Failed to retrieve log",errorResult);
                                $("#logs").text("Failed to retrieve log")
                            })
                    },1000)
                }
            }
        );


    };
    function dynamicWrap(){
        isStaticWrap=false;
        api_url=$("#url_text").val();
        let url= encodeURIComponent(api_url);
        $.get(server+"formdetector/?url="+url, function(result){
            console.log("Result of starting analysis",result);
            logUrl=result;
            time = 70;
            logTask=setInterval(()=>{
                $.get(logUrl)
                    .done((logResult)=>{
                        time = time - 1;
                        $("#logResult").html(logResult);
                        document.getElementById("logText").scrollTop = $("#logResult")[0].scrollHeight; //始终保持日志滚动条在最下方
                        let logArray=logResult.split("\n");
                        logArray.pop();
                        if (logArray.length<=1)
                            $("#logs").text("Dynamically wrapping. Seconds left: "+time+"s")
                        else
                            $("#logs").text("Dyanmically wrapping. Please wait for finishing. ")
                        let lastLine=logArray.pop();
                        console.log("lastLine",lastLine);
                        if(lastLine.startsWith("200")){//分析结束
                            clearInterval(logTask);//停止请求日志
                            let strs=lastLine.split(" ");
                            let imgUrl=strs.pop();
                            let jsonUrl=strs.pop();
                            console.log("imgUrl",imgUrl);
                            console.log("jsonUrl",jsonUrl);
                            $.get(jsonUrl).done((result)=>{//获取API信息
                                sessionStorage.setItem("form_info"+api_url,JSON.stringify(result));
                                if(result.forms.length==0) {
                                    $("#logs").text("Failed to detect form. Static wrap is about to start. ");
                                    staticWrap();
                                }
                                else{

                                    sessionStorage.setItem("img_url"+api_url,imgUrl);
                                    $("#nextBtn").css('display','block');//显示下一步按钮
                                    finished=true;
                                    $("#logs").text("Log")
                                }
                            })
                        }
                        else if(lastLine.startsWith("503") || lastLine.startsWith("504")|| (time <=0 && logArray.length<=1))
                        {
                            $("#logs").text("Log: Wrapping failed. Please click the 'wrap' button again.")
                            clearInterval(logTask);
                        }
                    })
                    .fail((errorResult)=>{
                        $("#logText").text("Failed to retrieve log");
                        console.log("Failed to retrieve log",errorResult);
                        $("#logs").text("Failed to retrieve log")
                    })
            },1000)

        });
    };
    if(getUrlParam("url")!=="" & getUrlParam("type")=="static"){
        $("#url_text").val(getUrlParam('url'));
        staticWrap();
        console.log("检测到url参数");
    }
    
    $("#staticWrap").click(staticWrap);
    $("#dynamicWrap").click(dynamicWrap);
    $("#nextBtn").click(()=>{
        console.log("testBtn2 clicked")
        if(isStaticWrap)
            window.location.href="select.html?api_url="+api_url;
        else
            window.location.href="formSelect.html?api_url="+api_url;
    });
});