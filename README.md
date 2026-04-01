# 🌾 FarmGPT - The Digital Krishi Officer

FarmGPT is an advanced, AI-powered agricultural assistant engineered specifically for farmers in Kerala, India. Functioning as a full-fledged "Digital Krishi Officer," it bridges the gap between traditional farming and modern technology by providing real-time, context-aware agricultural advisory, machine-learning-based disease diagnosis, and multilingual voice support.

## ✨ Core Features

- **🤖 Digital Krishi Officer (Chatbot):** Powered by Groq's blindingly fast Llama 3.3 70B model. The assistant maintains conversation memory and leverages localized knowledge (seasonality, Thrissur crop calendars, pest advisories, and AIMS Kerala government schemes).
- **🗣️ Multilingual Voice Engine (STT/TTS):** Speak to the app directly! FarmGPT uses native Web Speech APIs for Speech-to-Text and Text-to-Speech, allowing farmers to interact seamlessly in English, Malayalam, and Tamil without touching a keyboard.
- **🔬 AI Crop Disease Diagnosis:** A lightweight Flask microservice running a trained Keras/TensorFlow Computer Vision model (`plantdoc_optimized_v2.keras`). Upload a photo of a leaf, and the AI instantly categorizes it across 28 specialized crop diseases, providing severity and specific treatment recommendations.
- **🌐 Universal Real-time Translation:** Powered by the Google Gemini API, the entire React application interface auto-translates to localized languages locally with built-in caching and retry fallbacks.
- **🚨 Smart Escalation Matrix:** If the AI advisor encounters an unknown or complex physical symptom, it automatically triggers an escalation protocol, prompting the farmer to connect directly with human officers at the Krishibhavan.

## 🛠️ Technology Stack

| Component | Technology |
|--------------|-------------|
| **Frontend UI** | React 18, Vite, TypeScript, Tailwind CSS, Framer Motion |
| **Backend AI** | Python, Flask, TensorFlow & Keras (Computer Vision) |
| **LLM Engine** | Groq API (`llama-3.3-70b-versatile`) |
| **Translation** | Google AI Studio (Gemini 2.5 Flash) |
| **Voice Audio** | Browser Native Web Speech API (Free STT & TTS) |

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+)
- Python 3.9+
- API Keys for Google Gemini & Groq (Free tiers available)

### 1. Frontend Setup
```bash
# Clone the repository
git clone https://github.com/KABILESH77/FarmGPT.git
cd FarmGPT

# Install Dependencies
npm install

# Setup Environment Variables
cp .env.example .env
# Edit the .env file and paste in your Groq and Google AI API keys

# Start the Vite Dev Server
npm run dev
```
The Frontend is now running at `http://localhost:5173`.

### 2. Backend Setup (For Image Disease Diagnosis)

> **Important:** Ensure that the `plantdoc_optimized_v2.keras` model file and `plantdoc_class_names.json` map are placed inside the `backend/models/` folder before starting the server.
```bash
# Open a new terminal and navigate to the backend folder
cd backend

# Create a virtual environment (Recommended)
python -m venv venv
# Activate it (Windows)
venv\Scripts\activate
# Activate it (Mac/Linux)
source venv/bin/activate

# Install Python ML requirements
pip install -r requirements.txt

# Run the Flask endpoint
python app.py
```
The Python Backend will spin up at `http://localhost:5000` waiting for image payloads from the frontend.

## 📱 Project Implementation Details
This project was strictly designed for high accessibility in low-tech rural regions.
- **Dynamic Localization**: React Context wrappers force language consistency across every single pixel flawlessly.
- **Bypass Browser Restrictions**: The Native Voice engine implements robust caching and blessing queues to sidestep strict iOS and Chrome auto-play bans natively without servers.
- **Stateless Inference**: The ML backend stays at zero load until an image is streamed, ensuring cheap server deployments.

## 📝 License
This project was developed for open-source agricultural assistance.