/**
 * Bloques pantalla OLED — SmartTEAM4 / subcategoría OLED
 * Origen: ICreateRobot block/Av_OLED.ts
 */
//OLED模块
enum Ext4Oled {
    //% block=" "
    oled1 = 0,

    //% block=" "
    oled2 = 1,

    //% block=" "
    oled3 = 2,

    //% block=" "
    oled4 = 3,

    //% block=" "
    oled5 = 4,

    //% block=" "
    oled6 = 5,

    //% block=" "
    oled7 = 6,

    //% block=" "
    oled8 = 7,

    //% block=" "
    oled9 = 8,

    //% block=" "
    oled10 = 9,

    //% block=" "
    oled11 = 10,

    //% block=" "
    oled12 = 11,

    //% block=" "
    oled13 = 12,

    //% block=" "
    oled14 = 13,

    //% block=" "
    oled15 = 14,

    //% block=" "
    oled16 = 15,

    //% block=" "
    oled17 = 16,

    //% block=" "
    oled18 = 17,

    //% block=" "
    oled19 = 18,

    //% block=" "
    oled20 = 19,

    //% block=" "
    oled21 = 20,

    //% block=" "
    oled22 = 21,

    //% block=" "
    oled23 = 22,

    //% block=" "
    oled24 = 23,

    //% block=" "
    oled25 = 24,

    //% block=" "
    oled26 = 25,

    //% block=" "
    oled27 = 26,

    //% block=" "
    oled28 = 27,

    //% block=" "
    oled29 = 28,

    //% block=" "
    oled30 = 29,

    //% block=" "
    oled31 = 30,

    //% block=" "
    oled32 = 31,

    //% block=" "
    oled33 = 32,

    //% block=" "
    oled34 = 33,

    //% block=" "
    oled35 = 34,

    //% block=" "
    oled36 = 35,

    //% block=" "
    oled37 = 36,

    //% block=" "
    oled38 = 37,

    //% block=" "
    oled39 = 38,

    //% block=" "
    oled40 = 39,

    //% block=" "
    oled41 = 40,

    //% block=" "
    oled42 = 41,

    //% block=" "
    oled43 = 42,

    //% block=" "
    oled44 = 43,

    //% block=" "
    oled45 = 44,

    //% block=" "
    oled46 = 45,

    //% block=" "
    oled47 = 46,

    //% block=" "
    oled48 = 47,

    //% block=" "
    oled49 = 48,

    //% block=" "
    oled50 = 49,

    //% block=" "
    oled51 = 50,

    //% block=" "
    oled52 = 51,
}

namespace ext4_smartteam4 {
    let _I2CAddr = 0;
    let _screen = pins.createBuffer(1025);
    let _buf2 = pins.createBuffer(2);
    let _buf3 = pins.createBuffer(3);
    let _buf4 = pins.createBuffer(4);
    let _ZOOM = 1;
    
    let font: number[] = [];
    font[0] = 0x0022d422;
    font[1] = 0x0022d422;
    font[2] = 0x0022d422;
    font[3] = 0x0022d422;
    font[4] = 0x0022d422;
    font[5] = 0x0022d422;
    font[6] = 0x0022d422;
    font[7] = 0x0022d422;
    font[8] = 0x0022d422;
    font[9] = 0x0022d422;
    font[10] = 0x0022d422;
    font[11] = 0x0022d422;
    font[12] = 0x0022d422;
    font[13] = 0x0022d422;
    font[14] = 0x0022d422;
    font[15] = 0x0022d422;
    font[16] = 0x0022d422;
    font[17] = 0x0022d422;
    font[18] = 0x0022d422;
    font[19] = 0x0022d422;
    font[20] = 0x0022d422;
    font[21] = 0x0022d422;
    font[22] = 0x0022d422;
    font[23] = 0x0022d422;
    font[24] = 0x0022d422;
    font[25] = 0x0022d422;
    font[26] = 0x0022d422;
    font[27] = 0x0022d422;
    font[28] = 0x0022d422;
    font[29] = 0x0022d422;
    font[30] = 0x0022d422;
    font[31] = 0x0022d422;
    font[32] = 0x00000000;
    font[33] = 0x000002e0;
    font[34] = 0x00018060;
    font[35] = 0x00afabea;
    font[36] = 0x00aed6ea;
    font[37] = 0x01991133;
    font[38] = 0x010556aa;
    font[39] = 0x00000060;
    font[40] = 0x000045c0;
    font[41] = 0x00003a20;
    font[42] = 0x00051140;
    font[43] = 0x00023880;
    font[44] = 0x00002200;
    font[45] = 0x00021080;
    font[46] = 0x00000100;
    font[47] = 0x00111110;
    font[48] = 0x0007462e;
    font[49] = 0x00087e40;
    font[50] = 0x000956b9;
    font[51] = 0x0005d629;
    font[52] = 0x008fa54c;
    font[53] = 0x009ad6b7;
    font[54] = 0x008ada88;
    font[55] = 0x00119531;
    font[56] = 0x00aad6aa;
    font[57] = 0x0022b6a2;
    font[58] = 0x00000140;
    font[59] = 0x00002a00;
    font[60] = 0x0008a880;
    font[61] = 0x00052940;
    font[62] = 0x00022a20;
    font[63] = 0x0022d422;
    font[64] = 0x00e4d62e;
    font[65] = 0x000f14be;
    font[66] = 0x000556bf;
    font[67] = 0x0008c62e;
    font[68] = 0x0007463f;
    font[69] = 0x0008d6bf;
    font[70] = 0x000094bf;
    font[71] = 0x00cac62e;
    font[72] = 0x000f909f;
    font[73] = 0x000047f1;
    font[74] = 0x0017c629;
    font[75] = 0x0008a89f;
    font[76] = 0x0008421f;
    font[77] = 0x01f1105f;
    font[78] = 0x01f4105f;
    font[79] = 0x0007462e;
    font[80] = 0x000114bf;
    font[81] = 0x000b6526;
    font[82] = 0x010514bf;
    font[83] = 0x0004d6b2;
    font[84] = 0x0010fc21;
    font[85] = 0x0007c20f;
    font[86] = 0x00744107;
    font[87] = 0x01f4111f;
    font[88] = 0x000d909b;
    font[89] = 0x00117041;
    font[90] = 0x0008ceb9;
    font[91] = 0x0008c7e0;
    font[92] = 0x01041041;
    font[93] = 0x000fc620;
    font[94] = 0x00010440;
    font[95] = 0x01084210;
    font[96] = 0x00000820;
    font[97] = 0x010f4a4c;
    font[98] = 0x0004529f;
    font[99] = 0x00094a4c;
    font[100] = 0x000fd288;
    font[101] = 0x000956ae;
    font[102] = 0x000097c4;
    font[103] = 0x0007d6a2;
    font[104] = 0x000c109f;
    font[105] = 0x000003a0;
    font[106] = 0x0006c200;
    font[107] = 0x0008289f;
    font[108] = 0x000841e0;
    font[109] = 0x01e1105e;
    font[110] = 0x000e085e;
    font[111] = 0x00064a4c;
    font[112] = 0x0002295e;
    font[113] = 0x000f2944;
    font[114] = 0x0001085c;
    font[115] = 0x00012a90;
    font[116] = 0x010a51e0;
    font[117] = 0x010f420e;
    font[118] = 0x00644106;
    font[119] = 0x01e8221e;
    font[120] = 0x00093192;
    font[121] = 0x00222292;
    font[122] = 0x00095b52;
    font[123] = 0x0008fc80;
    font[124] = 0x000003e0;
    font[125] = 0x000013f1;
    font[126] = 0x00841080;
    font[127] = 0x0022d422;


    function cmd1(d: number) {
        let n = d % 256;
        pins.i2cWriteNumber(_I2CAddr, n, NumberFormat.UInt16BE);
    }

    function cmd2(d1: number, d2: number) {
        _buf3[0] = 0;
        _buf3[1] = d1;
        _buf3[2] = d2;
        pins.i2cWriteBuffer(_I2CAddr, _buf3);
    }

    function cmd3(d1: number, d2: number, d3: number) {
        _buf4[0] = 0;
        _buf4[1] = d1;
        _buf4[2] = d2;
        _buf4[3] = d3;
        pins.i2cWriteBuffer(_I2CAddr, _buf4);
    }

    function set_pos(col: number = 0, page: number = 0) {
        cmd1(0xb0 | page) // page number
        let c = col * (_ZOOM + 1)
        cmd1(0x00 | (c % 16)) // lower start column address
        cmd1(0x10 | (c >> 4)) // upper start column address    
    }

    /**
     * show text in OLED
     * @param oled_x is X alis, eg: 0
     * @param oled_y is Y alis, eg: 0
     * @param s is the text will be show, eg: 'Hello!'
     */
    //% blockId=ext4_oled_show_text block="Display text – please choose location %oled| text%s"
    //% parts=OLED12864_I2C trackArgs=0
    //% oled.fieldEditor="gridpicker"
    //% oled.fieldOptions.width=320
    //% oled.fieldOptions.columns=13
    //% group="OLED" color="#4527A0" icon="\uf108"
    //% weight=10 blockGap=10 
    export function showString(oled: Ext4Oled, s: string, color: number = 1) {
        let oled_x = oled % 13;
        let oled_y = Math.floor(oled / 13);
        let crror = 0
        let col2 = 0
        let q = 0
        let ind2 = 0
        let firstoledinit = 0
        if (pins.i2cReadNumber(_I2CAddr, NumberFormat.Int8LE) == 67) {
            init();
        }else {
            for (let r = 0; r < s.length; r++) {
                q = font[s.charCodeAt(r)]
                for (let o = 0; o < 5; o++) {
                    col2 = 0
                    for (let p = 0; p < 5; p++) {
                        if (q & (1 << (5 * o + p)))
                            col2 |= (1 << (p + 1))
                    }
                    ind2 = (oled_x + r) * 5 * (_ZOOM + 1) + oled_y * 128 + o * (_ZOOM + 1) + 1
                    if (color == 0)
                        col2 = 255 - col2
                    _screen[ind2] = col2
                    if (_ZOOM)
                        _screen[ind2 + 1] = col2
                }
            }
            set_pos(oled_x * 5, oled_y)
            let ind02 = oled_x * 5 * (_ZOOM + 1) + oled_y * 128
            let buf72 = _screen.slice(ind02, ind2 + 1)
            buf72[0] = 0x40
            pins.i2cWriteBuffer(_I2CAddr, buf72)
        }
    }



    /**
     * show a number in OLED
     * @param olednum_x is X alis, eg: 0
     * @param olednum_y is Y alis, eg: 0
     * @param num is the number will be show, eg: 12
     * @param color is number color, eg: 1
     */
    //% blockId=ext4_oled_show_number block="Display number – please choose location%oled| number%num"
    //% parts=OLED12864_I2C trackArgs=0
    //% olednum.fieldEditor="gridpicker"
    //% olednum.fieldOptions.width=320
    //% olednum.fieldOptions.columns=13
    //% group="OLED" color="#4527A0" icon="\uf108"
    //% weight=9 blockGap=10
    export function showNumber(olednum: Ext4Oled, num: number, color: number = 1) {
        let olednum_x = 0
        let olednum_y = 0
        olednum_x = Math.floor(olednum / 13);
        olednum_y = olednum % 13;
        showString(olednum, num.toString(), color)
    }

    export function draw() {
        set_pos()
        pins.i2cWriteBuffer(_I2CAddr, _screen)
    }

    /**
     * show text in OLED
     * @param x is X alis, eg: 0
     * @param y is Y alis, eg: 0
     * @param s is the text will be show, eg: 'Hello!'
     * @param color is string color, eg: 1
     */
    //% blockId=ext4_oled_show_string_xy block="Display string at x %x|y %y|at %s|color %color"
    //% parts=OLED12864_I2C trackArgs=0
    //% group="OLED" color="#4527A0" icon="\uf108"
    //% weight=80 blockGap=10 
    export function showStringxy(x: number, y: number, s: string, color: number = 1) {
        let col = 0
        let e = 0
        let ind = 0
        for (let f = 0; f < s.length; f++) {
            e = font[s.charCodeAt(f)]
            for (let g = 0; g < 5; g++) {
                col = 0
                for (let h = 0; h < 5; h++) {
                    if (e & (1 << (5 * g + h)))
                        col |= (1 << (h + 1))
                }
                ind = (x + f) * 5 * (_ZOOM + 1) + y * 128 + g * (_ZOOM + 1) + 1
                if (color == 0)
                    col = 255 - col
                _screen[ind] = col
                if (_ZOOM)
                    _screen[ind + 1] = col
            }
        }
        set_pos(x * 5, y)
        let ind0 = x * 5 * (_ZOOM + 1) + y * 128
        let buf7 = _screen.slice(ind0, ind + 1)
        buf7[0] = 0x40
        pins.i2cWriteBuffer(_I2CAddr, buf7)
    }

    /**
     * show a number in OLED
     * @param x is X alis, eg: 0
     * @param y is Y alis, eg: 0
     * @param num is the number will be show, eg: 12
     * @param color is number color, eg: 1
     */
    //% blockId=ext4_oled_show_number_xy block="Display number at x %x|y %y|number %num|color %color"
    //% parts=OLED12864_I2C trackArgs=0
    //% group="OLED" color="#4527A0" icon="\uf108"
    //% weight=80 blockGap=10
    export function showNumberxy(x: number, y: number, num: number, color: number = 1) {
        showStringxy(x, y, num.toString(), color)
    }


    /**
     * clear screen
     */
    //% blockId=ext4_oled_clear block="clear"
    //% parts=OLED12864_I2C trackArgs=0
    //% group="OLED" color="#4527A0" icon="\uf108"
    //% weight=8 blockGap=10
    export function clear() {
        _screen.fill(0)
        _screen[0] = 0x40
        draw()
    }



    /**
     * OLED initialize
     * @param addr is i2c addr, eg: 60
     */
    //% blockId=ext4_oled_init block="Initialize OLED "
    //% parts=OLED12864_I2C trackArgs=0
    //% weight=11 blockGap=10
    //% group="OLED" color="#4527A0" icon="\uf108"
    //% blockGap=10  
    export function init() {
        _I2CAddr = 60;
        cmd1(0xAE)       // SSD1306_DISPLAYOFF
        cmd1(0xA4)       // SSD1306_DISPLAYALLON_RESUME
        cmd2(0xD5, 0xF0) // SSD1306_SETDISPLAYCLOCKDIV
        cmd2(0xA8, 0x3F) // SSD1306_SETMULTIPLEX
        cmd2(0xD3, 0x00) // SSD1306_SETDISPLAYOFFSET
        cmd1(0 | 0x0)    // line #SSD1306_SETSTARTLINE
        cmd2(0x8D, 0x14) // SSD1306_CHARGEPUMP
        cmd2(0x20, 0x00) // SSD1306_MEMORYMODE
        cmd3(0x21, 0, 127) // SSD1306_COLUMNADDR
        cmd3(0x22, 0, 63)  // SSD1306_PAGEADDR
        cmd1(0xa0 | 0x1) // SSD1306_SEGREMAP
        cmd1(0xc8)       // SSD1306_COMSCANDEC
        cmd2(0xDA, 0x12) // SSD1306_SETCOMPINS
        cmd2(0x81, 0xCF) // SSD1306_SETCONTRAST
        cmd2(0xd9, 0xF1) // SSD1306_SETPRECHARGE
        cmd2(0xDB, 0x40) // SSD1306_SETVCOMDETECT
        cmd1(0xA6)       // SSD1306_NORMALDISPLAY
        cmd2(0xD6, 1)    // zoom on
        cmd1(0xAF)       // SSD1306_DISPLAYON
        clear()
        _ZOOM = 1
    }
}
