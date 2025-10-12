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
        const newChat = await chatService.postChat(req.body);
        res.status(201).json(newChat);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error" });
    }
};
