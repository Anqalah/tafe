import React, { useState } from "react";
import Cropper from "react-easy-crop";
import getCroppedImg from "../../../utils/CropImage";

const CropperModal = ({ isOpen, image, onClose, onCropDone }) => {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedPixels, setCroppedPixels] = useState(null);

  if (!isOpen) return null;

  const handleSave = async () => {
    const blob = await getCroppedImg(image, croppedPixels);

    const file = new File([blob], "cropped_photo.jpg", {
      type: "image/jpeg",
    });

    onCropDone(file);
  };

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-lg p-6 w-full max-w-xl space-y-4">
        <h2 className="text-xl font-semibold text-[#2A4365]">
          Crop Foto Profil
        </h2>

        <div className="relative w-full h-80 bg-black rounded-xl overflow-hidden">
          <Cropper
            image={image}
            crop={crop}
            zoom={zoom}
            aspect={1}
            onCropChange={setCrop}
            onZoomChange={setZoom}
            onCropComplete={(area, pixels) => setCroppedPixels(pixels)}
          />
        </div>

        <div className="flex items-center gap-3">
          <label className="text-sm">Zoom</label>
          <input
            type="range"
            min={1}
            max={3}
            step={0.1}
            value={zoom}
            onChange={(e) => setZoom(e.target.value)}
          />
        </div>

        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl border border-gray-300 text-gray-600 hover:bg-gray-100"
          >
            Batal
          </button>

          <button
            onClick={handleSave}
            className="px-5 py-2 rounded-xl bg-[#D4AF37] text-[#2A4365] font-semibold hover:bg-[#C19C30]"
          >
            Simpan Crop
          </button>
        </div>
      </div>
    </div>
  );
};

export default CropperModal;
