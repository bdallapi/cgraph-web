import * as PIXI from 'pixi.js';
import {
    sharpSelection,
    tones
} from './tones';
import TonesPlane from './TonesPlane';
import ToneSprite from './ToneSprite';
import ToneSounds from './ToneSounds';

var app = new PIXI.Application({
    autoResize: true,
    resolution: devicePixelRatio,
    antialias: true
});

var toneSounds = new ToneSounds('assets/tones.webm', onSoundLoaded);

document.querySelector("#tonesPlane").appendChild(app.view);

PIXI.Loader.shared.add(ToneSprite.asset).load(setup);

function setup(loader, resources) {
    let plane = new TonesPlane(sharpSelection, app.screen, resources);
    plane.position.set(app.screen.width / 2, app.screen.height / 2);

    app.stage.addChild(plane);
    app.renderer.render(app.stage);

    function resize() {
        // Get the p
        const parent = app.view.parentNode;

        // Resize the renderer
        app.renderer.resize(parent.clientWidth, parent.clientHeight);
        plane.resize(app.screen);
    }
    window.addEventListener('resize', resize);
    resize();
}

function onSoundLoaded() {
    toneSounds.play(tones.Tone.create(tones.C, 3));
    toneSounds.play(tones.Tone.create(tones.C, 4));
    toneSounds.play(tones.Tone.create(tones.E, 4));
    toneSounds.play(tones.Tone.create(tones.G, 4));
}