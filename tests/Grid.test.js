import {
    HexGrid
} from '../src/Grid';
import * as math from 'mathjs';

test('integer cell position transforms to itself', () => {
    let grid = HexGrid.create();
    let cell = math.matrix([
        [1],
        [1]
    ]);
    expect(grid.worldToCell(grid.cellToWorld(cell))).toEqual(cell);
});

test('points along edges transform to closest cell position', () => {
    let grid = HexGrid.create();
    let alpha = math.pi / 3;

    // take a cell position away from origin to avoid special cases
    let cell = math.matrix([
        [1],
        [2]
    ]);
    let pos = grid.cellToWorld(cell);
    let len = 0.3; // 0.5 is the tipping point
    for (var i = 0; i < 6; ++i) {
        let tpos = math.add(pos, math.multiply(len, math.matrix([
            [math.cos(i * alpha)],
            [math.sin(i * alpha)]
        ])));
        expect(grid.worldToCell(tpos)).toEqual(cell);
    }
});

describe('points further along edges transform to next cell position', () => {
    var grid = HexGrid.create();
    const alpha = math.pi / 3;

    // take a cell position away from origin to avoid special cases
    const cell = math.matrix([
        [1],
        [2]
    ]);
    const pos = grid.cellToWorld(cell);
    const len = 0.6; // 0.5 is the tipping point

    test('along (1, 0) edge', () => {
        let tpos = math.add(pos, math.multiply(len, math.matrix([
            [1],
            [0]
        ])));
        let expectedCell = math.matrix([
            [2],
            [2]
        ]);
        expect(grid.worldToCell(tpos)).toEqual(expectedCell);
    });

    test('along (-1, 1) edge', () => {
        let tpos = math.add(pos, math.multiply(len, math.matrix([
            [math.cos(2 * alpha)],
            [math.sin(2 * alpha)]
        ])));
        let expectedCell = math.matrix([
            [0],
            [3]
        ]);
        expect(grid.worldToCell(tpos)).toEqual(expectedCell);
    });

    test('along (-1, 0) edge', () => {
        let tpos = math.add(pos, math.multiply(len, math.matrix([
            [math.cos(3 * alpha)],
            [math.sin(3 * alpha)]
        ])));
        let expectedCell = math.matrix([
            [0],
            [2]
        ]);
        expect(grid.worldToCell(tpos)).toEqual(expectedCell);
    });

    test('along (0, -1) edge', () => {
        let tpos = math.add(pos, math.multiply(len, math.matrix([
            [math.cos(4 * alpha)],
            [math.sin(4 * alpha)]
        ])));
        let expectedCell = math.matrix([
            [1],
            [1]
        ]);
        expect(grid.worldToCell(tpos)).toEqual(expectedCell);
    });

    test('along (1, -1) edge', () => {
        let tpos = math.add(pos, math.multiply(len, math.matrix([
            [math.cos(5 * alpha)],
            [math.sin(5 * alpha)]
        ])));
        let expectedCell = math.matrix([
            [2],
            [1]
        ]);
        expect(grid.worldToCell(tpos)).toEqual(expectedCell);
    });
});