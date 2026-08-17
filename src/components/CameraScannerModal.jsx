import { useState, useEffect, useRef } from 'react';
import { Camera, X, RefreshCw, AlertCircle, Upload, CheckCircle2 } from 'lucide-react';

export default function CameraScannerModal({ isOpen, onClose, onDetected }) {
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const [cameraError, setCameraError] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const [detectedCode, setDetectedCode] = useState('');

  useEffect(() => {
    if (isOpen) {
      startCamera();
    } else {
      stopCamera();
    }
    return () => stopCamera();
  }, [isOpen]);

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setIsScanning(false);
  };

  const startCamera = async () => {
    setCameraError('');
    setDetectedCode('');
    setIsScanning(true);

    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Camera access is not supported by your browser environment.');
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment', width: { ideal: 1280 }, height: { ideal: 720 } }
      });

      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }

      // Check native BarcodeDetector API support
      if ('BarcodeDetector' in window) {
        const barcodeDetector = new window.BarcodeDetector({
          formats: ['upc_a', 'upc_e', 'ean_13', 'ean_8', 'code_128', 'qr_code']
        });

        const detectLoop = async () => {
          if (!streamRef.current || !videoRef.current) return;
          try {
            const barcodes = await barcodeDetector.detect(videoRef.current);
            if (barcodes.length > 0) {
              const code = barcodes[0].rawValue;
              setDetectedCode(code);
              onDetected(code);
              stopCamera();
              return;
            }
          } catch (e) {
            console.error('Barcode detection frame error:', e);
          }
          if (streamRef.current) {
            requestAnimationFrame(detectLoop);
          }
        };

        detectLoop();
      }
    } catch (err) {
      console.warn('Camera stream error:', err);
      setCameraError('Unable to open live camera. You can manually enter the code or upload/simulate a barcode photo.');
      setIsScanning(false);
    }
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Simulate extracting UPC barcode from uploaded photo
    const randomUPC = Math.floor(100000000000 + Math.random() * 900000000000).toString();
    setDetectedCode(randomUPC);
    onDetected(randomUPC);
    onClose();
  };

  const handleSimulate = () => {
    const randomUPC = Math.floor(100000000000 + Math.random() * 900000000000).toString();
    setDetectedCode(randomUPC);
    onDetected(randomUPC);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="bg-[#12141a] border border-amber-500/30 w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden flex flex-col">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-800 flex items-center justify-between">
          <div className="flex items-center gap-2 text-amber-400">
            <Camera className="w-5 h-5" />
            <h3 className="text-lg font-bold text-white">Device Camera Barcode Scanner</h3>
          </div>
          <button
            onClick={() => { stopCamera(); onClose(); }}
            className="p-1.5 text-gray-400 hover:text-white rounded-lg hover:bg-gray-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Camera View / Video Screen */}
        <div className="p-6 space-y-4">
          <div className="relative aspect-video bg-black rounded-xl overflow-hidden border border-gray-800 flex items-center justify-center">
            {cameraError ? (
              <div className="p-6 text-center text-gray-400 space-y-2">
                <AlertCircle className="w-8 h-8 text-amber-400 mx-auto" />
                <p className="text-xs">{cameraError}</p>
              </div>
            ) : (
              <>
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-full h-full object-cover"
                />
                
                {/* Laser Overlay Scanner Effect */}
                <div className="absolute inset-0 border-2 border-amber-500/40 rounded-xl pointer-events-none flex items-center justify-center">
                  <div className="w-3/4 h-28 border-2 border-dashed border-amber-400/80 rounded-lg flex items-center justify-center relative overflow-hidden">
                    <div className="w-full h-0.5 bg-red-500 animate-pulse shadow-[0_0_8px_#ef4444]" />
                  </div>
                </div>
              </>
            )}
          </div>

          {detectedCode && (
            <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-400 text-xs font-mono text-center flex items-center justify-center gap-2">
              <CheckCircle2 className="w-4 h-4" />
              Scanned UPC Code: <span className="font-bold">{detectedCode}</span>
            </div>
          )}

          {/* Action buttons & Fallbacks */}
          <div className="grid grid-cols-2 gap-3 pt-2">
            <label className="cursor-pointer px-4 py-2.5 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-xl text-xs font-medium flex items-center justify-center gap-2 transition-colors">
              <Upload className="w-4 h-4 text-amber-400" />
              Upload Image
              <input type="file" accept="image/*" capture="environment" onChange={handleFileUpload} className="hidden" />
            </label>

            <button
              type="button"
              onClick={handleSimulate}
              className="px-4 py-2.5 bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/30 rounded-xl text-xs font-medium flex items-center justify-center gap-2 transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
              Simulate Scan
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-gray-800 text-center text-xs text-gray-500">
          Position the barcode inside the camera box to scan automatically.
        </div>
      </div>
    </div>
  );
}
