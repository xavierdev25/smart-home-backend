import dotenv from "dotenv";
dotenv.config();
const API_URL = `http://${process.env.RED_LOCAL}:${process.env.IA_PORT}/v1/chat/completions`;

export const getChat = async () => {
    return [{ msg: "Mensaje de Diego" }];
};


export const postChat = async (data) => {
    const body = {
        messages: [
            { role: "user", content: data }
        ],
        temperature: 0.7,
        max_tokens: -1,
        stream: false
    };
    
    try {
        const response = await fetch(API_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(body)
        });

        if (!response.ok) {
            throw new Error(`Error en la solicitud HTTP: ${response.status} ${response.statusText}`);
        }

        // Parsea la respuesta JSON del servidor y la devuelve.
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("No se pudo conectar con el servidor de LM Studio:", error.message);
        return { error: true, message: error.message };
    }
};

const ARDUINO_IP = `${process.env.ARDUINO_IP}`;

export const interpretarComandoIA = async(texto) => {
    const PALABRAS = {
        on: ["enciende", "encender", "prende", "activar", "activa", "ilumina", "on"],
        off: ["apaga", "apagar", "desactiva", "desactivar", "oscurece", "off"]
    };

    texto = texto.toLowerCase();
    const encender = contienePalabra(texto, PALABRAS.on);
    const apagar = contienePalabra(texto, PALABRAS.off);

    if (!encender && !apagar) {
        console.log("No se detectó una acción de encendido o apagado.");
        return;
    }
    //Rutas de los leds
    if (texto.includes("1") || texto.includes("led 1") || texto.includes("primer led")) {
        await fetch(`${ARDUINO_IP}/led1/${esEncender ? "on" : "off"}`);
    } else if (texto.includes("2") || texto.includes("led 2") || texto.includes("segundo led")) {
        await fetch(`${ARDUINO_IP}/led2/${esEncender ? "on" : "off"}`);
    } else if (texto.includes("3") || texto.includes("led 3") || texto.includes("tercer led")) {
        await fetch(`${ARDUINO_IP}/led3/${esEncender ? "on" : "off"}`);
    } else {
        console.log("No se detectó un número de LED en la respuesta de la IA");
    }
}

function contienePalabra(texto, lista) {
    return lista.some(palabra => texto.includes(palabra));
}



