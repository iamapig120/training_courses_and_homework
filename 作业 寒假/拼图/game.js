class Jigsaw {
    /**
     * 构造函数
     */
    constructor({
        src = "simple.png",
        width = 1440,
        height = 900,
        diffcultX = 5,
        diffcultY = 4
    } = {}) {
        const puzzleImg = new Image();
        puzzleImg.src = src;
        puzzleImg.onload = e => {
            if (this.onload) {
                try {
                    this.onload();
                } catch (e) {
                    throw e;
                }
            }
        };
        avg.creaveWindow({
            width: width,
            height: height
        });
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
        this.gaming = false;
        this.x = diffcultX;
        this.y = diffcultY;
        this.width = width;
        this.height = height;
        let formIndex = 1;
        /**
         * @type {Array<Array<number>>}
         */
        this.form = new Array(diffcultY)
            .fill(new Array(diffcultX).fill(0))
            .map(value =>
                value.map(() => {
                    avg.loadImage({
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
                        sy: height / this.y * (((formIndex - 1) / this.x) >> 0),
                        swidth: width / this.x,
                        sheight: height / this.y
                    });
                    return formIndex++;
                })
            );
        this.pointer = [this.y - 1, this.x - 1];
    }
    /**
     * 向指定方向移动一格
     * @param {"left" | "up" | "right" | "down"} moveTo 移动到的方向
     * @param {boolean} refresh 是否刷新图像显示
     */
    move(moveTo, refresh = true) {
        if (this.gaming) {
            const pointerBackup = [...this.pointer];
            const _this = this;
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
            if (refresh) {
                this.refresh();
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
    win() {
        this.gaming = false;
        avg.move(
            {
                layer: this.x * this.y,
                alpha: 1
            },
            200
        );
    }
    refresh(time = 200) {
        let forEachIndex = 1;
        this.form.forEach(arr => {
            arr.forEach(e => {
                avg.move(
                    {
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
                    },
                    time
                );
                forEachIndex++;
            });
        });
        avg.wait(time);
    }
    start(flag = !this.gaming) {
        if (flag) {
            this.gaming = true;
            const arraws = ["left", "up", "right", "down"];
            for (let i = 0; i < 5000; i++) {
                this.move(arraws[(Math.random() * 4) >> 0], false);
            }
            this.refresh(0);
        }
        avg.move(
            {
                layer: this.x * this.y,
                alpha: 0
            },
            0
        );
    }
}
let game = new Jigsaw();
game.onload = () => {
    document.documentElement.addEventListener("keydown", e => {
        if (e.keyCode === 32 || e.keyCode === 13) {
            game.start();
        }
    });
};
