// 🌍 Language Data
const translations = {
    en: {
        title: "Image Processing Tool",
        process: "Process"
    },
    hi: {
        title: "छवि प्रसंस्करण उपकरण",
        process: "प्रोसेस करें"
    },
    kn: {
        title: "ಚಿತ್ರ ಸಂಸ್ಕರಣಾ ಸಾಧನ",
        process: "ಪ್ರಕ್ರಿಯೆ"
    }
};

// 🌐 Language Switch
document.getElementById("language").addEventListener("change", (e) => {
    const lang = e.target.value;
    document.getElementById("title").innerText = translations[lang].title;
    document.getElementById("processBtn").innerText = translations[lang].process;
});

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
let img = new Image();

document.getElementById("upload").addEventListener("change", (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();

    reader.onload = function(event) {
        img.src = event.target.result;
    };

    reader.readAsDataURL(file);
});

document.getElementById("processBtn").addEventListener("click", processImage);

function processImage() {
    if (!img.src) {
        alert("Please upload an image first!");
        return;
    }

    canvas.width = img.width;
    canvas.height = img.height;

    ctx.drawImage(img, 0, 0);

    let imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    let data = imageData.data;

    let operation = document.getElementById("operation").value;

    for (let i = 0; i < data.length; i += 4) {
        let r = data[i];
        let g = data[i + 1];
        let b = data[i + 2];

        if (operation === "grayscale") {
            let avg = (r + g + b) / 3;
            data[i] = data[i + 1] = data[i + 2] = avg;
        }

        else if (operation === "invert") {
            data[i] = 255 - r;
            data[i + 1] = 255 - g;
            data[i + 2] = 255 - b;
        }

        else if (operation === "brightness") {
            data[i] = Math.min(255, r + 50);
            data[i + 1] = Math.min(255, g + 50);
            data[i + 2] = Math.min(255, b + 50);
        }
    }

    ctx.putImageData(imageData, 0, 0);
}

// 💾 Download Image
document.getElementById("downloadBtn").addEventListener("click", () => {
    const canvas = document.getElementById("canvas");

    if (!canvas.width) {
        alert("Process an image first!");
        return;
    }

    const link = document.createElement("a");
    link.download = "processed_image.png";
    link.href = canvas.toDataURL("image/png");
    link.click();
});