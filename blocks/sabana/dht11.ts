namespace bloques {

    // ── Constantes del protocolo DHT11 ───────────────────────────────
    const DHT11_BITS = 40                // 5 bytes
    const DHT11_START_LOW_MS = 18        // señal de inicio en bajo
    const DHT11_POST_START_US = 40       // espera tras liberar el pin
    const DHT11_BIT_THRESHOLD_US = 28    // > 28us en alto = bit "1"
    const DHT11_ERROR = -999             // sensor no responde o checksum inválido

    export enum SabanaDatoDHT11 {
        //% block="Humedad"
        Humedad = 0,
        //% block="Temperatura"
        Temperatura = 1,
    }

    /**
     * Lee humedad y temperatura crudas del DHT11 por protocolo de un hilo.
     * Devuelve [humedad, temperatura], o [-999, -999] si falla.
     *
     * Origen: _referencia/ext5-DTH11.ts -> leerDHT11(), adaptado a su vez de
     * la extensión pública alankrantas/pxt-DHT11_DHT22 (MIT).
     *
     * ADVERTENCIA: la temporización de esta función es crítica. Los waitMicros
     * y los while de espera activa NO se pueden reemplazar por basic.pause()
     * ni reordenar: el protocolo del DHT11 se codifica en microsegundos.
     */
    function leerDHT11(pin: DigitalPin): number[] {
        let dataArray: boolean[] = []
        let resultArray: number[] = [0, 0, 0, 0, 0]
        for (let i = 0; i < DHT11_BITS; i++) dataArray.push(false)

        // señal de inicio
        pins.digitalWritePin(pin, 0)
        basic.pause(DHT11_START_LOW_MS)
        pins.setPull(pin, PinPullMode.PullUp)
        pins.digitalReadPin(pin)
        control.waitMicros(DHT11_POST_START_US)

        if (pins.digitalReadPin(pin) == 1) {
            return [DHT11_ERROR, DHT11_ERROR]   // el sensor no respondió
        }

        while (pins.digitalReadPin(pin) == 0);  // respuesta del sensor
        while (pins.digitalReadPin(pin) == 1);  // respuesta del sensor

        // lectura de 40 bits (5 bytes)
        for (let i = 0; i < DHT11_BITS; i++) {
            while (pins.digitalReadPin(pin) == 1);
            while (pins.digitalReadPin(pin) == 0);
            control.waitMicros(DHT11_BIT_THRESHOLD_US)
            // si sigue en alto pasado el umbral, es un bit "1"
            if (pins.digitalReadPin(pin) == 1) dataArray[i] = true
        }

        for (let i = 0; i < 5; i++)
            for (let j = 0; j < 8; j++)
                if (dataArray[8 * i + j]) resultArray[i] += 2 ** (7 - j)

        let checksumTmp = resultArray[0] + resultArray[1] + resultArray[2] + resultArray[3]
        if (checksumTmp >= 512) checksumTmp -= 512
        if (checksumTmp >= 256) checksumTmp -= 256

        if (checksumTmp != resultArray[4]) {
            return [DHT11_ERROR, DHT11_ERROR]   // checksum inválido
        }

        const humedad = resultArray[0] + resultArray[1] / 100
        const temperatura = resultArray[2] + resultArray[3] / 100
        return [humedad, temperatura]
    }

    /**
     * STV2-3 — DHT11 (humedad / temperatura) en un puerto GPIO.
     *
     * Devuelve el valor CON DECIMALES, o -999 si el sensor no responde o si
     * falla la verificación de datos.
     *
     * El módulo es de 3 pines (VCC / DATA / GND) y usa protocolo de un hilo
     * sobre el pin digital del puerto. NO es I2C.
     *
     * Los valores del enum (Humedad = 0, Temperatura = 1) son los índices del
     * array que devuelve leerDHT11(). NO renumerarlos.
     *
     * @param dato Humedad o Temperatura, eg: SabanaDatoDHT11.Humedad
     * @param puerto puerto GPIO de la placa, eg: SabanaPuerto.P0
     */
    //% blockId=sabana_dht11
    //% block="%dato │ en pin %puerto"
    //% group="SENSORES" color="#FFB800" weight=90 blockGap=8
    export function dht11(dato: SabanaDatoDHT11, puerto: SabanaPuerto): number {
        const lectura = leerDHT11(puertoToDigitalPin(puerto))
        return lectura[dato]
    }
}
