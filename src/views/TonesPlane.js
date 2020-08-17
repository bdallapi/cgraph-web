import * as PIXI from 'pixi.js';
import convex_hull from 'convex-hull';
import {
    Grid
} from './Grid';
import * as math from 'mathjs';
import ToneSprite from './ToneSprite';
import {
    foreFrontColor
} from '../constants';
import {
    tones
} from '../tones';

function TonesPlane(selection, rect, resources, ticker) {
    PIXI.Container.call(this);
    this.interactive = true;
    this.grid = Grid.create(math.matrix([
        [0.5, -0.5],
        [-0.5 * math.sqrt(3), -0.5 * math.sqrt(3)]
    ]));
    this.localWidth = 7.5;
    this.localScale = 1.0 / 192;
    this.unitCell = {
        size1: 3,
        size2: 4,
        toneValue: function (ii, jj) {
            let i = ii % 3;
            if (i < 0) i += 3;
            let j = jj % 4;
            if (j < 0) j += 4;
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

    this.mask = new PIXI.Graphics();
    this.addChild(this.mask);

    this.resize(rect);
    this.selection = selection;
    this.resources = resources;

    this.populate();

    this.hovered = false;

    this.pointerTriangle = [];
    this.triangleCursor = new PIXI.Graphics();
    this.triangleCursor.zIndex = 0;
    this.addChild(this.triangleCursor);

    this.currentChord = new PIXI.Graphics();
    this.currentChord.zIndex = 0;
    this.currentChord.interactive = true;
    this.addChildAt(this.currentChord);
    this.currentChordHull = [];

    this.ticker = ticker;

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
        })
        .on('mousedown', this.onMouseDown);

    var currentChordHovered = false;
    this.currentChord.on('mouseover', () => {
            this.emit('mouseout');
            currentChordHovered = true;
            for (let s of this.currentChordCoords) {
                this.setSpriteActive(s.get([0, 0]), s.get([1, 0]), true);
            }
        })
        .on('mouseout', () => {
            currentChordHovered = false;
            for (let s of this.currentChordCoords) {
                this.setSpriteActive(s.get([0, 0]), s.get([1, 0]), false);
            }
            this.emit('mouseover');
        })
        .on('mousedown', () => {
            if (currentChordHovered) {
                this.emit('currentchordtriggered');
            }
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
            case -1:
                newTriangle = [cell, math.add(cell, math.matrix([
                    [1],
                    [-1]
                ])), math.add(cell, math.matrix([
                    [1],
                    [0]
                ]))];
                break;
            case -2:
                newTriangle = [cell, math.add(cell, math.matrix([
                    [1],
                    [0]
                ])), math.add(cell, math.matrix([
                    [0],
                    [1]
                ]))];
                break;
            case 3:
            case -3:
                newTriangle = [cell, math.add(cell, math.matrix([
                    [0],
                    [1]
                ])), math.add(cell, math.matrix([
                    [-1],
                    [1]
                ]))];
                break;
            case 0:
                newTriangle = [cell, math.add(cell, math.matrix([
                    [1],
                    [-1]
                ])), math.add(cell, math.matrix([
                    [0],
                    [-1]
                ]))];
                break;
            case 1:
                newTriangle = [cell, math.add(cell, math.matrix([
                    [0],
                    [-1]
                ])), math.add(cell, math.matrix([
                    [-1],
                    [0]
                ]))];
                break;
            case 2:
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
            this.triangleCursor.clear().lineStyle(1 / 128, foreFrontColor, 1);
            this.drawPolygon(this.pointerTriangle, this.triangleCursor);
        }
    }
}

TonesPlane.prototype.onMouseDown = function (ev) {
    if (this.hovered) {
        if (ev.data.button == 0) {
            let triggeredTones = this.pointerTriangle.map(pt => tones.Tone.create(this.selection[this.unitCell.toneValue(pt.get([0, 0]), pt.get([1, 0]))], 4));
            this.emit('tonestriggered', triggeredTones, this.pointerTriangle);
        }
    }
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

TonesPlane.prototype.toneFromCell = function (i, j) {
    let uci = i % this.unitCell.size1;
    let ucj = j % this.unitCell.size2;
    if (uci < 0) uci += this.unitCell.size1;
    if (ucj < 0) ucj += this.unitCell.size2;
    const val = this.unitCell.toneValue(uci, ucj);
    return this.selection[val];
}

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
            sprite.on('mouseover', () => {
                    this.emit('mouseout');
                })
                .on('mouseout', () => {
                    this.emit('mouseover')
                })
                .on('tonetriggered', () => {
                    this.emit('singletonetriggered', tones.Tone.create(toneEnum, 4), math.matrix([
                        [i],
                        [j]
                    ]));
                });
        }
    }
};

TonesPlane.prototype.resize = function (rect) {
    let scale = rect.width / this.localWidth;
    this.scale.set(scale, scale);

    let aspect = rect.height / rect.width;
    this.localFrame = new PIXI.Rectangle(
        -this.localWidth / 2, -aspect * this.localWidth / 2,
        this.localWidth, aspect * this.localWidth);

    this.position.set(rect.x + rect.width / 2, rect.y + rect.height / 2);

    this.mask.clear();
    this.mask.beginFill(0xffffff)
        .drawRect(this.localFrame.x, this.localFrame.y, this.localFrame.width, this.localFrame.height)
        .endFill();

    this.hitArea = this.localFrame.clone();
};

TonesPlane.prototype.setCurrentChord = function (coords) {
    this.currentChordCoords = coords.map(c => c.clone());
    this.currentChord.clear();
    if (coords.length == 0) {
        return;
    }

    this.currentChordHull = convex_hull(coords.map((c) => [c.get([0, 0]), c.get([1, 0])])).map(h => coords[h[0]]);

    this.currentChord.lineStyle(1 / 128, foreFrontColor, 1);
    this.drawPolygon(this.currentChordHull, this.currentChord);
    this.currentChord.hitArea = new PIXI.Polygon(this.currentChordHull.map(e => {
        let p = this.grid.cellToWorld(e);
        return new PIXI.Point(p.get([0, 0]), p.get([1, 0]));
    }));
}

TonesPlane.prototype.drawPolygon = function (poly, graphics) {
    let start = this.grid.cellToWorld(poly[0]);
    graphics.moveTo(start.get([0, 0]), start.get([1, 0]))
    for (let p of poly.slice(1)) {
        let point = this.grid.cellToWorld(p);
        graphics.lineTo(point.get([0, 0]), point.get([1, 0]));
    }
    graphics.lineTo(start.get([0, 0]), start.get([1, 0]));
    graphics.closePath();
}

TonesPlane.prototype.onCurrentChordTriggered = function () {
    var fading = new PIXI.Graphics();
    var alpha = 1;
    this.addChildAt(fading, 0);
    var hull = this.currentChordHull.map(e => e.clone());
    let animation = () => {
        alpha -= 0.01;
        if (alpha < 0) {
            this.removeChild(fading);
            this.ticker.remove(animation);
            fading.destroy();
        } else {
            fading.clear();
            fading.beginFill(foreFrontColor, alpha);
            this.drawPolygon(hull, fading);
            fading.endFill();
        }
    };
    this.ticker.add(animation);
}

TonesPlane.prototype.coordFromToneClosestTo = function (tone, pos) {
    const closest = Object.keys(this.toneSprites).reduce((min, i) => {
        const minOverI = Object.keys(this.toneSprites[i]).reduce((min, j) => {
            if (tone.tone != this.toneFromCell(i, j)) {
                return min;
            }
            const p = this.grid.cellToWorld(math.matrix([
                [i],
                [j]
            ]));
            const d = math.subtract(p, pos);
            const val = math.pow(d.get([0, 0]), 2) + math.pow(d.get([1, 0]), 2);
            min = val < min.val ? {
                val: val,
                i: i,
                j: j
            } : min;
            return min;
        }, {
            val: 10000,
            i: i,
            j: 0
        });
        min = minOverI.val < min.val ? minOverI : min;
        return min;
    }, {
        val: 10000,
        i: 0,
        j: 0
    });
    return math.matrix([
        [closest.i],
        [closest.j]
    ]);
}

export default TonesPlane;