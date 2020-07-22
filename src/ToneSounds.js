import {
    Howl
} from 'howler'

import {
    tones,
    sharpSelection,
    flatSelection
} from './tones'

function loadToneSounds() {
    let conf = {
        src: 'assets/tones.webm',
        sprite: {}
    };
    let time = 8000;
    for (let octave = 3; octave < 6; ++octave) {
        for (let v = 0; v < 12; ++v) {
            conf.sprite[tones.Tone.create(sharpSelection[v], octave).str()] = [((octave - 3) * 12 + v) * time, time];
            conf.sprite[tones.Tone.create(flatSelection[v], octave).str()] = [((octave - 3) * 12 + v) * time, time];
        }
    }
    return new Howl(conf);
}

export {
    loadToneSounds
};