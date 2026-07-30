namespace bloques {

    // ── Direcciones I2C de los motores ───────────────────────────────
    // Verificado en ORIGINAL/block/servoMotor.ts -> enum MotorAddr
    // OJO: el orden del enum SabanaColorMotor NO coincide con el orden de
    // las direcciones (Amarillo va antes de Azul). Mapear por nombre.
    export const _MOTOR_ROJO = 0x51      // 81
    export const _MOTOR_VERDE = 0x52     // 82
    export const _MOTOR_AZUL = 0x53      // 83
    export const _MOTOR_AMARILLO = 0x54  // 84

    // Registro de comando del controlador de motor.
    const _MOTOR_CMD = 0x11

    export enum SabanaColorMotor {
        //% block="🔴"
        Rojo = 0,
        //% block="🟢"
        Verde = 1,
        //% block="🟡"
        Amarillo = 2,
        //% block="🔵"
        Azul = 3,
    }

    /**
     * Sentido de giro de un motor individual.
     * Lo reutiliza también el bloque de la hélice (helice.ts, M10).
     */
    export enum SabanaMovimientoMotorUnico {
        //% block="Rotar a la derecha"
        Derecha = 0,
        //% block="rotar a la izquierda"
        Izquierda = 1,
        //% block="Frenar"
        Frenar = 2,
    }

    /**
     * Envía una velocidad a un motor por I2C.
     *
     * speedRaw va de -100 a 100, YA con el signo final aplicado.
     *
     * Origen del código: _referencia/ext5-motores.ts -> writeMotor()
     *
     * NO SIMPLIFICAR. Tres detalles del protocolo que parecen bugs:
     *   1. speedRaw / 2 -> el controlador espera 0-50, no 0-100.
     *   2. ((~s) + 1) | 0x80 -> complemento a dos con bit alto de signo
     *      para el sentido inverso. No reemplazar por -half.
     *   3. Los bytes 2 y 3 en cero -> el buffer debe ser de 4 bytes aunque
     *      solo se usen dos. Con 2 bytes el motor no responde.
     *
     * Exportada porque movimiento.ts (M11) la consume: en TypeScript los
     * miembros no exportados de un namespace no se comparten entre archivos.
     */
    export function _writeMotor(address: number, speedRaw: number): void {
        const half = speedRaw / 2
        let speed_Buff = 0
        if (half < 0) {
            const s = -half
            speed_Buff = ((~s) + 1) | 0x80
        } else {
            speed_Buff = half
        }
        let buf = pins.createBuffer(4)
        buf.setNumber(NumberFormat.UInt8BE, 0, _MOTOR_CMD)
        buf.setNumber(NumberFormat.UInt8BE, 1, speed_Buff)
        buf.setNumber(NumberFormat.UInt8BE, 2, 0)
        buf.setNumber(NumberFormat.UInt8BE, 3, 0)
        pins.i2cWriteBuffer(address, buf)
    }

    // Mapea el color del desplegable a su dirección I2C.
    // POR NOMBRE, no por índice: Amarillo(2) -> 0x54 y Azul(3) -> 0x53.
    function colorToAddress(color: SabanaColorMotor): number {
        switch (color) {
            case SabanaColorMotor.Rojo: return _MOTOR_ROJO
            case SabanaColorMotor.Verde: return _MOTOR_VERDE
            case SabanaColorMotor.Amarillo: return _MOTOR_AMARILLO
            case SabanaColorMotor.Azul: return _MOTOR_AZUL
            default: return _MOTOR_ROJO
        }
    }

    // Decisión E: signo CRUDO, sin la negación del montaje en espejo.
    // Derecha = horario = positivo. Izquierda = antihorario = negativo.
    function movimientoToSpeed(
        movimiento: SabanaMovimientoMotorUnico,
        velocidad: number
    ): number {
        switch (movimiento) {
            case SabanaMovimientoMotorUnico.Derecha: return velocidad
            case SabanaMovimientoMotorUnico.Izquierda: return -velocidad
            case SabanaMovimientoMotorUnico.Frenar: return 0
            default: return 0
        }
    }

    /**
     * STV2-16 — Controla un motor individual (identificado por color/emoji)
     * conectado por I2C. El botón "+" agrega el parámetro opcional de velocidad.
     *
     * La velocidad que ve el usuario siempre es positiva (0-100); el signo
     * interno lo define el sentido de giro.
     *
     * A diferencia de los bloques de MOVIMIENTO (M11), acá NO se aplica la
     * negación del montaje en espejo del robot: este bloque maneja un motor
     * suelto y cada uno gira en su propio sentido físico.
     *
     * @param color motor a controlar, eg: SabanaColorMotor.Rojo
     * @param movimiento sentido de giro o freno, eg: SabanaMovimientoMotorUnico.Derecha
     * @param velocidad velocidad de 0 a 100, eg: 50
     */
    //% blockId=sabana_motor_multicolor
    //% block="Motor │ %color %movimiento en pin I2C || Velocidad %velocidad"
    //% velocidad.min=0 velocidad.max=100 velocidad.defl=50
    //% expandableArgumentMode="toggle"
    //% group="MOTORES" color="#35BFE9" weight=100 blockGap=8
    export function motorMulticolor(
        color: SabanaColorMotor,
        movimiento: SabanaMovimientoMotorUnico,
        velocidad = 50
    ): void {
        const v = _clamp(velocidad, 0, 100)
        _writeMotor(colorToAddress(color), movimientoToSpeed(movimiento, v))
    }
}
