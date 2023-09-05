import "./App.css";
import React, { useState } from "react";
import { CloudinaryContext } from "cloudinary-react";
import { Image, Video, Transformation } from "cloudinary-react";
import Dropzone from "react-dropzone";

function FileUploader() {
  const [uploadedMedia, setUploadedMedia] = useState([]);

  const onDrop = (acceptedFiles) => {
    acceptedFiles.forEach((file) => {
      // Verificar si el archivo es una imagen o un video
      if (file.type.startsWith("image/") || file.type.startsWith("video/")) {
        // Crear una instancia de FormData para subir el archivo multimedia
        const formData = new FormData();
        formData.append("file", file);
        formData.append("upload_preset", "api_Cloudinary");

        // Realizar la solicitud de subida a Cloudinary
        fetch("https://api.cloudinary.com/v1_1/da7ffijqs/auto/upload", {
          method: "POST",
          body: formData,
        })
          .then((response) => response.json())
          .then((data) => {
            // Verificar si la subida fue exitosa
            if (data && data.secure_url) {
              // Agregar la URL del archivo multimedia subido al estado
              setUploadedMedia([...uploadedMedia, data.secure_url]);
            } else {
              // Mostrar una alerta si la subida falló
              alert("Error al subir el archivo a Cloudinary");
            }
          })
          .catch((error) => {
            console.error("Error al subir el archivo:", error);
            alert("Error al subir el archivo a Cloudinary");
          });
      } else {
        // Mostrar una alerta si el archivo no es una imagen ni un video
        alert("Por favor, selecciona solo imágenes o videos.");
      }
    });
  };

  return (
    <div>
      <h2>Arrastra y suelta imágenes o videos aquí</h2>
      <Dropzone onDrop={onDrop}>
        {({ getRootProps, getInputProps }) => (
          <div {...getRootProps()} className="dropzone">
            <input {...getInputProps()} />
            <p>Arrastra imágenes o videos aquí o haz clic para seleccionarlos.</p>
          </div>
        )}
      </Dropzone>
      {uploadedMedia.length > 0 && (
        <div>
          <h3>Archivos multimedia subidos a Cloudinary:</h3>
          {uploadedMedia.map((url, index) => (
            <div key={index}>
              {url.startsWith("https://res.cloudinary.com/da7ffijqs/image/") ? (
                <Image publicId={url} width="300">
                  <Transformation crop="fill" />
                </Image>
              ) : url.startsWith("https://res.cloudinary.com/da7ffijqs/video/") ? (
                <Video publicId={url} width="400" controls>
                  <Transformation />
                </Video>
              ) : (
                <p>URL no válida: {url}</p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function App() {
  return (
    <CloudinaryContext cloudName="da7ffijqs">
      <div>
        <h1>Mi Aplicación con Cloudinary</h1>
        <h3>
          Bienvenido a mi aplicación que utiliza Cloudinary para administrar
          archivos multimedia.
        </h3>

        <img
          src="https://res.cloudinary.com/da7ffijqs/image/upload/v1693900784/hwiq5tdyyiv8eed7ffyw.jpg"
          alt="Mi imagen"
          width="300"
        />

        <video
          controls
          width="400"
          src="https://res.cloudinary.com/da7ffijqs/video/upload/v1693899694/sed0moogrok0wqun79px.mp4"
        ></video>

        <FileUploader />
      </div>
    </CloudinaryContext>
  );
}

export default App;

