namespace App {

    export const SCREEN_WIDTH:number = 736;
    export const SCREEN_HEIGHT:number = 512;

    export const TILE_SIZE:number = 32;

    export const mSCREEN_WIDTH:number = SCREEN_WIDTH/TILE_SIZE;
    export const mSCREEN_HEIGHT:number = SCREEN_HEIGHT/TILE_SIZE;

    export namespace States{

        export class MainState extends Phaser.State{

            g:Phaser.Graphics;
            upKey:Phaser.Key;
            downKey:Phaser.Key;
            leftKey:Phaser.Key;
            rightKey:Phaser.Key;
            timer:Phaser.Timer;

            snake:Snake;

            eat:Rect;
            //rectPlayer:Rect;

            preload(){

            }

            create(){

                this.upKey = this.input.keyboard.addKey(Phaser.Keyboard.UP);
                this.downKey = this.input.keyboard.addKey(Phaser.Keyboard.DOWN);
                this.leftKey = this.input.keyboard.addKey(Phaser.Keyboard.LEFT);
                this.rightKey = this.input.keyboard.addKey(Phaser.Keyboard.RIGHT);

                //this.stage.setBackgroundColor(0xDC143C);
                this.timer = this.time.create(false);
                
                this.snake = new Snake(this.timer);

                this.g = this.add.graphics(TILE_SIZE, TILE_SIZE);

                this.snake.render(this.g);

                
                let eatX:number = this.rnd.integerInRange(1, mSCREEN_WIDTH)*TILE_SIZE;
                let eatY:number = this.rnd.integerInRange(1, mSCREEN_HEIGHT)*TILE_SIZE;
                //let eatX = 32;
                //let eatY = 32;

                console.log("eatX:" + eatX, " eatY:" + eatY);
                this.eat = new Rect(eatX, eatY, TILE_SIZE, TILE_SIZE, c.green, c.blue );

                //this.rectPlayer = new Rect(32, 32, 0xFAF0E6, 0xF4A460);
                //this.rectPlayer.render(this.g);
                
                //this.game.state.start("state_name", true, false);
            }

            update(){
                if(this.upKey.isDown){
                    this.snake.changeDirection("up");
                }
                if(this.downKey.isDown){
                    this.snake.changeDirection("down");
                }
                if(this.rightKey.isDown){
                    this.snake.changeDirection("right");
                }
                if(this.leftKey.isDown){
                    this.snake.changeDirection("left");
                }

                if(this.snake.getHeadX() == this.eat.getX() &&
                    this.snake.getHeadY() == this.eat.getY()){
                    this.snake.add_segment();
                    let eatX:number = this.rnd.integerInRange(1, mSCREEN_WIDTH)*TILE_SIZE;
                    let eatY:number = this.rnd.integerInRange(1, mSCREEN_HEIGHT)*TILE_SIZE;
                    while(this.snake.checkContainSegments(eatX, eatY)){
                        eatX = this.rnd.integerInRange(1, mSCREEN_WIDTH)*TILE_SIZE;
                        eatY = this.rnd.integerInRange(1, mSCREEN_HEIGHT)*TILE_SIZE;
                    }
                    console.log("eatX:" + eatX, " eatY:" + eatY);
                    this.eat.setPosition(eatX, eatY);
                }
            }

            render(){
                //---
                this.g.clear();
                //---

                this.snake.render(this.g);
                this.eat.render(this.g);
            }
        }



        class Rect{
            private _colorLine:number;
            private _colorFill:number;
            private _x:number;
            private _y:number;
            private _prevX:number;
            private _prevY:number;
            private _width:number;
            private _height:number;
            public direction:string;
            public owner:Rect = null;
            constructor(x:number, y:number, width:number,
                height:number, colorLine:number, colorFill:number){
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

            public setColorFill(color:number){
                this._colorFill = color;
            }

            public getColorFill(){
                return this._colorFill;
            }

            public setPosition(x:number, y:number){
                this._prevX = this._x;
                this._prevY = this._y;
                this._x = x;
                this._y = y;
            }

            public getX():number{
                return this._x;
            }

            public getY():number{
                return this._y;
            }

            public getPrevX():number{
                return this._prevX;
            }

            public getPrevY():number{
                return this._prevY;
            }

            public render(graphics:Phaser.Graphics){
                let g = graphics;
                g.lineStyle(2, this._colorLine, 1);
                g.beginFill(this._colorFill, 0.5);
                g.drawRect(this._x, this._y, this._width, this._height);
            }
        }

        class Snake{
            private _items: Array<Rect>;
            private _timer: Phaser.Timer;
            public direction:string;
            private __indexSegment:number = 0;
            private speed:number = TILE_SIZE;
            private _fail:boolean = false;

            constructor(timer:Phaser.Timer){
                this.direction = "right";
                this._timer = timer;
                this._timer.loop(300, this.move, this);
                this._timer.start();
                this._items = new Array();
                this._items[0] = new Rect(32, 0, TILE_SIZE, TILE_SIZE, c.blue, 
                    c.red);
                this.add_segment();
                this.add_segment();
            }



            private move(){
                console.log("snake move");
                let segment:Rect = null;
                let prevX:number = 0;
                let prevY:number = 0;
                let prev:boolean = false;

                for(let i = 0; i<this._items.length; i++){
                    segment = this._items[i];

                    if(!segment.owner){
                        this.setPositionSnake(segment, this.direction);
                    }
                    else
                    if(segment.owner){
                        segment.setPosition(segment.owner.getPrevX(), segment.owner.getPrevY());
                    }
                }
            }

            private setPositionSnake(segment:Rect, direction:string){
                let x:number = 0;
                let y:number = 0;
                switch(direction){
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
                segment.setPosition(segment.getX()+x, segment.getY()+y);
            }

            public render(graphics:Phaser.Graphics){
                for(let i = 0; i<this._items.length; i++){
                    this._items[i].render(graphics);

                    ////CHECK_TO_FAIL_IN_ITSELF
                    this.checkToFailCollisionItSelf(this._items[i]);
                    this.checkToFailOutsideArea();
                }
            }

            public changeDirection(inputDirection:string){
                if(this.direction == inputDirection) return; 
                switch(inputDirection){
                    case "down":
                        if(this.direction == "up") return;
                    break;
                    case "up":
                        if(this.direction == "down") return;
                    break;

                    case "left":
                        if(this.direction == "right") return;
                    break;
                    case "right":
                        if(this.direction == "left") return;
                    break;
                }
                this.direction = inputDirection;
            }

            public getHeadX(){
                return this._items[0].getX();
            }

            public getHeadY(){
                return this._items[0].getY();
            }

            public add_segment(){
                let x:number = 0;
                let y:number = 0;
                switch(this.direction){
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
                let ownerSegment:Rect = this._items[this._items.length-1];
                
                this._items[this._items.length] = new Rect(ownerSegment.getX()+x,
            ownerSegment.getY()+y, TILE_SIZE, TILE_SIZE, c.blue, c.green);
                //--new elem length++
                this._items[this._items.length-1].owner = ownerSegment;
            }

            public checkContainSegments(x:number, y:number):boolean{
                for(let i = 0; i<this._items.length; i++){
                    if(this._items[i].getX() == x &&
                        this._items[i].getY() == y) return true;
                }
                return false;
            }

            private checkToFailOutsideArea(){
                if(!this._fail){
                    if(this.getHeadX()>SCREEN_WIDTH ||
                    this.getHeadY()>SCREEN_HEIGHT 
                    || this.getHeadX()<-TILE_SIZE || this.getHeadY()<-TILE_SIZE){
                        for(let i = 0; i<this._items.length; i++){
                            this._items[i].setColorFill(c.blue);
                        }
                        this._fail = true;
                        this._timer.stop();
                    }
                }
            }

            private checkToFailCollisionItSelf(segment:Rect){
                if(segment != this._items[0] && !this._fail){
                    if(this._items[0].getX() == segment.getX() &&
                    this._items[0].getY() == segment.getY()){
                        for(let i = 0; i<this._items.length; i++){
                            this._items[i].setColorFill(c.blue);
                        }
                        this._fail = true;
                        this._timer.stop();
                    }
                }
            }
        }
    }

}