import { useState, useEffect, useRef } from "react";
import { Scanner } from "@yudiel/react-qr-scanner";
import api from "../../api/axios";
import { useNavigate } from "react-router-dom";
import {
  CheckCircle,
  XCircle,
  Loader,
  ArrowLeft,
  Camera,
  AlertCircle,
  RefreshCw,
  ScanLine,
  Zap,
  QrCode,
  Eye,
  EyeOff,
} from "lucide-react";

export default function EnhancedScanner() {
  const [scanResult, setScanResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [paused, setPaused] = useState(false);
  const [cameraError, setCameraError] = useState(false);
  const [isInitializing, setIsInitializing] = useState(true);
  const [lastScanTime, setLastScanTime] = useState(null);
  const [scanCount, setScanCount] = useState(0);
  const [isScanning, setIsScanning] = useState(false);
  const [currentQRData, setCurrentQRData] = useState("");
  const [showQRPreview, setShowQRPreview] = useState(true);
  const [scanHistory, setScanHistory] = useState([]);
  const navigate = useNavigate();

  // Check camera permissions and support on mount
  useEffect(() => {
    const initializeCamera = async () => {
      setIsInitializing(true);
      
      try {
        // Check camera support
        const devices = await navigator.mediaDevices.enumerateDevices();
        const hasCamera = devices.some(device => device.kind === 'videoinput');
        
        if (!hasCamera) {
          setCameraError(true);
          setError("No camera found on this device");
          setIsInitializing(false);
          return;
        }

        // Check camera permissions
        try {
          const permission = await navigator.permissions.query({ name: 'camera' });
          setCameraPermission(permission.state);
          
          if (permission.state === 'denied') {
            setCameraError(true);
            setError("Camera permission denied. Please enable camera access in your browser settings.");
            setIsInitializing(false);
            return;
          }
        } catch (permErr) {
          console.log("Permission API not available, continuing...");
        }

        // Try to access camera
        const stream = await navigator.mediaDevices.getUserMedia({ 
          video: { 
            facingMode: 'environment',
            width: { ideal: 1280 },
            height: { ideal: 720 }
          } 
        });
        console.log("Camera access granted successfully");
        stream.getTracks().forEach(track => track.stop());
        
        setIsInitializing(false);
        
      } catch (err) {
        console.error("Camera initialization failed:", err);
        setCameraError(true);
        
        if (err.name === 'NotAllowedError') {
          setError("Camera permission denied. Please allow camera access to use QR scanner.");
        } else if (err.name === 'NotFoundError') {
          setError("No camera found on this device.");
        } else if (err.name === 'NotReadableError') {
          setError("Camera is already in use by another application.");
        } else {
          setError(`Camera access failed: ${err.message}`);
        }
        setIsInitializing(false);
      }
    };

    initializeCamera();
  }, []);

  /* ---------------- HANDLE SCAN ---------------- */
  const handleScan = async (result) => {
    if (!result || loading || paused) return;

    console.log("Scan result:", result);
    setIsScanning(true);
    setLastScanTime(Date.now());

    // Handle different QR library formats
    let rawValue = null;
    
    if (Array.isArray(result) && result[0]) {
      rawValue = result[0].rawValue;
    } else if (result?.text) {
      rawValue = result.text;
    } else if (result?.rawValue) {
      rawValue = result.rawValue;
    } else if (typeof result === 'string') {
      rawValue = result;
    }

    if (!rawValue) {
      console.log("No raw value found in scan result");
      setIsScanning(false);
      return;
    }

    console.log("Raw QR value:", rawValue);
    setCurrentQRData(rawValue);
    
    let ticketId = rawValue;
    let parsedData = null;

    try {
      parsedData = JSON.parse(rawValue);
      ticketId = parsedData.id || parsedData.ticketId || parsedData.bookingId || rawValue;
    } catch {
      // plain id, use as is
      ticketId = rawValue;
    }

    console.log("Extracted ticket ID:", ticketId);
    setScanCount(prev => prev + 1);
    
    // Add to scan history
    setScanHistory(prev => [
      {
        id: Date.now(),
        data: rawValue,
        parsed: parsedData,
        ticketId: ticketId,
        timestamp: new Date().toLocaleTimeString()
      },
      ...prev.slice(0, 4) // Keep only last 5 scans
    ]);
    
    // Show brief scanning feedback before verification
    setTimeout(() => {
      verifyTicket(ticketId, rawValue, parsedData);
    }, 800);
  };

  /* ---------------- VERIFY TICKET ---------------- */
  const verifyTicket = async (ticketId, rawValue, parsedData) => {
    try {
      setLoading(true);
      setPaused(true);
      setError(null);
      setScanResult(null);

      console.log("Verifying ticket with ID:", ticketId);
      const { data } = await api.get(`/bookings/verify/${ticketId}`);
      console.log("Verification response:", data);

      setScanResult({
        ...data.booking,
        scannedData: rawValue,
        parsedData: parsedData
      });
      setIsScanning(false);
    } catch (err) {
      console.error("Verification error:", err);
      const errorMessage = err.response?.data?.message || "Invalid Ticket";
      setError(errorMessage);
      setIsScanning(false);
      
      // Still show what we scanned even if verification failed
      setScanResult({
        scannedData: rawValue,
        parsedData: parsedData,
        verificationFailed: true,
        error: errorMessage
      });
    } finally {
      setLoading(false);
    }
  };

  const resetScanner = () => {
    setScanResult(null);
    setError(null);
    setPaused(false);
    setIsScanning(false);
    setLastScanTime(null);
    setCurrentQRData("");
  };

  const retryCamera = () => {
    setCameraError(false);
    setError(null);
    setIsInitializing(true);
    // Re-trigger camera initialization
    window.location.reload();
  };

  if (isInitializing) {
    return (
      <div className="max-w-xl mx-auto p-6">
        <div className="flex items-center gap-3 mb-6">
          <button
            onClick={() => navigate("/organizer/dashboard")}
            className="p-2 rounded-lg bg-gray-200 hover:bg-gray-300"
          >
            <ArrowLeft size={18} />
          </button>
          <h1 className="text-2xl font-bold text-gray-800">
            Enhanced QR Scanner
          </h1>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-8 text-center">
          <Loader className="animate-spin text-blue-600 mx-auto mb-4" size={48} />
          <h2 className="text-lg font-semibold text-blue-800 mb-2">
            Initializing Camera...
          </h2>
          <p className="text-blue-700">
            Please allow camera access when prompted
          </p>
        </div>
      </div>
    );
  }

  if (cameraError) {
    return (
      <div className="max-w-xl mx-auto p-6">
        <div className="flex items-center gap-3 mb-6">
          <button
            onClick={() => navigate("/organizer/dashboard")}
            className="p-2 rounded-lg bg-gray-200 hover:bg-gray-300"
          >
            <ArrowLeft size={18} />
          </button>
          <h1 className="text-2xl font-bold text-gray-800">
            Enhanced QR Scanner
          </h1>
        </div>

        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <AlertCircle className="mx-auto text-red-600 mb-3" size={48} />
          <h2 className="text-lg font-semibold text-red-800 mb-2">
            Camera Access Failed
          </h2>
          <p className="text-red-700 mb-4">
            {error || "Unable to access camera."}
          </p>
          
          <div className="space-y-3">
            <button
              onClick={retryCamera}
              className="w-full bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 flex items-center justify-center gap-2"
            >
              <RefreshCw size={16} />
              Retry Camera Access
            </button>
            
            <button
              onClick={() => navigate("/organizer/permission-help")}
              className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
            >
              Get Help with Permissions
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">

      {/* Header with Stats */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate("/organizer/dashboard")}
            className="p-2 rounded-lg bg-gray-200 hover:bg-gray-300"
          >
            <ArrowLeft size={18} />
          </button>
          <h1 className="text-2xl font-bold text-gray-800">
            Enhanced QR Scanner
          </h1>
        </div>
        
        <div className="flex items-center gap-4">
          {scanCount > 0 && (
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <ScanLine size={16} />
              <span>{scanCount} scanned</span>
            </div>
          )}
          
          <button
            onClick={() => setShowQRPreview(!showQRPreview)}
            className="flex items-center gap-2 text-sm bg-gray-200 px-3 py-1 rounded-lg hover:bg-gray-300"
          >
            {showQRPreview ? <EyeOff size={16} /> : <Eye size={16} />}
            {showQRPreview ? 'Hide' : 'Show'} Preview
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Camera Section */}
        <div>
          {/* Camera Box */}
          {!scanResult && !error && (
            <div className="bg-black rounded-2xl overflow-hidden shadow-lg relative">

              {/* Scanning Feedback Overlay */}
              {isScanning && (
                <div className="absolute inset-0 bg-green-500/20 flex flex-col items-center justify-center z-10">
                  <div className="bg-green-500 rounded-full p-4 mb-3 animate-pulse">
                    <Zap className="text-white" size={24} />
                  </div>
                  <p className="text-white font-semibold text-lg">QR Code Detected!</p>
                  <p className="text-white/80 text-sm">Analyzing content...</p>
                </div>
              )}

              {/* Loading Overlay */}
              {loading && !isScanning && (
                <div className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center z-10">
                  <Loader className="animate-spin text-red-500 w-10 h-10 mb-3" />
                  <p className="text-white font-semibold">Verifying Ticket...</p>
                </div>
              )}

              {/* Scanner */}
              <Scanner
                onScan={handleScan}
                paused={paused}
                components={{ audio: false, torch: true, finder: false }}
                styles={{ 
                  container: { width: "100%", height: "400px" },
                  video: { width: "100%", height: "100%", objectFit: "cover" }
                }}
                onError={(error) => {
                  console.error("Scanner error:", error);
                  setCameraError(true);
                  setError("Camera scanner failed to initialize");
                }}
                constraints={{
                  video: {
                    facingMode: 'environment',
                    width: { ideal: 1280 },
                    height: { ideal: 720 }
                  }
                }}
              />

              {/* Enhanced Overlay Frame */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="relative">
                  {/* Main scanning frame */}
                  <div className={`w-64 h-64 border-2 ${isScanning ? 'border-green-500 animate-pulse' : 'border-red-500'} rounded-xl transition-all duration-300`}></div>
                  
                  {/* Scanning line animation */}
                  {isScanning && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-full h-0.5 bg-green-500 animate-pulse"></div>
                    </div>
                  )}
                  
                  {/* Corner indicators */}
                  <div className="absolute -top-2 -left-2 w-6 h-6 border-t-4 border-l-4 border-red-500 rounded-tl-lg"></div>
                  <div className="absolute -top-2 -right-2 w-6 h-6 border-t-4 border-r-4 border-red-500 rounded-tr-lg"></div>
                  <div className="absolute -bottom-2 -left-2 w-6 h-6 border-b-4 border-l-4 border-red-500 rounded-bl-lg"></div>
                  <div className="absolute -bottom-2 -right-2 w-6 h-6 border-b-4 border-r-4 border-red-500 rounded-br-lg"></div>
                </div>
              </div>

              {/* Live Status Indicator */}
              <div className="absolute top-4 right-4 flex items-center gap-2 bg-black/50 rounded-full px-3 py-1">
                <div className={`w-2 h-2 rounded-full ${isScanning ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`}></div>
                <span className="text-white text-xs">
                  {isScanning ? 'Scanning' : 'Ready'}
                </span>
              </div>

              {/* Last Scan Time */}
              {lastScanTime && (
                <div className="absolute bottom-4 left-4 text-white text-xs bg-black/50 rounded px-2 py-1">
                  Last scan: {new Date(lastScanTime).toLocaleTimeString()}
                </div>
              )}
            </div>
          )}

          {/* Enhanced Helper Text */}
          {!scanResult && !error && (
            <div className="mt-4 text-center space-y-2">
              <p className="text-gray-600 flex items-center justify-center gap-2">
                <Camera size={16} />
                {isScanning ? 'QR Code detected! Analyzing...' : 'Position QR code within the frame'}
              </p>
              <p className="text-xs text-gray-500">
                {isScanning ? 'Please wait while we analyze the QR code content' : 'Make sure the QR code is well-lit and clearly visible'}
              </p>
              {scanCount > 0 && (
                <p className="text-xs text-green-600 font-medium">
                  ✓ {scanCount} QR code{scanCount > 1 ? 's' : ''} scanned successfully
                </p>
              )}
            </div>
          )}

          {/* Scan History */}
          {scanHistory.length > 0 && !scanResult && !error && (
            <div className="mt-4 bg-gray-50 rounded-lg p-4">
              <h3 className="text-sm font-semibold text-gray-700 mb-2">Recent Scans:</h3>
              <div className="space-y-1">
                {scanHistory.map((scan) => (
                  <div key={scan.id} className="text-xs text-gray-600 flex justify-between">
                    <span className="truncate mr-2">{scan.data}</span>
                    <span>{scan.timestamp}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* QR Data Preview Section */}
        <div>
          {showQRPreview && (
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <QrCode size={20} />
                QR Code Content
              </h3>
              
              {currentQRData ? (
                <div className="space-y-4">
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Raw Data:</h4>
                    <div className="bg-gray-100 p-3 rounded text-sm font-mono break-all">
                      {currentQRData}
                    </div>
                  </div>
                  
                  {(() => {
                    try {
                      const parsed = JSON.parse(currentQRData);
                      return (
                        <div>
                          <h4 className="text-sm font-medium text-gray-700 mb-2">Parsed Data:</h4>
                          <div className="bg-blue-50 p-3 rounded text-sm">
                            <pre className="whitespace-pre-wrap">{JSON.stringify(parsed, null, 2)}</pre>
                          </div>
                        </div>
                      );
                    } catch {
                      return null;
                    }
                  })()}
                  
                  <div className="text-xs text-gray-500">
                    Scanned at: {lastScanTime ? new Date(lastScanTime).toLocaleTimeString() : 'Waiting...'}
                  </div>
                </div>
              ) : (
                <div className="text-center text-gray-500 py-8">
                  <QrCode size={48} className="mx-auto mb-3 text-gray-300" />
                  <p>Waiting for QR code scan...</p>
                  <p className="text-xs mt-1">Point camera at a QR code to see its content here</p>
                </div>
              )}
            </div>
          )}

          {/* SUCCESS CARD */}
          {scanResult && (
            <div className="bg-white shadow-lg rounded-2xl p-6 text-center">

              <CheckCircle className="mx-auto text-green-600 mb-3" size={50} />

              <h2 className="text-xl font-bold text-green-700">
                {scanResult.verificationFailed ? 'QR Code Scanned' : 'Ticket Verified'}
              </h2>

              <div className="bg-gray-50 p-4 rounded-xl mt-4 text-left space-y-3">
                <div>
                  <span className="font-semibold">Scanned Data:</span>
                  <div className="bg-white p-2 rounded mt-1 text-xs font-mono break-all">
                    {scanResult.scannedData}
                  </div>
                </div>
                
                {scanResult.parsedData && (
                  <div>
                    <span className="font-semibold">Parsed Content:</span>
                    <div className="bg-blue-50 p-2 rounded mt-1 text-xs">
                      <pre>{JSON.stringify(scanResult.parsedData, null, 2)}</pre>
                    </div>
                  </div>
                )}
                
                {!scanResult.verificationFailed && (
                  <>
                    <p><span className="font-semibold">Guest:</span> {scanResult.guestName}</p>
                    <p><span className="font-semibold">Event:</span> {scanResult.eventName}</p>
                    <p><span className="font-semibold">Tickets:</span> {scanResult.quantity}</p>

                    {scanResult.isVip && (
                      <span className="inline-block mt-2 px-3 py-1 bg-yellow-100 text-yellow-700 rounded-lg text-sm font-semibold">
                        VIP
                      </span>
                    )}
                  </>
                )}
                
                {scanResult.verificationFailed && (
                  <div className="bg-red-50 p-3 rounded">
                    <p className="text-red-700 text-sm">
                      <span className="font-semibold">Verification Error:</span> {scanResult.error}
                    </p>
                  </div>
                )}
              </div>

              <div className="mt-6 space-y-2">
                <button
                  onClick={resetScanner}
                  className="w-full bg-black text-white py-3 rounded-lg font-semibold hover:bg-gray-800"
                >
                  Scan Next QR Code
                </button>
                
                <button
                  onClick={() => navigate("/organizer/qr-test")}
                  className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700"
                >
                  Generate Test QR Code
                </button>
              </div>
            </div>
          )}

          {/* ERROR CARD */}
          {error && (
            <div className="bg-white shadow-lg rounded-2xl p-6 text-center">

              <XCircle className="mx-auto text-red-600 mb-3" size={50} />

              <h2 className="text-xl font-bold text-red-600">
                Scanning Error
              </h2>

              <p className="text-gray-500 mt-2">{error}</p>

              <div className="mt-6 space-y-2">
                <button
                  onClick={resetScanner}
                  className="w-full bg-red-600 text-white py-3 rounded-lg font-semibold hover:bg-red-700"
                >
                  Try Again
                </button>
                
                <button
                  onClick={() => navigate("/organizer/qr-test")}
                  className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700"
                >
                  Generate Test QR Code
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
