import * as PIXI from 'pixi.js';

function ToneSprite(toneEnum, resources) {
    let main2Row = {
        "C": 0,
        "D": 1,
        "E": 2,
        "F": 3,
        "G": 4,
        "A": 5,
        "B": 6
    };
    let alt2Col = function (alt, act) {
        switch (alt) {
            case "f":
                return act;
            case "":
                return 2 + act;
            case "s":
                return 4 + act;
        }
    };
    let pixSize = 64;
    this.passiveTex = resources["assets/tones.png"].texture.clone();
    this.activeTex = this.passiveTex.clone();
    this.passiveTex.frame = new PIXI.Rectangle(alt2Col(toneEnum.alt, false) * pixSize, main2Row[toneEnum.main] * pixSize, pixSize, pixSize);
    this.activeTex.frame = new PIXI.Rectangle(alt2Col(toneEnum.alt, true) * pixSize, main2Row[toneEnum.main] * pixSize, pixSize, pixSize);

    PIXI.Sprite.call(this, this.passiveTex);
    this.interactive = true;
    this.hovered = false;
    this.on('mouseover', function () {
            this.hovered = true;
            this.setActive(true);
        })
        .on('mouseout', function () {
            this.hovered = false;
            this.setActive(false);
        });
    this.pivot.set(pixSize / 2, pixSize / 2);
}

ToneSprite.prototype = Object.create(PIXI.Sprite.prototype);

ToneSprite.prototype.setActive = function (active) {
    if (active)
        this.texture = this.activeTex;
    else if (!this.hovered)
        this.texture = this.passiveTex;
};

ToneSprite.asset = "assets/tones.png";

export default ToneSprite;