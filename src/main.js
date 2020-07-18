import * as PIXI from 'pixi.js';
import {
    tones,
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

PIXI.Loader.shared.add("assets/tones.png").load(setup);

function toneSpriteProvider(toneEnum, active, resources) {
    const main2Row = {
        "C": 0,
        "D": 1,
        "E": 2,
        "F": 3,
        "G": 4,
        "A": 5,
        "B": 6
    }
    let pixSize = 64;
    const alt2Col = function (alt, act) {
        switch (alt) {
            case "f":
                return act;
            case "":
                return 2 + act;
            case "s":
                return 4 + act;
        }
    }
    let texture = resources["assets/tones.png"].texture.clone();
    let rect = new PIXI.Rectangle(alt2Col(toneEnum.alt, active) * pixSize, main2Row[toneEnum.main] * pixSize, pixSize, pixSize);
    texture.frame = rect;
    return new PIXI.Sprite(texture);
}

function setup(loader, resources) {
    let provider = function (toneEnum, isActive) {
        return toneSpriteProvider(toneEnum, isActive, resources);
    }
    let plane = TonesPlane.create(sharpSelection, app.screen.height / app.screen.width, provider);
    plane.container.position.set(app.screen.width / 2, app.screen.height / 2);
    let scale = app.screen.width / plane.localWidth;
    plane.container.scale.set(scale, scale);
    app.stage.addChild(plane.container);
    app.renderer.render(app.stage);

    window.addEventListener('resize', resize);

    function resize() {
        // Get the p
        const parent = app.view.parentNode;

        // Resize the renderer
        app.renderer.resize(parent.clientWidth, parent.clientHeight);

        let scale = app.screen.width / plane.localWidth;
        plane.container.scale.set(scale, scale);
    }

    resize();
}