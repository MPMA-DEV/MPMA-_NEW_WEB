import { useState, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import {
  FileText,
  Image as ImageIcon,
  Download,
  Eye,
  X,
  ZoomIn,
  ZoomOut,
  RotateCw,
  ChevronLeft,
  ChevronRight,
  Printer,
  RefreshCw,
  ExternalLink,
} from "lucide-react";

interface Document {
  id: string;
  name: string;
  type: "pdf" | "image";
  url: string;
  uploadDate: string;
  size: string;
}

interface DocumentViewerProps {
  documents: Document[];
}

export function DocumentViewer({ documents }: DocumentViewerProps) {
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(
    null
  );
  const [zoomLevel, setZoomLevel] = useState(1);
  const [rotation, setRotation] = useState(0);

  // Calculate indices for navigation
  const currentIndex = selectedDocument
    ? documents.findIndex((d) => d.id === selectedDocument.id)
    : -1;
  const hasPrev = currentIndex > 0;
  const hasNext = currentIndex < documents.length - 1 && currentIndex !== -1;

  const handleDocumentClick = (document: Document) => {
    setSelectedDocument(document);
    setZoomLevel(1);
    setRotation(0);
  };

  const handleCloseViewer = useCallback(() => {
    setSelectedDocument(null);
    setZoomLevel(1);
    setRotation(0);
  }, []);

  const handleNext = useCallback(() => {
    if (hasNext) {
      setSelectedDocument(documents[currentIndex + 1]);
      setZoomLevel(1);
      setRotation(0);
    }
  }, [currentIndex, hasNext, documents]);

  const handlePrev = useCallback(() => {
    if (hasPrev) {
      setSelectedDocument(documents[currentIndex - 1]);
      setZoomLevel(1);
      setRotation(0);
    }
  }, [currentIndex, hasPrev, documents]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!selectedDocument) return;

      if (e.key === "Escape") handleCloseViewer();
      if (e.key === "ArrowRight") handleNext();
      if (e.key === "ArrowLeft") handlePrev();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedDocument, handleCloseViewer, handleNext, handlePrev]);

  const handleZoomIn = () => setZoomLevel((prev) => Math.min(prev + 0.25, 3));
  const handleZoomOut = () =>
    setZoomLevel((prev) => Math.max(prev - 0.25, 0.5));
  const handleRotate = () => setRotation((prev) => (prev + 90) % 360);
  const handleReset = () => {
    setZoomLevel(1);
    setRotation(0);
  };

  const handleDownload = (document: Document) => {
    // For data URLs, convert to blob with proper MIME type for correct file extension
    if (document.url.startsWith("data:")) {
      fetch(document.url)
        .then((res) => res.blob())
        .then((blob) => {
          // Extract MIME type from data URL or use document type
          const mimeType = document.url.match(/^data:([^;]+);/)?.[1] ||
            (document.type === "pdf" ? "application/pdf" : "image/jpeg");

          // Ensure filename has correct extension
          let filename = document.name;
          if (document.type === "pdf" && !filename.toLowerCase().endsWith(".pdf")) {
            filename += ".pdf";
          } else if (document.type === "image" && !filename.match(/\.(jpg|jpeg|png|gif|webp)$/i)) {
            const ext = mimeType.split("/")[1] || "jpg";
            filename += `.${ext}`;
          }

          const typedBlob = new Blob([blob], { type: mimeType });
          const blobUrl = URL.createObjectURL(typedBlob);
          const link = window.document.createElement("a");
          link.href = blobUrl;
          link.download = filename;
          link.click();
          URL.revokeObjectURL(blobUrl);
        });
    } else {
      const link = window.document.createElement("a");
      link.href = document.url;
      link.download = document.name;
      link.click();
    }
  };

  const handleOpenNewWindow = (document: Document) => {
    if (document.url.startsWith("data:")) {
      fetch(document.url)
        .then((res) => res.blob())
        .then((blob) => {
          const blobUrl = URL.createObjectURL(blob);
          window.open(blobUrl, "_blank");
        });
    } else {
      window.open(document.url, "_blank");
    }
  };

  const handlePrint = () => {
    if (!selectedDocument) return;

    if (selectedDocument.type === "image") {
      const printWindow = window.open("", "_blank");
      if (printWindow) {
        printWindow.document.write(`
                <html>
                    <head>
                      <title>Print - ${selectedDocument.name}</title>
                      <style>
                        body { margin: 0; display: flex; justify-content: center; align-items: center; height: 100vh; background: #fff; }
                        img { max-width: 100%; max-height: 100%; object-fit: contain; transform: rotate(${rotation}deg); }
                      </style>
                    </head>
                    <body>
                        <img src="${selectedDocument.url}" onload="window.print(); window.close();" />
                    </body>
                </html>
            `);
        printWindow.document.close();
      }
    } else {
      // For PDF, open in new tab for native browser printing
      // Use blob url if possible
      if (selectedDocument.url.startsWith("data:")) {
        fetch(selectedDocument.url)
          .then((res) => res.blob())
          .then((blob) => {
            const blobUrl = URL.createObjectURL(blob);
            const win = window.open(blobUrl, "_blank");
            if (win) {
              // Let browser handle print or user can press print
            }
          });
      } else {
        window.open(selectedDocument.url, "_blank");
      }
    }
  };

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {documents.map((document) => (
          <div
            key={document.id}
            className="group bg-white rounded-xl p-4 border border-gray-200 hover:border-blue-400 hover:shadow-md transition-all cursor-pointer relative overflow-hidden"
            onClick={() => handleDocumentClick(document)}
          >
            <div className="flex items-center justify-between mb-3 relative z-10">
              <div className="flex items-center overflow-hidden">
                <div
                  className={`p-2 rounded-lg mr-3 shrink-0 ${document.type === "pdf"
                    ? "bg-red-50 text-red-500"
                    : "bg-blue-50 text-blue-500"
                    }`}
                >
                  {document.type === "pdf" ? (
                    <FileText className="h-5 w-5" />
                  ) : (
                    <ImageIcon className="h-5 w-5" />
                  )}
                </div>
                <div className="min-w-0">
                  <h3 className="font-medium text-gray-900 text-sm truncate pr-2">
                    {document.name}
                  </h3>
                  <p className="text-xs text-gray-500 truncate">
                    {document.size || "Document"}
                  </p>
                </div>
              </div>
            </div>

            {document.type === "image" && (
              <div className="mb-3 aspect-video bg-gray-50 rounded-lg overflow-hidden border border-gray-100">
                <img
                  src={document.url}
                  alt={document.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
            )}

            {document.type === "pdf" && (
              <div className="mb-3 aspect-video bg-white rounded-lg overflow-hidden border border-gray-100 group-hover:bg-gray-50 transition-colors relative">
                <iframe
                  src={`${document.url}#toolbar=0&navpanes=0&scrollbar=0`}
                  className="w-[200%] h-[200%] border-0 absolute top-0 left-0 scale-50 origin-top-left pointer-events-none select-none"
                  title={document.name}
                />
                <div className="absolute inset-0 bg-transparent z-10" />
              </div>
            )}

            <div className="flex items-center justify-between pt-2 border-t border-gray-50">
              <span className="text-[10px] text-gray-400">
                {new Date(document.uploadDate).toLocaleDateString()}
              </span>
              <div className="flex space-x-2">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleOpenNewWindow(document);
                  }}
                  className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
                  title="Open in New Window"
                >
                  <ExternalLink className="h-3.5 w-3.5" />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDownload(document);
                  }}
                  className="p-1.5 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors"
                  title="Download"
                >
                  <Download className="h-3.5 w-3.5" />
                </button>
                <span className="flex items-center text-xs text-blue-600 font-medium bg-blue-50 px-2 py-1 rounded-full">
                  <Eye className="h-3 w-3 mr-1" /> View
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Document Viewer Modal */}
      {selectedDocument && createPortal(
        <div className="fixed inset-0 z-[100] h-[100dvh] w-screen flex flex-col bg-black/95 backdrop-blur-sm animate-fade-in overflow-hidden">
          {/* Top Bar - Relative in Flex container */}
          <div className="h-16 shrink-0 flex items-center justify-between px-6 bg-black/40 z-50">
            <div className="flex items-center text-white">
              {selectedDocument.type === "pdf" ? (
                <FileText className="h-5 w-5 mr-3 text-red-400" />
              ) : (
                <ImageIcon className="h-5 w-5 mr-3 text-blue-400" />
              )}
              <div>
                <h3 className="font-medium text-sm leading-tight">
                  {selectedDocument.name}
                </h3>
                <p className="text-xs text-gray-400 mt-0.5">
                  {new Date(selectedDocument.uploadDate).toLocaleString()} •{" "}
                  {selectedDocument.size}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => handleOpenNewWindow(selectedDocument)}
                className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-full transition-colors"
                title="Open in New Window"
              >
                <ExternalLink className="h-5 w-5" />
              </button>
              <button
                onClick={handleCloseViewer}
                className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-full transition-colors"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
          </div>

          {/* Main Content Area - Flex Grow with Min Height 0 */}
          <div className="flex-1 min-h-0 relative flex items-center justify-center p-4">
            {/* Navigation Arrows */}
            {hasPrev && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handlePrev();
                }}
                className="absolute left-4 z-40 p-3 text-white/70 hover:text-white bg-black/20 hover:bg-black/50 rounded-full transition-all backdrop-blur-sm"
              >
                <ChevronLeft className="h-8 w-8" />
              </button>
            )}

            {hasNext && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleNext();
                }}
                className="absolute right-4 z-40 p-3 text-white/70 hover:text-white bg-black/20 hover:bg-black/50 rounded-full transition-all backdrop-blur-sm"
              >
                <ChevronRight className="h-8 w-8" />
              </button>
            )}

            {/* Document Content */}
            <div className="w-full h-full flex items-center justify-center overflow-hidden">
              {selectedDocument.type === "image" ? (
                <img
                  src={selectedDocument.url}
                  alt={selectedDocument.name}
                  className="max-w-full max-h-full object-contain transition-transform duration-200 ease-out"
                  style={{
                    transform: `scale(${zoomLevel}) rotate(${rotation}deg)`,
                  }}
                />
              ) : (
                <div className="w-full h-full bg-white rounded-lg overflow-hidden shadow-2xl max-w-5xl">
                  <iframe
                    src={selectedDocument.url}
                    className="w-full h-full border-0"
                    title={selectedDocument.name}
                  />
                </div>
              )}
            </div>
          </div>

          {/* Bottom Control Bar - Relative in Flex container */}
          <div className="h-20 shrink-0 flex items-center justify-center pb-4 px-4 z-50 pointer-events-none">
            <div className="bg-gray-900/90 backdrop-blur-md border border-white/10 rounded-2xl px-4 py-2.5 flex items-center space-x-2 shadow-2xl pointer-events-auto">
              <span className="text-xs text-gray-400 font-medium mr-2 px-2 border-r border-gray-700/50">
                {currentIndex + 1} / {documents.length}
              </span>

              {selectedDocument.type === "image" && (
                <>
                  <button
                    onClick={handleZoomOut}
                    className="p-2 text-gray-300 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                    title="Zoom Out"
                  >
                    <ZoomOut className="h-4 w-4" />
                  </button>
                  <span className="text-xs text-gray-300 w-12 text-center font-mono">
                    {Math.round(zoomLevel * 100)}%
                  </span>
                  <button
                    onClick={handleZoomIn}
                    className="p-2 text-gray-300 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                    title="Zoom In"
                  >
                    <ZoomIn className="h-4 w-4" />
                  </button>
                  <div className="w-px h-4 bg-gray-700 mx-1"></div>
                  <button
                    onClick={handleRotate}
                    className="p-2 text-gray-300 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                    title="Rotate"
                  >
                    <RotateCw className="h-4 w-4" />
                  </button>
                  <button
                    onClick={handleReset}
                    className="p-2 text-gray-300 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                    title="Reset View"
                  >
                    <RefreshCw className="h-4 w-4" />
                  </button>
                  <div className="w-px h-4 bg-gray-700 mx-1"></div>
                </>
              )}

              <button
                onClick={handlePrint}
                className="p-2 text-gray-300 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                title="Print"
              >
                <Printer className="h-4 w-4" />
              </button>
              <button
                onClick={() => handleDownload(selectedDocument)}
                className="p-2 text-blue-400 hover:text-blue-300 hover:bg-blue-500/20 rounded-lg transition-colors"
                title="Download"
              >
                <Download className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}
    </>
  );
}
