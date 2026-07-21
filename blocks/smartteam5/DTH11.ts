/**
 * Sensor DHT11 (Humedad/Temperatura) — SmartTEAM5 / subcategoría Sensores L5
 * Protocolo de un solo cable, adaptado de la extensión pública
 * alankrantas/pxt-DHT11_DHT22 (MIT) al esquema de puertos de esta extensión.
 *
 * Devuelve -999 si el sensor no responde o falla el checksum.
 */

namespace ext5_smartteam5 {

    export enum Ext5DHT11Dato {
        //% block="HUMEDAD"
        Humedad = 1,
        //% block="TEMPERATURA"
        Temperatura = 2,
    }

    // Lee humedad y temperatura crudas del DHT11. Devuelve [-999,-999] si falla.
    function leerDHT11(pin: DigitalPin): number[] {
        let dataArray: boolean[] = []
        let resultArray: number[] = [0, 0, 0, 0, 0]
        for (let i = 0; i < 40; i++) dataArray.push(false)

        // señal de inicio
        pins.digitalWritePin(pin, 0)
        basic.pause(18)
        pins.setPull(pin, PinPullMode.PullUp)
        pins.digitalReadPin(pin)
        control.waitMicros(40)

        if (pins.digitalReadPin(pin) == 1) {
            return [-999, -999] // el sensor no respondió
        }

        while (pins.digitalReadPin(pin) == 0); // respuesta del sensor
        while (pins.digitalReadPin(pin) == 1); // respuesta del sensor

        // lectura de 40 bits (5 bytes)
        for (let i = 0; i < 40; i++) {
            while (pins.digitalReadPin(pin) == 1);
            while (pins.digitalReadPin(pin) == 0);
            control.waitMicros(28)
            // si sigue en alto pasados 28us, es un bit "1"
            if (pins.digitalReadPin(pin) == 1) dataArray[i] = true
        }

        for (let i = 0; i < 5; i++)
            for (let j = 0; j < 8; j++)
                if (dataArray[8 * i + j]) resultArray[i] += 2 ** (7 - j)

        let checksumTmp = resultArray[0] + resultArray[1] + resultArray[2] + resultArray[3]
        if (checksumTmp >= 512) checksumTmp -= 512
        if (checksumTmp >= 256) checksumTmp -= 256

        if (checksumTmp != resultArray[4]) {
            return [-999, -999] // checksum inválido
        }

        const humedad = resultArray[0] + resultArray[1] / 100
        const temperatura = resultArray[2] + resultArray[3] / 100
        return [humedad, temperatura]
    }

    /**
     * Lee humedad o temperatura del sensor DHT11 conectado al puerto indicado.
     * Devuelve -999 si el sensor no responde o falla la verificación de datos.
     * @param dato humedad o temperatura, eg: Ext5DHT11Dato.Temperatura
     * @param puerto puerto GPIO, eg: Ext5Puerto.P1
     */
    //% blockId=ext5_dht11
    //% block="%dato en el puerto %puerto"
    //% group="Sensores L5" color=#fcbb2b weight=60 blockGap=8
    export function ext5DHT11(dato: Ext5DHT11Dato, puerto: Ext5Puerto): number {
        const pin = puertoToGpioPin(puerto)
        const lectura = leerDHT11(pin)
        return dato == Ext5DHT11Dato.Humedad ? lectura[0] : lectura[1]
    }
}
