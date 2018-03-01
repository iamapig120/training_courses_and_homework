class Jigsaw {
    /**
     * 构造函数
     */
    constructor({
        src = "simple.png",
        width = 1440,
        height = 900,
        diffcultX = 5,
        diffcultY = 4,
        dom = document.documentElement
    } = {}) {
        //构造一个图片
        const puzzleImg = new Image();
        const _this = this;
        //加载src
        puzzleImg.src = src;
        //当加载完成
        puzzleImg.onload = e => {
            if (this.onload) {
                try {
                    this.onload();
                } catch (e) {
                    throw e;
                }
            }
        };
        //创建一个div对象
        const box = document.createElement("div");
        //设置style
        box.style = `
        padding:0;
        width:${width}px;
        height:${height}px;
        `;
        //插入到目标DOM中
        dom.appendChild(box);
        //设置自身dom
        this.dom = box;
        /**
         * 添加一个可移动的拼图
         */
        function addCase({
            layer,
            img = puzzleImg,
            width = width / _this.x,
            height = height / _this.y,
            x,
            y,
            sx,
            sy
        } = {}) {
            const newCase = document.createElement("div");
            newCase.style = `
            padding:0;
            border:0;
            margin:0;
            width:${width}px;
            height:${height}px;
            background-image:url("${puzzleImg.src}");
            background-repeat: "no-repeat";
            background-position: -${sx}px -${sy}px;
            transition: all 0.2s;
            position: absolute;
            background-size: ${_this.width}px ${_this.height}px;
            left: ${x}px;
            top: ${y}px;
            `;
            newCase.layer = layer;
            box.appendChild(newCase);
        }
        //绑定按键事件
        document.documentElement.addEventListener("keydown", e => {
            switch (e.keyCode) {
                case 37: {
                    e.preventDefault();
                    this.move("left");
                    break;
                }
                case 38: {
                    e.preventDefault();
                    this.move("up");
                    break;
                }
                case 39: {
                    e.preventDefault();
                    this.move("right");
                    break;
                }
                case 40: {
                    e.preventDefault();
                    this.move("down");
                    break;
                }
            }
        });
        //是否在游戏中
        this.gaming = false;
        //X难度
        this.x = diffcultX;
        //Y难度
        this.y = diffcultY;
        //宽度
        this.width = width;
        //高度
        this.height = height;
        //遍历索引
        let formIndex = 1;
        /**
         * 构建一个宽度x高度y的二维数组，并按照等差数列从1开始填充
         * @type {Array<Array<number>>}
         */
        this.form = new Array(diffcultY) //新数组
            .fill(new Array(diffcultX).fill(0)) //填满新数组，再填满0，
            .map((
                value //然后映射二维数组
            ) =>
                value.map(() => {
                    //然后映射一维数组
                    addCase({
                        //遍历并添加拼图
                        layer: formIndex,
                        img: puzzleImg,
                        width: width / this.x,
                        height: height / this.y,
                        x:
                            width /
                            this.x *
                            ((formIndex % this.x === 0
                                ? this.x
                                : formIndex % this.x) -
                                1),
                        y: height / this.y * (((formIndex - 1) / this.x) >> 0),
                        sx:
                            width /
                            this.x *
                            ((formIndex % this.x === 0
                                ? this.x
                                : formIndex % this.x) -
                                1),
                        sy: height / this.y * (((formIndex - 1) / this.x) >> 0)
                    });
                    return formIndex++; //返回索引
                })
            );
        //得到结果类似
        /**
         * [1,2,3]
         * [4,5,6]
         * [7,8,9]
         */
        //当前空白的格子的位置
        this.pointer = [this.y - 1, this.x - 1];
    }
    /**
     * 向指定方向移动一格
     * @param {"left" | "up" | "right" | "down"} moveTo 移动到的方向
     * @param {boolean} refresh 是否刷新图像显示
     */
    move(moveTo, refresh = true) {
        if (this.gaming) {
            //复制一份当前的空白的格子的位置
            const pointerBackup = [...this.pointer];
            const _this = this;
            //交换两个数
            function changeCase() {
                _this.form[pointerBackup[0]][pointerBackup[1]] =
                    _this.form[pointerBackup[0]][pointerBackup[1]] ^
                    _this.form[_this.pointer[0]][_this.pointer[1]];
                _this.form[_this.pointer[0]][_this.pointer[1]] =
                    _this.form[pointerBackup[0]][pointerBackup[1]] ^
                    _this.form[_this.pointer[0]][_this.pointer[1]];
                _this.form[pointerBackup[0]][pointerBackup[1]] =
                    _this.form[pointerBackup[0]][pointerBackup[1]] ^
                    _this.form[_this.pointer[0]][_this.pointer[1]];
            }
            //按照方向不同，不同处理方式
            switch (moveTo) {
                case "right": {
                    if (this.pointer[1] - 1 >= 0) {
                        this.pointer[1]--;
                        changeCase();
                    }
                    break;
                }
                case "down": {
                    if (this.pointer[0] - 1 >= 0) {
                        this.pointer[0]--;
                        changeCase();
                    }
                    break;
                }
                case "left": {
                    if (this.pointer[1] + 1 < this.x) {
                        this.pointer[1]++;
                        changeCase();
                    }
                    break;
                }
                case "up": {
                    if (this.pointer[0] + 1 < this.y) {
                        this.pointer[0]++;
                        changeCase();
                    }
                    break;
                    break;
                }
            }
            //如果需要刷新
            if (refresh) {
                //刷新图像
                this.refresh();
                //检测是否获胜
                if (this.test()) {
                    this.win();
                }
            }
        }
    }
    /**
     * 测试是否获胜
     */
    test() {
        let testIndex = 1;
        for (let arr of this.form) {
            for (let num of arr) {
                if (num !== testIndex++) {
                    return false;
                }
            }
        }
        return true;
    }
    /**
     * 获胜后事件
     */
    win() {
        this.gaming = false;
        this.moveCase(
            {
                layer: this.x * this.y,
                alpha: 1
            },
            200
        );
    }
    /**
     * 刷新图像
     * @param {number} time 刷新速度
     */
    refresh(time = 200) {
        let forEachIndex = 1;
        this.form.forEach(arr => {
            arr.forEach(e => {
                this.moveCase({
                    layer: e,
                    x:
                        this.width /
                        this.x *
                        ((forEachIndex % this.x === 0
                            ? this.x
                            : forEachIndex % this.x) -
                            1),
                    y:
                        this.height /
                        this.y *
                        (((forEachIndex - 1) / this.x) >> 0)
                });
                forEachIndex++;
            });
        });
        //avg.wait(time);
    }
    //移动单个盒子
    moveCase({ layer, x, y, alpha } = {}) {
        /**
         * @type {HTMLDivElement}
         */
        const dom = this.dom;
        for (let div of dom.getElementsByTagName("div")) {
            if (div.layer !== layer) {
                continue;
            }
            div.style.left = `${x}px`;
            div.style.top = `${y}px`;
            div.style.opacity = alpha;
        }
    }
    //开始游戏
    start(flag = !this.gaming) {
        if (flag) {
            this.gaming = true;
            const arraws = ["left", "up", "right", "down"];
            for (let i = 0; i < 5000; i++) {
                this.move(arraws[(Math.random() * 4) >> 0], false);
            }
            this.refresh(0);
        }
        this.moveCase({
            layer: this.x * this.y,
            alpha: 0
        });
    }
}
let game = new Jigsaw({
    src: "simple.png", //图像
    width: 1440, //宽度
    height: 900, //高度
    diffcultX: 5, //x轴难度
    diffcultY: 4, //y轴难度
    dom: document.documentElement
});
game.onload = () => {
    document.documentElement.addEventListener("keydown", e => {
        if (e.keyCode === 32 || e.keyCode === 13) {
            game.start();
        }
    });
};
