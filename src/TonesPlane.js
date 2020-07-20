import * as PIXI from 'pixi.js';
import {
    Grid
} from './Grid';
import * as math from 'mathjs';
import ToneSprite from './ToneSprite';
import {
    foreFrontColor
} from './constants';

function TonesPlane(selection, screen, resources) {
    PIXI.Container.call(this);
    this.interactive = true;
    this.grid = Grid.create(math.matrix([
        [0.5, -0.5],
        [0.5 * math.sqrt(3), 0.5 * math.sqrt(3)]
    ]));
    this.localWidth = 7.5;
    this.localScale = 1.0 / 192;
    this.unitCell = {
        size1: 3,
        size2: 4,
        toneValue: function (i, j) {
            if (i == 0 && j == 0) return 0;
            if (i == 1 && j == 0) return 4;
            if (i == 2 && j == 0) return 8;
            if (i == 0 && j == 1) return 9;
            if (i == 1 && j == 1) return 1;
            if (i == 2 && j == 1) return 5;
            if (i == 0 && j == 2) return 6;
            if (i == 1 && j == 2) return 10;
            if (i == 2 && j == 2) return 2;
            if (i == 0 && j == 3) return 3;
            if (i == 1 && j == 3) return 7;
            if (i == 2 && j == 3) return 11;
        }
    };
    const aspect = screen.height / screen.width;
    this.localFrame = new PIXI.Rectangle(
        -this.localWidth / 2, -aspect * this.localWidth / 2,
        this.localWidth, aspect * this.localWidth);
    this.selection = selection;
    this.resources = resources;

    this.resize(screen);
    this.populate();

    this.hovered = false;

    this.pointerTriangle = [];
    this.triangleCursor = new PIXI.Graphics();
    this.triangleCursor.zIndex = 0;
    this.addChild(this.triangleCursor);

    this.sortChildren();

    this.on('mousemove', this.onMouseMove)
        .on('mouseover', function () {
            this.hovered = true;
        })
        .on('mouseout', function () {
            this.hovered = false;
            for (let s of this.pointerTriangle) {
                this.setSpriteActive(s.get([0, 0]), s.get([1, 0]), false);
            }
            this.pointerTriangle = [];
            this.triangleCursor.clear();
        });
}

TonesPlane.prototype = Object.create(PIXI.Container.prototype);

TonesPlane.prototype.setSpriteActive = function (i, j, active) {
    if (i in this.toneSprites) {
        if (j in this.toneSprites[i]) {
            this.toneSprites[i][j].setActive(active);
        }
    }
}

TonesPlane.prototype.onMouseMove = function (ev) {
    const trianglesEq = function (lhs, rhs) {
        if (lhs.length != rhs.length)
            return false;
        for (let l of lhs) {
            let found = false;
            for (let r of rhs) {
                if (l.get([0, 0]) == r.get([0, 0]) && l.get([1, 0]) == r.get([1, 0])) {
                    found = true;
                    break;
                }
            }

            if (!found)
                return false;
        }
        return true;
    };
    if (this.hovered) {
        let local = this.toLocal(ev.data.global);
        let cell = this.grid.worldToCell(math.matrix([
            [local.x],
            [local.y]
        ]));
        let cellCoord = this.grid.cellToWorld(cell);
        let sextant = math.floor(math.atan2(local.y - cellCoord.get([1, 0]), local.x - cellCoord.get([0, 0])) / math.pi * 3);
        let newTriangle;
        switch (sextant) {
            case 0:
                newTriangle = [cell, math.add(cell, math.matrix([
                    [1],
                    [-1]
                ])), math.add(cell, math.matrix([
                    [1],
                    [0]
                ]))];
                break;
            case 1:
                newTriangle = [cell, math.add(cell, math.matrix([
                    [1],
                    [0]
                ])), math.add(cell, math.matrix([
                    [0],
                    [1]
                ]))];
                break;
            case 2:
                newTriangle = [cell, math.add(cell, math.matrix([
                    [0],
                    [1]
                ])), math.add(cell, math.matrix([
                    [-1],
                    [1]
                ]))];
                break;
            case -1:
                newTriangle = [cell, math.add(cell, math.matrix([
                    [1],
                    [-1]
                ])), math.add(cell, math.matrix([
                    [0],
                    [-1]
                ]))];
                break;
            case -2:
                newTriangle = [cell, math.add(cell, math.matrix([
                    [0],
                    [-1]
                ])), math.add(cell, math.matrix([
                    [-1],
                    [0]
                ]))];
                break;
            case -3:
                newTriangle = [cell, math.add(cell, math.matrix([
                    [-1],
                    [0]
                ])), math.add(cell, math.matrix([
                    [-1],
                    [1]
                ]))];
                break;
            default:
                throw new Error("unexpected sextant value: " + sextant);
        }
        if (!trianglesEq(this.pointerTriangle, newTriangle)) {
            for (let s of this.pointerTriangle) {
                this.setSpriteActive(s.get([0, 0]), s.get([1, 0]), false);
            }
            this.pointerTriangle = newTriangle;
            for (let s of this.pointerTriangle) {
                this.setSpriteActive(s.get([0, 0]), s.get([1, 0]), true);
            }
            this.drawTriangle(this.pointerTriangle);
        }
    }
}

TonesPlane.prototype.drawTriangle = function (summits) {
    const s0 = this.grid.cellToWorld(summits[0]);
    const s1 = this.grid.cellToWorld(summits[1]);
    const s2 = this.grid.cellToWorld(summits[2]);
    this.triangleCursor.clear()
        .lineStyle(1 / 128, foreFrontColor, 1)
        .beginFill(0xFFFFFF, 0)
        .moveTo(s0.get([0, 0]), s0.get([1, 0]))
        .lineTo(s1.get([0, 0]), s1.get([1, 0]))
        .lineTo(s2.get([0, 0]), s2.get([1, 0]))
        .lineTo(s0.get([0, 0]), s0.get([1, 0]))
        .closePath()
        .endFill();
}

TonesPlane.prototype.worldToTransformedFrame = function (worldFrame) {
    const tl = math.floor(math.multiply(this.grid.inv, math.matrix([
        [worldFrame.x],
        [worldFrame.y]
    ])));
    const tr = math.floor(math.multiply(this.grid.inv, math.matrix([
        [worldFrame.x + worldFrame.width],
        [worldFrame.y]
    ])));
    const bl = math.floor(math.multiply(this.grid.inv, math.matrix([
        [worldFrame.x],
        [worldFrame.y + worldFrame.height]
    ])));
    const br = math.floor(math.multiply(this.grid.inv, math.matrix([
        [worldFrame.x + worldFrame.width],
        [worldFrame.y + worldFrame.height]
    ])));
    const min0 = math.min(tl.get([0, 0]), tr.get([0, 0]), bl.get([0, 0]), br.get([0, 0]));
    const max0 = math.max(tl.get([0, 0]), tr.get([0, 0]), bl.get([0, 0]), br.get([0, 0]));
    const min1 = math.min(tl.get([1, 0]), tr.get([1, 0]), bl.get([1, 0]), br.get([1, 0]));
    const max1 = math.max(tl.get([1, 0]), tr.get([1, 0]), bl.get([1, 0]), br.get([1, 0]));
    return new PIXI.Rectangle(min0, min1, max0 - min0 + 1, max1 - min1 + 1);
};

TonesPlane.prototype.populate = function () {
    const tf = this.worldToTransformedFrame(this.localFrame);
    this.toneSprites = {};
    for (let i = tf.x; i < tf.x + tf.width; ++i) {
        for (let j = tf.y; j < tf.y + tf.height; ++j) {
            let uci = i % this.unitCell.size1;
            let ucj = j % this.unitCell.size2;
            if (uci < 0) uci += this.unitCell.size1;
            if (ucj < 0) ucj += this.unitCell.size2;
            const val = this.unitCell.toneValue(uci, ucj);
            const toneEnum = this.selection[val];

            let sprite = new ToneSprite(toneEnum, this.resources);
            sprite.zIndex = 1;
            let pos = this.grid.cellToWorld(math.matrix([
                [i],
                [j]
            ]));
            sprite.position.set(pos.get([0, 0]), pos.get([1, 0]));
            sprite.scale.set(this.localScale, this.localScale);
            this.addChild(sprite);
            if (!(i in this.toneSprites))
                this.toneSprites[i] = {};
            this.toneSprites[i][j] = sprite;
            let plane = this;
            sprite.on('mouseover', function () {
                    plane.emit('mouseout');
                })
                .on('mouseout', function () {
                    plane.emit('mouseover')
                });
        }
    }
};

TonesPlane.prototype.resize = function (rect) {
    let scale = rect.width / this.localWidth;
    this.scale.set(scale, scale);

    let screenTopLeftInLocal = this.toLocal(new PIXI.Point(rect.x, rect.y));
    let height = this.scale.y * rect.height;
    let width = this.scale.x * rect.width;
    this.hitArea = new PIXI.Rectangle(screenTopLeftInLocal.x, screenTopLeftInLocal.y, width, height);

    let aspect = rect.height / rect.width;
    this.localFrame = new PIXI.Rectangle(
        -this.localWidth / 2, -aspect * this.localWidth / 2,
        this.localWidth, aspect * this.localWidth);
};

export default TonesPlane;