import os
import io
import numpy as np
from flask import Flask, request, jsonify
from flask_cors import CORS
from PIL import Image

# Setup Flask
app = Flask(__name__)
CORS(app) # Allow cross-origin requests from React port 3000

# Path to the Keras model located in workspace root
MODEL_PATH = os.path.join(os.path.dirname(__file__), '..', 'trained_plant_disease_model.keras')
TARGET_SIZE = (224, 224) # Fallback size

try:
    # Attempt to load tensorflow
    from tensorflow.keras.models import load_model
    model = load_model(MODEL_PATH)
    print(f"Model loaded successfully from {MODEL_PATH}")
    
    # Attempt to derive input size automatically
    input_shape = model.input_shape
    if input_shape and len(input_shape) >= 3:
        TARGET_SIZE = (input_shape[1], input_shape[2])
except Exception as e:
    print(f"Warning: Could not fully load model on startup! Make sure tensorflow is installed. Error: {e}")
    model = None

# Update these to match your model's actual trained classes
CLASS_NAMES = [
    "Healthy", 
    "Tomato Leaf Curl Virus", 
    "Early Blight", 
    "Late Blight"
]

def preprocess_image(image_bytes):
    img = Image.open(io.BytesIO(image_bytes))
    if img.mode != "RGB":
        img = img.convert("RGB")
    img = img.resize(TARGET_SIZE)
    img_array = np.array(img) / 255.0  # Normalize to [0,1]. Remove or change if your model uses different scaling!
    img_array = np.expand_dims(img_array, axis=0)
    return img_array

@app.route('/predict', methods=['POST'])
def predict():
    if 'file' not in request.files:
        return jsonify({"error": "No file uploaded"}), 400
        
    file = request.files['file']
    if file.filename == '':
        return jsonify({"error": "No file selected"}), 400
        
    try:
        image_bytes = file.read()
        processed_img = preprocess_image(image_bytes)
        
        if model is None:
            # Fallback for when TF isn't installed during testing
            return jsonify({
                "disease": "Model Not Loaded",
                "category": "Error: Check terminal",
                "severity": "Unknown",
                "confidence": 0.0,
                "symptoms": ["Could not run inference. See terminal output for missing libraries."],
                "treatments": ["Run: pip install -r requirements.txt", "Restart backend"]
            })

        prediction = model.predict(processed_img)
        predicted_class_idx = np.argmax(prediction[0])
        confidence = float(np.max(prediction[0]))
        
        predicted_class = CLASS_NAMES[predicted_class_idx] if predicted_class_idx < len(CLASS_NAMES) else f"Class {predicted_class_idx}"
        
        return jsonify({
            "disease": predicted_class,
            "category": "AI Prediction",
            "severity": "High" if confidence > 0.8 else "Medium",
            "confidence": confidence,
            "symptoms": ["Dynamic symptoms go here (e.g., spots, wilting) based on class"], 
            "treatments": ["Dynamic treatments for " + predicted_class] 
        })
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    print("Starting Flask prediction server on port 5000...")
    app.run(port=5000, debug=True)
