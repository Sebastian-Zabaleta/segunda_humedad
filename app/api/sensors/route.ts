import { NextResponse } from 'next/server';
import { Client } from 'pg';

// Configuración de la base de datos
const getClientConfig = () => ({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false, // Configuración SSL para conexiones seguras
  },
});

// Manejador de solicitudes GET para recuperar datos de humedad
export async function GET() {
  const client = new Client(getClientConfig());
  
  try {
    // Conectar al cliente de PostgreSQL
    await client.connect();
    console.log("✅ Conexión establecida para solicitud GET");

    // Consulta SQL para obtener las últimas 10 entradas
    const query = 'SELECT * FROM Humedad ORDER BY timestamp DESC LIMIT 10;';
    const result = await client.query(query);

    // Retornar los datos obtenidos en formato JSON
    return NextResponse.json(result.rows);
  } catch (err) {
    console.error('❌ Error al obtener datos de la base de datos:', err);
    return NextResponse.json({ error: 'Error al obtener datos' }, { status: 500 });
  } finally {
    // Cerrar la conexión
    await client.end();
    console.log("✅ Conexión cerrada después de solicitud GET");
  }
}

// Manejador de solicitudes POST para insertar datos de humedad
export async function POST(req: Request) {
  const client = new Client(getClientConfig());
  
  try {
    // Conectar al cliente de PostgreSQL
    await client.connect();
    console.log("✅ Conexión establecida para solicitud POST");

    // Verificar que la solicitud tenga JSON
    const contentType = req.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      return NextResponse.json({ error: 'Content-Type debe ser application/json' }, { status: 400 });
    }

    // Extraer y validar los datos del cuerpo de la solicitud
    const { humidity_value, location } = await req.json();
    if (humidity_value === undefined || !location) {
      return NextResponse.json(
        { error: 'Faltan datos: humidity_value o location' },
        { status: 400 }
      );
    }

    // Insertar datos en la base de datos
    const query = `
      INSERT INTO Humedad (humidity_value, location)
      VALUES ($1, $2)
      RETURNING *;
    `;
    const values = [humidity_value, location];
    const result = await client.query(query, values);

    // Responder con los datos insertados en formato JSON
    console.log("✅ Datos insertados con éxito:", result.rows[0]);
    return NextResponse.json(result.rows[0]);
  } catch (err) {
    console.error('❌ Error al insertar datos en la base de datos:', err);
    return NextResponse.json({ error: 'Error al insertar datos' }, { status: 500 });
  } finally {
    // Cerrar la conexión
    await client.end();
    console.log("✅ Conexión cerrada después de solicitud POST");
  }
}
