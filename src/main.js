import * as PIXI from 'pixi.js';
import {
    sharpSelection
} from './tones';
import {
    TonesPlane
} from './TonesPlane';

var app = new PIXI.Application({
    autoResize: true,
    resolution: devicePixelRatio
});

document.querySelector("#tonesPlane").appendChild(app.view);

PIXI.Loader.shared.add(TonesPlane.asset).load(setup);

function setup(loader, resources) {
    let plane = TonesPlane.create(sharpSelection, app.screen.height / app.screen.width, resources);
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

        let scale = app.screen.width / plane.localWidth;
        plane.container.scale.set(scale, scale);
    }
    window.addEventListener('resize', resize);
    resize();
}