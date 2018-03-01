/**
 * 分数更新速度，单位 毫秒
 */
const SCORE_UPDATE_TIME = 400;
/**
 * 每个洞口每帧刷新狼的几率，一定刷新为 1
 */
const WOLF_REFRESH_RATE = 0.004;
/**
 * 单局游戏时长，单位 毫秒
 */
const GAME_TIME = 20000;
/**
 * 每次有效击打的奖励时长，单位 毫秒
 */
const RIGHT_AWARD_TIME = 400;
/**
 * 每次错误击打的扣除时长，单位 毫秒
 */
const MISTAKE_DEDUCTING_TIME = 200;
/**
 * 第几帧为静止帧
 */
const STATIC_FRAME = 5;
/**
 * 序列帧总帧数
 */
const FRAME_LENGTH = 10;
/**
 * 在场上的停留时长，单位 毫秒
 */
const WOLF_STOP_TIME = new function() {
    /**
     * @returns {number} 返回的随机时长,1.5到2秒
     */
    this.toString = function() {
        return Math.random() * 500 + 1500;
    };
}();
/**
 * 所有可用坐标键值对，单位 像素
 */
const POSTION = new Array(
    { x: 21, y: 160 },
    { x: 101, y: 115 },
    { x: 190, y: 142 },
    { x: 19, y: 221 },
    { x: 106, y: 192 },
    { x: 202, y: 212 },
    { x: 33, y: 294 },
    { x: 122, y: 274 },
    { x: 210, y: 296 }
);
/**
 * 所有可能出现的目标
 */
const WOLFS = new Array(
    { img: "imgs/h.png", score: 10, chance: 70, width: 108 },
    { img: "imgs/hex.png", score: s => s * 1.1 + 5, chance: 30, width: 108 },
    { img: "imgs/x.png", score: -10, chance: 30, width: 108 }
);

/**
 * 另外一种可能的定义方案
 */
// const WOLFS = new Array({
//   img: "imgs/h.png",
//   score: function(s) {
//     s += 10;
//     return s * 1.1;
//   },
//   chance: 100,
//   width: 108
// });

/**
 * 分数显示所用DOM
 */
const SCORE_DOM = document.getElementById("score_box");
/**
 * 时间进度条显示所用DOM
 */
const TIME_DOM = document.getElementById("progress_bar");
/**
 * 开始按钮所用DOM
 */
const START_BUTTON = document.getElementById("start");
/**
 * 洞口（狼）容器DOM
 */
const WOLF_BOX_DOM = document.getElementById("wolf_box");
/**
 * 游戏结束提示DOM
 */
const GAME_OVER_DOM = document.getElementById("gameOver");
/**
 * 作弊按钮DOM
 */
const CHEAT_BTN = document.getElementById("handle");
/**
 * 时间进度条的完整宽度
 */
const TIME_DOM_BASE_WIGTH = TIME_DOM.clientWidth;
/**
 * 100%概率对应的值
 */
const SUM_WOLFS_CHANCE = (() => WOLFS.reduce((a, b) => a + b.chance, 0))();

// var SUM_WOLFS_CHANCE = (function() {
//   let re = 0;
//   WOLFS.forEach(function(e) {
//     re += e.chance;
//   });
//   return re;
// })();

/**
 * requestAnimationFrame()的返回值，lang整数
 * @type {number}
 */
let rafSet;

/**
 * 记录当前总分
 * @type {number}
 */
let scoreSet;

/**
 * 记录当前剩余时长
 * @type {number}
 */
let timeSet;

/**
 * 更新当前得分到特定分数
 * @param {nunber} s 要跳动到的分数
 * @param {number} time 动画时长，单位 毫秒
 * @author Handle
 * @date 2018-1-31 14:56
 */
function updateScore(s = scoreSet, time = SCORE_UPDATE_TIME) {
    if (s < 0 && scoreSet < 0) {
        s = 0;
        scoreSet = 0;
    }
    if (time <= 0) {
        SCORE_DOM.innerText = s;
        return;
    }
    if (rafSet) {
        cancelAnimationFrame(rafSet);
    }
    let timeSet;
    let nowScore = parseInt(SCORE_DOM.innerText);
    rafSet = requestAnimationFrame(function raf(t) {
        if (!timeSet) {
            timeSet = t;
        }
        let scoreToShow = parseInt(
            (s - nowScore) * ((t - timeSet) / time) + nowScore
        );
        if (s - nowScore > 0 && scoreToShow > s) {
            scoreToShow = s;
        } else if (s - nowScore < 0 && scoreToShow < s) {
            scoreToShow = s;
        }
        SCORE_DOM.innerText = scoreToShow;
        rafSet = requestAnimationFrame(raf);
        if (t - timeSet > time) {
            SCORE_DOM.innerText = parseInt(s);
            cancelAnimationFrame(rafSet);
        }
    });
}

/**
 * 更新时间进度
 * @param {nunber} t 要显示的剩余时长
 */
function updateTime(t = timeSet) {
    if ((timeSet > GAME_TIME) | (t > GAME_TIME)) {
        timeSet = GAME_TIME;
        t = GAME_TIME;
    }
    TIME_DOM.style.width = `${TIME_DOM_BASE_WIGTH * (t / GAME_TIME)}px`;
}

/**
 * 洞口类
 * @author Handle
 * @date 2018-01-31 15:10
 */
class Hole {
    /**
     * 构造函数，构造一个洞口对象
     * @param {Object} postion
     * @param {number} postion.x
     * @param {number} postion.y 自定义对象和属性，分别存储X坐标和Y坐标
     */
    constructor(postion) {
        const theObject = this;
        this.x = postion.x;
        this.y = postion.y;
        this.dom = document.createElement("div");
        this.dom.style.top = `${this.y}px`;
        this.dom.style.left = `${this.x}px`;
        this.frame = 0;
        this.score = 0;
        this.frameWidth = 0;
        this.showTIme = 0;
        this.canHit = false;
        this.haveWolf = false;

        this.raf;

        this.getDOM().addEventListener("click", e => {
            if (this.canHit) {
                console.log("Hit");
                switch (typeof this.score) {
                    case "number": {
                        scoreSet += this.score;
                        if (this.score >= 0) {
                            timeSet += RIGHT_AWARD_TIME;
                        } else {
                            timeSet -= MISTAKE_DEDUCTING_TIME;
                        }
                        break;
                    }
                    case "function": {
                        let bak = scoreSet;
                        scoreSet = this.score(scoreSet);
                        if (scoreSet - bak >= 0) {
                            timeSet += RIGHT_AWARD_TIME;
                        } else {
                            timeSet -= MISTAKE_DEDUCTING_TIME;
                        }
                    }
                }
                updateScore();
                //updateTime();
                cancelAnimationFrame(this.raf);
                this.canHit = false;
                this.raf = requestAnimationFrame(function rafFun() {
                    if (theObject.frame >= FRAME_LENGTH) {
                        theObject.removeWolf();
                        return;
                    }
                    theObject.frame++;
                    theObject.refreshFrame();
                    theObject.raf = requestAnimationFrame(rafFun);
                });
            }
        });

        this.getDOM().style.display = "none";
    }
    /**
     * 返回对象对应的DOM元素
     * @returns {HTMLImageElement}
     */
    getDOM() {
        return this.dom;
    }
    /**
     * 设置洞口击打得分
     * @param {number} s 要设置为的得分
     */
    getScore(s) {
        this.score = s;
    }
    /**
     * 应用一个狼属性到本对象
     * @param {Object} wolf
     * @param {string} wolf.img
     * @param {number|Function} wolf.score
     * @param {number} wolf.width
     * 狼类型 对象
     * 狼图片地址
     * 狼的击打分数
     * 狼的序列帧宽度
     * @param {number} t 要显示的时长
     */
    setWolf(wolf, t) {
        if (this.haveWolf) return;

        this.getDOM().style.display = "block";
        this.getDOM().style.backgroundImage = `url(${wolf.img})`;
        this.refreshFrame();
        this.score = wolf.score;
        this.frameWidth = wolf.width;
        this.showTime = parseFloat(t.toString());

        console.log("Setted Wolf, Show Time:", this.showTime);

        this.canHit = true;
        this.haveWolf = true;

        let timeCount;
        const thisObj = this;
        this.raf = requestAnimationFrame(function rafFun(timestamp) {
            if (!timeCount) {
                timeCount = timestamp;
            }
            if (thisObj.frame < 5 && thisObj.canHit) {
                thisObj.refreshFrame();
                thisObj.frame++;
            }
            if (timestamp - timeCount > thisObj.showTime) {
                //console.log("Wolf, Exiting:", thisObj.frame);
                if (thisObj.frame < 0) {
                    thisObj.removeWolf();
                    return;
                }
                thisObj.canHit = false;
                thisObj.frame--;
                thisObj.refreshFrame();
            }
            if (thisObj.haveWolf) {
                thisObj.raf = requestAnimationFrame(rafFun);
            }
        });
    }
    /**
     * 移除狼
     */
    removeWolf() {
        this.getDOM().style.backgroundImage = "";
        this.getDOM().style.display = "none";
        this.score = 0;
        this.frame = 0;
        this.frameWidth = 0;
        this.showTime = 0;
        this.haveWolf = false;
    }
    /**
     * 获取开始显示于
     */
    getStartTIme() {
        return this.showTime;
    }
    /**
     * 刷新序列帧
     * @param {number} f 帧号码
     */
    refreshFrame(f = this.frame) {
        this.getDOM().style.backgroundPositionX = `${f *
            this.frameWidth *
            -1}px`;
    }
    /**
     * 返回一个布尔值，表示是否坑内有狼
     */
    isHaveWolf() {
        return this.haveWolf;
    }
}

/**
 * 开始游戏函数
 */
function startNewGame(event = null) {
    GAME_OVER_DOM.style.display = "none";
    scoreSet = 0;
    timeSet = GAME_TIME;
    updateTime();
    updateScore(0, 0);
    START_BUTTON.style.display = "none";
    CHEAT_BTN.style.display = "none";
    WOLF_BOX_DOM.innerHTML = "";
    /**
     * @type {Array<Hole>} 所有可能的洞口 数组
     */
    const holeArray = (function() {
        const newArr = new Array();
        POSTION.forEach(e => newArr.push(new Hole(e)));
        return newArr;
    })();
    holeArray.forEach(e => WOLF_BOX_DOM.appendChild(e.getDOM()));
    /**
     * 按照预设概率比例，获取一个类型的狼
     * @returns {number}
     */
    function randomWolf() {
        let _temp = Math.random() * SUM_WOLFS_CHANCE;
        for (let i = 0; i < WOLFS.length; i++) {
            _temp -= WOLFS[i].chance;
            if (_temp < 0) {
                return i;
            }
        }
        return 0;
    }
    /**
     * 判断是否还有洞未清空
     * @returns {boolean}
     */
    function isAllEmpty() {
        let flag = true;
        holeArray.forEach(e => {
            if (e.isHaveWolf()) {
                flag = false;
            }
        });
        return flag;
    }
    let LastTime;
    let raf = requestAnimationFrame(function rafFun(t) {
        if (!LastTime) {
            LastTime = t;
        }
        timeSet -= t - LastTime;
        LastTime = t;
        if (timeSet < 0) {
            timeSet = 0;
        }
        updateTime();
        if (timeSet > 0) {
            holeArray.forEach(e => {
                if (Math.random() < WOLF_REFRESH_RATE) {
                    e.setWolf(WOLFS[randomWolf()], WOLF_STOP_TIME);
                }
            });
        }
        if (timeSet == 0 && isAllEmpty()) {
            START_BUTTON.style.display = "block";
            GAME_OVER_DOM.style.display = "block";
        } else {
            raf = requestAnimationFrame(rafFun);
        }
    });
}
/**
 * 绑定按钮事件
 */
START_BUTTON.addEventListener("click", startNewGame);

// class A{
//   static a = "0";
//   constructor(p){
//     //this.a = p;
//   }
//   getA(){
//     return this.a;
//   }
// }

// class A {
//   constructor(p) {
//     this.a = p;
//   }
//   get a() {
//     return this._a;
//   }
//   set a(p) {
//     this._a = p;
//   }
// }
CHEAT_BTN.addEventListener("click", function(e) {
    this.style.display = "none";
    function postSetWolf(hole) {
        switch (typeof hole.score) {
            case "number": {
                if (hole.score > 0) hole.getDOM().click();
                break;
            }
            case "function": {
                if (hole.score(10) > 10) hole.getDOM().click();
                break;
            }
        }
    }
    Hole.prototype.setWolf2 = Hole.prototype.setWolf;
    Hole.prototype.setWolf = function(wolf, t) {
        console.log(this);
        this.setWolf2(wolf, t);
        postSetWolf(this);
    };
});

function extend(sup, base) {
    var descriptor = Object.getOwnPropertyDescriptor(
        base.prototype,
        "constructor"
    );
    base.prototype = Object.create(sup.prototype);
    var handler = {
        construct: function(target, args) {
            var obj = Object.create(base.prototype);
            this.apply(target, obj, args);
            return obj;
        },
        apply: function(target, that, args) {
            sup.apply(that, args);
            base.apply(that, args);
        },
        get: function(target, name) {
            if (name in target) {
                return target[name];
            }
            return name;
        }
    };
    var proxy = new Proxy(base, handler);
    descriptor.value = proxy;
    Object.defineProperty(base.prototype, "constructor", descriptor);
    return proxy;
}

const strBackup = String;
String = extend(strBackup, function(){});

var a = "a";
console.log(a.a);