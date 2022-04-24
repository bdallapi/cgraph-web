class Chord {
    constructor() {
        this.tones = [];
        this.coords = [];
    }
}

class Model {
    constructor() {
        this.chord = new Chord();
    }

    setChord(tones, coords) {
        this.chord.tones = tones;
        this.chord.coords = coords;
    }
    appendToCurrentChord(tone, coord) {
        this.chord.tones.push(tone);
        this.chord.coords.push(coord);
    }
    removeFromCurrentChord(tone) {
        let t = this.chord.tones.findIndex(e => e.tone == tone.tone && e.octave == tone.octave);
        this.chord.tones.splice(t, 1);
        this.chord.coords.splice(t, 1);
    }
}

export default Model;