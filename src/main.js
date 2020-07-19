import * as PIXI from 'pixi.js';
import {
    sharpSelection
} from './tones';
import TonesPlane from './TonesPlane';
import ToneSprite from './ToneSprite';

var app = new PIXI.Application({
    autoResize: true,
    resolution: devicePixelRatio
});

document.querySelector("#tonesPlane").appendChild(app.view);

PIXI.Loader.shared.add(ToneSprite.asset).load(setup);

function setup(loader, resources) {
    let plane = TonesPlane.create(sharpSelection, app.screen, resources);
    plane.container.position.set(app.screen.width / 2, app.screen.height / 2);
    let scale = app.screen.width / plane.localWidth;
    plane.container.scale.set(scale, scale);

    app.stage.addChild(plane.container);
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