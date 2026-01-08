from flask import Flask, request, jsonify
import tensorflow as tf
import numpy as np
import requests
import cv2
from io import BytesIO
from PIL import Image
import sys
import os
import logging
from urllib.parse import urlparse
import ipaddress
import socket

app = Flask(__name__)

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(message)s",
    handlers=[logging.StreamHandler(sys.stdout)]
)
logger = logging.getLogger(__name__)

MODEL_PATH = "bfm_classifier.h5"
model = None

if not os.path.exists(MODEL_PATH):
    logger.critical(f"Model file '{MODEL_PATH}' not found. Please ensure it exists.")
    sys.exit(1)

try:
    model = tf.keras.models.load_model(MODEL_PATH)
except (IOError, OSError, ValueError) as e:
    logger.critical(f"Failed to load model '{MODEL_PATH}': {e}")
    sys.exit(1)

def validate_image_url(url):
    try:
        parsed = urlparse(url)
        if parsed.scheme not in ("http", "https"):
            raise ValueError("URL must use http or https scheme")

        host_ip = socket.gethostbyname(parsed.hostname)
        ip_obj = ipaddress.ip_address(host_ip)
        if ip_obj.is_private or ip_obj.is_loopback or ip_obj.is_reserved or ip_obj.is_multicast:
            raise ValueError("URL resolves to a private or internal IP, not allowed")

        return url
    except Exception as e:
        raise ValueError(f"Invalid image_url: {e}")

def download_image(url):
    try:
        url = validate_image_url(url)
        r = requests.get(url, timeout=10)
        r.raise_for_status()
        return Image.open(BytesIO(r.content)).convert("RGB")
    except Exception as e:
        raise ValueError(f"Failed to download image: {e}")

def is_blurry(image, threshold=100):
    gray = cv2.cvtColor(np.array(image), cv2.COLOR_RGB2GRAY)
    variance = cv2.Laplacian(gray, cv2.CV_64F).var()
    return variance < threshold

def predict_bfm(image):
    try:
        image = image.resize((224, 224))
        img_array = np.array(image) / 255.0
        img_array = np.expand_dims(img_array, axis=0)
        prob = model.predict(img_array)[0][0]
        return prob
    except Exception as e:
        raise ValueError(f"Model prediction failed: {e}")

@app.route('/analyze', methods=['POST'])
def analyze():
    data = request.get_json()

    if not data or "image_url" not in data:
        return jsonify({"valid": False, "reason": "IMAGE_URL_MISSING"}), 400

    try:
        image = download_image(data["image_url"])

        if is_blurry(image):
            return jsonify({"valid": False, "reason": "IMAGE_BLURRY"})

        prob = predict_bfm(image)

        if prob < 0.7:
            return jsonify({"valid": False, "reason": "NOT_BFM_IMAGE"})

        return jsonify({"valid": True, "reason": "OK"})

    except ValueError as ve:
        logger.warning(f"Validation/processing error: {ve}")
        return jsonify({"valid": False, "reason": str(ve)}), 400
    except Exception as e:
        logger.exception(f"Unexpected processing error: {e}")
        return jsonify({"valid": False, "reason": "PROCESSING_FAILED"}), 500


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)
