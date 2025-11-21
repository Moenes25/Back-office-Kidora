// src/components/maps/CrechesMap.jsx
import React, { useState, useRef, useMemo } from "react";
import {
  GoogleMap,
  LoadScript,
  Marker,
  InfoWindow,
  HeatmapLayer,
  MarkerClusterer,
} from "@react-google-maps/api";
import Card from "components/card";

const containerStyle = {
  width: "100%",
  height: "420px",
  borderRadius: "20px",
};

const defaultCenter = { lat: 35.5, lng: 10.0 };

const CRECHES = [
  { id: 1, nom: "Crèche Les Petits Anges", region: "Grand Tunis", latitude: 36.811, longitude: 10.176, enfantsInscrits: 80, statut: "Active" },
  { id: 2, nom: "Crèche Arc-en-ciel", region: "Nord", latitude: 37.05, longitude: 10.03, enfantsInscrits: 45, statut: "Active" },
  { id: 3, nom: "Crèche Paradis Kids", region: "Sahel", latitude: 35.825, longitude: 10.64, enfantsInscrits: 60, statut: "En test" },
  { id: 4, nom: "Crèche Les Étoiles", region: "Sud", latitude: 33.8869, longitude: 9.5375, enfantsInscrits: 30, statut: "Active" },
  { id: 5, nom: "Crèche Kidora Partner", region: "Grand Tunis", latitude: 36.8, longitude: 10.2, enfantsInscrits: 120, statut: "Active" },
];

const REGIONS = ["Toutes", "Grand Tunis", "Nord", "Sahel", "Sud"];

const lightMapStyle = [
  { featureType: "all", elementType: "geometry", stylers: [{ color: "#eef2ff" }] },
  { featureType: "water", stylers: [{ color: "#dbeafe" }] },
  { featureType: "road", stylers: [{ color: "#e5e7eb" }] },
  { featureType: "poi", stylers: [{ visibility: "off" }] },
];

const darkMapStyle = [
  { elementType: "geometry", stylers: [{ color: "#0f172a" }] },
  { featureType: "water", stylers: [{ color: "#020617" }] },
  { featureType: "road", stylers: [{ color: "#1e293b" }] },
];

const CrechesMap = () => {
  const [selectedRegion, setSelectedRegion] = useState("Toutes");
  const [selectedCreche, setSelectedCreche] = useState(null);
  const mapRef = useRef(null);

  const filteredCreches = useMemo(
    () => (selectedRegion === "Toutes" ? CRECHES : CRECHES.filter((c) => c.region === selectedRegion)),
    [selectedRegion]
  );

  const heatmapData = useMemo(() => {
    if (!window.google) return [];
    return CRECHES.map((c) => ({
      location: new window.google.maps.LatLng(c.latitude, c.longitude),
      weight: c.enfantsInscrits / 20,
    }));
  }, []);

  const onMapLoad = (map) => {
    mapRef.current = map;
  };

  const focusOnCreche = (creche) => {
    setSelectedCreche(creche);
    mapRef.current?.panTo({ lat: creche.latitude, lng: creche.longitude });
    mapRef.current?.setZoom(11);
  };

  const isDark = document.body.classList.contains("dark");

  const mapOptions = {
    styles: isDark ? darkMapStyle : lightMapStyle,
    disableDefaultUI: true,
    zoomControl: true,
  };

  return (
    <Card extra="group p-6 relative overflow-hidden rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500">

      {/* Overlay glow */}
      <div className="absolute inset-0 pointer-events-none 
        bg-gradient-to-br from-indigo-500/10 via-transparent to-indigo-500/5 
        opacity-0 group-hover:opacity-100 transition-all duration-500" />

    {/* HEADER */}
<div
  className="
    relative mb-6 rounded-2xl p-4
    bg-gradient-to-r from-white/40 to-white/10 dark:from-navy-800/20 dark:to-navy-900/10
    backdrop-blur-xl border border-white/30 dark:border-white/5 
    shadow-md hover:shadow-xl 
    transition-all duration-500
    group
  "
>
  {/* ORB ANIMÉ */}
  <div
    className="
      absolute -left-4 -top-4 w-10 h-10 rounded-full 
      bg-gradient-to-br from-indigo-500 to-blue-400 
      blur-xl opacity-40 
      animate-pulse
    "
  ></div>

  <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">

    {/* TITRE + SOUS-TITRE */}
    <div className="transition-all duration-500 group-hover:translate-x-1">
      
      <h2
        className="
          flex items-center gap-2 text-2xl font-extrabold
          bg-gradient-to-r from-indigo-600 to-blue-400 
          bg-clip-text text-transparent 
          dark:from-indigo-300 dark:to-blue-200
          animate-[fadeIn_0.7s_ease-out]
        "
      >
        <span className="text-3xl animate-bounce">🌍</span>
        Carte des crèches Kidora
      </h2>

      <p
        className="
          mt-1 text-gray-500 dark:text-gray-300 text-sm
          opacity-0 animate-[fadeIn_1s_forwards] 
        "
      >
        {filteredCreches.length} crèches connectées à la plateforme
      </p>
    </div>

    {/* SELECT – Région */}
    <div
      className="
        flex items-center gap-2
        bg-white/70 dark:bg-navy-700/40 
        backdrop-blur-md px-4 py-2 rounded-xl 
        border border-gray-200 dark:border-gray-700
        shadow-sm hover:shadow-md 
        transition-all duration-300
      "
    >
      <span className="text-sm text-gray-600 dark:text-gray-300">
        Région :
      </span>

      <select
        className="
          px-3 py-2 rounded-lg border text-sm shadow-sm 
          bg-white dark:bg-navy-700 dark:text-white 
          transition-all duration-300
          focus:ring-2 focus:ring-indigo-400
        "
        value={selectedRegion}
        onChange={(e) => setSelectedRegion(e.target.value)}
      >
        {REGIONS.map((r) => (
          <option key={r}>{r}</option>
        ))}
      </select>
    </div>

  </div>
</div>


      {/* GRID : Liste + Map */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
      <div className="
  h-[420px] overflow-y-auto
  rounded-2xl 
  bg-white/80 dark:bg-navy-800/60
  border border-gray-200 dark:border-navy-700
  p-4 shadow-sm
  backdrop-blur-xl
  transition-all duration-300
  hover:shadow-lg
">

  {/* TITRE */}
  <h3 className="
    text-sm font-semibold 
    text-gray-700 dark:text-gray-200 
    mb-3 tracking-wide flex items-center gap-2
  ">
    <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse"></span>
    Crèches partenaires
  </h3>

  {/* LISTE ANIMÉE */}
  <div className="flex flex-col gap-3">
    {filteredCreches.map((c) => (
      <button
        key={c.id}
        onClick={() => focusOnCreche(c)}
        className={[
          "group w-full text-left p-4 rounded-xl border transition-all duration-300",
          "bg-white/70 dark:bg-navy-700/40 backdrop-blur-md shadow-sm",
          "hover:shadow-lg hover:-translate-y-[2px] hover:bg-white/90 dark:hover:bg-navy-700/70",

          selectedCreche?.id === c.id
            ? "border-indigo-400 ring-2 ring-indigo-300/40 shadow-indigo-200"
            : "border-gray-200 dark:border-gray-600",
        ].join(" ")}
      >

        {/* NOM + VILLE */}
        <p className="font-semibold text-navy-700 dark:text-white text-sm group-hover:tracking-wide transition-all">
          {c.nom}
        </p>

        {/* Région */}
        <p className="text-xs text-gray-500 dark:text-gray-300 mt-0.5">
          📍 {c.region}
        </p>

        {/* INFOS */}
        <div className="flex items-center gap-2 mt-2">
          <span className="text-xs text-gray-500 dark:text-gray-400">
            👶 {c.enfantsInscrits} enfants
          </span>

          {/* BADGE STATUT */}
          <span className={[
            "px-2 py-0.5 rounded-full text-[10px] font-semibold",
            c.statut === "Active" && "bg-blue-100 text-blue-600 dark:bg-blue-500/20 dark:text-blue-300",
            c.statut === "En test" && "bg-yellow-100 text-yellow-600 dark:bg-yellow-500/20 dark:text-yellow-300",
            c.statut === "Expirée" && "bg-red-100 text-red-600 dark:bg-red-500/20 dark:text-red-300",
          ].join(" ")}>
            {c.statut}
          </span>
        </div>
      </button>
    ))}
  </div>

</div>


        <div className="lg:col-span-2">
          <LoadScript
            googleMapsApiKey="AIzaSyAegrKyFWfKvlAoYM-_xhTB96Zg6I3_dxg"
            libraries={["visualization"]}
          >
            <GoogleMap
              mapContainerStyle={containerStyle}
              center={defaultCenter}
              zoom={6}
              options={mapOptions}
              onLoad={onMapLoad}
            >
              <HeatmapLayer data={heatmapData} />

              <MarkerClusterer>
                {(clusterer) =>
                  filteredCreches.map((c) => (
                    <Marker
                      key={c.id}
                      clusterer={clusterer}
                      position={{ lat: c.latitude, lng: c.longitude }}
                      onClick={() => focusOnCreche(c)}
                    />
                  ))
                }
              </MarkerClusterer>

              {selectedCreche && (
                <InfoWindow
                  position={{
                    lat: selectedCreche.latitude,
                    lng: selectedCreche.longitude,
                  }}
                  onCloseClick={() => setSelectedCreche(null)}
                >
                  <div>
                    <p className="font-bold">{selectedCreche.nom}</p>
                    <p className="text-xs">{selectedCreche.region}</p>
                    <p className="text-xs">
                      👶 {selectedCreche.enfantsInscrits} — {selectedCreche.statut}
                    </p>
                  </div>
                </InfoWindow>
              )}
            </GoogleMap>
          </LoadScript>
        </div>
      </div>

      <div className="mt-4 flex items-center gap-4 text-sm">
        <span className="w-3 h-3 bg-blue-500 rounded-full" /> Active
        <span className="w-3 h-3 bg-yellow-500 rounded-full" /> En test
        <span className="w-3 h-3 bg-red-500 rounded-full" /> Expirée
      </div>
    </Card>
  );
};

export default CrechesMap;
