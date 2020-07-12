const tones = Object.freeze(
    {
        C: {val: 0, name: "C"},
        D: {val: 2, name: "D"},
        Df:{val: 1, name: "Df"},
        Ef:{val: 3, name: "Ef"},
        E: {val: 4, name: "E"},
        F: {val: 5, name: "F"},
        Gf:{val: 6, name: "Gf"},
        G: {val: 7, name: "G"},
        Af:{val: 8, name: "Af"},
        A: {val: 9, name: "A"},
        Bf:{val: 10, name: "Bf"},
        B: {val: 11, name: "B"},
        Tone: {
            create: function(toneEnum, octave)
            {
                var t = Object.create(this);
                t.tone = toneEnum;
                t.octave = octave;
                return t;
            },
            
            str: function()
            {
                return this.tone.name + '_' + this.octave;
            }
        }
    });

export default tones;