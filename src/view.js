import * as PIXI from 'pixi.js'

import {
    sharpSelection
} from './tones';

import TonesPlane from './views/TonesPlane';

import {
    tonesPlaneWidth
} from './constants';

class View {
    constructor(pixiapp, resources, toneSounds) {
        this.app = pixiapp;
        let planerect = new PIXI.Rectangle(pixiapp.screen.x, pixiapp.screen.y,
            tonesPlaneWidth * pixiapp.screen.width, pixiapp.screen.height);
        this.tonesPlane = new TonesPlane(sharpSelection, planerect, resources, pixiapp.ticker);
        this.toneSounds = toneSounds;

        this.app.stage.addChild(this.tonesPlane);
        this.app.renderer.render(this.app.stage);

        this.playing = [];

        let resize = () => {
            // Get the p
            const parent = this.app.view.parentNode;

            // Resize the renderer
            this.app.renderer.resize(parent.clientWidth, parent.clientHeight);
            let planerect = new PIXI.Rectangle(pixiapp.screen.x, pixiapp.screen.y,
                tonesPlaneWidth * pixiapp.screen.width, pixiapp.screen.height);
            this.tonesPlane.resize(planerect);
        }
        window.addEventListener('resize', resize);
        resize();
    }
    playTones(tones) {
        for (let p of this.playing) {
            this.toneSounds.fade(1, 0, 50, p);
        }
        this.playing = tones.map(t => this.toneSounds.play(t.str()));
    }
}

export default View;