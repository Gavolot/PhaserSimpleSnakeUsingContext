var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var App;
(function (App) {
    var Colors = (function () {
        function Colors() {
            this.red = 0xFF0000;
            this.blue = 0x0000FF;
            this.green = 0x008000;
        }
        return Colors;
    }());
    App.c = new Colors();
})(App || (App = {}));
var App;
(function (App) {
    App.SCREEN_WIDTH = 736;
    App.SCREEN_HEIGHT = 512;
    App.TILE_SIZE = 32;
    App.mSCREEN_WIDTH = App.SCREEN_WIDTH / App.TILE_SIZE;
    App.mSCREEN_HEIGHT = App.SCREEN_HEIGHT / App.TILE_SIZE;
    var States;
    (function (States) {
        var MainState = (function (_super) {
            __extends(MainState, _super);
            function MainState() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            MainState.prototype.preload = function () {
            };
            MainState.prototype.create = function () {
                this.upKey = this.input.keyboard.addKey(Phaser.Keyboard.UP);
                this.downKey = this.input.keyboard.addKey(Phaser.Keyboard.DOWN);
                this.leftKey = this.input.keyboard.addKey(Phaser.Keyboard.LEFT);
                this.rightKey = this.input.keyboard.addKey(Phaser.Keyboard.RIGHT);
                this.timer = this.time.create(false);
                this.snake = new Snake(this.timer);
                this.g = this.add.graphics(App.TILE_SIZE, App.TILE_SIZE);
                this.snake.render(this.g);
                var eatX = this.rnd.integerInRange(1, App.mSCREEN_WIDTH) * App.TILE_SIZE;
                var eatY = this.rnd.integerInRange(1, App.mSCREEN_HEIGHT) * App.TILE_SIZE;
                console.log("eatX:" + eatX, " eatY:" + eatY);
                this.eat = new Rect(eatX, eatY, App.TILE_SIZE, App.TILE_SIZE, App.c.green, App.c.blue);
            };
            MainState.prototype.update = function () {
                if (this.upKey.isDown) {
                    this.snake.changeDirection("up");
                }
                if (this.downKey.isDown) {
                    this.snake.changeDirection("down");
                }
                if (this.rightKey.isDown) {
                    this.snake.changeDirection("right");
                }
                if (this.leftKey.isDown) {
                    this.snake.changeDirection("left");
                }
                if (this.snake.getHeadX() == this.eat.getX() &&
                    this.snake.getHeadY() == this.eat.getY()) {
                    this.snake.add_segment();
                    var eatX = this.rnd.integerInRange(1, App.mSCREEN_WIDTH) * App.TILE_SIZE;
                    var eatY = this.rnd.integerInRange(1, App.mSCREEN_HEIGHT) * App.TILE_SIZE;
                    while (this.snake.checkContainSegments(eatX, eatY)) {
                        eatX = this.rnd.integerInRange(1, App.mSCREEN_WIDTH) * App.TILE_SIZE;
                        eatY = this.rnd.integerInRange(1, App.mSCREEN_HEIGHT) * App.TILE_SIZE;
                    }
                    console.log("eatX:" + eatX, " eatY:" + eatY);
                    this.eat.setPosition(eatX, eatY);
                }
            };
            MainState.prototype.render = function () {
                this.g.clear();
                this.snake.render(this.g);
                this.eat.render(this.g);
            };
            return MainState;
        }(Phaser.State));
        States.MainState = MainState;
        var Rect = (function () {
            function Rect(x, y, width, height, colorLine, colorFill) {
                this.owner = null;
                this._x = x;
                this._y = y;
                this._prevX = this._x;
                this._prevY = this._y;
                this._colorLine = colorLine;
                this._colorFill = colorFill;
                this._width = width;
                this._height = height;
                this.direction = "right";
            }
            Rect.prototype.setColorFill = function (color) {
                this._colorFill = color;
            };
            Rect.prototype.getColorFill = function () {
                return this._colorFill;
            };
            Rect.prototype.setPosition = function (x, y) {
                this._prevX = this._x;
                this._prevY = this._y;
                this._x = x;
                this._y = y;
            };
            Rect.prototype.getX = function () {
                return this._x;
            };
            Rect.prototype.getY = function () {
                return this._y;
            };
            Rect.prototype.getPrevX = function () {
                return this._prevX;
            };
            Rect.prototype.getPrevY = function () {
                return this._prevY;
            };
            Rect.prototype.render = function (graphics) {
                var g = graphics;
                g.lineStyle(2, this._colorLine, 1);
                g.beginFill(this._colorFill, 0.5);
                g.drawRect(this._x, this._y, this._width, this._height);
            };
            return Rect;
        }());
        var Snake = (function () {
            function Snake(timer) {
                this.__indexSegment = 0;
                this.speed = App.TILE_SIZE;
                this._fail = false;
                this.direction = "right";
                this._timer = timer;
                this._timer.loop(300, this.move, this);
                this._timer.start();
                this._items = new Array();
                this._items[0] = new Rect(32, 0, App.TILE_SIZE, App.TILE_SIZE, App.c.blue, App.c.red);
                this.add_segment();
                this.add_segment();
            }
            Snake.prototype.move = function () {
                console.log("snake move");
                var segment = null;
                var prevX = 0;
                var prevY = 0;
                var prev = false;
                for (var i = 0; i < this._items.length; i++) {
                    segment = this._items[i];
                    if (!segment.owner) {
                        this.setPositionSnake(segment, this.direction);
                    }
                    else if (segment.owner) {
                        segment.setPosition(segment.owner.getPrevX(), segment.owner.getPrevY());
                    }
                }
            };
            Snake.prototype.setPositionSnake = function (segment, direction) {
                var x = 0;
                var y = 0;
                switch (direction) {
                    case "right":
                        x = this.speed;
                        break;
                    case "up":
                        y = -this.speed;
                        break;
                    case "down":
                        y = this.speed;
                        break;
                    case "left":
                        x = -this.speed;
                        break;
                }
                segment.setPosition(segment.getX() + x, segment.getY() + y);
            };
            Snake.prototype.render = function (graphics) {
                for (var i = 0; i < this._items.length; i++) {
                    this._items[i].render(graphics);
                    this.checkToFailCollisionItSelf(this._items[i]);
                    this.checkToFailOutsideArea();
                }
            };
            Snake.prototype.changeDirection = function (inputDirection) {
                if (this.direction == inputDirection)
                    return;
                switch (inputDirection) {
                    case "down":
                        if (this.direction == "up")
                            return;
                        break;
                    case "up":
                        if (this.direction == "down")
                            return;
                        break;
                    case "left":
                        if (this.direction == "right")
                            return;
                        break;
                    case "right":
                        if (this.direction == "left")
                            return;
                        break;
                }
                this.direction = inputDirection;
            };
            Snake.prototype.getHeadX = function () {
                return this._items[0].getX();
            };
            Snake.prototype.getHeadY = function () {
                return this._items[0].getY();
            };
            Snake.prototype.add_segment = function () {
                var x = 0;
                var y = 0;
                switch (this.direction) {
                    case "up":
                        y = this.speed;
                        break;
                    case "down":
                        y = -this.speed;
                        break;
                    case "left":
                        x = this.speed;
                        break;
                    case "right":
                        x = -this.speed;
                        break;
                }
                var ownerSegment = this._items[this._items.length - 1];
                this._items[this._items.length] = new Rect(ownerSegment.getX() + x, ownerSegment.getY() + y, App.TILE_SIZE, App.TILE_SIZE, App.c.blue, App.c.green);
                this._items[this._items.length - 1].owner = ownerSegment;
            };
            Snake.prototype.checkContainSegments = function (x, y) {
                for (var i = 0; i < this._items.length; i++) {
                    if (this._items[i].getX() == x &&
                        this._items[i].getY() == y)
                        return true;
                }
                return false;
            };
            Snake.prototype.checkToFailOutsideArea = function () {
                if (!this._fail) {
                    if (this.getHeadX() > App.SCREEN_WIDTH ||
                        this.getHeadY() > App.SCREEN_HEIGHT
                        || this.getHeadX() < -App.TILE_SIZE || this.getHeadY() < -App.TILE_SIZE) {
                        for (var i = 0; i < this._items.length; i++) {
                            this._items[i].setColorFill(App.c.blue);
                        }
                        this._fail = true;
                        this._timer.stop();
                    }
                }
            };
            Snake.prototype.checkToFailCollisionItSelf = function (segment) {
                if (segment != this._items[0] && !this._fail) {
                    if (this._items[0].getX() == segment.getX() &&
                        this._items[0].getY() == segment.getY()) {
                        for (var i = 0; i < this._items.length; i++) {
                            this._items[i].setColorFill(App.c.blue);
                        }
                        this._fail = true;
                        this._timer.stop();
                    }
                }
            };
            return Snake;
        }());
    })(States = App.States || (App.States = {}));
})(App || (App = {}));
var App;
(function (App) {
    var Main = (function (_super) {
        __extends(Main, _super);
        function Main() {
            var _this = _super.call(this, 800, 576, Phaser.AUTO, 'game', null) || this;
            _this.state.add("main_state", App.States.MainState, true);
            return _this;
        }
        return Main;
    }(Phaser.Game));
    App.Main = Main;
})(App || (App = {}));
window.onload = function () {
    var app = new App.Main();
};
