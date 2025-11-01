import * as chatService from "../services/chatServices.js";

export const getChat = async (req, res) => {
    try {
        const chat = await chatService.getChat();
        res.json(chat);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error" });
    }
};

export const postChat = async (req, res) => {
    try {
        const { mensaje } = req.body;
        // valida mensaje
        if (!mensaje) {
            return res
                .status(400)
                .json({ error: "El campo 'mensaje' es requerido en el body." });
        }
        const newChat = await chatService.postChat(mensaje);
        if (newChat.error) {
            return res.status(500).json({
                error: "Error al contactar el servicio de LM Studio.",
                details: newChat.message,
            });
        }
        // se extrae la respuesta del modelo
        const contenidoRespuesta = newChat.choices[0]?.message?.content;

        if (!contenidoRespuesta) {
            return res
                .status(500)
                .json({ error: "Respuesta inesperada o vacía del modelo de IA." });
        }
        // se envia la respuesta
        console.log(`Respuesta: "${contenidoRespuesta}"`);
        res.json({ respuesta: contenidoRespuesta });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error" });
    }
};
