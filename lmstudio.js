/**
 * @file
 * @description
 */

/**
 * Envía un mensaje de usuario al endpoint de chat de LM Studio y devuelve la respuesta del modelo.
 *
 * @async
 * @param {string} mensajeUsuario El mensaje que se enviará al modelo de IA.
 * @returns {Promise<object>} Una promesa que se resuelve con la respuesta completa en formato JSON del servidor.
 * En caso de error, devuelve un objeto con una clave 'error'.
 */
async function enviarMensajeLMStudio(mensajeUsuario) {
  // Define el endpoint local de LM Studio.
  const API_URL = "http://localhost:1234/v1/chat/completions";

 
  const body = {
  
    messages: [
      { role: "user", content: mensajeUsuario }
    ],
   
    temperature: 0.7, 
    max_tokens: -1,   
    stream: false     
  };

  console.log("Enviando solicitud a LM Studio...");

  try {
    // Realiza la solicitud HTTP usando el método POST.
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
}

(async () => {
  // Mensaje que quieres enviar al modelo Qwen3 30B.
  const miPregunta = "dime hola";

  const respuestaJSON = await enviarMensajeLMStudio(miPregunta);

  if (respuestaJSON && !respuestaJSON.error) {
    console.log("\n--- Respuesta Completa (JSON) ---");
    console.log(JSON.stringify(respuestaJSON, null, 2)); 


    const contenidoRespuesta = respuestaJSON.choices[0]?.message?.content;

    if (contenidoRespuesta) {
      console.log("\n--- Mensaje del Modelo ---");
      console.log(contenidoRespuesta);
    } else {
      console.error("\nNo se pudo extraer el contenido del mensaje de la respuesta.");
    }
  } else {
    console.log("\nNo se recibió una respuesta válida del modelo.");
  }
})();