class Chord {
    constructor() {
        this.tones = [];
        this.coords = [];
    }
}

class Tune {
    constructor() {
        this.chords = [];
        this.current = -1;
    }
    next() {
        ++this.current;
        if (this.current == this.chords.length) {
            this.chords.push(new Chord());
        }
    }
    getCurrent() {
        return this.chords[this.current];
    }
    setCurrentChord(tones, coords) {
        this.chords[this.current].tones = tones;
        this.chords[this.current].coords = coords;
    }
    appendToCurrentChord(tone, coord) {
        this.chords[this.current].tones.push(tone);
        this.chords[this.current].coords.push(coord);
    }
    removeFromCurrentChord(tone) {
        let t = this.chords[this.current].tones.findIndex(e => e.tone == tone.tone);
        this.chords[this.current].tones.splice(t, 1);
        this.chords[this.current].coords.splice(t, 1);
    }
    setCurrent(index) {
        while (index >= this.chords.length) {
            this.chords.push(new Chord);
        }
        this.current = index;
    }
}

class Model {
    constructor() {
        this.tune = new Tune();
    }
}

export default Model;