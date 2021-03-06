class Gobang {
    /**
     * 构造函数
     */
    constructor({
        width = 900,
        height = 900,
        dom = document.documentElement
    } = {}) {
        //创建一个div对象
        const box = document.createElement("div");
        const _this = this;
        //设置style
        box.style = `
        padding:0;
        width:${width}px;
        height:${height}px;
        font-size: 0;
        text-align: center;
        background-image: url("img/pad.jpg");
        background-repeat: "no-repeat";
        background-size: ${width}px ${height}px;
        user-select: none;
        `;
        //插入到目标DOM中
        dom.appendChild(box);
        //设置自身dom
        this.dom = box;
        //第X步
        this.step = 0;
        //下棋音效
        this.AUDIO_DROP = new Audio("audio/drop.mp3");
        //宽高
        this.x = 15;
        this.y = 15;
        /**
         * 添加一个棋子
         */
        function addCase({
            step,
            width = width / _this.x,
            height = height / _this.y,
            x,
            y,
            obj
        } = {}) {
            const newCase = document.createElement("div");
            newCase.innerText = step ? step : "";
            newCase.style = `
            padding:0;
            border:0;
            margin:0;
            width:${width}px;
            height:${height}px;
            background-repeat: "no-repeat";
            position: absolute;
            background-size: ${width}px ${height}px;
            left: ${x}px;
            top: ${y}px;
            font-size: ${height / 2}px;
            line-height: ${height}px;
            box-sizing: border-box;
            `;
            newCase.step = step;
            newCase.obj = obj;
            newCase.addEventListener("click", function(e) {
                _this.dropAt(this);
            });
            box.appendChild(newCase);
        }
        //是否在游戏中
        this.gaming = false;
        //宽度
        this.width = width;
        //高度
        this.height = height;
        //遍历索引
        let formIndex = 1;
        //棋子类
        class Piece {
            constructor({
                left = 0,
                top = 0,
                leftTop = 0,
                rightTop = 0,
                color = null
            } = {}) {
                this.left = left;
                this.leftTop = leftTop;
                this.top = top;
                this.rightTop = rightTop;
                this.color = color;
            }
        }
        /**
         * 构建一个宽度15高度15的二维数组，并填充
         * @type {Array<Array<Piece>>}
         */
        this.form = new Proxy(
            new Array(this.y) //新数组
                .fill(0)
                .map(
                    () =>
                        new Proxy(
                            new Array(this.x).fill(0).map(() => {
                                const newPiece = new Piece();
                                addCase({
                                    step: 0,
                                    width: width / this.x,
                                    height: height / this.y,
                                    x:
                                        width /
                                        this.x *
                                        ((formIndex % this.x === 0
                                            ? this.x
                                            : formIndex % this.x) -
                                            1),
                                    y:
                                        height /
                                        this.y *
                                        (((formIndex - 1) / this.y) >> 0),
                                    obj: newPiece
                                });
                                formIndex++;
                                return newPiece;
                            }),
                            {
                                get: function(target, name) {
                                    return name in target
                                        ? target[name]
                                        : { color: Symbol() };
                                }
                            }
                        )
                ),
            {
                get: function(target, name) {
                    return name in target
                        ? target[name]
                        : new Proxy(
                              {},
                              {
                                  get: () => {
                                      return { color: Symbol() };
                                  }
                              }
                          );
                }
            }
        );
    }
    /**
     * 在指定位置下棋
     * @param {HTMLDivElement | number} dom 被下棋的DOM对象或这个对象的下标
     */
    dropAt(dom) {
        if (Number.isInteger(dom)) {
            dom = this.dom.getElementsByTagName("div")[dom];
        }
        if (this.gaming && !dom.step) {
            Array.prototype.forEach.call(
                this.dom.getElementsByTagName("div"),
                e => {
                    e.style.borderRadius = "0%";
                    e.style.border = 0;
                    e.style.lineHeight = `${this.width / this.x}px`;
                }
            );
            this.step++;
            dom.step = this.step;
            dom.innerText = this.step;
            dom.obj.color = this.players[
                (this.step - 1) % this.players.length
            ].id;
            dom.style.color = this.players[
                (this.step - 1) % this.players.length
            ].color;
            dom.style.backgroundImage = `url(${
                this.players[(this.step - 1) % this.players.length].piece
            })`;
            dom.style.borderRadius = "50%";
            dom.style.border = `3px solid ${dom.style.color}`;
            dom.style.lineHeight = `${this.width / this.x - 6}px`;
            this.AUDIO_DROP.currentTime = 0;
            this.AUDIO_DROP.play();
            if (this.test()) {
                this.win(dom.obj.color);
            }
        }
    }
    /**
     * 测试是否有人获胜
     */
    test(form = this.form) {
        for (let i in form) {
            for (let j in form[i]) {
                if (form[i][j].color === form[i - 1][j].color) {
                    form[i][j].top = form[i - 1][j].top + 1;
                } else {
                    form[i][j].top = 0;
                }
                if (form[i][j].color === form[i][j - 1].color) {
                    form[i][j].left = form[i][j - 1].left + 1;
                } else {
                    form[i][j].left = 0;
                }
                if (form[i][j].color === form[i - 1][(j >> 0) + 1].color) {
                    form[i][j].rightTop =
                        form[i - 1][(j >> 0) + 1].rightTop + 1;
                } else {
                    form[i][j].rightTop = 0;
                }
                if (form[i][j].color === form[i - 1][j - 1].color) {
                    form[i][j].leftTop = form[i - 1][j - 1].leftTop + 1;
                } else {
                    form[i][j].leftTop = 0;
                }
                if (
                    Number.isInteger(form[i][j].color) &&
                    form[i][j].color > 0
                ) {
                    const testAs = num =>
                        form[i][j].top === num ||
                        form[i][j].left === num ||
                        form[i][j].leftTop === num ||
                        form[i][j].rightTop === num;
                    if (testAs(2) && this.BGMPlaying === 1) {
                        this.audioBGM1.pause();
                        this.audioBGM2.play();
                        this.BGMPlaying++;
                    }
                    if (testAs(3) && this.BGMPlaying === 2) {
                        this.audioBGM2.pause();
                        this.audioBGM3.play();
                        this.BGMPlaying++;
                    }
                    if (testAs(4)) {
                        this.audioBGM3.pause();
                        this.audioWin.play();
                        this.BGMPlaying++;
                        return form[i][j].color;
                    }
                }
            }
        }
        return false;
    }
    /**
     * 获胜后事件
     */
    win(color) {
        this.gaming = false;
        console.log(`${this.players[color - 1].nick}获胜！`);
    }
    //开始游戏
    start(
        flag = !this.gaming,
        players = (function() {
            let playerIndex = 1;
            const re = new Array(2).fill(null).map(() => {
                const re = {
                    id: playerIndex,
                    piece: `img/piece_${playerIndex}.png`,
                    nick: `玩家${playerIndex}`,
                    color: null
                };
                playerIndex++;
                return re;
            });
            re[0].color = "#FFFFFF";
            re[1].color = "#000000";
            return re;
        })()
    ) {
        if (flag) {
            this.gaming = true;
            this.step = 0;
            this.players = players;
        }
        this.audioBGM1 = new Audio("audio/Normal.mp3");
        this.audioBGM1.loop = true;
        this.audioBGM2 = new Audio("audio/Exciting1.mp3");
        this.audioBGM2.loop = true;
        this.audioBGM3 = new Audio("audio/Exciting2.mp3");
        this.audioBGM3.loop = true;
        this.audioBGM1.play();
        this.audioWin = new Audio("audio/win.mp3");
        this.BGMPlaying = 1;
    }
}

let game = new Gobang({
    width: 900, //宽度
    height: 900, //高度
    dom: document.documentElement
});
const audioBGM0 = new Audio("audio/welcome.mp3");
audioBGM0.loop = true;
document.documentElement.addEventListener("keydown", e => {
    if (e.keyCode === 32 || e.keyCode === 13) {
        audioBGM0.pause();
        game.start();
    }
});
let flag = true;
const mouseMoveFun = e => {
    if (flag) {
        flag = false;
        document.documentElement.removeEventListener("mousemove", mouseMoveFun);
        audioBGM0.play();
    }
};
document.documentElement.addEventListener("mousemove", mouseMoveFun);
