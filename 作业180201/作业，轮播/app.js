console.time("ReadyAt");

/**
 * 轮播组件
 * @param {HTMLDivElement} dom 要解析轮播的元素
 */
function LoopPlay(dom) {
  //动态加载DOM对象
  const thisObj = this;
  const loopList = new Array();
  this.getLoopList = function() {
    return loopList;
  };
  const superNode = dom;
  const parentNode = superNode.getElementsByTagName("div")[0];
  parentNode.className = "img-set";
  const target = parentNode.getElementsByTagName("div");
  const titleNode = document.createElement("div");
  const trigNode = document.createElement("div");
  titleNode.className = "title-set";
  trigNode.className = "trig-set";
  superNode.appendChild(titleNode);
  superNode.appendChild(trigNode);

  //计时器相关
  let timeCount;
  let nowPlay = 0;

  for (let i in target) {
    let temp;
    try {
      /**
       * @type {Object}
       */
      temp = JSON.parse(target[i].innerHTML);
      target[i].innerHTML = "";
      let tmpA = document.createElement("a");
      target[i].appendChild(tmpA);
      tmpA.href = temp.url;
      tmpA.target = "_blank";
      let length = loopList.push(temp);
      temp.dom = target[i];
      temp.dom.style.backgroundImage = `url(${temp.img})`;
      temp.titleDom = document.createElement("div");
      tmpA = document.createElement("a");
      tmpA.innerHTML = temp.text;
      tmpA.href = temp.url;
      tmpA.target = "_blank";
      temp.titleDom.appendChild(tmpA);
      titleNode.appendChild(temp.titleDom);
      temp.trig = document.createElement("span");
      temp.trig.addEventListener("click", () => {
        loopTo(temp);
        nowPlay = length - 1;
      });
      trigNode.appendChild(temp.trig);
    } catch (e) {
      console.log(e);
    }
  }
  //主逻辑
  /**
   *
   * @param {HTMLElement} e
   */
  function loopTo(e) {
    loopList.forEach(element => {
      if (element == e) {
        element.titleDom.style.zIndex = 3;
        element.titleDom.style.opacity = 1;
        element.trig.className = "on";
        //console.log("show");
      } else {
        element.titleDom.style.zIndex = "auto";
        element.titleDom.style.opacity = 0;
        element.trig.className = "";
        //console.log("hide");
      }
    });
    requestAnimationFrame(function(t) {
      timeCount = t;
    });
    parentNode.style.left = `${-e.dom.offsetLeft /
      superNode.clientWidth *
      100}%`;
    //console.log(e);
    console.log("Runned");
  }
  requestAnimationFrame(function raf(t) {
    if (!timeCount) {
      timeCount = t - 4000;
    }
    if (t - timeCount > 4000) {
      loopTo(loopList[nowPlay++]);
      if (nowPlay == loopList.length) {
        nowPlay = 0;
      }
    }
    requestAnimationFrame(raf);
  });
  thisObj.loopTo = loopTo;
  //console.log(loopList);
}

const loopPlayArr = Array.prototype.map.call(
  document.getElementsByClassName("loopPlay"),
  d => new LoopPlay(d)
);
// var a = new Image();
// var b = document.createElement("img");
console.timeEnd("ReadyAt");
