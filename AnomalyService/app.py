from flask import Flask, request, jsonify
import tensorflow as tf
import numpy as np
import requests
import cv2
from io import BytesIO
from PIL import Image

app = Flask(__name__)

model = tf.keras.models.load_model("bfm_classifier.h5")

def download_image(url):
    r = requests.get(url, timeout=10)
    r.raise_for_status()
    return Image.open(BytesIO(r.content)).convert("RGB")

def is_blurry(image, threshold=100):
    gray = cv2.cvtColor(np.array(image), cv2.COLOR_RGB2GRAY)
    variance = cv2.Laplacian(gray, cv2.CV_64F).var()
    return variance < threshold

def predict_bfm(image):
    image = image.resize((224, 224))
    img_array = np.array(image) / 255.0
    img_array = np.expand_dims(img_array, axis=0)
    prob = model.predict(img_array)[0][0]
    return prob

@app.route('/analyze', methods=['POST'])
def analyze():
    data = request.get_json()

    if "image_url" not in data:
        return jsonify({"valid": False, "reason": "IMAGE_URL_MISSING"}), 400

    try:
        image = download_image(data["image_url"])

        if is_blurry(image):
            return jsonify({"valid": False, "reason": "IMAGE_BLURRY"})

        prob = predict_bfm(image)

        if prob < 0.7:
            return jsonify({"valid": False, "reason": "NOT_BFM_IMAGE"})

        return jsonify({"valid": True, "reason": "OK"})

    except Exception:
        return jsonify({"valid": False, "reason": "PROCESSING_FAILED"}), 500


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)