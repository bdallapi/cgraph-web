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
    setCurrent(index) {
        this.current = index;
    }
}

class Model {
    constructor() {
        this.tune = new Tune();
    }
}

export default Model;