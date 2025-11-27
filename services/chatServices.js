import dotenv from "dotenv";
import { SerialPort } from "serialport";

const port = new SerialPort({
  path: "COM4",
  baudRate: 9600,
});
dotenv.config();

const API_URL = `http://${process.env.RED_LOCAL}:${process.env.IA_PORT}/v1/chat/completions`;

export const getChat = async () => {
  return [{ msg: "Mensaje de Diego" }];
};

export const postChat = async (data) => {
  const body = {
    messages: [{ role: "user", content: data }],
    temperature: 0.7,
    max_tokens: -1,
    stream: false,
  };

  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      throw new Error(
        `Error en la solicitud HTTP: ${response.status} ${response.statusText}`
      );
    }

    // Parsea la respuesta JSON del servidor y la devuelve.
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(
      "No se pudo conectar con el servidor de LM Studio:",
      error.message
    );
    return { error: true, message: error.message };
  }
};

const ARDUINO_IP = `${process.env.ARDUINO_IP}`;

export const interpretarComandoIA = async (texto) => {
  const PALABRAS = {
    on: [
      "enciende",
      "encender",
      "prende",
      "activar",
      "activa",
      "ilumina",
      "on",
    ],
    off: ["apaga", "apagar", "desactiva", "desactivar", "oscurece", "off"],
  };

  texto = texto.toLowerCase();
  const encender = contienePalabra(texto, PALABRAS.on);
  const apagar = contienePalabra(texto, PALABRAS.off);

  if (!encender && !apagar) {
    console.log("No se detectó una acción de encendido o apagado.");
    return;
  }
  //Rutas de los leds
  if (
    texto.includes("1") ||
    texto.includes("led 1") ||
    texto.includes("primer led")
  ) {
    await fetch(`${ARDUINO_IP}/led1/${esEncender ? "on" : "off"}`);
  } else if (
    texto.includes("2") ||
    texto.includes("led 2") ||
    texto.includes("segundo led")
  ) {
    await fetch(`${ARDUINO_IP}/led2/${esEncender ? "on" : "off"}`);
  } else if (
    texto.includes("3") ||
    texto.includes("led 3") ||
    texto.includes("tercer led")
  ) {
    await fetch(`${ARDUINO_IP}/led3/${esEncender ? "on" : "off"}`);
  } else {
    console.log("No se detectó un número de LED en la respuesta de la IA");
  }
};

function contienePalabra(texto, lista) {
  return lista.some((palabra) => texto.includes(palabra));
}

// Envía el comando al Arduino
const enviarAArduino = (command) => {
  return new Promise((resolve, reject) => {
    port.write(command + "\n", (err) => {
      if (err) {
        console.error("Error enviando comando:", err);
        reject(err);
      } else {
        console.log("Comando enviado al Arduino:", command);
        resolve();
      }
    });
  });
};

export const controlarLed = async (texto) => {
  const PALABRAS = {
    on: [
      "enciende",
      "encender",
      "prende",
      "activar",
      "activa",
      "ilumina",
      "on",
    ],
    off: ["apaga", "apagar", "desactiva", "desactivar", "oscurece", "off"],
  };
  const lowerText = texto.toLowerCase();
  const encender = contienePalabra(lowerText, PALABRAS.on);
  const apagar = contienePalabra(lowerText, PALABRAS.off);

  let accion = null;
  if (encender) accion = "on";
  if (apagar) accion = "off";

  if (!accion) {
    console.log("ℹNo se detectó una acción de encendido/apagado.");
    return;
  }

  let led = null;
  if (lowerText.includes("1") || lowerText.includes("uno")) led = 1;
  else if (lowerText.includes("2") || lowerText.includes("dos")) led = 2;
  else if (lowerText.includes("3") || lowerText.includes("tres")) led = 3;

  if (!led) {
    console.log("No se detectó número de LED en la respuesta.");
    return;
  }

  const comando = `/led${led}/${accion}`;
  await enviarAArduino(comando);
};
