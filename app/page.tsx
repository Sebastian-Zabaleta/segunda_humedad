export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex flex-col items-center justify-center p-8">
      <div className="flex justify-between w-full max-w-5xl">
        
        {/* Espacio para el Logo Izquierdo */}
        <div className="flex items-center justify-center">
          {/* Imagen del Logo Izquierdo */}
          {/* Para activar, descomenta y asegúrate de que la imagen exista en la carpeta 'public/assets/' */}
          {/* <Image
            src="/assets/Logo_Universidad_de_Cundinamarca.png"
            alt="Logo Universidad de Cundinamarca"
            width={400} // Ajusta el tamaño según sea necesario
            height={400}
            className="rounded-full shadow-lg"
          /> */}
        </div>

        {/* Contenido Principal */}
        <div className="bg-gray-800 shadow-2xl rounded-3xl p-10 w-full max-w-3xl text-left transform hover:scale-105 transition-all duration-300 ease-in-out">
          <h1 className="text-5xl font-semibold mb-6 text-teal-400 text-center border-b border-teal-500 pb-3">
            Estadio UDEC
          </h1>

          <p className="text-lg mb-4 text-gray-300 leading-relaxed text-center">
            Accede al monitoreo detallado de temperatura y humedad en distintas áreas del estadio.
            Mantén el control en tiempo real para asegurar un ambiente óptimo.
          </p>

          {/* Imagen del Estadio */}
          <div className="my-10 flex justify-center">
            {/* Para activar, descomenta y asegúrate de que la imagen exista en la carpeta 'public/' */}
            {/* <Image
              src="/images.png"
              alt="Estadio"
              width={400}
              height={400}
              className="rounded-3xl shadow-lg border-4 border-teal-600 transition-transform transform hover:scale-105"
            /> */}
          </div>

          {/* Enlace a la página de sensores */}
          <div className="flex justify-center mt-8">
            <a
              href="/sensors"
              className="bg-teal-500 text-gray-900 text-lg font-semibold px-10 py-3 rounded-full hover:bg-teal-400 hover:shadow-lg transition-all duration-300 transform hover:scale-105"
            >
              Explorar Sensores
            </a>
          </div>
        </div>

        {/* Espacio para el Logo Derecho */}
        <div className="flex items-center justify-center">
          {/* Imagen del Logo Derecho */}
          {/* Para activar, descomenta y asegúrate de que la imagen exista en la carpeta 'public/' */}
          {/* <Image
            src="/assets/Logo_Universidad_de_Cundinamarca.png"
            alt="Logo Universidad de Cundinamarca"
            width={400} // Ajusta el tamaño según sea necesario
            height={400}
            className="rounded-full shadow-lg"
          /> */}
        </div>
      </div>
    </div>
  );
}
