import {
    AssignmentNodeDependencies
} from "mathjs";

const tones = Object.freeze({
    Cf: {
        val: 11,
        name: "Cf",
        main: "C",
        alt: "f"
    },
    C: {
        val: 0,
        name: "C",
        main: "C",
        alt: ""
    },
    Cs: {
        val: 1,
        name: "Cs",
        main: "C",
        alt: "s"
    },
    Df: {
        val: 1,
        name: "Df",
        main: "D",
        alt: "f"
    },
    D: {
        val: 2,
        name: "D",
        main: "D",
        alt: ""
    },
    Ds: {
        val: 3,
        name: "Ds",
        main: "D",
        alt: "s"
    },
    Ef: {
        val: 3,
        name: "Ef",
        main: "E",
        alt: "f"
    },
    E: {
        val: 4,
        name: "E",
        main: "E",
        alt: ""
    },
    Es: {
        val: 5,
        name: "Es",
        main: "E",
        alt: "s"
    },
    Ff: {
        val: 4,
        name: "Ff",
        main: "F",
        alt: "f"
    },
    F: {
        val: 5,
        name: "F",
        main: "F",
        alt: ""
    },
    Fs: {
        val: 6,
        name: "Fs",
        main: "F",
        alt: "s"
    },
    Gf: {
        val: 6,
        name: "Gf",
        main: "G",
        alt: "f"
    },
    G: {
        val: 7,
        name: "G",
        main: "G",
        alt: ""
    },
    Gs: {
        val: 8,
        name: "Gs",
        main: "G",
        alt: "s"
    },
    Af: {
        val: 8,
        name: "Af",
        main: "A",
        alt: "f"
    },
    A: {
        val: 9,
        name: "A",
        main: "A",
        alt: ""
    },
    As: {
        val: 10,
        name: "As",
        main: "A",
        alt: "s"
    },
    Bf: {
        val: 10,
        name: "Bf",
        main: "B",
        alt: "f"
    },
    B: {
        val: 11,
        name: "B",
        main: "B",
        alt: ""
    },
    Bs: {
        val: 0,
        name: "Bs",
        main: "B",
        alt: "s"
    },
    Tone: {
        create: function (toneEnum, octave) {
            var t = Object.create(this);
            t.tone = toneEnum;
            t.octave = octave;
            return t;
        },

        str: function () {
            return this.tone.name + '_' + this.octave;
        }
    }
});

const sharpSelection = [
    tones.C, tones.Cs, tones.D, tones.Ds, tones.E, tones.F, tones.Fs, tones.G, tones.Gs, tones.A, tones.As, tones.B
];
const flatSelection = [
    tones.C, tones.Df, tones.D, tones.Ef, tones.E, tones.F, tones.Gf, tones.G, tones.Af, tones.A, tones.Bf, tones.B
];

export {
    tones,
    sharpSelection,
    flatSelection
}