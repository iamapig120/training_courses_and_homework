<?php
session_start();
if (!isset($_SESSION['userinfo']) || !isset($_SESSION['userinfo']['usr'])) {
    //echo $_SESSION['userinfo']['usr'];
    header("location:login.php");
} else {
    ?>

    <!DOCTYPE html>
    <html>

    <head>
        <meta charset="utf-8"/>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no">
        <title>SlimChat</title>
        <link rel="stylesheet" href="css/bootstrap.min.css"/>
        <link rel="stylesheet" href="css/index.css"/>
        <script type="text/javascript" src="js/jquery-3.2.1.min.js"></script>
        <script>if (typeof module === 'object') {
                window.jQuery = window.$ = module.exports;
            }
            ;</script>
        <script type="text/javascript" src="js/bootstrap.min.js"></script>
        <script type="text/javascript" src="js/socket.io.js"></script>
        <script type="text/javascript" src="js/md5.min.js"></script>
    </head>

    <body>
    <div class=".container-fluid">
        <div class="row">
            <div id="mainChatWindow">
                <span style="display:none;" class="dataSpan"></span>
                <div id="chatTtles">
                    <h1>SlimChat匿名版</h1>
                    <h3>请您登录</h3>
                </div>
                <div class="row">
                    <div id="chatPannelLeft" class="div-half">
                        <div id="div-history">
                        </div>
                        <div id="div-user">
                            <div id="div-tools">
                                <div id="formEmoji">
                                </div>
                                <!-- <input type="color" class="btn btn-default" style="width: 54px;height: 34px;" id="colorSelect" /> -->
                                <button type="button" class="btn btn-default" id="btnEmoji">表情</button>
                                <span id="fileSpan">
									<input type="file" id="fileInput" style="display: none;"
                                           accept="image/gif, image/jpeg, image/png, image/webp"/>
									<button type="button" class="btn btn-default" id="btnImage">图片</button>
								</span>
                                <button type="button" class="btn btn-default" id="btnClearScreen">清屏</button>
                            </div>
                            <div id="div-text">
                                <div id="textSend" contenteditable="true"></div>
                                <div class="btn-group-buttom">
                                    <p class="copyright">Copyright © 2017 Katyusha. Modify By Handle</p>
                                    <div class="btn-group ">
                                        <button type="button" class="btn btn-default bottomBtn" id="btnClear">清 空
                                        </button>
                                    </div>
                                    <div class="btn-group">
                                        <button type="button" class="btn btn-default bottomBtn" id="btnSend">发 送
                                        </button>
                                        <button id="bottomDropBtn" type="button"
                                                class="btn btn-default dropdown-toggle bottomBtn" data-toggle="dropdown"
                                                aria-haspopup="true"
                                                aria-expanded="false">
                                            <span class="caret"></span>
                                        </button>
                                        <ul class="dropdown-menu">
                                            <li>
                                                <a id="inputWay1" href="javascript:">使用Enter发送消息</a>
                                            </li>
                                            <li>
                                                <a id="inputWay2" href="javascript:">使用Ctrl+Enter发送消息</a>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div id="chatPannelRight" class="div-half">
                        <div id="div-notice">
                        </div>
                        <div id="div-users">
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <!--模态框-->
        <div class="modal fade" id="modalLogin" tabindex="-1" role="dialog" aria-labelledby="myModalLabel"
             aria-hidden="true">
            <div class="modal-dialog" style="width: 400px;">
                <div class="modal-content">
                    <div class="modal-header">
                        <button type="button" class="close" data-dismiss="modal" aria-hidden="true">×</button>
                        <h4 class="modal-title" id="myModalLabel">
                            欢迎使用 SlimChat - Fork
                        </h4>
                    </div>
                    <div class="modal-body">
                        <p id="status" class="text-danger">正在连接至服务器……</p>
                        <div id="loginWapper">
                            <p class="itemRequired">昵称</p>
                            <input type="text" id="inputName" maxlength="20"/>
                            <p>电子邮件</p>
                            <input type="email" id="inputMail"/>
                            <p>站点</p>
                            <input type="url" id="inputUrl"/>
                        </div>
                        <div id="joinRoom">
                            <p>加入房间</p>
                            <input type="number" id="inputRoom" maxlength="20"/>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-primary" id="btnSubmit">确认</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <script>
        (function () {
            let name;//当前用户昵称
            let mail;//当前用户电子邮件
            let url;//当前用户站点
            let socket;//套接字流
            let users = [];//当前在线用户
            let flagOnline = false;//是否成功登陆
            let lastMessageTime;//最后发送的消息时间

            let rooms = new Array();
            //let usersList, mailsList, urlsList, avatarsList;//用于展示用户列表

            //初始化
            window.onload = function () {
                //socket = io.connect();
                //socket = io.connect("http://localhost:2333/");
                //socket = io.connect("https://slimchat.top");
                socket = io.connect("http://182.254.136.143:2333/");
                $("#modalLogin").modal();//初始化模态框
                $("#joinRoom")[0].style.display = "none";//不显示加入房间
                socket.on("connect", function () {//连接成功事件
                    console.log("connect success");
                    //socket.emit("usersList");//刷新用户列表
                    $("#status").text("电子邮件地址不会被公开，带有 * 的是必填项，用户名限制最长20字节");
                    $("#loginWapper")[0].style.display = "block";
                    $("#btnSubmit").bind("click", (function () {
                        name = $("#inputName").val();
                        name = $.trim(name);
                        mail = $("#inputMail").val();
                        if (mail.length > 0) {
                            mail = $.trim(mail);
                            mail = mail.toLowerCase();
                            mail = hex_md5(mail);
                        }
                        url = $("#inputUrl").val();
                        url = $.trim(url);
                        //此处还有一大堆
                        if (name) {
                            $("#status").text("提交中……");
                            $("#loginWapper")[0].style.display = "none";
                            socket.emit("login", name, mail, url);
                        } else {
                            $("#status").text("昵称不能为空，请重新输入");
                        }
                    }));
                });

                //使用模态框提示
                function showAlert(text) {
                    $("#btnSubmit").unbind();
                    $("#btnSubmit").bind("click", (function () {
                        $("#modalLogin").modal("hide");
                        $("#loginWapper")[0].style.display = "none";
                        $("#joinRoom")[0].style.display = "none";
                        $("#textSend").html("");
                    }));
                    $("#loginWapper")[0].style.display = "none";
                    $("#joinRoom")[0].style.display = "none";
                    $("#status").text(text);
                    $("#modalLogin").modal();
                }

                //用户登录事件
                socket.on("loginStatus", function (userStatus) {
                    if (userStatus == "success") {//登录成功
                        flagOnline = true;//更新在线状态
                        //$("#modalLogin").modal("hide");//隐藏模态框
                        $("#btnSend").bind("click", (function () {
                            sendText($(".dataSpan")[0].innerText);
                        }));

                        function sendText(roomId) {
                            roomId = parseInt(roomId);
                            //文字发送方法绑定
                            //let textContent = $("#textSend").val();
                            let textContent = $("#textSend")[0].innerText;
                            let textColor = $("#colorSelect").val();
                            textContent = $.trim(textContent);
                            //不允许为空
                            if (textContent.length <= 0) {
                                showAlert("要发送的内容不能为空！");
                            } else {
                                socket.emit("text", roomId, textContent, textColor);
                                textContent = $("#textSend").html("");
                                console.log("Send a message : " + textContent);
                            }
                        }

                        $("#fileInput")[0].onchange = function () {
                            sendImg($(".dataSpan")[0].innerText);
                        }

                        function sendImg(roomId) {//Copy from Mozilla API Document
                            roomId = parseInt(roomId);
                            //图片发送方法绑定
                            //addInfo("图片发送已被禁止，请等待后续更新");
                            let file = document.querySelector('input[type=file]').files[0];
                            console.log(file);
                            let reader = new FileReader();
                            //console.log("Send a image 1/3");
                            reader.addEventListener("load", function () {
                                //console.log("Send a image 2/3");
                                socket.emit("image", roomId, reader.result);
                                $("#fileInput").val(null);//清空值，修复选择相同文件不触发的bug
                                //console.log("Send a image 3/3");
                            }, false);

                            if (file) {
                                if (!/image\/\w+/.test(file.type)) {
                                    showAlert("请确保文件为图像类型");
                                } else {
                                    reader.readAsDataURL(file);
                                }
                            }
                        }

                        //加入房间
                        function joinRoomAlert() {
                            $("#btnSubmit").unbind();
                            $("#status").text("请输入房间号码");
                            $("#loginWapper")[0].style.display = "none";
                            $("#joinRoom")[0].style.display = "block";
                            $("#btnSubmit").bind("click", (function () {
                                let roomId = parseInt($("#inputRoom").val());
                                if (Number.isInteger(roomId) && roomId > 0) {
                                    socket.emit("join", roomId);
                                    $(".dataSpan")[0].innerText = roomId;
                                    $("h1").text("房间 " + $(".dataSpan")[0].innerText);
                                    $("#modalLogin").modal("hide");
                                    rooms[roomId] = [];
                                    $("#joinRoom")[0].style.display = "none";
                                } else {
                                    $("#inputRoom").val("");
                                    $("#status").text("房间号码必须是正整数");
                                }
                            }));
                            $("#modalLogin").modal("show");
                        }

                        joinRoomAlert();

                    } else if (userStatus == "nameExisted") {
                        $("#status").text("昵称已被使用，请重新输入");
                        $("#inputName").val("");
                        $("#loginWapper")[0].style.display = "block";
                    } else if (userStatus == "nameNonHalal") {
                        $("#status").text("昵称不合法，请重新输入");
                        $("#inputName").val("");
                        $("#loginWapper")[0].style.display = "block";
                    } else if (userStatus == "nameTooLong") {
                        $("#status").text("昵称过长，请重新输入");
                        $("#inputName").val("");
                        $("#loginWapper")[0].style.display = "block";
                    }
                });

                //用户加入或退出
                socket.on("user", function (roomId, userName, userStatus) {
                    timeTest();
                    if (userStatus == "login") {
                        //addText("System", "用户 [" + userName + "] 加入", "red", true);
                        addInfo(userName + " 加入了聊天");
                        console.log("user arrive: " + userName);
                    } else {
                        //addText("System", "用户 [" + userName + "] 离开", "red", true);
                        addInfo(userName + " 离开了聊天");
                        console.log("user left: " + userName);
                    }
                    lastMessageTime = (new Date()).valueOf();
                });

                //文字消息到达
                socket.on("textMessage", function (roomId, userName, content, color, fromSystem) {
                    addText(roomId, userName, content, color, fromSystem);
                    console.log("text message arrive , from " + userName + " : " + content);
                });

                //图片消息到达
                socket.on("imageMessage", function (roomId, userName, content) {
                    addImage(roomId, userName, content);
                    console.log("image message arrive , from " + userName);
                });

                //刷新用户列表事件
                socket.on("flushUsers", function (roomId, userList, mailList, urlList) {
                    //$("h3").text(userList.length + " user" + (userList.length > 1 ? "s" : "") + " online");
                    //$("h1").text("房间号：" + $(".dataSpan")[0].innerText);
                    $("h3").text(userList.length + " 位用户在线");
                    $("#div-users").empty();
                    rooms[roomId]["usersList"] = userList;
                    if (mailList) rooms[roomId]["mailsList"] = mailList;
                    if (urlList) rooms[roomId]["urlsList"] = urlList;
                    rooms[roomId]["avatarsList"] = new Array(userList.length);
                    if (true) {
                        for (let i = 0; i < userList.length; i++) {
                            if (mailList && mailList[i]) {
                                rooms[roomId]["avatarsList"][i] = new Image();
                                rooms[roomId]["avatarsList"][i].src = "https://secure.gravatar.com/avatar/" + mailList[i] + "?s=64";
                            } else {
                                //rooms["avatarsList"][roomId][i] = new Image();
                                //rooms["avatarsList"][roomId][i].src = 一些别的随机头像;
                            }
                        }
                    }
                    console.log(userList);
                    console.log(mailList);
                    console.log(urlList);
                    //console.log(avatarsList);
                });

            }

            //不在线，弹框无法关闭
            $('#modalLogin').on('hidden.bs.modal', function () {
                if (!flagOnline) {
                    $("#modalLogin").modal();
                }
                //未加入任何房间，弹框无法关闭
                if (!rooms || rooms.length < 1) {
                    $("#modalLogin").modal();
                }
            });


            //头像p元素
            function getAvatar(roomId, title) {
                let avatarLetter = title[0].toUpperCase();//获取首字母并大写
                let textAvatar = document.createElement("p");
                textAvatar.className = "avatar";
                textAvatar.textContent = avatarLetter;

                let indexOfList = rooms[roomId]["usersList"].indexOf(title.toLowerCase());
                if (rooms[roomId]["mailsList"] && rooms[roomId]["mailsList"][indexOfList] != null) {
                    textAvatar.style.fontSize = 0;
                    let avatarImg = new Image();
                    avatarImg.src = rooms[roomId]["avatarsList"][indexOfList].src;
                    textAvatar.appendChild(rooms[roomId]["avatarsList"][indexOfList]);
                    rooms[roomId]["avatarsList"][indexOfList] = avatarImg;
                }
                if (rooms[roomId]["urlsList"] && rooms[roomId]["urlsList"][indexOfList] != null) {
                    textAvatar.onclick = function () {
                        window.open(rooms[roomId]["urlsList"][indexOfList]);
                    }
                    textAvatar.style.cursor = "pointer";
                }
                return textAvatar;
            }

            //发信人
            function getTextTitle(title, fromSystem) {
                let textTitle = document.createElement("p");
                textTitle.className = "p-title";
                title.replace(/[ ]/g, " ");
                textTitle.textContent = title;
                if (fromSystem == "system") {
                    //textTitle.style.color = "red";
                }
                return textTitle;
            }

            //文本消息到达，标题，内容，颜色，是否系统消息
            function addText(roomId, title, content, color, fromSystem) {

                let divMessage = document.createElement("div");
                if (title == name) {
                    divMessage.className = "div-message self-message clearfix";
                } else {
                    divMessage.className = "div-message clearfix";
                }

                divMessage.appendChild(getAvatar(roomId, title));

                timeTest();

                // let textTime = document.createElement("p");
                // textTime.className = "p-time";
                // textTime.textContent = getNowTime();
                // divMessage.appendChild(textTime);

                divMessage.appendChild(getTextTitle(title, fromSystem));

                let textMessage = document.createElement("p");
                textMessage.className = "p-message";
                let temp = document.createElement("div");
                temp.textContent = content;
                //将emoji部分替换为img元素
                /*
                 [emoji:(0-49)] ==> (\[emoji:)([0-4]{0,1}[0-9])(\])
                 <img src="./content/emoji/pic$2.png" />
                 //正则替换时只保留第二个括号内容（即id）
                 */
                let contentNew = temp.innerHTML.replace(/\n+/g, "<br>");
                contentNew = contentNew.replace(/[ ]/g, "&nbsp;");
                contentNew = contentNew.replace(/(\[emoji:)([0-4]{0,1}[0-9])(\])/g, "<img src=\"./content/emoji/pic$2.png\" alt=\"[emoji:$2]\"/>");
                textMessage.innerHTML = contentNew;//以html形式读入
                temp = textMessage.getElementsByTagName("img");
                for (i in temp) {
                    temp[i].onload = function () {
                        console.log(i);
                        scrollWindow();
                    }
                }
                temp = null;
                //textMessage.style.color = color ? color : "black";
                divMessage.appendChild(textMessage);

                let textHistory = $("#div-history")[0];
                textHistory.appendChild(divMessage);
                scrollWindow();
            }

            //信息
            function addInfo(content) {
                let divMessage = document.createElement("div");
                divMessage.className = "div-info clearfix";

                let textMessage = document.createElement("p");
                textMessage.className = "p-info";
                let temp = document.createElement("div");
                temp.textContent = content;
                let contentNew = temp.innerHTML.replace(/\n+/g, "<br>");
                contentNew = contentNew.replace(/[ ]/g, "&nbsp;");
                contentNew = contentNew.replace(/(\[emoji:)([0-4]{0,1}[0-9])(\])/g, "<img src=\"./content/emoji/pic$2.png\" alt=\"[emoji:$2]\"/>");
                temp = null;
                textMessage.innerHTML = contentNew;//以html形式读入
                //textMessage.style.color = color ? color : "black";
                divMessage.appendChild(textMessage);

                let textHistory = $("#div-history")[0];
                textHistory.appendChild(divMessage);
                scrollWindow();
            }

            //时间
            function addTime(content) {
                let divMessage = document.createElement("div");
                divMessage.className = "div-time clearfix";

                let textMessage = document.createElement("p");
                textMessage.className = "p-time";
                let temp = document.createElement("div");
                temp.textContent = content;
                let contentNew = temp.innerHTML.replace(/\n+/g, "<br>");
                contentNew = contentNew.replace(/[ ]/g, "&nbsp;");
                contentNew = contentNew.replace(/(\[emoji:)([0-4]{0,1}[0-9])(\])/g, "<img src=\"./content/emoji/pic$2.png\" alt=\"[emoji:$2]\"/>");
                temp = null;
                textMessage.innerHTML = contentNew;//以html形式读入
                //textMessage.style.color = color ? color : "black";
                divMessage.appendChild(textMessage);

                let textHistory = $("#div-history")[0];
                textHistory.appendChild(divMessage);
                scrollWindow();
            }

            //图像消息到达，标题，图片（base64数据）
            function addImage(roomId, title, image, fromSystem) {

                let divMessage = document.createElement("div");

                if (title == name) {
                    divMessage.className = "div-message self-message clearfix";
                } else {
                    divMessage.className = "div-message clearfix";
                }

                divMessage.appendChild(getAvatar(roomId, title));

                timeTest();

                // let textTime = document.createElement("p");
                // textTime.className = "p-time";
                // textTime.textContent = getNowTime();
                // divMessage.appendChild(textTime);

                divMessage.appendChild(getTextTitle(title, fromSystem));

                let textHistory = $("#div-history")[0];

                let imageMessage = document.createElement("img");
                imageMessage.className = "img-message";
                imageMessage.onload = function () {
                    scrollWindow();
                }
                imageMessage.src = image;
                imageMessage.alt = "[图片]"
                divMessage.appendChild(imageMessage);

                textHistory.appendChild(divMessage);

            }

            //定义表情弹框按钮
            let isDisplay = false;
            $("#formEmoji").click(function (e) {
                e.stopPropagation();
            })
            $("#btnEmoji").click(function (e) {
                e.stopPropagation();
                if (isDisplay) {
                    $("#formEmoji")[0].style.display = "none";
                    $(document.body).unbind();
                    isDisplay = false;
                } else {
                    $("#formEmoji")[0].style.display = "block";
                    $(document.body).bind("click", (function () {
                        $("#btnEmoji")[0].click();
                        console.log("关闭表情标签页");
                    }));
                    isDisplay = true;
                }
            });

            //定义重置按钮事件
            $("#btnClear").click(function () {
                $("#textSend").html("");
            });

            //定义清屏按钮事件
            $("#btnClearScreen").click(function () {
                $("#div-history").empty();
                lastMessageTime = 0;//刷新时间显示
            });

            //定义图片按钮事件
            $("#btnImage").click(function () {
                return $("#fileInput").click();//将点击事件传至input:file对象
            });

            //不同的输入方式
            $("#inputWay2").click(function () {
                //文本框绑定
                $("#textSend").unbind();
                $("#textSend").bind("keypress", (function (e) {
                    if (e.ctrlKey && e.which == 13 || e.which == 10) {
                        $("#btnSend").click();
                    }
                }));
                $("#inputWay1")[0].className = null;
                $("#inputWay2")[0].className = "choosed";
                localStorage.inputWay = 2;
            });

            $("#inputWay1").click(function () {
                //文本框绑定
                $("#textSend").unbind();
                $("#textSend").bind("keypress", (function (e) {
                    if (e.ctrlKey && e.which == 13 || e.which == 10) {
                        //$("#textSend").val($("#textSend").val() + "\n");
                        $("#textSend").html($("#textSend").html() + "<br>");
                    } else if (e.which == 13 || e.which == 10) {
                        $("#btnSend").click();
                        e.preventDefault()
                    }
                }));
                $("#inputWay2")[0].className = null;
                $("#inputWay1")[0].className = "choosed";
                localStorage.inputWay = 1;
            });

            let inputWay = localStorage.inputWay;
            if (inputWay == 2) {
                $("#inputWay2").click();
            } else {
                $("#inputWay1").click();
            }

            //批量添加表情
            for (let x = 0; x < 50; x++) {
                let emojiUrl = "./content/emoji/pic" + x + ".png";//图片源

                let emojiForm = $("#formEmoji")[0];
                let newEmojiA = document.createElement("a");//创建包裹图片的链接
                let newEmojiPic = document.createElement("img");//创建图片对象
                //图片对象的属性
                // newEmojiPic.style.width = "30px";
                // newEmojiPic.style.height = "30px";
                newEmojiPic.src = emojiUrl;
                //链接对象的属性
                newEmojiA.id = "emoji:" + x;
                newEmojiA.href = "javascript:;"
                newEmojiA.className = "emojiPic";
                //绑定被单击事件
                newEmojiA.addEventListener("click", function () {
                    //$("#textSend")[0].value += "[" + this.id + "]";
                    $("#textSend")[0].innerHTML += "[" + this.id + "]";
                    //$("#btnEmoji")[0].click();
                });

                newEmojiA.appendChild(newEmojiPic)//将img元素添加进a元素
                emojiForm.appendChild(newEmojiA);//再添加进表情框中
            }

            //动态设置高度
            function resetHeight() {
                let nowHeight = document.documentElement.clientHeight;
                if (nowHeight < 554) {
                    nowHeight = 554;
                }
                //nowHeight -= 350;
                nowHeight -= $("#div-user")[0].clientHeight;
                nowHeight -= $("#chatTtles")[0].clientHeight;
                $("#formEmoji")[0].style.top = nowHeight - 182 + "px";
                $("#div-history")[0].style.height = nowHeight + "px";
                $("#div-users")[0].style.height = nowHeight + $("#div-user")[0].clientHeight - 240 + "px";
            }

            window.onresize = function () {
                resetHeight();
                scrollWindow();
            }
            resetHeight();

            //滚动条下拉
            function scrollWindow() {
                let textHistory = $("#div-history")[0];
                if ((textHistory.scrollHeight - textHistory.scrollTop) < (2 * textHistory.clientHeight)) {
                    textHistory.scrollTop = textHistory.scrollHeight;//滚动条下拉
                }
            }

            //获取当前时间并格式化
            function getNowTime() {
                let nowDate = new Date();

                //let nowTime = (nowDate.getHours() > 9 ? nowDate.getHours() : "0" + nowDate.getHours()) + ":" + (nowDate.getMinutes() > 9 ? nowDate.getMinutes() : "0" + nowDate.getMinutes()) + ":";

                //(nowDate.getSeconds() > 9 ? nowDate.getSeconds() : "0" + nowDate.getSeconds())

                let nowHour = nowDate.getHours();
                let timeStatus;
                if (nowHour < 5) {
                    timeStatus = "凌晨 ";
                } else if (nowHour < 12) {
                    timeStatus = "上午 ";
                } else if (nowHour == 12) {
                    timeStatus = "中午 ";
                } else if (nowHour < 18) {
                    timeStatus = "下午 ";
                } else {
                    timeStatus = "晚上 ";
                }
                let nowTime = timeStatus + (nowHour > 12 ? nowHour - 12 : nowHour) + ":" + (nowDate.getMinutes() > 9 ? nowDate.getMinutes() : "0" + nowDate.getMinutes());
                return nowTime;
            }

            let timeSet = -120500;

            function timeTest() {
                timeSet += 500;
                if (lastMessageTime - (new Date()).valueOf() < timeSet || !lastMessageTime) {//一定时间没有收到新消息
                    addTime(getNowTime());
                    timeSet = -120000;
                }
                lastMessageTime = (new Date()).valueOf();
            }
        })();
    </script>
    </body>

    </html>
<?php } ?>