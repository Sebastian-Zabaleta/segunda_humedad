const fetch = require('node-fetch');

// Función para generar datos aleatorios
function generateRandomData() {
  return {
    humidity_value: Math.floor(Math.random() * 101), // Humedad entre 0 y 100
    location: `Ubicación ${Math.floor(Math.random() * 5) + 1}`, // Ubicaciones 1 a 5
  };
}

// Función para enviar datos simulados a la API en Vercel
async function sendData() {
  const data = generateRandomData();
  try {
    console.log('Enviando datos a la API:', data);

    const response = await fetch('https://segunda-humedad.vercel.app/api/sensors', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`Error al enviar datos: ${response.status} ${response.statusText}`);
    }

    const result = await response.json();
    console.log('✅ Datos enviados con éxito:', result);
  } catch (error) {
    console.error('❌ Error al enviar datos:', error.message);
  }
}

// Enviar datos simulados cada 10 segundos
setInterval(sendData, 10000);
