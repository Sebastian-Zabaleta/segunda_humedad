'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

type HumidityData = {
  timestamp: string;
  humidity_value: number;
  location: string;
};

export default function SensorsPage() {
  const [history, setHistory] = useState<HumidityData[]>([]);
  const [latestReading, setLatestReading] = useState<HumidityData | null>(null);

  useEffect(() => {
    async function fetchHumidityData() {
      try {
        const response = await fetch('/api/sensors');

        if (!response.ok) {
          console.error("Error al obtener los datos:", response.status, response.statusText);
          throw new Error(`Error al obtener los datos: ${response.status}`);
        }

        const dataResponse = await response.json();
        console.log("Respuesta de la API:", dataResponse);

        const data: HumidityData[] = Array.isArray(dataResponse)
          ? dataResponse
          : dataResponse.results;

        if (!Array.isArray(data)) {
          throw new Error("La respuesta de la API no es un array válido");
        }

        const sortedData = data.sort(
          (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
        );

        setHistory(sortedData);

        const latestData = sortedData.filter((item) => item.location === "Ubicacion 1").pop();
        setLatestReading(latestData || null);
      } catch (error) {
        console.error("Error al obtener los datos de la API:", error);

        // Proveer datos de ejemplo si la API falla
        const sampleData: HumidityData[] = [
          { timestamp: new Date().toISOString(), humidity_value: 45, location: "Ubicacion 1" },
          { timestamp: new Date().toISOString(), humidity_value: 50, location: "Ubicacion 2" },
        ];
        setHistory(sampleData);
        setLatestReading(sampleData[0]);
      }
    }

    fetchHumidityData();
    const interval = setInterval(fetchHumidityData, 10000);

    return () => clearInterval(interval);
  }, []);

  const data = {
    labels: history.map((item) => new Date(item.timestamp).toLocaleTimeString()),
    datasets: [
      {
        label: 'Humedad (%)',
        data: history.map((item) => item.humidity_value),
        borderColor: 'rgb(75, 192, 192)',
        backgroundColor: 'rgba(75, 192, 192, 0.3)',
        borderWidth: 2,
        pointBackgroundColor: 'rgba(255, 255, 255, 0.8)',
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'bottom' as const,
      },
      title: {
        display: true,
        text: 'Mediciones de Humedad en Tiempo Real',
        font: {
          size: 18,
        },
        color: '#E5E5E5',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 100,
        grid: {
          color: 'rgba(255, 255, 255, 0.1)',
        },
        title: {
          display: true,
          text: 'Humedad (%)',
          color: '#E5E5E5',
        },
      },
      x: {
        grid: {
          color: 'rgba(255, 255, 255, 0.1)',
        },
        ticks: {
          color: '#E5E5E5',
        },
      },
    },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 to-gray-900 flex flex-col items-center p-6">
      <div className="bg-gray-800 shadow-lg rounded-lg w-full max-w-5xl p-6 sm:p-8">
        <h1 className="text-4xl font-bold text-teal-300 text-center mb-6">Sensor de Humedad</h1>
        <p className="text-center text-gray-300 mb-8 text-lg">
          Monitorea las mediciones en tiempo real de la humedad relativa.
        </p>

        <div className="bg-gray-700 p-4 sm:p-6 rounded-lg shadow-inner">
          <Line data={data} options={options} />
        </div>
      </div>

      <div className="bg-gray-800 shadow-lg rounded-lg w-full max-w-5xl mt-8 p-6 sm:p-8">
        <h2 className="text-2xl font-semibold text-teal-300 mb-4">Historial de Mediciones</h2>
        <table className="w-full text-gray-300 text-sm sm:text-base bg-gray-700 rounded-lg overflow-hidden">
          <thead>
            <tr className="bg-teal-600 text-white">
              <th className="px-4 py-2">Hora</th>
              <th className="px-4 py-2">Humedad (%)</th>
              <th className="px-4 py-2">Ubicación</th>
            </tr>
          </thead>
          <tbody>
            {history.map((item, index) => (
              <tr key={index} className="even:bg-gray-800 odd:bg-gray-700">
                <td className="px-4 py-2 text-center">{new Date(item.timestamp).toLocaleTimeString()}</td>
                <td className="px-4 py-2 text-center">{item.humidity_value}</td>
                <td className="px-4 py-2 text-center">{item.location}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="bg-gray-800 shadow-lg rounded-lg w-full max-w-3xl mt-8 p-6 text-center">
        <h2 className="text-xl font-semibold text-teal-300">Última Lectura</h2>
        {latestReading ? (
          <p className="text-gray-300 text-lg mt-4">
            Humedad: <span className="text-teal-400 font-bold">{latestReading.humidity_value}%</span> registrada a las{' '}
            <span className="text-teal-400 font-bold">{new Date(latestReading.timestamp).toLocaleTimeString()}</span>
          </p>
        ) : (
          <p className="text-gray-400 text-lg mt-4">Cargando datos...</p>
        )}
      </div>

      <div className="mt-6">
        <Link href="/" className="bg-teal-500 text-gray-900 font-medium text-lg px-8 py-3 rounded-lg shadow-lg hover:bg-teal-400 transition duration-200">
          Ir al Inicio
        </Link>
      </div>
    </div>
  );
}
