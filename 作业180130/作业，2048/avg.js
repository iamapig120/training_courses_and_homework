(function(window, undefined) {
  // 构造对象
  // 部分抄袭来自jQuery
  let canvasMain; //主绘图板
  let document = window.document,
    navigator = window.navigator,
    location = window.location;
  let paintBrush; //2D画笔
  let theLayer = new Array(); //图层记录
  let audioBGM, //音乐音效
    audioBGSE = new Array(),
    audioVoice;
  let volumeBGM, volumeSE, volumeVoice;
  let windowWidth, windowHeight;
  let backgroundColor;
  let defaultFont, defaultFontColor;
  let defaultChatX, defaultChatY;

  let mouseX = 0; //对外暴露的鼠标坐标
  let mouseY = 0;
  //let layerCount = 0;//图层计数
  function loadImgObjFromSrc(src) {
    if (src == null) return null;
    try {
      let imgObj = new Image();
      imgObj.src = src;
      return imgObj;
    } catch (e) {
      return null;
    }
  }
  //事件队列
  function eventQueue() {
    let queue = [];
    //let length = 0;
    //let pointer = 0;
    this.add = function(f) {
      queue.push(function() {
        return new Promise(resolve => {
          f(resolve);
        });
      });
      //length++;
      //next();
    };
    function hasNext() {
      return queue.length > 0;
    }
    function next() {
      let raf = requestAnimationFrame(async function autoRun() {
        while (hasNext()) {
          //console.log(pointer + "length");
          await queue[0]();
          //queue[pointer] = null;
          queue.splice(0, 1);
          //pointer++;
        }
        raf = requestAnimationFrame(autoRun);
      });
    }
    next();
  }
  let eQ;
  //图层对象
  //图像图层
  function imgLayerObj(p, resolve) {
    //if (p.src == null) return null;
    this.img = p.img;
    this.layer = 0;
    this.x,
      this.y,
      this.width,
      this.height,
      this.sx,
      this.sy,
      this.swidth,
      this.swidth,
      this.alpha,
      (this.type = "image");
    this.rotate, this.rotatePointX, this.rotatePointY;
    let obj = this;
    if (p.rotate != null) {
      //旋转相关
      this.rotate = p.rotate;
      this.rotatePointX = p.rotatePointX != null ? p.rotatePointX : null;
      this.rotatePointY = p.rotatePointY != null ? p.rotatePointY : null;
    } else {
      this.rotate = 0;
      this.rotatePointX = 0;
      this.rotatePointY = 0;
    }
    this.alpha = p.alpha == null ? 1 : p.alpha;
    obj.x = p.x == null ? 0 : p.x; //在画布上放置图像的 x 坐标位置。
    obj.y = p.y == null ? 0 : p.y; //在画布上放置图像的 y 坐标位置。
    obj.sx = p.sx == null ? 0 : p.sx; //sx 可选。开始剪切的 x 坐标位置。
    obj.sy = p.sx == null ? 0 : p.sy; //sy 可选。开始剪切的 y 坐标位置。
    obj.width =
      p.width == null ? (p.img.width != null ? p.img.width : 0) : p.width; //可选。要使用的图像的宽度。（伸展或缩小图像）
    obj.height =
      p.height == null ? (p.img.height != null ? p.img.height : 0) : p.height; //可选。要使用的图像的宽度。（伸展或缩小图像）
    obj.swidth =
      p.swidth == null ? (p.img.width != null ? p.img.width : 0) : p.swidth; //swidth	可选。被剪切图像的宽度。
    obj.sheight =
      p.sheight == null ? (p.img.height != null ? p.img.height : 0) : p.sheight; //sheight	可选。被剪切图像的高度。
    let state = 0;
    if (p.img.width > 0 && p.img.height > 0) {
      state = 1;
      resolve();
    }
    this.img.onload = function() {
      obj.width = p.width == null ? obj.img.width : p.width; //可选。要使用的图像的宽度。（伸展或缩小图像）
      obj.height = p.height == null ? obj.img.height : p.height; //可选。要使用的图像的宽度。（伸展或缩小图像）
      obj.swidth = p.swidth == null ? obj.img.width : p.swidth; //swidth	可选。被剪切图像的宽度。
      obj.sheight = p.sheight == null ? obj.img.height : p.sheight; //sheight	可选。被剪切图像的高度。
      if (state == 0) resolve();
    };
    //this.img.src = p.src;
  }
  //文字图层
  function textLayerObj(p, resolve) {
    this.type = "text";
    this.text = p.text;
    this.font = p.font == null ? defaultFont : p.font;
    this.color = p.color == null ? defaultFontColor : p.color;
    this.x = p.x;
    this.y = p.y;
    if (p.rotate != null) {
      //旋转相关
      this.rotate = p.rotate;
      this.rotatePointX = p.rotatePointX != null ? p.rotatePointX : null;
      this.rotatePointY = p.rotatePointY != null ? p.rotatePointY : null;
    } else {
      this.rotate = 0;
      this.rotatePointX = 0;
      this.rotatePointY = 0;
    }
    this.alpha = p.alpha == null ? 1 : p.alpha;
    resolve();
  }
  //从图片加载图层
  function loadImage(parameter, resolve) {
    //参数 layer
    try {
      // function imgReady() {
      //     drawImageLayer();
      // }
      //parameter.ready = imgReady;
      //console.log(parameter.layer);
      if (parameter.src) {
        parameter.img = loadImgObjFromSrc(parameter.src);
      }
      //parameter.type = "image";
      //parameter.img =
      theLayer[parameter.layer] = new imgLayerObj(parameter, resolve);
      //console.log(imageLayer);
    } catch (e) {
      console.log(e);
    }
  }
  //从文本加载图层
  function loadText(parameter, resolve) {
    //参数 layer
    try {
      // function imgReady() {
      //     drawImageLayer();
      // }
      //parameter.ready = imgReady;
      //console.log(parameter.layer);
      // if (parameter.src) {
      //     parameter.img = loadImgObjFromSrc(parameter.src);
      // }
      //parameter.type = "image";
      //parameter.img =
      theLayer[parameter.layer] = new textLayerObj(parameter, resolve);
      //console.log(imageLayer);
    } catch (e) {
      console.log(e);
    }
  }
  //移动图层
  function move(parameter, time, resolve) {
    //参数 layer
    //参数 time
    try {
      if (theLayer[parameter.layer]) {
        let p = {}; //差值
        let startTime = performance.now();
        let nowTime;
        let animeTime = time;
        let pBackup = {}; //原值
        for (let i in parameter) {
          pBackup[i] = theLayer[parameter.layer][i];
          p[i] = theLayer[parameter.layer][i];
          p[i] -= parameter[i];
          p[i] *= -1;
        }
        p.layer = 0;
        let layer = parameter.layer;
        let timeCount;
        let percent;
        let raf = requestAnimationFrame(function refreshImage() {
          if (timeCount <= 0) {
            for (let i in p) {
              theLayer[layer][i] = p[i] + pBackup[i];
            }
            cancelAnimationFrame(raf);
            return true;
          }
          nowTime = performance.now();
          percent = (nowTime - startTime) / animeTime;
          if (percent > 1) {
            percent = 1;
          }
          for (let i in p) {
            theLayer[layer][i] = percent * p[i] + pBackup[i];
          }
          timeCount = animeTime - (nowTime - startTime);
          raf = requestAnimationFrame(refreshImage);
        });
        resolve();
        //refreshImage(time);
      }
    } catch (e) {
      console.log(e);
    }
  }
  // function creaveWindow(width, height) {
  //     creaveWindow(width, height, "avgMain", "", "avgMain");
  // }
  //绘制一个canvas (宽度,高度,id,cladd,name)
  //let refreshSet;
  //let refreshRate;
  //绘制主窗口并初始化
  function creaveWindow(p) {
    let newCanvasObject = document.createElement("canvas");
    p.idName = p.idName != null ? p.idName : "avgMain";
    p.className = p.className != null ? p.className : "avgMain";
    p.realName = p.realName != null ? p.realName : "avgMain";
    newCanvasObject.setAttribute("id", p.idName != null ? p.idName : "avgMain");
    newCanvasObject.setAttribute(
      "class",
      p.className != null ? p.className : "avgCanvas"
    );
    backgroundColor = p.backgroundColor != null ? p.backgroundColor : "#000";
    defaultFont =
      p.defaultFont != null ? p.defaultFont : '40px Arial,"Microsoft Yahei"';
    defaultFontColor = p.defaultFontColor != null ? p.defaultFontColor : "#FFF";
    newCanvasObject.setAttribute("name", p.realName ? p.realName : "avgMain");
    newCanvasObject.width = p.width;
    newCanvasObject.height = p.height;
    newCanvasObject.style.touchAction = "none";
    // newCanvasObject.setAttribute(
    //     "style",
    //     "width:" + p.width + "px;height:" + p.height + "px;"
    // );
    //设置div的属性
    //newCanvasObject.innerHTML = '';
    //设置显示的数据，可以是标签
    //newCanvasObject.style.width = width;
    //newCanvasObject.style.height = height;
    //设置css样式
    document.body.insertBefore(newCanvasObject, document.body.lastChild);
    canvasMain = newCanvasObject;
    paintBrush = newCanvasObject.getContext("2d");
    //document.write(newCanvasObject);
    //动态插入到body中
    //refreshRate = p.refresh == null ? 10 : p.refresh;
    //console.log(refreshRate);
    //refreshSet = performance.now();
    //音量
    volumeBGM = p.volumeBGM != null ? p.volumeBGM : 0.7;
    volumeSE = p.volumeSE != null ? p.volumeSE : 0.7;
    volumeVoice = p.volumeVoice != null ? p.volumeVoice : 0.7;
    windowWidth = p.width;
    windowHeight = p.height;
    eQ = new eventQueue(); //创建一个事件队列对象

    let dom = canvasMain;
    let bbox = dom.getBoundingClientRect();
    function mouseMoveFun(e) {
      mouseX = e.clientX - bbox.left * (dom.width / bbox.width);
      mouseY = e.clientY - bbox.top * (dom.height / bbox.height);
    }
    dom.addEventListener("mousemove", mouseMoveFun);

    drawImageLayer();

    console.log("avg.Js 已完成初始化");
  }
  //移除图层
  function removeLayer(layerNo, resolve) {
    //console.log(imageLayer);
    theLayer[layerNo] = null;
    resolve();
  }
  //移除全部图层
  function removeAllLayer(resolve) {
    //console.log(imageLayer);
    for (i in theLayer) {
      theLayer[i] = null;
    }
    resolve();
  }
  //等待
  function wait(t, resolve) {
    //console.log("wait:" + t + " ms At " + performance.now());
    // setTimeout(function() {
    //     resolve();
    // }, t);
    let startTime = performance.now();
    t -= 13.34;
    if (t < 0) t = 0;
    let goneTime;
    let raf = requestAnimationFrame(function waitCont() {
      //console.log("inLoop");
      goneTime = performance.now() - startTime;
      if (goneTime >= t) {
        //console.log("ready:" + t + " ms At " + performance.now());
        resolve();
      } else {
        raf = requestAnimationFrame(waitCont);
      }
    });
  }
  //帧等待
  function waitByFrame(f, resolve) {
    //console.log("wait:" + f + " frames At " + performance.now());
    // setTimeout(function() {
    //     resolve();
    // }, t);
    let leftFrame = f;
    let raf = requestAnimationFrame(function waitCont() {
      //console.log("inLoop");
      leftFrame--;
      if (leftFrame <= 0) {
        //console.log("ready:" + f + " frames At " + performance.now());
        resolve();
      } else {
        raf = requestAnimationFrame(waitCont);
      }
    });
  }
  //依次重新绘制图层
  function drawImageLayer() {
    let raf = requestAnimationFrame(function autoRun() {
      //if (performance.now() - refreshSet >= refreshRate) { //老的基于setTimeout
      if (true) {
        //refreshSet = performance.now();
        //console.log(imageLayer);
        paintBrush.beginPath();
        paintBrush.globalAlpha = 1;
        paintBrush.fillStyle = backgroundColor;
        paintBrush.fillRect(0, 0, windowWidth, windowHeight);
        for (let i in theLayer) {
          let e = theLayer[i];
          //console.log(i);
          //console.log(e);
          //图像绘制逻辑
          if (e && e.type == "image") {
            paintBrush.globalAlpha = e.alpha;
            if (e.rotate != 0) {
              let _rX = 0;
              let _rY = 0;
              if (e.rotatePointX == null && e.rotatePointY == null) {
                _rX = e.x;
                _rY = e.y;
                //console.log(_rX + "," + _rY);
              } else if (e.rotatePointX != null || e.rotatePointY != null) {
                _rX = e.rotatePointX;
                _rY = e.rotatePointY;
              }
              paintBrush.translate(_rX, _rY);
              let rotateRate = e.rotate * Math.PI / 180;
              paintBrush.rotate(rotateRate);
              paintBrush.drawImage(
                e.img,
                e.sx,
                e.sy,
                e.swidth,
                e.sheight,
                e.x - _rX,
                e.y - _rY,
                e.width,
                e.height
              );
              paintBrush.rotate(-rotateRate);
              paintBrush.translate(-_rX, -_rY);
              continue;
            }
            paintBrush.drawImage(
              e.img,
              e.sx,
              e.sy,
              e.swidth,
              e.sheight,
              e.x,
              e.y,
              e.width,
              e.height
            );
            //paintBrush.drawImage(e.img, e.x, e.y);
          } else if (e && e.type == "text") {
            paintBrush.globalAlpha = e.alpha;
            paintBrush.fillStyle = e.color;
            paintBrush.font = e.font;
            if (e.rotate != 0) {
              let _rX = 0;
              let _rY = 0;
              if (e.rotatePointX == null && e.rotatePointY == null) {
                _rX = e.x;
                _rY = e.y;
                //console.log(_rX + "," + _rY);
              } else if (e.rotatePointX != null || e.rotatePointY != null) {
                _rX = e.rotatePointX;
                _rY = e.rotatePointY;
              }
              paintBrush.translate(_rX, _rY);
              let rotateRate = e.rotate * Math.PI / 180;
              paintBrush.rotate(rotateRate);
              paintBrush.fillText(e.text, e.x - _rX, e.y - _rY);
              paintBrush.rotate(-rotateRate);
              paintBrush.translate(-_rX, -_rY);
              continue;
            }
            paintBrush.fillText(e.text, e.x, e.y);
          }
        }
        paintBrush.closePath();
        // a.forEach(function (e) {
        //     paintBrush.drawImage(e.img, e.sx, e.sy, e.swidth, e.sheight, e.x, e.y, e.width, e.height)
        // }, this);
      }
      raf = requestAnimationFrame(autoRun);
    });
  }
  //播放BGM
  function playBGM(p, resolve) {
    //p.src 从src加载曲目
    //p.audio 从audio加载曲目
    try {
      if (p.src) {
        if (!audioBGM) {
          audioBGM = new Audio(p.src);
        } else {
          audioBGM.src = p.src;
        }
      } else {
        if (!audioBGM) {
          audioBGM.pause();
        }
        audioBGM = p.audio;
      }
      audioBGM.autoplay = true;
      audioBGM.loop = true;
      audioBGM.volume = volumeBGM * (p.volume == null ? 1 : p.volume);
      if (audioBGM.readyState == 4) {
        audioBGM.play();
        resolve();
      } else {
        audioBGM.oncanplay = function() {
          audioBGM.play();
          resolve();
        };
      }
    } catch (e) {
      console.log(e);
      resolve(); //如果加载失败继续执行
    }
  }
  //执行时间
  function runFunction(f, resolve) {
    try {
      f();
    } catch (e) {
      console.log(e);
      console.log("runFunction runError");
    } finally {
      resolve();
    }
  }
  //坐标获取
  //入参 e.clientX , e.clientY
  function getLocation(x, y) {
    return {
      x: (x - canvasMain.left) * (canvas.width / canvasMain.width),
      y: (y - canvasMain.top) * (canvas.height / canvasMain.height)
      /*  
                         * 此处不用下面两行是为了防止使用CSS和JS改变了canvas的高宽之后是表面积拉大而实际  
                         * 显示像素不变而造成的坐标获取不准的情况  
                        x: (x - bbox.left),  
                        y: (y - bbox.top)  
                        */
    };
  }

  //    basetool = drawwindow;
  //    window.jsAvg = window.$ = jsAvg;
  //    window.jsAvg.basetool = drawwindow;
  window["avg"] = {};
  let avgJs = window["avg"];
  avgJs["creaveWindow"] = creaveWindow;

  avgJs["loadImage"] = function(p) {
    eQ.add(function(resolve) {
      loadImage(p, resolve);
    });
  };
  avgJs["loadText"] = function(p) {
    eQ.add(function(resolve) {
      loadText(p, resolve);
    });
  };
  avgJs["playBGM"] = function(p) {
    eQ.add(function(resolve) {
      playBGM(p, resolve);
    });
  };

  //avgJs["drawImageLayer"] = drawImageLayer;

  avgJs["removeLayer"] = function(p) {
    eQ.add(function(resolve) {
      removeLayer(p, resolve);
    });
  };
  avgJs["removeAllLayer"] = function() {
    eQ.add(function(resolve) {
      removeAllLayer(resolve);
    });
  };
  avgJs["move"] = function(p, t) {
    eQ.add(function(resolve) {
      move(p, t, resolve);
    });
  };
  avgJs["wait"] = function(t) {
    eQ.add(function(resolve) {
      wait(t, resolve);
    });
  };
  avgJs["waitByFrame"] = function(f) {
    eQ.add(function(resolve) {
      waitByFrame(f, resolve);
    });
  };
  avgJs["setColor"] = function(i, c) {
    eQ.add(function(resolve) {
      theLayer[i].color = c;
      resolve();
    });
  };
  avgJs["runFunction"] = function(f) {
    eQ.add(function(resolve) {
      runFunction(f, resolve);
    });
  };
  avgJs["getDOM"] = function() {
    return canvasMain;
  };
  avgJs["mouse"] = {};
  avgJs["mouse"].X = new function() {
    this.toString = function() {
      return mouseX;
    };
  }();
  avgJs["mouse"].Y = new function() {
    this.toString = function() {
      return mouseY;
    };
  }();
  //avgJs["loadImgObjFromSrc"] = loadImgObjFromSrc;
})(window);
