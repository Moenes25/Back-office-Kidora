import React from "react";
import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";
import Card from "components/card";

const containerStyle = {
  width: "100%",
  height: "350px",
  borderRadius: "20px",
};

// Position centrée sur Tunis
const center = {
  lat: 36.8065,
  lng: 10.1815,
};

// 🎯 LISTE STATIQUE DES CRECHES
const crechesStatic = [
  { nom: "Crèche Les P'tits Génies", latitude: 36.8065, longitude: 10.1815 },
  { nom: "Crèche Les Anges", latitude: 36.8790, longitude: 10.2600 },
  { nom: "Crèche Babou", latitude: 36.8495, longitude: 10.2785 },
  { nom: "Crèche Kids Club", latitude: 36.8188, longitude: 10.1659 },
  { nom: "Crèche Les Étoiles", latitude: 36.7930, longitude: 10.0732 },
];

const CrechesMap = () => {
  return (
    <Card extra="p-4">
      <h2 className="text-lg font-bold text-navy-700 mb-4">
        Localisation des crèches actives
      </h2>

      <LoadScript googleMapsApiKey="AIzaSyAegrKyFWfKvlAoYM-_xhTB96Zg6I3_dxg">
        <GoogleMap
          mapContainerStyle={containerStyle}
          center={center}
          zoom={11}
        >
          {crechesStatic.map((c, index) => (
            <Marker
              key={index}
              position={{ lat: c.latitude, lng: c.longitude }}
              title={c.nom}
            />
          ))}
        </GoogleMap>
      </LoadScript>
    </Card>
  );
};

export default CrechesMap;
