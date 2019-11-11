$(function() {
    //总的调用接口
    var ApiUrl = 'http://api.cheosgrid.org:8077/api/findApi.do?path=%2F';

    // 获取语义分解的api：  待服务器完成之后在此处添加
    var okapiUrl = "http://183.129.170.180:18088/?question=";

    var serviceId = "";
    //点击测试功能从这里开始
    var formList = {

        // 根据服务名称获得对应的url
        getURL: function (id) {
            // return url;

            var request = ApiUrl + id;
            console.log(request)
            return new Promise((res, rej)=>{
                $.ajax({
                    type: "get",
                    url: request,
                    datType: "json",
                    success: function(data) {
                        console.log(data)
                        var true_information = data.data;
                        console.log(true_information)
                        var url = true_information.apiUrl;
                        var para = true_information.arguments;
                        var type = true_information.apiCallWay.split(" ")[1];
                        serviceId = true_information.serviceId;
                        console.log("type::", type, true_information.apiCallWay.split(" "))
                        console.log(para);
                        $("#service").html(true_information.serviceName);
                        $("#api").html(true_information.name);
                        var result = {
                            url: url,
                            parameters: [],
                            type: type
                        }
                        para = JSON.parse("["+para+"]")[0]
                        for(let i=0; i<para.length; i++){

                            let discr = para[i]
                            console.log(discr)
                            result.parameters.push(discr["名称"])
                        }

                        res(result)
                    }
                });
            })

        },

        locations: function () {
            $("#testBtn2").on('click', function () {
                console.log("serviceId是：", serviceId);
                if(serviceId === "" || serviceId.length < 1){

                }else{
                    window.open("http://service.cheosgrid.org:8076/detail.html?serviceId="+serviceId);
                }
            })
        },

        getOkapi: function () {
          $("#testBtn1").on('click', function () {
              var search_value = $("#search_text").val();
              search_value = search_value.split("").join(" ");
              console.log(search_value)
              var request_url = okapiUrl + search_value;
              $.ajax({
                  url: request_url,
                  dataType: "text",
                  type: 'get',
                  success: function(result){
                  //"<TRAIN_0> <SPA> <DATE_DEFAULT> <SPA> 石 嘴 山 市 <SPA> 绥 化 市 <SPA> 快 车"
                      console.log(result)
                      result = result.split(" ").join("");
                      result = result.split("<SPA>")  // 示例结果["<TRAIN_0>", "<DATE_DEFAULT>", "石嘴山市", "绥化市", "快车"]
                      console.log(result)
                      result[0] = result[0].replace("<","").replace(">","")

                      $("#nlp").html(result.join("  "));
                      formList.getURL(result[0]).then((url_parameters)=>{
                          console.log(url_parameters)

                          var url = url_parameters.url;
                          var parameters = url_parameters.parameters;
                          var type = url_parameters.type;

                          var request_here = url+"?apiKey=";

                          var param = {};

                          var apikey = $("#apikey").val();

                          if(apikey != '' && apikey != null) {
                              request_here = request_here + apikey;
                              param["apiKey"] = apikey;
                          }
                          var length_min = result.length - 1 < parameters.length ? result.length - 1 : parameters.length;
                          for(let i=0; i<length_min; i++){
                              request_here = request_here + '&'+parameters[i]+"="+result[i+1];
                              param[parameters[i]] = result[i+1];
                          }

                          console.log("拼装好之后的request", request_here);

                          $("#urlText").html(request_here);
                          $("#testResult").html("");
                          $("#testBtn1").html("请求中...").css("background", "gray");
                          $("#testBtn1").attr("disabled", "disabled");

                          console.log("url:", url);
                          console.log("type:", type);
                          console.log("data:", param);
                          $.ajax(
                              { url: url,
                                  type:type,
                                  data:param,
                                  dataType: 'JSON',//here
                                  success: function(result){
                                      $("#testResult").html(JSON.stringify(result,null,6));//跨域问题需要解决
                                  },
                                  error:function (e) {
                                      $("#testResult").html("请输入正确的参数。");//跨域问题需要解决
                                  }
                              }
                          );
                          $("#testBtn1").html("点击测试").css("background", "#00ABFF");
                          $("#testBtn1").removeAttr("disabled");
                      })
                  },
                  error:function (e) {
                      $("#testResult").html("服务器出错，查询失败！！");//跨域问题需要解决
                  }
              })
          })
        },

        //formList结束
    }
    formList.getOkapi();
    formList.locations();
})