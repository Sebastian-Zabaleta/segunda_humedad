const fetch = require('node-fetch');

// Función para generar datos aleatorios
function generateRandomData() {
  return {
    humidity_value: Math.floor(Math.random() * 101), // Humedad entre 0 y 100
    location: `Ubicación ${Math.floor(Math.random() * 5) + 1}`, // Ubicaciones 1-5
  };
}

// Función para enviar datos a la API
async function sendData() {
  const data = generateRandomData();
  try {
    const response = await fetch('http://localhost:3000/api/sensors', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`Error al enviar datos: ${response.statusText}`);
    }

    const result = await response.json();
    console.log('✅ Datos enviados con éxito:', result);
  } catch (error) {
    console.error('❌ Error al enviar datos:', error);
  }
}

// Enviar datos cada 10 segundos
setInterval(sendData, 10000);
