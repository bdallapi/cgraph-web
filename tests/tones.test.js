import tones from '../src/tones';

test('tone C at octave 3 has string C_3', () => {
    expect(tones.Tone(tones.C, 3).str()).toBe('C_3');
});