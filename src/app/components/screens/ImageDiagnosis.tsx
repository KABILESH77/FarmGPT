import { useState, useRef } from "react";
import { useNavigate } from "react-router";
import { Camera, Upload, Leaf, MapPin, Phone, CheckCircle, AlertTriangle, X } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

export function ImageDiagnosis() {
  const navigate = useNavigate();
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<any>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;
    
    processFile(selectedFile);
  };

  const processFile = async (file: File) => {
    const previewUrl = URL.createObjectURL(file);
    setSelectedImage(previewUrl);
    setFile(file);
    setIsAnalyzing(true);
    setShowResult(false);

    try {
      const formData = new FormData();
      formData.append("file", file);

      // We will create the python backend on port 5000
      const response = await fetch("http://localhost:5000/predict", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        setAnalysisResult(data);
      } else {
        console.error("Failed to fetch prediction");
        // Fallback or error handling
      }
    } catch (error) {
      console.error("Error connecting to backend", error);
    } finally {
      setIsAnalyzing(false);
      setShowResult(true);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const droppedFile = e.dataTransfer.files?.[0];
    if (droppedFile && droppedFile.type.startsWith("image/")) {
      processFile(droppedFile);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleReset = () => {
    setSelectedImage(null);
    setFile(null);
    setIsAnalyzing(false);
    setShowResult(false);
    setAnalysisResult(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto">
      <div className="grid lg:grid-cols-2 gap-8 items-start">
        {/* Left: Upload Area */}
        <div>
          <h2 className="text-[var(--farmgpt-text-primary)] mb-2" style={{ fontSize: "1.25rem", fontWeight: 700 }}>
            Upload Crop Image
          </h2>
          <p className="text-[var(--farmgpt-text-secondary)] mb-6" style={{ fontSize: "0.875rem" }}>
            Take a clear photo of the affected leaves or plant. Our AI will analyze and identify any diseases.
          </p>

          <AnimatePresence mode="wait">
            {!selectedImage ? (
              <motion.div
                key="upload"
                initial={{ opacity: 0, scale: 0.97 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.97 }}
                transition={{ duration: 0.3 }}
                className="bg-white rounded-3xl border-2 border-dashed border-[var(--farmgpt-primary-green)] flex flex-col items-center justify-center p-16 min-h-[400px] hover:bg-[var(--farmgpt-surface-green)]/30 transition-colors cursor-pointer group"
                onClick={handleUploadClick}
                onDrop={handleDrop}
                onDragOver={handleDragOver}
              >
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                />
                <div className="w-24 h-24 bg-[var(--farmgpt-surface-green)] rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <Leaf size={48} className="text-[var(--farmgpt-primary-green)]" />
                </div>
                <h3 className="text-[var(--farmgpt-text-primary)] mb-2" style={{ fontSize: "1.25rem", fontWeight: 600 }}>
                  Drop image here or click to upload
                </h3>
                <p className="text-[var(--farmgpt-text-secondary)] text-center mb-8" style={{ fontSize: "0.875rem" }}>
                  Supports JPG, PNG, HEIC · Max 10MB
                </p>
                <div className="flex gap-4">
                  <button
                    onClick={(e) => { e.stopPropagation(); handleUploadClick(); }}
                    className="flex items-center gap-2 px-6 py-3 bg-[var(--farmgpt-primary-green)] text-white rounded-full hover:opacity-90 transition-opacity"
                  >
                    <Camera size={20} />
                    <span>Take Photo</span>
                  </button>
                  <button
                    onClick={(e) => { e.stopPropagation(); handleUploadClick(); }}
                    className="flex items-center gap-2 px-6 py-3 bg-[var(--farmgpt-surface-green)] text-[var(--farmgpt-primary-green)] rounded-full hover:opacity-90 transition-opacity"
                  >
                    <Upload size={20} />
                    <span>Upload File</span>
                  </button>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="preview"
                initial={{ opacity: 0, scale: 0.97 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.97 }}
                transition={{ duration: 0.3 }}
                className="bg-white rounded-3xl overflow-hidden shadow-lg"
              >
                {/* Image Preview */}
                <div className="relative aspect-video bg-gray-100 flex items-center justify-center overflow-hidden">
                  <img src={selectedImage} alt="Crop preview" className="w-full h-full object-cover" />
                  <button
                    onClick={handleReset}
                    className="absolute top-3 right-3 w-9 h-9 bg-white/90 rounded-full flex items-center justify-center hover:bg-white transition-colors shadow-md"
                  >
                    <X size={18} className="text-[var(--farmgpt-text-secondary)]" />
                  </button>
                  {isAnalyzing && (
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                      <div className="text-center text-white">
                        <div className="w-12 h-12 border-4 border-white border-t-transparent rounded-full animate-spin mx-auto mb-3" />
                        <p style={{ fontSize: "0.9rem" }}>Analyzing image...</p>
                      </div>
                    </div>
                  )}
                </div>

                <div className="p-5">
                  <div className="flex items-center gap-2 text-[var(--farmgpt-text-secondary)]" style={{ fontSize: "0.8rem" }}>
                    <CheckCircle size={14} className="text-green-600" />
                    <span>Image uploaded successfully · Processing with AI vision model</span>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Tips */}
          <div className="mt-6 bg-[var(--farmgpt-surface-green)] rounded-2xl p-5">
            <h4 className="text-[var(--farmgpt-primary-green)] mb-3" style={{ fontSize: "0.9rem", fontWeight: 600 }}>
              📸 Tips for Better Results
            </h4>
            <ul className="space-y-2">
              {[
                "Capture the affected leaves clearly in natural light",
                "Include both healthy and diseased portions",
                "Avoid blurry or shadowed images",
                "Close-up shots give better accuracy",
              ].map((tip, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="text-[var(--farmgpt-primary-green)] mt-0.5">•</span>
                  <span className="text-[var(--farmgpt-text-secondary)]" style={{ fontSize: "0.8rem" }}>{tip}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Right: Results */}
        <div>
          <h2 className="text-[var(--farmgpt-text-primary)] mb-2" style={{ fontSize: "1.25rem", fontWeight: 700 }}>
            Diagnosis Results
          </h2>
          <p className="text-[var(--farmgpt-text-secondary)] mb-6" style={{ fontSize: "0.875rem" }}>
            AI-powered analysis with treatment recommendations
          </p>

          <AnimatePresence mode="wait">
            {!showResult ? (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="bg-white rounded-3xl flex flex-col items-center justify-center p-16 min-h-[400px] border border-[var(--border)]"
              >
                <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                  <AlertTriangle size={32} className="text-gray-300" />
                </div>
                <p className="text-[var(--farmgpt-text-secondary)] text-center" style={{ fontSize: "0.9rem" }}>
                  Upload an image to see diagnosis results
                </p>
              </motion.div>
            ) : (
              <motion.div
                key="result"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="space-y-5"
              >
                {/* Main Result Card */}
                <div className="bg-white rounded-3xl p-6 shadow-lg">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-[var(--farmgpt-text-primary)]" style={{ fontSize: "1.25rem", fontWeight: 700 }}>
                        {analysisResult?.disease || "Tomato Leaf Curl Virus"}
                      </h3>
                      <p className="text-[var(--farmgpt-text-secondary)]" style={{ fontSize: "0.875rem" }}>
                        {analysisResult?.category || "Begomovirus · Whitefly transmitted"}
                      </p>
                    </div>
                    <span className="px-3 py-1 bg-red-50 text-red-700 rounded-full" style={{ fontSize: "0.8rem", fontWeight: 600 }}>
                      {analysisResult?.severity || "Severe"}
                    </span>
                  </div>

                  {/* Confidence */}
                  <div className="mb-5">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[var(--farmgpt-text-secondary)]" style={{ fontSize: "0.8rem" }}>Confidence Score</span>
                      <span className="text-[var(--farmgpt-primary-green)]" style={{ fontSize: "0.875rem", fontWeight: 600 }}>
                        {analysisResult?.confidence ? `${(analysisResult.confidence * 100).toFixed(0)}%` : "87%"}
                      </span>
                    </div>
                    <div className="w-full h-2.5 bg-gray-100 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: analysisResult?.confidence ? `${analysisResult.confidence * 100}%` : "87%" }}
                        transition={{ delay: 0.3, duration: 0.8, ease: "easeOut" }}
                        className="h-full bg-[var(--farmgpt-primary-green)] rounded-full"
                      />
                    </div>
                  </div>

                  {/* Symptoms */}
                  <div className="bg-[var(--farmgpt-surface-green)] rounded-2xl p-4 mb-4">
                    <p className="text-[var(--farmgpt-primary-green)] mb-2" style={{ fontSize: "0.8rem", fontWeight: 600 }}>
                      Detected Symptoms
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {(analysisResult?.symptoms || ["Leaf curling", "Yellowing", "Stunted growth", "Vein thickening"]).map((s: string) => (
                        <span key={s} className="px-2.5 py-1 bg-white rounded-full text-[var(--farmgpt-text-primary)]" style={{ fontSize: "0.75rem" }}>
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                  {/* Treatment */}
                  <div className="bg-white rounded-2xl p-5 shadow-sm">
                    <h4 className="text-[var(--farmgpt-text-primary)] mb-4" style={{ fontSize: "0.95rem", fontWeight: 700 }}>
                      Recommended Treatment
                    </h4>
                    <div className="space-y-3">
                      {(analysisResult?.treatments || [
                        "Remove and destroy all infected plants immediately",
                        "Spray Imidacloprid 17.8% SL @ 0.3 ml/liter to control whitefly vectors",
                        "Use yellow sticky traps around the field",
                        "Apply micronutrient foliar spray to boost plant immunity",
                      ]).map((step: string, i: number) => (
                        <div key={i} className="flex gap-3">
                          <div className="w-6 h-6 bg-[var(--farmgpt-primary-green)] rounded-full text-white flex items-center justify-center shrink-0 mt-0.5"
                            style={{ fontSize: "0.75rem", fontWeight: 600 }}>
                            {i + 1}
                          </div>
                          <p className="text-[var(--farmgpt-text-secondary)]" style={{ fontSize: "0.85rem", lineHeight: 1.6 }}>{step}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                {/* Actions */}
                <div className="grid grid-cols-2 gap-3">
                  <button className="flex items-center justify-center gap-2 p-4 bg-white rounded-2xl border border-[var(--border)] hover:border-[var(--farmgpt-primary-green)] hover:shadow-md transition-all">
                    <MapPin size={18} className="text-[var(--farmgpt-primary-green)]" />
                    <span className="text-[var(--farmgpt-text-primary)]" style={{ fontSize: "0.875rem" }}>Nearby Agri Shops</span>
                  </button>
                  <button
                    onClick={() => navigate("/app/agri-officer")}
                    className="flex items-center justify-center gap-2 p-4 bg-[var(--farmgpt-accent-amber)] rounded-2xl hover:opacity-90 transition-opacity"
                  >
                    <Phone size={18} className="text-white" />
                    <span className="text-white" style={{ fontSize: "0.875rem", fontWeight: 600 }}>Talk to Expert</span>
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
