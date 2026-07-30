namespace bloques {

    // ── Constantes físicas del robot ─────────────────────────────────
    // Origen: _referencia/ext5-motores.ts
    const DIAMETRO_RUEDA_CM = 5.5
    const CIRCUNFERENCIA_RUEDA_CM = 3.14159 * DIAMETRO_RUEDA_CM   // 17.28 cm
    const DIST_ENTRE_RUEDAS_CM = 12.0

    // ── Constante A CALIBRAR con el robot real ───────────────────────
    // RPM del motor a velocidad 100, después de la caja reductora.
    // El valor 150 es una ESTIMACIÓN, no una medición. De él dependen la
    // distancia de sabana_movimiento_cm y el ángulo de sabana_movimiento_girar.
    //
    // Procedimiento de calibración:
    //   1. Marcar una rueda con una cinta
    //   2. Ejecutar "Avanzar | Velocidad 100 por 100 cm"
    //   3. Contar vueltas de la rueda y medir el tiempo real
    //   4. RPM = vueltas * 60000 / tiempo_real_ms
    //
    // Atajo: si al pedir 100 cm el robot recorre 80, multiplicar por 80/100.
    const RPM_A_VEL_100 = 150

    export enum SabanaMovimiento {
        //% block="Avanzar"
        Avanzar = 0,
        //% block="Retroceder"
        Retroceder = 1,
        //% block="Girar a la Izquierda"
        GirarIzquierda = 2,
        //% block="Girar a la Derecha"
        GirarDerecha = 3,
        //% block="Frenar"
        Frenar = 4,
    }

    export enum SabanaAvanceRetroceso {
        //% block="Avanzar"
        Avanzar = 0,
        //% block="Retroceder"
        Retroceder = 1,
    }

    export enum SabanaDireccionGiro {
        //% block="Girar a la izquierda"
        Izquierda = 0,
        //% block="Girar a la derecha"
        Derecha = 1,
    }

    /**
     * Aplica un movimiento a los dos motores del robot.
     *
     * Los motores están montados EN ESPEJO: para avanzar tienen que girar en
     * sentidos opuestos. Por eso Avanzar es (+v, -v) y no (+v, +v).
     *
     * A diferencia de sabana_motor_multicolor (M09), que usa signo crudo, acá
     * el espejo SÍ se aplica: los motores se mueven juntos como robot.
     *
     * Origen: _referencia/ext5-motores.ts -> movimientoToSpeeds() + runDualMotors()
     */
    function aplicarMovimiento(movimiento: SabanaMovimiento, velocidad: number): void {
        let sRojo = 0
        let sVerde = 0

        switch (movimiento) {
            case SabanaMovimiento.Avanzar:
                sRojo = velocidad; sVerde = -velocidad; break
            case SabanaMovimiento.Retroceder:
                sRojo = -velocidad; sVerde = velocidad; break
            case SabanaMovimiento.GirarDerecha:
                sRojo = -velocidad; sVerde = -velocidad; break
            case SabanaMovimiento.GirarIzquierda:
                sRojo = velocidad; sVerde = velocidad; break
            case SabanaMovimiento.Frenar:
                sRojo = 0; sVerde = 0; break
        }

        _writeMotor(_MOTOR_ROJO, sRojo)
        _writeMotor(_MOTOR_VERDE, sVerde)
    }

    // Detiene los dos motores.
    function frenarMotores(): void {
        _writeMotor(_MOTOR_ROJO, 0)
        _writeMotor(_MOTOR_VERDE, 0)
    }

    // Tiempo en ms que hace falta para recorrer una distancia en cm.
    function tiempoParaCm(cm: number, velocidad: number): number {
        const rpmEfectivas = RPM_A_VEL_100 * velocidad / 100
        return (cm * 60000) / (CIRCUNFERENCIA_RUEDA_CM * rpmEfectivas)
    }

    /**
     * STV2-17 — Movimiento simple del robot. Bloque directo, sin botón "+".
     *
     * No frena solo: el robot sigue moviéndose hasta que se le mande Frenar
     * o hasta que termine el programa.
     *
     * @param movimiento dirección, eg: SabanaMovimiento.Avanzar
     * @param velocidad velocidad de 0 a 100, eg: 50
     */
    //% blockId=sabana_movimiento_simple
    //% block="%movimiento │ Velocidad %velocidad"
    //% velocidad.min=0 velocidad.max=100 velocidad.defl=50
    //% group="MOVIMIENTO" color="#35BFE9" weight=100 blockGap=8
    export function movimientoSimple(movimiento: SabanaMovimiento, velocidad: number): void {
        aplicarMovimiento(movimiento, _clamp(velocidad, 0, 100))
    }

    /**
     * STV2-18 — Movimiento por una distancia en cm. Bloque directo, sin
     * botón "+". Solo Avanzar/Retroceder (no incluye giros ni frenar).
     *
     * BLOQUEANTE: espera a que el robot recorra la distancia y después frena
     * solo. La precisión depende de RPM_A_VEL_100, que está sin calibrar.
     *
     * @param movimiento Avanzar o Retroceder, eg: SabanaAvanceRetroceso.Avanzar
     * @param velocidad velocidad de 0 a 100, eg: 50
     * @param cm distancia en centímetros, eg: 10
     */
    //% blockId=sabana_movimiento_cm
    //% block="%movimiento │ Velocidad %velocidad por %cm cm"
    //% velocidad.min=0 velocidad.max=100 velocidad.defl=50
    //% cm.min=1 cm.max=500 cm.defl=10
    //% group="MOVIMIENTO" color="#35BFE9" weight=90 blockGap=8
    export function movimientoCm(movimiento: SabanaAvanceRetroceso, velocidad: number, cm: number): void {
        const v = _clamp(velocidad, 0, 100)
        if (v <= 0 || cm <= 0) return

        const mov = movimiento == SabanaAvanceRetroceso.Avanzar
            ? SabanaMovimiento.Avanzar
            : SabanaMovimiento.Retroceder

        aplicarMovimiento(mov, v)
        basic.pause(tiempoParaCm(cm, v))
        frenarMotores()
    }

    /**
     * STV2-19 — Gira el robot un ángulo determinado. Bloque directo, sin
     * botón "+". La palabra "Girar" es parte del texto del desplegable
     * (SabanaDireccionGiro), no del texto fijo del bloque.
     *
     * BLOQUEANTE: espera a completar el giro y después frena solo.
     * El giro es sobre el eje del robot (las dos ruedas en sentidos
     * opuestos), no un giro con radio.
     *
     * @param direccion sentido del giro, eg: SabanaDireccionGiro.Izquierda
     * @param velocidad velocidad de 0 a 100, eg: 50
     * @param angulo ángulo en grados, eg: 90
     */
    //% blockId=sabana_movimiento_girar
    //% block="%direccion │ Velocidad %velocidad ángulo de %angulo"
    //% velocidad.min=0 velocidad.max=100 velocidad.defl=50
    //% angulo.min=0 angulo.max=360 angulo.defl=90
    //% group="MOVIMIENTO" color="#35BFE9" weight=80 blockGap=8
    export function movimientoGirar(direccion: SabanaDireccionGiro, velocidad: number, angulo: number): void {
        const v = _clamp(velocidad, 0, 100)
        if (v <= 0 || angulo <= 0) return

        // Arco que recorre cada rueda para que el robot gire ese ángulo.
        const arcoCm = 3.14159 * DIST_ENTRE_RUEDAS_CM * angulo / 360

        const mov = direccion == SabanaDireccionGiro.Izquierda
            ? SabanaMovimiento.GirarIzquierda
            : SabanaMovimiento.GirarDerecha

        aplicarMovimiento(mov, v)
        basic.pause(tiempoParaCm(arcoCm, v))
        frenarMotores()
    }
}
