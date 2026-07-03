/**
 * Bloques Geek Servo (I2C) — SmartTEAM4 / subcategoría Motores
 * Origen: ICreateRobot block/M_motor.ts
 */
//伺服电机模块

enum Ext4MotorColor {
    //% block="red"
    red = 81,

    //% block="green"
    blue = 82,

    //% block="blue"
    green = 83,

    //% block="yellow"
    yellow = 84
}

namespace ext4_smartteam4 {

    let caraddress1 = 81
    let caraddress2 = 82

    //% blockId=ext4_motor_run block="|%motoraddress|Motor rotate at|%speed|"
    //% speed.min=-100 speed.max=100
    //% parts="SuperBit_runMotor" group="Motores" color="#29B6F6" icon="\uf013"
    export function runMotor(motoraddress: Ext4MotorColor, speed: number): void {
        speed = speed / 2
        let speed_Buff
        if (speed < 0) {
            speed = -speed
            speed_Buff = (~speed) + 1
            speed_Buff = speed_Buff | 0x80
        } else {
            speed_Buff = speed
        }

        let SetBuff = pins.createBuffer(4)
        SetBuff.setNumber(NumberFormat.UInt8BE, 0, 0x11)
        SetBuff.setNumber(NumberFormat.UInt8BE, 1, speed_Buff)
        SetBuff.setNumber(NumberFormat.UInt8BE, 2, 0)
        SetBuff.setNumber(NumberFormat.UInt8BE, 3, 0)
        pins.i2cWriteBuffer(motoraddress, SetBuff)
    }

    //% blockId=ext4_motor_turn_to block="|%motoraddress|Motor is turned at|%speed|to|%location|degrees"
    //% speed.min=0 speed.max=100
    //% location.min=-360 location.max=360
    //% parts="writemotorlocation" group="Motores" color="#29B6F6" icon="\uf013"
    export function Writemotorlocation(motoraddress: Ext4MotorColor, speed: number, location: number): void {
        if (speed == 0) {
            return
        }

        speed = speed / 2
        let speed_Buff2

        if (speed < 0) {
            speed = -speed
            speed_Buff2 = (~speed) + 1
            speed_Buff2 = speed_Buff2 | 0x80
        } else {
            speed_Buff2 = speed
        }

        let location_Buff2

        if (location < 0) {
            location = -location
            location_Buff2 = (~location) + 1
            location_Buff2 = location_Buff2 | 0x8000
        } else {
            location_Buff2 = location
        }

        let GetBuff3 = pins.createBuffer(6)
        GetBuff3 = pins.i2cReadBuffer(motoraddress, 6)

        if (((location - 5) <= getMotorLocation(GetBuff3)) && (getMotorLocation(GetBuff3) <= (location + 5))) {
            return;
        }
        let SetBuff2 = pins.createBuffer(4)

        SetBuff2.setNumber(NumberFormat.UInt8BE, 0, 0x3)
        SetBuff2.setNumber(NumberFormat.UInt8BE, 1, speed_Buff2)
        SetBuff2.setNumber(NumberFormat.UInt8BE, 2, location_Buff2 >> 8)
        SetBuff2.setNumber(NumberFormat.UInt8BE, 3, location_Buff2)

        pins.i2cWriteBuffer(motoraddress, SetBuff2)

        let flag2 = GetBuff3.getNumber(NumberFormat.Int8BE, 5);
        while (true) {//如果没有在运行，则一直读取
            GetBuff3 = pins.i2cReadBuffer(motoraddress, 6)
            flag2 = GetBuff3.getNumber(NumberFormat.Int8BE, 5)
            if ((flag2 == 3)) break;//当有一个Servo Motor转动起来的时候，就退出死循环
        }
        while (true) {//如果没有在运行，则一直读取
            GetBuff3 = pins.i2cReadBuffer(motoraddress, 6)
            flag2 = GetBuff3.getNumber(NumberFormat.Int8BE, 5)
            if ((flag2 == 11) || (flag2 == 10)) break;//当结束任务的时候，就退出死循环
        }
    }

    //% blockId=ext4_motor_rotate_deg block="|%motoraddress|Motor rotate at|%speed|in|%location|degrees"
    //% speed.min=-100 speed.max=100
    //% location.min=0 
    //% parts="writemotorrelativelocation" group="Motores" color="#29B6F6" icon="\uf013"
    export function Writemotorrelativelocation(motoraddress: Ext4MotorColor, speed: number, location: number): void {
        if (((location <= 5) && (location >= 0)) || ((location >= -5) && (location <= 0))) {
            return;
        }
        speed = speed / 2

        let location_Buff22

        if (speed < 0) {
            speed = -speed
            location_Buff22 = (~location) + 1
            location_Buff22 = location_Buff22 | 0x8000
        } else {
            speed = speed
            location_Buff22 = location
        }

        let SetBuff22 = pins.createBuffer(4)

        SetBuff22.setNumber(NumberFormat.UInt8BE, 0, 0x4)
        SetBuff22.setNumber(NumberFormat.UInt8BE, 1, speed)
        SetBuff22.setNumber(NumberFormat.UInt8BE, 2, location_Buff22 >> 8)
        SetBuff22.setNumber(NumberFormat.UInt8BE, 3, location_Buff22)

        let GetBuff4 = pins.createBuffer(6)
        let flag3 = 0

        if (speed != 0) {
            pins.i2cWriteBuffer(motoraddress, SetBuff22)
        } else {
            location = 0;
        }

        if (location != 0) {
            while (true) {//如果没有在运行，则一直读取
                GetBuff4 = pins.i2cReadBuffer(motoraddress, 6)
                flag3 = GetBuff4.getNumber(NumberFormat.Int8BE, 5)
                if ((flag3 == 4)) break;//等待电机执行指令，跳出循环
            }
            while (true) {//如果没有在运行，则一直读取
                GetBuff4 = pins.i2cReadBuffer(motoraddress, 6)
                flag3 = GetBuff4.getNumber(NumberFormat.Int8BE, 5)
                if ((flag3 == 11) || (flag3 == 10)) break;//等待电机执行完指令或堵转时，跳出循环
            }
        }


    }

    //% blockId=ext4_motor_rotate_sec block="|%motoraddress|Motor rotate at|%speed|in|%time|seconds"
    //% speed.min=-100 speed.max=100
    //% parts="writemotorrelativetime" group="Motores" color="#29B6F6" icon="\uf013"
    export function Writemotorrelativetime(motoraddress: Ext4MotorColor, speed: number, time: number): void {
        speed = speed / 2
        if (time > 0 && time < 0.1) {
            time = 0.1;
        }
        time = time * 10

        let speed_Buff3
        if (speed < 0) {
            speed = -speed
            speed_Buff3 = (~speed) + 1
            speed_Buff3 = speed_Buff3 | 0x80
        } else {
            speed_Buff3 = speed
        }

        let SetBuff222 = pins.createBuffer(4)
        SetBuff222.setNumber(NumberFormat.UInt8BE, 0, 0x12)
        SetBuff222.setNumber(NumberFormat.UInt8BE, 1, speed_Buff3)
        SetBuff222.setNumber(NumberFormat.UInt8BE, 2, time >> 8)
        SetBuff222.setNumber(NumberFormat.UInt8BE, 3, time)

        let flag4 = 0
        pins.i2cWriteBuffer(motoraddress, SetBuff222)
        if (time != 0) {
            if (speed <= 0) {
                let waitFalg = (control.millis() + (time * 100));
                while (control.millis() <= waitFalg) { }

            } else {
                let GetBuff5 = pins.createBuffer(6)
                while (true) {//如果没有在运行，则一直读取
                    GetBuff5 = pins.i2cReadBuffer(motoraddress, 6)
                    flag4 = GetBuff5.getNumber(NumberFormat.Int8BE, 5)
                    // serial.writeLine("read1:[" + GetBuff.getNumber(NumberFormat.Int8BE, 0) + "," + GetBuff.getNumber(NumberFormat.Int8BE, 1) + "," + GetBuff.getNumber(NumberFormat.Int8BE, 2) + "," + GetBuff.getNumber(NumberFormat.Int8BE, 3) + "," + GetBuff.getNumber(NumberFormat.Int8BE, 4) + "," + GetBuff.getNumber(NumberFormat.Int8BE, 5) + "," + GetBuff.getNumber(NumberFormat.Int8BE, 6) + "]");
                    if ((flag4 == 0x7)) break;//等待电机执行指令，跳出循环
                }
                while (true) {//如果没有在运行，则一直读取
                    GetBuff5 = pins.i2cReadBuffer(motoraddress, 6)
                    flag4 = GetBuff5.getNumber(NumberFormat.Int8BE, 5)
                    // serial.writeLine("read2:" + flag);
                    if ((flag4 == 11)) break;//等待电机执行完指令或堵转时，跳出循环
                }
            }
        }
    }

    //% blockId=ext4_motor_dual_run block="Dual motors rotate at|%speed1| |%speed2|"
    //% speed1.min=-100 speed1.max=100
    //% speed2.min=-100 speed2.max=100
    //% parts="SuperBit_runDMotor" group="Motores" color="#29B6F6" icon="\uf013"
    export function runDMotor(speed1: number, speed2: number): void {
        speed1 = -speed1 / 2
        speed2 = speed2 / 2

        let speed_Buff1
        if (speed1 < 0) {
            speed1 = -speed1
            speed_Buff1 = (~speed1) + 1
            speed_Buff1 = speed_Buff1 | 0x80
        } else {
            speed_Buff1 = speed1
        }

        let speed_Buff23
        if (speed2 < 0) {
            speed2 = -speed2
            speed_Buff23 = (~speed2) + 1
            speed_Buff23 = speed_Buff23 | 0x80
        } else {
            speed_Buff23 = speed2
        }

        let SetBuff3 = pins.createBuffer(4)
        let SetBuffc = pins.createBuffer(4)

        SetBuff3.setNumber(NumberFormat.UInt8BE, 0, 0x11)
        SetBuff3.setNumber(NumberFormat.UInt8BE, 1, speed_Buff1)
        SetBuff3.setNumber(NumberFormat.UInt8BE, 2, 0)
        SetBuff3.setNumber(NumberFormat.UInt8BE, 3, 0)

        SetBuffc.setNumber(NumberFormat.UInt8BE, 0, 0x11)
        SetBuffc.setNumber(NumberFormat.UInt8BE, 1, speed_Buff23)
        SetBuffc.setNumber(NumberFormat.UInt8BE, 2, 0)
        SetBuffc.setNumber(NumberFormat.UInt8BE, 3, 0)

        pins.i2cWriteBuffer(caraddress1, SetBuff3)
        pins.i2cWriteBuffer(caraddress2, SetBuffc)

    }

    //% blockId=ext4_motor_dual_deg block="Dual motors at|%speed1| |%speed2|in|%location|degrees"
    //% speed1.min=-100 speed1.max=100
    //% speed2.min=-100 speed2.max=100
    //% location.min=0 
    //% parts="writeDmotorlocation" group="Motores" color="#29B6F6" icon="\uf013"
    export function WriteDmotorlocation(speed1: number, speed2: number, location: number): void {
        if (((location <= 5) && (location >= 0)) || ((location >= -5) && (location <= 0))) {
            return;
        }
        speed1 = -speed1 / 2
        speed2 = speed2 / 2

        let location1
        let location_Buff1

        let location2
        let location_Buff23

        location2 = ~location
        location1 = ~location

        if (speed2 < 0) {
            speed2 = -speed2
            location_Buff23 = location2 + 1
        } else {
            location_Buff23 = location
        }

        if (speed1 < 0) {
            speed1 = -speed1
            location_Buff1 = location1 + 1
        } else {
            location_Buff1 = location
        }

        if (speed1 == 0) {
            location_Buff1 = 0
        }

        if (speed2 == 0) {
            location_Buff23 = 0
        }

        let SetBuff23 = pins.createBuffer(4)
        let SetBuff2c = pins.createBuffer(4)

        SetBuff2c.setNumber(NumberFormat.UInt8BE, 0, 0x4)
        SetBuff2c.setNumber(NumberFormat.UInt8BE, 1, speed2)
        SetBuff2c.setNumber(NumberFormat.UInt8BE, 2, location_Buff23 >> 8)
        SetBuff2c.setNumber(NumberFormat.UInt8BE, 3, location_Buff23)

        SetBuff23.setNumber(NumberFormat.UInt8BE, 0, 0x4)
        SetBuff23.setNumber(NumberFormat.UInt8BE, 1, speed1)
        SetBuff23.setNumber(NumberFormat.UInt8BE, 2, location_Buff1 >> 8)
        SetBuff23.setNumber(NumberFormat.UInt8BE, 3, location_Buff1)

        if ((location != 0) && ((speed1 != 0) || (speed2 != 0))) {
            let GetBuff6 = pins.createBuffer(7)
            let GetBuff1 = pins.createBuffer(7)

            //发送控制参数并获取运动状态
            pins.i2cWriteBuffer(caraddress1, SetBuff23)
            GetBuff1 = pins.i2cReadBuffer(caraddress1, 6)
            pins.i2cWriteBuffer(caraddress2, SetBuff2c)
            GetBuff6 = pins.i2cReadBuffer(caraddress2, 6)

            let flag5 = GetBuff6.getNumber(NumberFormat.Int8BE, 5)//获取了第6位
            let flag1 = GetBuff1.getNumber(NumberFormat.Int8BE, 5)//获取了第6位
            //4为正在运行
            while (true) {//如果没有在运行，则一直读取
                GetBuff6 = pins.i2cReadBuffer(caraddress2, 6)
                GetBuff1 = pins.i2cReadBuffer(caraddress1, 6)
                flag5 = GetBuff6.getNumber(NumberFormat.Int8BE, 5)
                flag1 = GetBuff1.getNumber(NumberFormat.Int8BE, 5)
                if ((flag1 == 4) || (flag5 == 4)) break;//当有一个电机转动起来的时候，就退出死循环
            }

            //11为运行结束
            while (true) {
                GetBuff6 = pins.i2cReadBuffer(caraddress2, 6)
                GetBuff1 = pins.i2cReadBuffer(caraddress1, 6)
                flag5 = GetBuff6.getNumber(NumberFormat.Int8BE, 5)
                flag1 = GetBuff1.getNumber(NumberFormat.Int8BE, 5)
                // 11：结束运动，10：堵转停止
                if (((flag1 == 11) || (flag1 == 10)) && ((flag5 == 11) || (flag5 == 10))) break;//当有两个电机都执行完毕的时候，就退出死循环
            }
        }
    }

    //% blockId=ext4_motor_dual_sec block="Dual motors rotate at |%speed1| |%speed2|in|%time|seconds"
    //% speed1.min=-100 speed1.max=100
    //% speed2.min=-100 speed2.max=100
    //% time.min=0 
    //% parts="writeDmotortime" group="Motores" color="#29B6F6" icon="\uf013"
    export function writeDmotortime(speed1: number, speed2: number, time: number): void {
        speed1 = -speed1 / 2
        speed2 = speed2 / 2
        // serial.writeLine("read1:" + time + "," + (time > 0 && time < 0.1));
        if (time > 0 && time < 0.1) {
            time = 0.1;
        }
        time = time * 10
        let speed_Buff32
        let speed_Buff4

        if (speed1 < 0) {
            speed1 = -speed1
            speed_Buff32 = (~speed1) + 1
            speed_Buff32 = speed_Buff32 | 0x80
        } else {
            speed_Buff32 = speed1
        }

        if (speed2 < 0) {
            speed2 = -speed2
            speed_Buff4 = (~speed2) + 1
            speed_Buff4 = speed_Buff4 | 0x80
        } else {
            speed_Buff4 = speed2
        }

        let SetBuff32 = pins.createBuffer(4)
        let SetBuff4 = pins.createBuffer(4)

        SetBuff32.setNumber(NumberFormat.UInt8BE, 0, 0x12)
        SetBuff32.setNumber(NumberFormat.UInt8BE, 1, speed_Buff32)
        SetBuff32.setNumber(NumberFormat.UInt8BE, 2, time >> 8)
        SetBuff32.setNumber(NumberFormat.UInt8BE, 3, time)

        SetBuff4.setNumber(NumberFormat.UInt8BE, 0, 0x12)
        SetBuff4.setNumber(NumberFormat.UInt8BE, 1, speed_Buff4)
        SetBuff4.setNumber(NumberFormat.UInt8BE, 2, time >> 8)
        SetBuff4.setNumber(NumberFormat.UInt8BE, 3, time)
        // serial.writeLine("read1:" + SetBuff4.getNumber(NumberFormat.UInt8BE, ));

        if (speed1 != 0) {
            pins.i2cWriteBuffer(caraddress1, SetBuff32)
        }

        if (speed2 != 0) {
            pins.i2cWriteBuffer(caraddress2, SetBuff4)
        }

        if ((time !== 0) && ((speed1 !== 0) || (speed2 !== 0))) {
            let GetBuff7 = pins.createBuffer(6)
            let GetBuff12 = pins.createBuffer(6)

            GetBuff7 = pins.i2cReadBuffer(caraddress2, 6)
            GetBuff12 = pins.i2cReadBuffer(caraddress1, 6)

            let flag6 = GetBuff7.getNumber(NumberFormat.Int8BE, 5)//获取了第6位
            let flag12 = GetBuff12.getNumber(NumberFormat.Int8BE, 5)//获取了第6位

            while (true) {//如果没有在运行，则一直读取
                GetBuff7 = pins.i2cReadBuffer(caraddress2, 6)
                GetBuff12 = pins.i2cReadBuffer(caraddress1, 6)
                flag6 = GetBuff7.getNumber(NumberFormat.Int8BE, 5)
                flag12 = GetBuff12.getNumber(NumberFormat.Int8BE, 5)
                // serial.writeLine("read2:[" + flag1 + "," + flag+"]");
                if ((flag12 == 0x7) || (flag6 == 0x7)) break;//当有一个电机转动起来的时候，就退出死循环
            }

            //11为运行结束
            while (true) {
                GetBuff7 = pins.i2cReadBuffer(caraddress2, 6)
                GetBuff12 = pins.i2cReadBuffer(caraddress1, 6)
                flag6 = GetBuff7.getNumber(NumberFormat.Int8BE, 5)
                flag12 = GetBuff12.getNumber(NumberFormat.Int8BE, 5)
                // serial.writeLine("read3:[" + flag1 + "," + flag + "]");
                if (((flag12 == 11)) && ((flag6 == 11))) break;//当有两个电机都执行完毕的时候，就退出死循环
            }
        }
    }


    //% blockId=ext4_motor_read_speed block="Read speed of the |%motoraddress|motor"
    //% parts="readmotorspeed" group="Motores" color="#29B6F6" icon="\uf013"
    export function Readmotorspeed(motoraddress: Ext4MotorColor): number {
        let GetBuff8 = pins.createBuffer(6)
        GetBuff8 = pins.i2cReadBuffer(motoraddress, 6)
        return GetBuff8.getNumber(NumberFormat.Int8BE, 0);
    }

    function getMotorLocation(buffer: Buffer) {
        let location_Buff = (buffer.getNumber(NumberFormat.Int8BE, 1) << 8) + buffer.getNumber(NumberFormat.Int8BE, 2)
        let This_location;
        if (location_Buff & 0x0080) {
            This_location = location_Buff + 0x0100
        }
        else {
            This_location = location_Buff
        }
        return This_location;
    }

    function getMotorSpeed(buffer: Buffer) {
        let location_Buff3 = (buffer.getNumber(NumberFormat.Int8BE, 0) << 8) + buffer.getNumber(NumberFormat.Int8BE, 1)
        let This_speed;
        if (location_Buff3 & 0x0080) {
            This_speed = location_Buff3 + 0x0100
        } else {
            This_speed = location_Buff3
        }
        return This_speed;
    }

    //% blockId=ext4_motor_read_pos block="Read position of the |%motoraddress|motor"
    //% parts="readmotorlocation" group="Motores" color="#29B6F6" icon="\uf013"
    export function Readmotorlocation(motoraddress: Ext4MotorColor): number {
        let GetBuff22 = pins.createBuffer(6)
        GetBuff22 = pins.i2cReadBuffer(motoraddress, 6)
        let This_location2 = getMotorLocation(GetBuff22);
        return This_location2;
    }
}
