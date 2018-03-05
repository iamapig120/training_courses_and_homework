//20170624
//加载jsonp

//Ajax封装 http://xiaodidiao.com/blog/archives/162
(function() {
    function Ajax() {
        var xhr = window.XMLHttpRequest
            ? new XMLHttpRequest()
            : new ActiveXObject("Microsoft.XMLHttp");
        if (!xhr) {
            alert("您的浏览器不支持XMLHttpRequest对象");
            return;
        }
        this.xhr = xhr;
    }

    /**
     * 发送一个AJAX请求
     *
     * @param  {string} option.method 请求类型:"GET"(默认)/"POST"
     * @param  {string} option.url 请求的url地址
     * @param  {boolean} option.async 请求是否异步:true(默认 异步)/false
     * @param  {object} option.data 向服务器发送的数据(用键值对表示)
     * @param  {"text" | "xml" | "json" | "jsonp"} option.resType 以何种形式接收响应的数据:"text"(默认 字符串)/"xml"(格式化成XML)/"json"(解析json对象)/"sjonp"jsonpGet 请求
     * @param  {function} option.success 响应成功执行的回调
     * @param  {function} option.error 响应失败执行的回调
     */
    /* 发送请求 */
    Ajax.prototype.send = function(option) {
        if (typeof option != "object" || option === null) {
            // 判断传参
            throw "请正确配置参数";
            return;
        }
        option.method = option.method ? option.method.toUpperCase() : "GET";
        option.url = option.url || "";
        option.async = option.async == false ? false : true;
        option.data = option.data || null;
        option.resType = option.resType.toLowerCase() || "text";
        option.success =
            option.success ||
            function(res) {
                console.log(res);
            };
        option.error =
            option.error ||
            function(e) {
                console.log("error: status=" + e);
            };
        // 处理数据，加时间戳防止缓存
        var params = ["t=" + new Date().valueOf()];
        if (option.data) {
            for (var key in option.data) {
                params.push(key + "=" + option.data[key]);
            }
        }

        if (option.resType == "jsonp") {
            var callbackFunctionName;
            while (callbackFunctionName & !window[callbackFunctionName]) {
                callbackFunctionName =
                    "jsonp" +
                    Math.random()
                        .toString(36)
                        .substr(2);
            }
            params.push("callback=" + callbackFunctionName);

            var postData = params.join("&");

            var script = document.createElement("script");
            script.src = option.url + "?" + postData;

            window[callbackFunctionName] = function(cb) {
                document.getElementsByTagName("head")[0].removeChild(script);
                window[callbackFunctionName] = undefined;
                option.success(cb);
            };

            document.getElementsByTagName("head")[0].appendChild(script);
        } else {
            var postData = params.join("&");

            this.xhr.onreadystatechange = function() {
                if (this.xhr.readyState == 4) {
                    if (this.xhr.status == 200) {
                        if (option.resType == "text") {
                            option.success(this.xhr.responseText);
                        } else if (option.resType == "xml") {
                            option.success(this.xhr.responseXML);
                        } else if (option.resType == "json") {
                            //console.log(this.xhr.responseText);
                            try {
                                var obj;
                                if (window.JSON) {
                                    obj = JSON.parse(this.xhr.responseText);
                                } else if (eval) {
                                    obj = eval(
                                        "(" + this.xhr.responseText + ")"
                                    );
                                } else {
                                    obj = new Function(
                                        "return " + this.xhr.responseText
                                    )();
                                }
                                option.success(obj);
                            } catch (e) {
                                option.error("Not A JSON");
                            }
                        }
                    } else {
                        option.error(this.xhr.status);
                    }
                }
            }.bind(this);

            if (option.method == "GET") {
                this.xhr.open("GET", option.url + "?" + postData, option.async);
            } else if (option.method == "POST") {
                this.xhr.open("POST", option.url, option.async);
                // POST方法要添加请求头
                this.xhr.setRequestHeader(
                    "Content-Type",
                    "application/x-www-form-urlencoded;charset=utf-8"
                );
            }

            this.xhr.send(postData);
        }
    };
    /* 取消请求 */
    Ajax.prototype.abort = function() {
        this.xhr.abort();
    };
    /* 绑定到全局 */
    window.Ajax = Ajax;
})();
