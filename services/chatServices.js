export const getChat = async () => {
    return [{ msg: "Mensaje de Diego" }];
};

export const postChat = async (data) => {
    return { msg: "mensaje recibido", data };
};
