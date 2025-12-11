import { useEffect, useState } from "react";
import { X, Smile, Clock, Box, LogIn } from "lucide-react";

const RegisterSuccessModal = ({
  show,
  embeddingResult,
  faceImageUrl,
  onClose,
}) => {
  const [countdown, setCountdown] = useState(10);

  useEffect(() => {
    if (!show) return;

    setCountdown(10);

    const timer = setInterval(() => {
      setCountdown((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(timer);
  }, [show]);

  useEffect(() => {
    if (countdown === 0) {
      onClose?.();
    }
  }, [countdown, onClose]);

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
      {/* Wrapper for centering and max-width control */}
      <div className="w-full max-w-xs mx-4">
        <div className="relative bg-[#1E2E4A] p-6 border border-[#2A4365]/30 rounded-xl shadow-lg">
          <div className="flex flex-col items-center">
            {/* Wajah Preview */}
            {faceImageUrl ? (
              <img
                src={faceImageUrl}
                alt="Wajah terdaftar"
                className="w-24 h-24 mb-6 rounded-full border-2 border-[#D4AF37]/40 object-cover"
              />
            ) : (
              <div className="w-24 h-24 mb-6 rounded-full bg-[#2A4365]/50 flex items-center justify-center border-2 border-dashed border-[#2A4365]">
                <Smile className="w-8 h-8 text-gray-500" />
              </div>
            )}

            {/* Judul & Subjudul */}
            <h5 className="mb-0.5 text-xl font-bold tracking-tight text-white">
              Wajah Terdaftar!
            </h5>
            <span className="text-sm text-gray-400">
              Berhasil disimpan ke sistem
            </span>

            {/* Stats Ringkasan (opsional: bisa disembunyikan jika space terbatas) */}
            {embeddingResult && (
              <div className="w-full mt-4 mb-3 grid grid-cols-2 gap-2 text-center text-xs">
                <div className="bg-[#2A4365]/30 px-3 py-2 rounded-lg">
                  <Box className="w-4 h-4 mx-auto mb-1 text-[#D4AF37]" />
                  <span className="block text-gray-300">
                    {embeddingResult.embedding_dim || 128}D
                  </span>
                </div>
                <div className="bg-[#2A4365]/30 px-3 py-2 rounded-lg">
                  <Clock className="w-4 h-4 mx-auto mb-1 text-[#D4AF37]" />
                  <span className="block text-gray-300">
                    {(embeddingResult.total_time || 0).toFixed(2)}s
                  </span>
                </div>
              </div>
            )}

            {/* Tombol utama */}
            <div className="flex mt-4 gap-3 w-full">
              <button
                onClick={onClose}
                className="inline-flex items-center justify-center flex-1 text-white bg-[#D4AF37] hover:bg-[#C19C30] border border-transparent hover:shadow-md transition-all duration-200 font-medium rounded-lg text-sm px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/50"
              >
                <LogIn className="w-4 h-4 me-1.5 -ms-0.5" />
                Lanjut ke Login
              </button>
            </div>

            {/* Countdown & Progress Indicator (small) */}
            <div className="mt-4 flex flex-col items-center">
              <p className="text-xs text-gray-400 mb-1">
                Otomatis tutup dalam {countdown}s
              </p>
              <div className="w-full h-1.5 bg-[#2A4365] rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#D4AF37] rounded-full transition-all duration-1000 ease-linear"
                  style={{ width: `${((10 - countdown) / 10) * 100}%` }}
                />
              </div>
            </div>

            {/* Tombol Close (top-right) */}
            <button
              onClick={onClose}
              className="absolute top-3 right-3 p-1 text-gray-400 hover:text-white transition-colors rounded-full hover:bg-[#2A4365]/50"
              aria-label="Tutup"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
export default RegisterSuccessModal;
