namespace ext4_smartteam4 {

    // ── Direcciones I2C de los motores ──────────────────────────────
    // Motor ROJO  = derecho  = caraddress1 (se niega internamente)
    // Motor VERDE = izquierdo = caraddress2
    let MOTOR_ROJO = 81    // 0x51 — verificado en código oficial ICreateRobot
    let MOTOR_VERDE = 82   // 0x52 — verificado en código oficial ICreateRobot

    // Tiempo en ms para completar un giro de 90° — ajustar con hardware real
    const TIEMPO_GIRO_90 = 500

    // Milisegundos para recorrer 1 cm a velocidad 100 — ajustar con hardware real
    const MS_POR_CM_A_VEL_100 = 20

    // ── Enums ────────────────────────────────────────────────────────

    export enum Ext4MovimientoMotores {
        //% block="Avanzar"
        Avanzar = 1,
        //% block="Retroceder"
        Retroceder = 2,
        //% block="Girar a la derecha"
        GirarDerecha = 3,
        //% block="Girar a la Izquierda"
        GirarIzquierda = 4,
        //% block="Frenar"
        Frenar = 5,
    }

    export enum Ext4DireccionGiro {
        //% block="↰ Izquierda"
        Izquierda = 0,
        //% block="Derecha ↱"
        Derecha = 1,
    }

    // ── Protocolo I2C interno ────────────────────────────────────────

    // Envía velocidad a un motor por I2C.
    // speedRaw: valor en rango -100 a 100 YA con la negación aplicada si corresponde.
    function writeMotor(address: number, speedRaw: number): void {
        const half = speedRaw / 2
        let speed_Buff = 0
        if (half < 0) {
            const s = -half
            speed_Buff = ((~s) + 1) | 0x80
        } else {
            speed_Buff = half
        }
        let buf = pins.createBuffer(4)
        buf.setNumber(NumberFormat.UInt8BE, 0, 0x11)
        buf.setNumber(NumberFormat.UInt8BE, 1, speed_Buff)
        buf.setNumber(NumberFormat.UInt8BE, 2, 0)
        buf.setNumber(NumberFormat.UInt8BE, 3, 0)
        pins.i2cWriteBuffer(address, buf)
    }

    // Mueve ambos motores. speed1 y speed2 en rango -100 a 100.
    // Internamente: motor rojo se niega (montaje en espejo).
    function runDualMotors(speed1: number, speed2: number): void {
        writeMotor(MOTOR_ROJO, -speed1)    // negado por montaje en espejo
        writeMotor(MOTOR_VERDE, speed2)
    }

    // Convierte movimiento + velocidad a speeds para cada motor.
    function movimientoToSpeeds(
        movimiento: Ext4MovimientoMotores,
        velocidad: number
    ): { s1: number; s2: number } {
        switch (movimiento) {
            case Ext4MovimientoMotores.Avanzar:
                return { s1: velocidad, s2: velocidad }
            case Ext4MovimientoMotores.Retroceder:
                return { s1: -velocidad, s2: -velocidad }
            case Ext4MovimientoMotores.GirarDerecha:
                return { s1: velocidad, s2: -velocidad }
            case Ext4MovimientoMotores.GirarIzquierda:
                return { s1: -velocidad, s2: velocidad }
            case Ext4MovimientoMotores.Frenar:
                return { s1: 0, s2: 0 }
            default:
                const _exhaustiveCheck: never = movimiento
                return _exhaustiveCheck
        }
    }

    // ── Bloques públicos ─────────────────────────────────────────────

    /**
     * Mueve los motores en la dirección indicada a la velocidad indicada.
     */
    //% blockId=ext4_motor_move
    //% block="Motores %movimiento || Velocidad %velocidad"
    //% movimiento.fieldEditor="gridpicker"
    //% velocidad.min=0 velocidad.max=100 velocidad.defl=50
    //% expandableArgumentMode="toggle"
    //% group="Motores" color="#34c2eb" weight=90 blockGap=8
    export function ext4MotoresMover(
        movimiento: Ext4MovimientoMotores,
        velocidad = 50
    ): void {
        const { s1, s2 } = movimientoToSpeeds(movimiento, velocidad)
        runDualMotors(s1, s2)
    }

    /**
     * Gira el robot 90° a izquierda o derecha y frena automáticamente.
     */
    //% blockId=ext4_motor_giro90
    //% block="Girar a 90° %direccion"
    //% direccion.fieldEditor="gridpicker"
    //% group="Motores" color="#34c2eb" weight=85 blockGap=8
    export function girar90(direccion: Ext4DireccionGiro): void {
        const mov = direccion === Ext4DireccionGiro.Izquierda
            ? Ext4MovimientoMotores.GirarIzquierda
            : Ext4MovimientoMotores.GirarDerecha
        const { s1, s2 } = movimientoToSpeeds(mov, 50)
        runDualMotors(s1, s2)
        basic.pause(TIEMPO_GIRO_90)
        runDualMotors(0, 0)
    }

    /**
     * Mueve el robot una distancia en centímetros y frena automáticamente.
     */
    //% blockId=ext4_motor_cm
    //% block="Motores %movimiento por %cm cm || Velocidad %velocidad"
    //% movimiento.fieldEditor="gridpicker"
    //% cm.min=1 cm.max=500 cm.defl=10
    //% velocidad.min=0 velocidad.max=100 velocidad.defl=50
    //% expandableArgumentMode="toggle"
    //% group="Motores" color="#34c2eb" weight=84 blockGap=8
    export function moverCm(
        movimiento: Ext4MovimientoMotores,
        cm: number,
        velocidad = 50
    ): void {
        if (velocidad <= 0 || cm <= 0) return
        const { s1, s2 } = movimientoToSpeeds(movimiento, velocidad)
        const tiempo = (cm * MS_POR_CM_A_VEL_100 * 100) / velocidad
        runDualMotors(s1, s2)
        basic.pause(tiempo)
        runDualMotors(0, 0)
    }
}
