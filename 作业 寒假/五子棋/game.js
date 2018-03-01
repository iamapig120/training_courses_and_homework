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
            `;
            newCase.step = step;
            newCase.obj = obj;
            newCase.addEventListener("click", function(e) {
                if (_this.gaming && !this.step) {
                    _this.step++;
                    this.step = _this.step;
                    this.innerText = _this.step;
                    this.obj.color =
                        _this.players[
                            (_this.step - 1) % _this.players.length
                        ].id;
                    this.style.color =
                        _this.players[
                            (_this.step - 1) % _this.players.length
                        ].color;
                    this.style.backgroundImage = `url(${
                        _this.players[(_this.step - 1) % _this.players.length]
                            .piece
                    })`;
                    if (_this.test()) {
                        _this.win(this.obj.color);
                    }
                }
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
            new Array(15) //新数组
                .fill(0)
                .map(
                    () =>
                        new Proxy(
                            new Array(15).fill(0).map(() => {
                                const newPiece = new Piece();
                                addCase({
                                    step: 0,
                                    width: width / 15,
                                    height: height / 15,
                                    x:
                                        width /
                                        15 *
                                        ((formIndex % 15 === 0
                                            ? 15
                                            : formIndex % 15) -
                                            1),
                                    y:
                                        height /
                                        15 *
                                        (((formIndex - 1) / 15) >> 0),
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
                    form[i][j].color > 0 &&
                    (form[i][j].top >= 4 ||
                        form[i][j].left >= 4 ||
                        form[i][j].leftTop >= 4 ||
                        form[i][j].rightTop >= 4)
                ) {
                    return form[i][j].color;
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
    }
}

let game = new Gobang({
    width: 900, //宽度
    height: 900, //高度
    dom: document.documentElement
});
document.documentElement.addEventListener("keydown", e => {
    if (e.keyCode === 32 || e.keyCode === 13) {
        game.start();
    }
});
