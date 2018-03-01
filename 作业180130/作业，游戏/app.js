console.time("ReadyAt");

const TIME_COUNT = 20000;
const IMG_LENGTH = 3;
const IMG_WIDTH = 512;

const gameSet = document.getElementById("game");
const scoreSet = document.getElementById("score");
const timeSet = document.getElementById("time");

const imgArr = new Array();

let level = 1;
let socre = 0;

function randImg() {
  const ranNum = parseInt(Math.random() * IMG_LENGTH + 1);
  imgArr[0] = `img${ranNum}-0.png`;
  imgArr[1] = `img${ranNum}-1.png`;
}
function timeToString(t) {
  return `${parseInt(t / 1000)}.${(function() {
    let re = parseInt((t % 1000) / 10);
    if (re < 10) {
      return `0${re}`;
    } else {
      return re.toString();
    }
  })()}`;
}
function refreshScore() {
  scoreSet.innerText = `分数：${socre}`;
}
function refreshTime(t) {
  timeSet.innerText = `剩余时间${timeToString(t)}秒`;
}
function newImage() {
  const img = new Image();
  img.src = imgArr[0];
  return img;
}
function newColumn(width) {
  const colDom = document.createElement("div");
  for (let i = 0; i < width; i++) {
    colDom.appendChild(newImage());
  }
  return colDom;
}
function newForm(height) {
  const rowDom = document.createElement("div");
  for (let i = 0; i < height; i++) {
    rowDom.appendChild(newColumn(height));
  }
  function randRGB() {
    return parseInt(Math.random() * 256);
  }
  const randColor = `rgb(${randRGB()},${randRGB()},${randRGB()})`;
  Array.prototype.forEach.call(rowDom.getElementsByTagName("img"), e => {
    e.style.backgroundColor = randColor;
  });
  return rowDom;
}
function bindClick() {
  const allDom = document.getElementsByTagName("img");
  const tempWidth = parseInt(IMG_WIDTH / level);
  function nextLevel() {
    console.time("LevelUpdate");
    level++;
    if (level > 9) {
      level = 9;
    }
    gameSet.innerHTML = "";
    randImg();
    gameSet.appendChild(newForm(level));
    refreshScore();
    bindClick();
    console.timeEnd("LevelUpdate");
  }
  Array.prototype.forEach.call(allDom, dom => {
    dom.onclick = e => {
      nextLevel();
    };
    dom.style.width = `${tempWidth}px`;
    dom.style.height = `${tempWidth}px`;
  });
  const randDom = allDom[parseInt(Math.random() * allDom.length)];
  randDom.src = imgArr[1];
  randDom.onclick = e => {
    socre += level * 10;
    nextLevel();
  };
}
function init() {
  level = 1;
  socre = 0;
  refreshScore();
  refreshTime(TIME_COUNT);
  randImg();
  gameSet.innerHTML = "";
  gameSet.appendChild(newForm(level));
}
init();
document
  .getElementById("start")
  .addEventListener("click", function startNewGame(e) {
    const theThis = this;
    this.style.display = "none";
    bindClick();
    let tStart;
    let tmpTimeCount;
    requestAnimationFrame(function raf(t) {
      if (!tStart) {
        tStart = t;
      }
      tmpTimeCount = TIME_COUNT - (t - tStart);
      refreshTime(tmpTimeCount);

      if (tmpTimeCount <= 0) {
        refreshTime(0);
        theThis.style.display = "block";
        alert(`游戏结束！得分：${socre}`);
        init();
      } else {
        requestAnimationFrame(raf);
      }
    });
  });

console.timeEnd("ReadyAt");
