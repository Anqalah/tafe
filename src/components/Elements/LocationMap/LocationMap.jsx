import React, { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

const LocationMap = (props) => {
  const { latitude, longitude, onMapClick } = props;
  const mapRef = useRef(null); // Ref to store the Leaflet map instance

  useEffect(() => {
    // Initialize map only once
    if (!mapRef.current && latitude && longitude) {
      mapRef.current = L.map("map").setView([latitude, longitude], 17);

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution:
          'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors',
        maxZoom: 18,
      }).addTo(mapRef.current);

      // Handle map click
      mapRef.current.on("click", onMapClick);
    }

    // Update map view if latitude and longitude change
    if (mapRef.current) {
      mapRef.current.setView([latitude, longitude], 17);

      // Clear previous markers
      mapRef.current.eachLayer((layer) => {
        if (layer instanceof L.Marker) {
          mapRef.current.removeLayer(layer);
        }
      });

      // Create a custom marker
      const customMarkerIcon = L.divIcon({
        className: "custom-marker",
        html: '<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24"><path fill="#467599" d="M13.5 5.5c1.09 0 2-.92 2-2a2 2 0 0 0-2-2c-1.11 0-2 .88-2 2c0 1.08.89 2 2 2M9.89 19.38l1-4.38L13 17v6h2v-7.5l-2.11-2l.61-3A7.29 7.29 0 0 0 19 13v-2c-1.91 0-3.5-1-4.31-2.42l-1-1.58c-.4-.62-1-1-1.69-1c-.31 0-.5.08-.81.08L6 8.28V13h2V9.58l1.79-.7L8.19 17l-4.9-1l-.4 2z"/></svg>',
      });

      // Add a new marker at the updated location
      L.marker([latitude, longitude], { icon: customMarkerIcon })
        .addTo(mapRef.current)
        .openPopup();
    }

    // Cleanup function to remove the map instance on unmount
    return () => {
      if (mapRef.current) {
        mapRef.current.off(); // Remove all event listeners
        mapRef.current.remove(); // Remove the map
        mapRef.current = null; // Reset the reference
      }
    };
  }, [latitude, longitude, onMapClick]);

  return (
    <div style={{ zIndex: "0", position: "relative", cursor: "pointer" }}>
      <a
        href={`https://www.google.com/maps?q=${latitude},${longitude}`}
        target="_blank"
        rel="noopener noreferrer"
      >
        <div className="absolute flex gap-2 items-center p-2 rounded-md bg-tertiary top-2 right-2 z-30">
          <p className="text-white text-xs">Go Maps</p>
        </div>
      </a>
      <div
        id="map"
        style={{ width: "100%", height: "300px", zIndex: "0" }}
      ></div>
    </div>
  );
};

export default LocationMap;
