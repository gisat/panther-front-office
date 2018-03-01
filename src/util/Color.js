let hexDigits = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "a", "b", "c", "d", "e", "f"];

class Color {
    constructor(rgb) {
        this.rgb = rgb;
    };

    hex() {
        let rgb = this.rgb.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);
        return "#" + this._hex(rgb[1]) + this._hex(rgb[2]) + this._hex(rgb[3]);
    };

    _hex(x) {
        return isNaN(x) ? "00" : hexDigits[(x - x % 16) / 16] + hexDigits[x % 16];
    };
}

export default Color;