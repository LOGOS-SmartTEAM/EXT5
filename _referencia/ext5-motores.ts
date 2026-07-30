namespace ext5_smartteam5 {

    // ── Direcciones I2C de los motores ──────────────────────────────
    // Motor ROJO  = derecho  = caraddress1 (se niega internamente)
    // Motor VERDE = izquierdo = caraddress2
    let MOTOR_ROJO = 81    // 0x51 — verificado en código oficial ICreateRobot
    let MOTOR_VERDE = 82   // 0x52 — verificado en código oficial ICreateRobot

    // ── Constantes físicas del robot ────────────────────────────────
    // Diámetro de rueda en cm (medido: 55mm)
    const DIAMETRO_RUEDA_CM = 5.5
    // Circunferencia de rueda en cm (π × diámetro)
    const CIRCUNFERENCIA_RUEDA_CM = 3.14159 * DIAMETRO_RUEDA_CM  // = 17.28 cm

    // Distancia entre centros de rueda en cm (medido: 120mm)
    const DIST_ENTRE_RUEDAS_CM = 12.0

    // ── Constante a calibrar con el robot real ───────────────────────
    // RPM del motor a velocidad 100 (después de la caja reductora).
    // Procedimiento de calibración:
    //   1. Marcar una rueda con una cinta
    //   2. Usar el bloque "Motores Avanzar por X cm" con X=100 y velocidad=100
    //   3. Contar cuántas vueltas dio la rueda
    //   4. RPM = vueltas × 60000 / tiempo_real_ms
    // Valor inicial estimado: 150 RPM (ajustar tras medir)
    const RPM_A_VEL_100 = 150

    // ── Enums ────────────────────────────────────────────────────────

    export enum Ext5MovimientoMotores {
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

    export enum Ext5DireccionGiro {
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
    // El montaje en espejo se refleja en los signos de movimientoToSpeeds.
    function runDualMotors(speed1: number, speed2: number): void {
        writeMotor(MOTOR_ROJO, speed1)
        writeMotor(MOTOR_VERDE, speed2)
    }

    // Convierte movimiento + velocidad a speeds para cada motor.
    function movimientoToSpeeds(
        movimiento: Ext5MovimientoMotores,
        velocidad: number
    ): { s1: number; s2: number } {
        switch (movimiento) {
            case Ext5MovimientoMotores.Avanzar:
                return { s1: velocidad, s2: -velocidad }
            case Ext5MovimientoMotores.Retroceder:
                return { s1: -velocidad, s2: velocidad }
            case Ext5MovimientoMotores.GirarDerecha:
                return { s1: -velocidad, s2: -velocidad }
            case Ext5MovimientoMotores.GirarIzquierda:
                return { s1: velocidad, s2: velocidad }
            case Ext5MovimientoMotores.Frenar:
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
    //% blockId=ext5_motor_move
    //% block="Motores %movimiento ||  Velocidad %velocidad"
    //% movimiento.fieldEditor="gridpicker"
    //% velocidad.min=0 velocidad.max=100 velocidad.defl=50
    //% expandableArgumentMode="toggle"
    //% group="Motores L5" color="#34c2eb" weight=90 blockGap=8
    export function ext5MotoresMover(
        movimiento: Ext5MovimientoMotores,
        velocidad = 50
    ): void {
        const { s1, s2 } = movimientoToSpeeds(movimiento, velocidad)
        runDualMotors(s1, s2)
    }

    /**
     * Gira el robot en la dirección indicada a la velocidad y ángulo especificados.
     * Calibrar con RPM_A_VEL_100.
     */
    //% blockId=ext5_motor_girar
    //% block="Girar a la %direccion ||  Velocidad %velocidad ángulo de %angulo °"
    //% direccion.fieldEditor="gridpicker"
    //% velocidad.min=1 velocidad.max=100 velocidad.defl=50
    //% angulo.min=1 angulo.max=360 angulo.defl=90
    //% expandableArgumentMode="toggle"
    //% group="Motores L5" color="#34c2eb" weight=85 blockGap=8
    export function girar(direccion: Ext5DireccionGiro, velocidad = 50, angulo = 90): void {
        if (angulo <= 0 || velocidad <= 0) return
        const rpm_efectivas = RPM_A_VEL_100 * velocidad / 100
        const arco_cm = 3.14159 * DIST_ENTRE_RUEDAS_CM * angulo / 360
        const tiempo = (arco_cm * 60000) / (CIRCUNFERENCIA_RUEDA_CM * rpm_efectivas)
        const mov = direccion === Ext5DireccionGiro.Izquierda
            ? Ext5MovimientoMotores.GirarIzquierda
            : Ext5MovimientoMotores.GirarDerecha
        const { s1, s2 } = movimientoToSpeeds(mov, velocidad)
        runDualMotors(s1, s2)
        basic.pause(tiempo)
        runDualMotors(0, 0)
    }

    /**
     * Mueve el robot una distancia en centímetros y frena automáticamente.
     */
    //% blockId=ext5_motor_cm
    //% block="Motores %movimiento por %cm cm ||  Velocidad %velocidad"
    //% movimiento.fieldEditor="gridpicker"
    //% cm.min=1 cm.max=500 cm.defl=10
    //% velocidad.min=1 velocidad.max=100 velocidad.defl=50
    //% expandableArgumentMode="toggle"
    //% group="Motores L5" color="#34c2eb" weight=84 blockGap=8
    export function moverCm(
        movimiento: Ext5MovimientoMotores,
        cm: number,
        velocidad = 50
    ): void {
        if (velocidad <= 0 || cm <= 0) return
        const rpm_efectivas = RPM_A_VEL_100 * velocidad / 100
        const tiempo = (cm * 60000) / (CIRCUNFERENCIA_RUEDA_CM * rpm_efectivas)
        const { s1, s2 } = movimientoToSpeeds(movimiento, velocidad)
        runDualMotors(s1, s2)
        basic.pause(tiempo)
        runDualMotors(0, 0)
    }
}
