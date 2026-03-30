import React, { useState } from "react";
import "./App.css";

function App() {
  const [image, setImage] = useState(null);
  const [processed, setProcessed] = useState(null);
  const [operation, setOperation] = useState("grayscale");

  const handleUpload = (e) => {
    setImage(e.target.files[0]);
  };

  const processImage = async () => {
    if (!image) {
      alert("Upload image first");
      return;
    }

    const formData = new FormData();
    formData.append("image", image);
    formData.append("operation", operation);

    const res = await fetch("http://127.0.0.1:5000/process", {
      method: "POST",
      body: formData,
    });

    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    setProcessed(url);
  };

  return (
    <div className="App">
      <h1>✨ Image Processor</h1>

      <div className="controls">
        <input type="file" onChange={handleUpload} />

        <select onChange={(e) => setOperation(e.target.value)}>
          <option value="grayscale">Grayscale</option>
          <option value="blur">Blur</option>
          <option value="edge">Edge Detection</option>
          <option value="resize">Resize</option>
        </select>

        <button onClick={processImage}>Process Image</button>
      </div>

      <div className="images">
        {image && (
          <div className="image-card">
            <h3>Original</h3>
            <img src={URL.createObjectURL(image)} alt="original" />
          </div>
        )}

        {processed && (
          <div className="image-card">
            <h3>Processed</h3>
            <img src={processed} alt="processed" />
          </div>
        )}
      </div>

      <div className="dwnld"> 
        <a
              href={processed}
              download="processed.png"
              className="download-btn"
            >
              Download
          </a>
      </div>
    </div>
  );
}

export default App;
