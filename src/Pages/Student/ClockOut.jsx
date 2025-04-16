import React, { useState } from "react";
import axios from "axios";

const ClockOut = () => {
  const [location, setLocation] = useState("");
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState("");

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("locationClockOut", location);
    formData.append("facePhotoClockOut", file);

    try {
      const response = await axios.post(
        `${API_BASE_URL}/attendance/clock-out/:id`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      setMessage(response.data.msg);
    } catch (error) {
      setMessage(error.response.data.msg || "Terjadi kesalahan");
    }
  };

  return (
    <div className="max-w-md mx-auto p-4">
      <h2 className="text-xl font-semibold mb-4">Clock Out Siswa</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-2">Lokasi Clock Out</label>
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="w-full border border-gray-300 p-2 rounded"
            required
          />
        </div>
        <div>
          <label className="block mb-2">Unggah Foto Wajah</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="w-full border border-gray-300 p-2 rounded"
            required
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-500 text-white p-2 rounded"
        >
          Clock Out
        </button>
        {message && <p className="text-red-500">{message}</p>}
      </form>
    </div>
  );
};

export default ClockOut;
