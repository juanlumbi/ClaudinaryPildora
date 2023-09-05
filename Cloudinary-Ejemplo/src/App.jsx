import "./App.css";
import React, { useState } from "react";
import { CloudinaryContext } from "cloudinary-react";
import { Image, Transformation } from "cloudinary-react";
import Dropzone from "react-dropzone";

function FileUploader() {
    const [uploadedImages, setUploadedImages] = useState([]);
  
    const onDrop = (acceptedFiles) => {
      acceptedFiles.forEach((file) => {
        // Verificar si el archivo es una imagen
        if (file.type.startsWith("image/")) {
          // Crear una instancia de FormData para subir la imagen
          const formData = new FormData();
          formData.append("file", file);
          formData.append("upload_preset", "api_Cloudinary");
  
          // Realizar la solicitud de subida a Cloudinary
          fetch("https://api.cloudinary.com/v1_1/da7ffijqs/image/upload", {
            method: "POST",
            body: formData,
          })
            .then((response) => response.json())
            .then((data) => {
              // Verificar si la subida fue exitosa
              if (data && data.public_id) {
                // Agregar la URL de la imagen subida al estado
                setUploadedImages([...uploadedImages, data.secure_url]);
              } else {
                // Mostrar una alerta si la subida falló
                alert("Error al subir la imagen a Cloudinary");
              }
            })
            .catch((error) => {
              console.error("Error al subir la imagen:", error);
              alert("Error al subir la imagen a Cloudinary");
            });
        } else {
          // Mostrar una alerta si el archivo no es una imagen
          alert("Por favor, selecciona solo imágenes.");
        }
      });
    };
  
    return (
      <div>
        <h2>Arrastra y suelta imágenes aquí</h2>
        <Dropzone onDrop={onDrop}>
          {({ getRootProps, getInputProps }) => (
            <div {...getRootProps()} className="dropzone">
              <input {...getInputProps()} />
              <p>Arrastra imágenes aquí o haz clic para seleccionarlas.</p>
            </div>
          )}
        </Dropzone>
        {uploadedImages.length > 0 && (
          <div>
            <h3>Imágenes subidas a Cloudinary:</h3>
            {uploadedImages.map((url, index) => (
              <div key={index}>
                <Image publicId={url} width="300">
                  <Transformation crop="fill" />
                </Image>
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
