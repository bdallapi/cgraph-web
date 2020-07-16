import * as math from 'mathjs'
var Grid = {
    create: function (trans) {
        var g = Object.create(this);
        g.trans = trans;
        g.inv = math.inv(trans);
        return g;
    },

    cellToWorld: function (cell) {
        return math.multiply(this.trans, cell);
    },

    worldToCell: function (pos) {
        return math.round(math.multiply(this.inv, pos));
    }
}

var HexGrid = Object.create(Grid);
HexGrid.create = function () {
    return Grid.create(math.matrix([
        [1, math.cos(math.pi / 3)],
        [0, math.sin(math.pi / 3)]
    ]));
};

export default HexGrid;
export default Grid;