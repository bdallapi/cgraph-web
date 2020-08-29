import * as PIXI from 'pixi.js';

function ToneSprite(toneEnum, resources) {
    PIXI.Container.call(this);
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
    let shiftx = 1.25;
    let shifty = 0.7;
    let tokenScale = 0.35;
    let pixSize = 64;
    this.passiveTex = resources["assets/tones.png"].texture.clone();
    this.activeTex = this.passiveTex.clone();
    this.passiveTex.frame = new PIXI.Rectangle(alt2Col(toneEnum.alt, false) * pixSize, main2Row[toneEnum.main] * pixSize, pixSize, pixSize);
    this.activeTex.frame = new PIXI.Rectangle(alt2Col(toneEnum.alt, true) * pixSize, main2Row[toneEnum.main] * pixSize, pixSize, pixSize);
    this.toneSprite = new PIXI.Sprite(this.passiveTex);
    this.toneSprite.interactive = true;
    this.addChild(this.toneSprite);

    let tokensTex = resources["assets/tokens.png"].texture.clone();
    this.tokens = {};
    this.tokenSprites = {};
    for (let octave of [3, 4, 5]) {
        this.tokens[octave] = {};
        this.tokens[octave]["+"] = tokensTex.clone();
        this.tokens[octave]["+"].frame = new PIXI.Rectangle(0, (octave - 3) * pixSize, pixSize, pixSize);
        this.tokens[octave]["-"] = tokensTex.clone();
        this.tokens[octave]["-"].frame = new PIXI.Rectangle(pixSize, (octave - 3) * pixSize, pixSize, pixSize);
        this.tokenSprites[octave] = new PIXI.Sprite(this.tokens[octave]["+"]);
        this.tokenSprites[octave].position.set(shiftx * pixSize, tokenScale * pixSize + (octave - 4) * shifty * pixSize);
        this.tokenSprites[octave].scale.set(tokenScale, tokenScale);
        this.tokenSprites[octave].interactive = true;
        this.tokenSprites[octave].visible = false;
        let tokenHovered = false;
        this.tokenSprites[octave].on("mouseover", () => {
                tokenHovered = true;
            })
            .on("mouseout", () => {
                tokenHovered = false;
            })
            .on("mousedown", () => {
                if (tokenHovered) {
                    this.emit("tonetriggered", octave);
                }
            })
        this.addChild(this.tokenSprites[octave]);
    }
    this.interactive = true;

    const showOctaves = (show) => {
        for (const octave in this.tokenSprites) {
            this.tokenSprites[octave].visible = show;
        }
    }

    this.selected = false;
    this.toneSpriteHovered = false;
    this.toneSprite.on("mouseover", () => {
            this.toneSpriteHovered = true;
            this.setActive(true);
            showOctaves(true);
        })
        .on("mouseout", () => {
            this.toneSpriteHovered = false;
            this.setActive(this.selected);
            showOctaves(this.selected);
        })
        .on("mousedown", () => {
            this.selected = !this.selected;
            showOctaves(this.selected);
        });

    this.pivot.set(pixSize / 2, pixSize / 2);
}

ToneSprite.prototype = Object.create(PIXI.Container.prototype);

ToneSprite.prototype.setActive = function (active) {
    if (active)
        this.toneSprite.texture = this.activeTex;
    else if (!this.toneSpriteHovered && !this.selected)
        this.toneSprite.texture = this.passiveTex;
};

ToneSprite.prototype.setSelectedOctaves = function (octaves) {
    for (const octave in this.tokenSprites) {
        if (octaves.findIndex((o) => o == octave) >= 0) {
            this.tokenSprites[octave].texture = this.tokens[octave]["-"];
        } else {
            this.tokenSprites[octave].texture = this.tokens[octave]["+"];
        }
    }
}

ToneSprite.assets = ["assets/tones.png", "assets/tokens.png"];

export default ToneSprite;