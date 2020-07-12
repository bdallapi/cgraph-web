import HexGrid from '../src/HexGrid';
import * as math from 'mathjs'

test('integerPosition transforms to itself', () => {
    let grid = HexGrid.create();
    let cell = math.matrix([[1],[1]]);
    expect(grid.worldToCell(grid.cellToWorld(cell))).toEqual(cell);
})