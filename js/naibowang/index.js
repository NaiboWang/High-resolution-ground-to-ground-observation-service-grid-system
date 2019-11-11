//此页面用来多线程加载ajax请求，配合主页的worker使用
var server = "http://api.cheosgrid.org:8077";//全局服务器地址
var Ajax={
    get: function(url, fn) {
        var obj = new XMLHttpRequest();  // XMLHttpRequest对象用于在后台与服务器交换数据
        obj.open('GET', url, false);//第三个参数为false为同步处理，true为异步处理
        obj.onreadystatechange = function() {
            if (obj.readyState == 4 && obj.status == 200 || obj.status == 304) { // readyState == 4说明请求已完成
                fn.call(this, obj.responseText);  //从服务器获得数据
            }
        };
        obj.send();
    },
    post: function (url, data, fn) {         // datat应为'a=a1&b=b1'这种字符串格式，在jq里如果data为对象会自动将对象转成这种字符串格式
        var obj = new XMLHttpRequest();
        obj.open("POST", url, false);//第三个参数为false为同步处理，true为异步处理
        obj.setRequestHeader("Content-type", "application/x-www-form-urlencoded");  // 添加http头，发送信息至服务器时内容编码类型
        obj.onreadystatechange = function() {
            if (obj.readyState == 4 && (obj.status == 200 || obj.status == 304)) {  // 304未修改
                fn.call(this, obj.responseText);
            }
        };
        obj.send(data);
    }
}
var st="";
//右侧推荐列表
Ajax.get(server+"/service/list.do?orderBy=1&pageNum=1&pageSize=40", function(result){
    result = JSON.parse(result);
    for(var x = 0;x<6;x++)
    {
        st+=`<div class="new-better-service-content bb1 hover-opacity ml-1"><a href="detail.html?serviceId=${result.data.list[x].serviceId}" title="${result.data.list[x].serviceName}" target="_blank">
<div class="service-content-pic"><img src="${result.data.list[x].serviceImg}" alt="images/79f0f736afc379315c292f97ecc4b74542a911ce.jpg?timestamp=1468910864" /></div>
<p class="service-content-p text-overflow-fix" title="${result.data.list[x].serviceName}">${result.data.list[x].serviceName}</p>
</a></div>`;}
    st+="@split";
    for(var x = 6;x<12;x++)
    {
        st+=`<div class="new-better-service-content bb1 hover-opacity ml-1"><a href="detail.html?serviceId=${result.data.list[x].serviceId}" title="${result.data.list[x].serviceName}" target="_blank">
<div class="service-content-pic"><img src="${result.data.list[x].serviceImg}" alt="images/79f0f736afc379315c292f97ecc4b74542a911ce.jpg?timestamp=1468910864" /></div>
<p class="service-content-p text-overflow-fix" title="${result.data.list[x].serviceName}">${result.data.list[x].serviceName}</p>
</a></div>`;}
    st+="@split";
});
//左侧大类和小类
Ajax.get(server+"/serviceCategory/listparent.do", function(data){
    data = JSON.parse(data);
    var listItemData = data.data;
    for(var k = 0 ; k < listItemData.length; k++ ){
        st+=`<li class="new-product-list-li pr">
							<span>`+listItemData[k].name+`</span>`;
        var tid = listItemData[k].id;
        Ajax.get(server+"/serviceCategory/list.do?parentId="+listItemData[k].id, function(result){
            result = JSON.parse(result);
            var listItemResult=result.data;
            for(var m=0;m<listItemResult.length;m++){
                st+=`<li class="new-product-list-li pr">
									<a href="APIMarket.html?id=`+listItemResult[m].id+`" class="activity-link dib vat" target="_blank">
									<img class="new-small-pic" src="images/icon/index`+listItemResult[m].id+`.png"/>
									<span>`+listItemResult[m].categoryName+`</span>
									<b class="arrow"></b>
									</a>
									<div class="content-con">
									<div class="pannel-con">
									<div class="lable-list-wrap">
									<div class="lable-list">`;
                Ajax.get(server+"/service/list.do?category="+listItemResult[m].id+"&pageNum=1&pageSize=3", function(result){
                    result = JSON.parse(result);
                    for(var x = 0;x<result.data.list.length;x++)
                    {
                        st+=`<a id="home-product-service-${tid}-${x}" href="detail.html?serviceId=${result.data.list[x].serviceId}" target="_blank">${result.data.list[x].serviceName}</a>`;
                    }

                });
                st+=`</div>
											</div>
											</div>
											</div>
											</li>`;
            }
        });
        st+=`</li>`
    }
    postMessage(st);
});

// Ajax.get(server+"/serviceCategory/list.do", function(data){
//     data = JSON.parse(data);
//     var listItemData = data.data;
//     for(var k = 0 ; k < listItemData.length; k++ ){
//         st+=`<li class="new-product-list-li pr">
// 							<a href="APIMarket.html?id=`+listItemData[k].id+`" class="activity-link dib vat" target="_blank">
// 							<img class="new-small-pic" src="images/icon/index`+listItemData[k].id+`.png"/>
// 							<span>`+listItemData[k].categoryName+`</span>
// 							<b class="arrow"></b>
// 							</a>
// 							<div class="content-con">
// 							<div class="pannel-con">
// 							<div class="lable-list-wrap">
// 							<div class="lable-list">`;
//         var tid = listItemData[k].id;
//         Ajax.get(server+"/service/list.do?category="+listItemData[k].id+"&pageNum=1&pageSize=3", function(result){
//             result = JSON.parse(result);
//             for(var x = 0;x<result.data.list.length;x++)
//             {
//                 st+=`<a id="home-product-service-${tid}-${x}" href="detail.html?serviceId=${result.data.list[x].serviceId}" target="_blank">${result.data.list[x].serviceName}</a>`;
//             }
//
//         });
//         st+=`</div>
// 							</div>
// 							</div>
// 							</div>
// 							</li>`;
//     }
//     postMessage(st);
// });