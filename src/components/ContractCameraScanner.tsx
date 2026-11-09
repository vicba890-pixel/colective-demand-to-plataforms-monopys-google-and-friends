import React, { useState, useRef, useEffect } from 'react';
import {
  Camera,
  Upload,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  X,
  ScanText,
  FileImage,
  SwitchCamera
} from 'lucide-react';
import { AbusiveClausePattern } from '../data/legalArchiveData';

interface ContractCameraScannerProps {
  onScanComplete: (extractedText: string, aiPattern?: AbusiveClausePattern) => void;
}

export default function ContractCameraScanner({ onScanComplete }: ContractCameraScannerProps) {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [streamActive, setStreamActive] = useState<boolean>(false);
  const [facingMode, setFacingMode] = useState<'environment' | 'user'>('environment');
  const [capturedDataUrl, setCapturedDataUrl] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const stopCameraStream = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    setStreamActive(false);
  };

  const startCameraStream = async (preferredFacing: 'environment' | 'user' = facingMode) => {
    setErrorMsg(null);
    setCapturedDataUrl(null);
    stopCameraStream();

    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      setErrorMsg(
        'Su navegador no permite acceso directo a la cámara en este contexto. Utilice la opción "Subir Fotografía de Contrato" para escanear un documento físico.'
      );
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: { ideal: preferredFacing },
          width: { ideal: 1920 },
          height: { ideal: 1080 }
        },
        audio: false
      });

      streamRef.current = stream;
      setStreamActive(true);
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }
    } catch (err: any) {
      console.error('Error al acceder a la cámara:', err);
      setErrorMsg(
        'No se pudo iniciar la cámara del dispositivo (permiso denegado o cámara no disponible). Puede capturar o seleccionar una fotografía del contrato desde su dispositivo.'
      );
    }
  };

  useEffect(() => {
    return () => {
      stopCameraStream();
    };
  }, []);

  const handleToggleScannerPanel = () => {
    if (isOpen) {
      stopCameraStream();
      setIsOpen(false);
    } else {
      setIsOpen(true);
      startCameraStream('environment');
    }
  };

  const handleSwitchCamera = () => {
    const nextFacing = facingMode === 'environment' ? 'user' : 'environment';
    setFacingMode(nextFacing);
    startCameraStream(nextFacing);
  };

  const handleCaptureFrame = () => {
    if (!videoRef.current || !canvasRef.current) return;
    const video = videoRef.current;
    const canvas = canvasRef.current;

    const width = video.videoWidth || 1280;
    const height = video.videoHeight || 720;
    canvas.width = width;
    canvas.height = height;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.drawImage(video, 0, 0, width, height);
    const dataUrl = canvas.toDataURL('image/jpeg', 0.9);
    setCapturedDataUrl(dataUrl);
    stopCameraStream();
    processDocumentImage(dataUrl, 'image/jpeg');
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setErrorMsg(null);
    stopCameraStream();

    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      setCapturedDataUrl(result);
      processDocumentImage(result, file.type || 'image/jpeg');
    };
    reader.onerror = () => {
      setErrorMsg('No se pudo leer el archivo de imagen seleccionado.');
    };
    reader.readAsDataURL(file);
  };

  const processDocumentImage = async (dataUrl: string, mimeType: string) => {
    setIsProcessing(true);
    setErrorMsg(null);
    setStatusMessage('Extrayendo texto legal y auditando cláusulas del documento capturado...');

    try {
      const response = await fetch('/api/ocr-contract', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          imageBase64: dataUrl,
          mimeType
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Error al procesar el documento legal.');
      }

      const extractedText = (data.extractedText || '').trim();
      if (!extractedText) {
        throw new Error('No se detectó texto legible en la fotografía capturada. Intente con mayor iluminación.');
      }

      const validCategories: AbusiveClausePattern['category'][] = [
        'Exención de Responsabilidad',
        'Arbitraje Forzoso',
        'Modificación Unilateral',
        'Publicidad Engañosa',
        'Expropiación de Datos'
      ];

      const matchedCategory: AbusiveClausePattern['category'] = validCategories.includes(data.detectedCategory)
        ? data.detectedCategory
        : 'Exención de Responsabilidad';

      const dynamicPattern: AbusiveClausePattern = {
        id: `ocr-${Date.now()}`,
        title: data.detectedClauseTitle || 'Dictamen Forense sobre Contrato Escaneado',
        category: matchedCategory,
        contractExcerpt: extractedText,
        keywords: [],
        legalFraudAnalysis:
          data.legalFraudAnalysis ||
          'El texto extraído presenta disposiciones unilaterales sujetas a escrutinio por desequilibrio contractual.',
        statutoryPrecedent:
          data.statutoryPrecedent ||
          'FTC Act Sección 5 (15 U.S.C. § 45) y Restatement (Second) of Contracts § 195.',
        criminalCivilLiability:
          data.criminalCivilLiability ||
          'Inoponibilidad de cláusulas exoneratorias frente a dolo o incumplimiento de promesas comerciales.',
        severityScore:
          typeof data.severityScore === 'number'
            ? Math.min(100, Math.max(1, Math.round(data.severityScore)))
            : 90
      };

      onScanComplete(extractedText, dynamicPattern);
      setStatusMessage('Texto extraído e incorporado automáticamente al Auditor de Cláusulas.');
    } catch (err: any) {
      console.error('Error en OCR de contrato:', err);
      setErrorMsg(
        err?.message ||
          'No fue posible completar la extracción óptica. Verifique la nitidez de la foto o intente nuevamente.'
      );
      setStatusMessage(null);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="mb-4">
      {/* Trigger Bar inside the Auditor */}
      <div className="p-4 bg-[#EBE6DF] border border-stone-300 rounded flex flex-wrap items-center justify-between gap-4">
        <div className="space-y-0.5">
          <div className="text-xs font-semibold uppercase tracking-wider text-[#9A3412] flex items-center gap-1.5">
            <ScanText className="w-4 h-4" />
            <span>Escáner Óptico de Contratos Físicos (Cámara y OCR Legal)</span>
          </div>
          <p className="text-xs text-stone-700">
            Capture con su cámara hojas impresas, facturas o contratos físicos para extraer el texto y auditarlo
            automáticamente.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={handleToggleScannerPanel}
            className="px-3.5 py-2 bg-[#9A3412] hover:bg-[#7C2D12] text-white text-xs font-semibold rounded transition-colors flex items-center gap-1.5 whitespace-nowrap shrink-0"
          >
            {isOpen ? <X className="w-3.5 h-3.5" /> : <Camera className="w-3.5 h-3.5" />}
            <span>{isOpen ? 'Cerrar Cámara' : 'Escanear con Cámara'}</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setIsOpen(true);
              fileInputRef.current?.click();
            }}
            className="px-3.5 py-2 bg-stone-900 hover:bg-stone-800 text-white text-xs font-semibold rounded transition-colors flex items-center gap-1.5 whitespace-nowrap shrink-0"
          >
            <Upload className="w-3.5 h-3.5" />
            <span>Subir Foto de Contrato</span>
          </button>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            capture="environment"
            onChange={handleFileUpload}
            className="hidden"
          />
        </div>
      </div>

      {/* Expandable Camera & OCR Workbench */}
      {isOpen && (
        <div className="mt-3 p-5 bg-white border border-stone-300 rounded space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-stone-200 pb-3">
            <div>
              <h4 className="font-editorial text-base font-bold text-stone-900">
                Visor de Captura Documental para Auditoría Forense
              </h4>
              <p className="text-xs text-stone-600">
                Encuadre el párrafo o cláusula del contrato impreso con buena iluminación y presione «Capturar y Extraer
                Texto».
              </p>
            </div>

            <div className="flex items-center gap-2">
              {streamActive && (
                <button
                  type="button"
                  onClick={handleSwitchCamera}
                  className="px-3 py-1.5 border border-stone-300 hover:border-stone-500 text-stone-800 text-xs font-semibold rounded transition-colors flex items-center gap-1.5 whitespace-nowrap shrink-0"
                >
                  <SwitchCamera className="w-3.5 h-3.5" />
                  <span>Cambiar Lente</span>
                </button>
              )}
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="px-3 py-1.5 border border-stone-300 hover:border-stone-500 text-stone-800 text-xs font-semibold rounded transition-colors flex items-center gap-1.5 whitespace-nowrap shrink-0"
              >
                <FileImage className="w-3.5 h-3.5" />
                <span>Elegir Archivo</span>
              </button>
            </div>
          </div>

          {/* Viewport: Video Stream or Captured Snapshot */}
          <div className="relative bg-stone-950 rounded overflow-hidden border border-stone-400 aspect-video max-h-[360px] w-full flex items-center justify-center">
            {streamActive && !capturedDataUrl && (
              <>
                <video
                  ref={videoRef}
                  playsInline
                  muted
                  autoPlay
                  className="w-full h-full object-cover"
                />
                {/* Framing Guides for Legal Document */}
                <div className="pointer-events-none absolute inset-5 border border-dashed border-amber-200/70 rounded flex flex-col justify-between p-3">
                  <div className="text-[11px] font-mono-tabular uppercase tracking-wider text-amber-100 bg-black/60 px-2 py-0.5 rounded self-start">
                    Área de Lectura Óptica de Cláusulas
                  </div>
                  <div className="text-[11px] text-stone-200 bg-black/60 px-2 py-0.5 rounded self-center">
                    Alinee el texto del contrato físico dentro del recuadro
                  </div>
                </div>
              </>
            )}

            {capturedDataUrl && (
              <img
                src={capturedDataUrl}
                alt="Fotografía capturada del contrato físico para extracción de texto"
                referrerPolicy="no-referrer"
                className="w-full h-full object-contain bg-stone-900"
              />
            )}

            {!streamActive && !capturedDataUrl && (
              <div className="p-6 text-center space-y-3 max-w-md">
                <Camera className="w-8 h-8 text-stone-400 mx-auto" />
                <p className="text-xs text-stone-300 leading-relaxed">
                  La vista previa en vivo está detenida o no disponible. Puede activar la cámara nuevamente o cargar una
                  fotografía tomada con su teléfono.
                </p>
                <div className="flex flex-wrap items-center justify-center gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => startCameraStream()}
                    className="px-3.5 py-1.5 bg-[#9A3412] hover:bg-[#7C2D12] text-white text-xs font-semibold rounded transition-colors whitespace-nowrap shrink-0"
                  >
                    Reintentar Cámara
                  </button>
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="px-3.5 py-1.5 bg-stone-800 hover:bg-stone-700 text-white text-xs font-semibold rounded transition-colors whitespace-nowrap shrink-0"
                  >
                    Seleccionar Imagen
                  </button>
                </div>
              </div>
            )}

            {isProcessing && (
              <div className="absolute inset-0 bg-black/75 flex flex-col items-center justify-center p-6 text-center space-y-3">
                <RefreshCw className="w-7 h-7 text-amber-400 animate-spin" />
                <div className="text-sm font-semibold text-white">
                  Digitalizando documento físico y evaluando legalidad...
                </div>
                <p className="text-xs text-stone-300 max-w-sm">
                  Transcribiendo cláusulas impresas y contrastando con precedentes de fraude contractual (FTC Act § 5 y
                  Restatement § 195).
                </p>
              </div>
            )}
          </div>

          <canvas ref={canvasRef} className="hidden" />

          {/* Action Bar below Camera Viewport */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
            <div className="flex flex-wrap items-center gap-2">
              {streamActive && (
                <button
                  type="button"
                  onClick={handleCaptureFrame}
                  disabled={isProcessing}
                  className="px-4 py-2 bg-[#9A3412] hover:bg-[#7C2D12] disabled:opacity-50 text-white text-xs font-semibold rounded transition-colors flex items-center gap-1.5 whitespace-nowrap shrink-0"
                >
                  <Camera className="w-4 h-4" />
                  <span>Capturar y Extraer Texto</span>
                </button>
              )}

              {capturedDataUrl && !isProcessing && (
                <button
                  type="button"
                  onClick={() => startCameraStream()}
                  className="px-4 py-2 bg-stone-900 hover:bg-stone-800 text-white text-xs font-semibold rounded transition-colors flex items-center gap-1.5 whitespace-nowrap shrink-0"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Tomar Nueva Captura</span>
                </button>
              )}
            </div>

            {statusMessage && !errorMsg && (
              <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-800">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>{statusMessage}</span>
              </div>
            )}
          </div>

          {errorMsg && (
            <div className="p-3 bg-red-50 border border-red-300 rounded text-xs text-red-900 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-red-700 shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
