import {
    sharpSelection
} from './tones';

import TonesPlane from './views/TonesPlane';

class View {
    constructor(pixiapp, resources, toneSounds) {
        this.app = pixiapp;
        this.tonesPlane = new TonesPlane(sharpSelection, pixiapp.screen, resources, pixiapp.ticker);
        this.toneSounds = toneSounds;
        this.tonesPlane.position.set(this.app.screen.width / 2, this.app.screen.height / 2);

        this.app.stage.addChild(this.tonesPlane);
        this.app.renderer.render(this.app.stage);

        this.playing = [];
        this.tonesPlane.on('singletonetriggered', (triggeredTone) => {
            this.playTones([triggeredTone]);
        });

        let resize = () => {
            // Get the p
            const parent = this.app.view.parentNode;

            // Resize the renderer
            this.app.renderer.resize(parent.clientWidth, parent.clientHeight);
            this.tonesPlane.resize(this.app.screen);
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