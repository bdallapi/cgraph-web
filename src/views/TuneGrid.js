import * as PIXI from 'pixi.js';
import {
    foreFrontColor
} from '../constants';
import * as math from 'mathjs';
import {
    tones
} from '../tones';

class TuneGrid extends PIXI.Container {
    constructor(selection, rect) {
        super();
        this.selection = selection;
        this.octaves = 3;
        this.minOctave = 3;
        this.chordsCount = 16;
        this.topOffset = 2;
        this.graph = new PIXI.Graphics();
        this.addChild(this.graph);
        this.cursorCell = [-1, -1];
        this.cursor = new PIXI.Graphics();
        this.addChild(this.cursor);
        this.chords = new PIXI.Graphics();
        this.addChild(this.chords);
        this.interactive = true;
        this.hitArea = new PIXI.Rectangle(0, 0, this.chordsCount, 12 * this.octaves + this.topOffset);
        let hovered = false;
        this.on('mouseover', () => hovered = true)
            .on('mouseout', () => {
                hovered = false;
                this.cursor.clear();
                this.cursorCell = [-1, -1];
            })
            .on('mousemove', (ev) => {
                if (hovered) this.drawCursor(ev);
            })
            .on('mousedown', (ev) => {
                if (hovered) this.onMouseDown(ev);
            });
        this.initTones();
        this.resize(rect);
        this.draw();
    }
    initTones() {
        this.tones = [];
        for (let o = this.octaves - 1; o >= 0; --o) {
            for (let val = 11; val >= 0; --val) {
                this.tones.push(tones.Tone.create(this.selection[val], o + this.minOctave));
            }
        }
    }
    resize(rect) {
        this.position.set(rect.x, rect.y);
        const scaleY = rect.height / (12 * this.octaves + this.topOffset);
        const scaleX = rect.width / this.chordsCount;
        this.scale.set(scaleX, scaleY);
    }
    drawCursor(ev) {
        let local = this.toLocal(ev.data.global);
        let cellX = math.floor(local.x);
        let cellY = math.floor(local.y);
        if (cellX != this.cursorCell[0] || cellY != this.cursorCell[1]) {
            this.cursorCell = [cellX, cellY];
            this.cursor.clear();
            this.cursor.lineStyle(1 / 32, foreFrontColor)
                .beginFill(foreFrontColor, 0.25)
                .drawRect(cellX, 0, 1, 12 * this.octaves)
                .endFill()
                .beginFill(foreFrontColor);
            if (cellY < this.topOffset) {
                this.cursor.drawRect(cellX, 0, 1, 2);
            } else {
                this.cursor.drawRect(cellX, cellY, 1, 1);
            }
            this.cursor.endFill();
        }
    }
    draw() {
        this.graph.clear();
        this.graph.lineStyle(1 / 16, foreFrontColor, 1);
        this.graph.drawRect(0, 0, this.chordsCount, this.topOffset);
        this.graph.lineStyle(1 / 8, foreFrontColor, 1);
        this.graph.moveTo(0, 2).lineTo(this.chordsCount, 2);
        this.graph.moveTo(0, 0).lineTo(0, this.octaves * 12 + this.topOffset);
        this.graph.lineStyle(1 / 16, foreFrontColor, 1);
        for (let o = 0; o < 3; ++o) {
            this.graph.drawRect(0, o * 12 + this.topOffset, this.chordsCount, 1)
                .beginFill(foreFrontColor, 0.5)
                .drawRect(0, (12 * o + 1) + this.topOffset, this.chordsCount, 1)
                .endFill()
                .drawRect(0, (o * 12 + 2) + this.topOffset, this.chordsCount, 1)
                .beginFill(foreFrontColor, 0.5)
                .drawRect(0, (12 * o + 3) + this.topOffset, this.chordsCount, 1)
                .endFill()
                .drawRect(0, (o * 12 + 4) + this.topOffset, this.chordsCount, 1)
                .beginFill(foreFrontColor, 0.5)
                .drawRect(0, (o * 12 + 5) + this.topOffset, this.chordsCount, 1)
                .endFill()
                .drawRect(0, (12 * o + 6) + this.topOffset, this.chordsCount, 1)
                .drawRect(0, (o * 12 + 7) + this.topOffset, this.chordsCount, 1)
                .beginFill(foreFrontColor, 0.5)
                .drawRect(0, (12 * o + 8) + this.topOffset, this.chordsCount, 1)
                .endFill()
                .drawRect(0, (o * 12 + 9) + this.topOffset, this.chordsCount, 1)
                .beginFill(foreFrontColor, 0.5)
                .drawRect(0, (12 * o + 10) + this.topOffset, this.chordsCount, 1)
                .endFill()
                .drawRect(0, (o * 12 + 11) + this.topOffset, this.chordsCount, 1);
        }
        for (let g = 1; g < this.chordsCount; ++g) {
            this.graph.moveTo(g, 0);
            this.graph.lineTo(g, this.octaves * 12 + this.topOffset);
        }
    }
    onMouseDown(ev) {
        let local = this.toLocal(ev.data.global);
        let cell = [math.floor(local.x), math.floor(local.y)];
        if (cell[1] < this.topOffset) {
            this.emit('chordTriggered', cell[0]);
        } else {
            this.emit('toneTriggered', cell[0], this.tones[cell[1] - this.topOffset]);
        }
    }
    drawChords(chords) {
        this.chords.clear();
        for (const [index, c] of chords.entries()) {
            for (const t of c.tones) {
                this.chords.beginFill(foreFrontColor)
                    .drawRect(index, (this.octaves + this.minOctave - t.octave) * 12 - t.tone.val - 1 + this.topOffset, 1, 1)
                    .endFill();
            }
        }
    }
}

export default TuneGrid;