/**
 * 时钟类
 */
class Clock {
  /**
   * 构造一个时钟类
   * @param {HTMLElement} dom 传入的DOM对象
   */
  constructor(dom) {
    this._dom = dom;
    const thisObj = this;
    requestAnimationFrame(function raf(t) {
      thisObj.dom.innerText = new Date().toLocaleString();
      requestAnimationFrame(raf);
    });
  }
  get dom() {
    return this._dom;
  }
}

/**
 * 时钟类
 * @param {HTMLElement} domIN 传入的DOM对象
 */
function Clock2(domIN) {
  this._dom = domIN;
  const thisObj = this;
  requestAnimationFrame(function raf(t) {
    thisObj.dom.innerText = new Date().toLocaleString();
    requestAnimationFrame(raf);
  });
}
Clock2.prototype = {
  get dom() {
    return this._dom;
  }
};

/**
 * 时钟类
 * @param {HTMLElement} dom 传入的DOM对象
 */
function Clock3(dom) {
  requestAnimationFrame(() => {
    var a = t => {
      dom.innerText = new Date().toLocaleString();
      requestAnimationFrame(a);
    };
    a();
  });
}

/**
 * 时钟类
 * @param {HTMLElement} dom 传入的DOM对象
 */
function Clock4(dom) {
  dom.innerText = new Date().toLocaleString();
  requestAnimationFrame(() => new Clock4(dom));
}

/**
 * 时钟类
 * @param {HTMLElement} dom 传入的DOM对象
 */
function Clock5(dom){
  dom.innerText = (new Date().toLocaleString() + ("" & (requestAnimationFrame(() => new Clock5(dom))))).slice(0,-1);
};

/**
 * 时钟函数
 * @param {HTMLElement} dom 传入的DOM对象
 */
const Clock6 = (dom) => dom.innerText = (new Date().toLocaleString() + ('' & (requestAnimationFrame(() => Clock6(dom))))).slice(0,-1);


const clock = new Clock(document.getElementsByTagName("span")[0]);
const clock2 = new Clock2(document.getElementsByTagName("span")[1]);
const clock3 = new Clock3(document.getElementsByTagName("span")[2]);
const clock4 = new Clock4(document.getElementsByTagName("span")[3]);
const clock5 = new Clock5(document.getElementsByTagName("span")[4]);
Clock6(document.getElementsByTagName("span")[5]);