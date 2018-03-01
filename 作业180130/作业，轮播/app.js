console.time("ReadyAt");
//动态加载DOM对象
const loopList = new Array();
const superNode = document.getElementsByClassName("loopPlay")[0];
const parentNode = document
  .getElementsByClassName("loopPlay")[0]
  .getElementsByTagName("div")[0];
const target = document
  .getElementsByClassName("loopPlay")[0]
  .getElementsByTagName("div")[0]
  .getElementsByTagName("div");
const titleNode = document.createElement("div");
superNode.appendChild(titleNode);
for (let i in target) {
  let temp;
  try {
    temp = JSON.parse(target[i].innerHTML);
    target[i].innerHTML = "";
    let tmpA = document.createElement("a");
    target[i].appendChild(tmpA);
    tmpA.href = temp.url;
    tmpA.target = "_blank";
    loopList.push(temp);
    temp.dom = target[i];
    temp.dom.style.backgroundImage = `url(${temp.img})`;
    temp.titleDom = document.createElement("div");
    tmpA = document.createElement("a");
    tmpA.innerHTML = temp.text;
    tmpA.href = temp.url;
    tmpA.target = "_blank";
    temp.titleDom.appendChild(tmpA);
    titleNode.appendChild(temp.titleDom);
  } catch (e) {
    console.log(e);
  }
}
//主逻辑
(function() {
  let timeCount;
  let nowPlay = 0;
  /**
   *
   * @param {HTMLElement} e
   */
  function loopTo(e) {
    loopList.forEach(element => {
      if (element == e) {
        element.titleDom.style.zIndex = 20;
        element.titleDom.style.opacity = 1;
        console.log("show");
      } else {
        element.titleDom.style.zIndex = "auto";
        element.titleDom.style.opacity = 0;
        console.log("hide");
      }
    });
    requestAnimationFrame(function(t) {
      timeCount = t;
    });
    parentNode.style.left = `${(superNode.offsetLeft - e.dom.offsetLeft) /
      superNode.clientWidth *
      100}%`;
    console.log(e);
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
  console.log(loopList);
})();

// var a = new Image();
// var b = document.createElement("img");
console.timeEnd("ReadyAt");