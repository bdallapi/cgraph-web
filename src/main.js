import * as PIXI from 'pixi.js';
import {
    tones
} from './tones';
import ToneSprite from './views/ToneSprite';
import {
    loadToneSounds
} from './views/ToneSounds';
import {
    foreFrontColor
} from './constants';
import Model from './model';
import View from './view';
import Controller from './controller';

let app = setupApp();
let loadingAnimation = loadScreen(app);
app.stage.addChild(loadingAnimation);

var toneSounds = loadToneSounds();
toneSounds.once('load', () => {
    PIXI.Loader.shared.add(ToneSprite.asset).load((loader, resources) => {
        app.stage.removeChild(loadingAnimation);
        setup(loader, resources);
    });
});

function setupApp() {
    var app = new PIXI.Application({
        autoResize: true,
        resolution: devicePixelRatio,
        antialias: true
    });
    document.querySelector("#main").appendChild(app.view);
    const parent = app.view.parentNode;
    app.renderer.resize(parent.clientWidth, parent.clientHeight);
    return app;
}

function loadScreen(app) {
    let loadingAnimation = new PIXI.Graphics;
    app.stage.addChild(loadingAnimation);
    loadingAnimation.position.set(app.screen.x / 2, app.screen.y / 2);
    let dx = 0;
    let dir = 8;
    app.ticker.add(() => {
        let bw = app.screen.width / 4;
        let bh = 64;
        let cw = app.screen.width / 16;
        loadingAnimation.clear();
        loadingAnimation.lineStyle(1, foreFrontColor);
        loadingAnimation.drawRect(app.screen.width / 2 - bw / 2, app.screen.height / 2 - bh / 2, bw, bh);
        let step = dx + dir;
        if (step + cw >= bw) dir = -8;
        else if (step <= 0) dir = 8;
        else dx = step;
        loadingAnimation.beginFill(foreFrontColor);
        loadingAnimation.drawRect(app.screen.width / 2 - bw / 2 + dx, app.screen.height / 2 - bh / 2, cw, bh)
        loadingAnimation.endFill();
    });
    return loadingAnimation;
}

function setup(loader, resources) {
    let model = new Model();
    let view = new View(app, resources, toneSounds);
    let controller = new Controller(model, view);

    view.tonesPlane.on('tonestriggered', (tones, coords) => controller.onTonesTriggered(tones, coords));
    view.tonesPlane.on('singletonetriggered', (tone, coord) => controller.onSingleToneTriggered(tone, coord));
    view.tonesPlane.on('currentchordtriggered', () => controller.onCurrentChordTriggered());
    view.tuneGrid.on('toneTriggered', (cid, tone) => controller.onTuneToneTriggered(cid, tone));

    onSoundLoaded();
}

function onSoundLoaded() {
    toneSounds.play(tones.Tone.create(tones.C, 3).str());
    toneSounds.play(tones.Tone.create(tones.C, 4).str());
    toneSounds.play(tones.Tone.create(tones.E, 4).str());
    toneSounds.play(tones.Tone.create(tones.G, 4).str());
}