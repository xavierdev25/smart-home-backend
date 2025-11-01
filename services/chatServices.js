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
