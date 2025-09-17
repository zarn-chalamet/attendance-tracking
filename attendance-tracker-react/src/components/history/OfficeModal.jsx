import React from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { X } from "lucide-react";

const OfficeModal = ({ office, onClose }) => {
  if (!office) return null;

  return (
    <div className="fixed inset-0 bg-black/50 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-lg max-w-lg w-full p-6 relative">
        <button
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
          onClick={onClose}
        >
          <X size={20} />
        </button>
        <h2 className="text-xl font-bold mb-4">{office.name}</h2>
        <p className="text-gray-600 mb-4">Office ID: {office.id}</p>
        <div className="w-full h-64 rounded-lg overflow-hidden">
          <MapContainer
            center={[office.latitude, office.longitude]}
            zoom={16}
            style={{ height: "100%", width: "100%" }}
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            <Marker position={[office.latitude, office.longitude]}>
              <Popup>{office.name}</Popup>
            </Marker>
          </MapContainer>
        </div>
      </div>
    </div>
  );
};

export default OfficeModal;
