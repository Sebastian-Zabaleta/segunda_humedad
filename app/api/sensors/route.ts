import { NextResponse } from 'next/server';
import { Client } from 'pg';

// Configuración de PostgreSQL
const client = new Client({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

// Función para conectar al cliente de PostgreSQL
async function connectToDatabase() {
  try {
    if (!client._connected) {
      console.log("Conectando a la base de datos...");
      await client.connect();
      console.log("✅ Conexión establecida con la base de datos");
    }
  } catch (error) {
    console.error("❌ Error al conectar a la base de datos:", error);
    throw new Error("Error al conectar a la base de datos");
  }
}

// Endpoint POST: Insertar datos en la tabla
export async function POST(req: Request) {
  try {
    await connectToDatabase();

    const { humidity_value, location } = await req.json();

    // Validación de datos
    if (!humidity_value || !location) {
      console.error("❌ Datos inválidos:", { humidity_value, location });
      return NextResponse.json({ error: "Faltan datos requeridos" }, { status: 400 });
    }

    // Inserción en la base de datos
    const query = `
      INSERT INTO humedad (humidity_value, location)
      VALUES ($1, $2)
      RETURNING *;
    `;
    const values = [humidity_value, location];

    console.log("Ejecutando query:", query, values);

    const result = await client.query(query, values);
    console.log("✅ Datos insertados:", result.rows[0]);

    return NextResponse.json(result.rows[0]);

  } catch (error) {
    console.error("❌ Error en el servidor:", error.message);
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}

// Endpoint GET: Obtener los últimos 10 registros de la tabla
export async function GET() {
  try {
    await connectToDatabase();

    // Consulta para obtener los últimos 10 registros
    const query = `
      SELECT * FROM humedad
      ORDER BY timestamp DESC
      LIMIT 10;
    `;

    console.log("Ejecutando query:", query);

    const result = await client.query(query);
    console.log("✅ Datos obtenidos:", result.rows);

    return NextResponse.json(result.rows);

  } catch (error) {
    console.error("❌ Error en el servidor:", error.message);
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}
