
namespace App {



export class Main extends Phaser.Game{
    constructor(){
        super(800, 576, Phaser.AUTO, 'game', null);
        this.state.add("main_state", States.MainState, true);
    }
}

}

window.onload = () => {

    var app = new App.Main();

};