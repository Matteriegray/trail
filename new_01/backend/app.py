from flask import Flask, request, send_file
from flask_cors import CORS
import cv2
import numpy as np
from PIL import Image
import io

app = Flask(__name__)
CORS(app)

@app.route("/process", methods=["POST"])
def process():
    file = request.files["image"]
    operation = request.form["operation"]

    image = Image.open(file.stream)
    img = np.array(image)

    # Convert RGB to BGR (OpenCV format)
    img = cv2.cvtColor(img, cv2.COLOR_RGB2BGR)

    if operation == "grayscale":
        img = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)

    elif operation == "blur":
        img = cv2.GaussianBlur(img, (15, 15), 0)

    elif operation == "edge":
        img = cv2.Canny(img, 100, 200)

    elif operation == "resize":
        img = cv2.resize(img, (300, 300))

    # Convert back to RGB for saving
    if len(img.shape) == 2:
        result = Image.fromarray(img)
    else:
        img = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
        result = Image.fromarray(img)

    img_io = io.BytesIO()
    result.save(img_io, "PNG")
    img_io.seek(0)

    return send_file(img_io, mimetype='image/png')

if __name__ == "__main__":
    app.run(debug=True)