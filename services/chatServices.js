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
    texto = texto.toLowerCase();

    console.log(ARDUINO_IP);

    // LED 1
    if (texto.includes("1") && (texto.includes("enciende") || texto.includes("prende") || texto.includes("activa"))) {
        await fetch(`${ARDUINO_IP}/led1/on`);
    } else if (texto.includes("1") && (texto.includes("apaga") || texto.includes("desactiva"))) {
        await fetch(`${ARDUINO_IP}/led1/off`);
    }

    // LED 2
    if (texto.includes("2") && (texto.includes("enciende") || texto.includes("prende") || texto.includes("activa"))) {
        await fetch(`${ARDUINO_IP}/led2/on`);
    } else if (texto.includes("2") && (texto.includes("apaga") || texto.includes("desactiva"))) {
        await fetch(`${ARDUINO_IP}/led2/off`);
    }

    // LED 3
    if (texto.includes("3") && (texto.includes("enciende") || texto.includes("prende") || texto.includes("activa"))) {
        await fetch(`${ARDUINO_IP}/led3/on`);
    } else if (texto.includes("3") && (texto.includes("apaga") || texto.includes("desactiva"))) {
        await fetch(`${ARDUINO_IP}/led3/off`);
    }
}


