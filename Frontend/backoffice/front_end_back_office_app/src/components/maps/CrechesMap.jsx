// src/components/maps/CrechesMap.jsx
import React, { useState, useRef, useMemo, useEffect } from "react";
import {
  GoogleMap,
  LoadScript,
  Marker,
  InfoWindow,
  HeatmapLayer,
  MarkerClusterer,
} from "@react-google-maps/api";
import Card from "components/card";

/* --- styles & map container --- */
const containerStyle = { width: "100%", height: "420px", borderRadius: "20px" };
const defaultCenter = { lat: 35.5, lng: 10.0 };

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

/* --- datasets 3 types --- */
const CRECHES = [
  { id: 1, nom: "Crèche Les Petits Anges", type:"creches", region: "Grand Tunis", latitude: 36.811, longitude: 10.176, enfantsInscrits: 80, statut: "Active" },
  { id: 2, nom: "Crèche Arc-en-ciel",      type:"creches", region: "Nord",        latitude: 37.05,  longitude: 10.03,  enfantsInscrits: 45, statut: "Active" },
  { id: 3, nom: "Crèche Paradis Kids",     type:"creches", region: "Sahel",       latitude: 35.825, longitude: 10.64,  enfantsInscrits: 60, statut: "En test" },
  { id: 4, nom: "Crèche Les Étoiles",      type:"creches", region: "Sud",         latitude: 33.887, longitude: 9.538,  enfantsInscrits: 30, statut: "Active" },
  { id: 5, nom: "Crèche Kidora Partner",   type:"creches", region: "Grand Tunis", latitude: 36.8,   longitude: 10.2,  enfantsInscrits: 120, statut: "Active" },
];
const GARDERIES = [
  { id: 101, nom: "Garderie Soleil",  type:"garderies", region: "Grand Tunis", latitude: 36.84, longitude: 10.19, enfantsInscrits: 110, statut: "Active" },
  { id: 102, nom: "Nounours",         type:"garderies", region: "Sahel",       latitude: 35.83, longitude: 10.65, enfantsInscrits: 78,  statut: "En alerte" },
  { id: 103, nom: "Les Lutins",       type:"garderies", region: "Nord",        latitude: 37.0,  longitude: 10.1,  enfantsInscrits: 66,  statut: "Active" },
];
const ECOLES = [
  { id: 201, nom: "École Horizon",      type:"ecoles", region: "Ariana",      latitude: 36.86, longitude: 10.2,  enfantsInscrits: 320, statut: "Active" },
  { id: 202, nom: "École Les Sources",  type:"ecoles", region: "Nabeul",      latitude: 36.46, longitude: 10.73, enfantsInscrits: 260, statut: "Active" },
];

const DATASETS = { creches: CRECHES, garderies: GARDERIES, ecoles: ECOLES };
const TYPE_META = {
  creches:   { label: "crèches",   color: "#6366f1", emoji: "🧸", listTitle: "Crèches partenaires" },
  garderies: { label: "garderies", color: "#f59e0b", emoji: "🧩", listTitle: "Garderies partenaires" },
  ecoles:    { label: "écoles",    color: "#10b981", emoji: "📚", listTitle: "Écoles partenaires" },
};
const hexToRgba = (hex, a=1) => {
  const v = hex.replace('#','');
  const b = parseInt(v.length===3 ? v.split('').map(x=>x+x).join('') : v, 16);
  const r = (b>>16)&255, g = (b>>8)&255, bl=b&255;
  return `rgba(${r}, ${g}, ${bl}, ${a})`;
};

/* --- Segmented control animé (filtre type) --- */
function TypeSegmented({ value, onChange, counts }) {
  const options = ["creches", "garderies", "ecoles"];
  const containerRef = useRef(null);
  const [indicator, setIndicator] = useState({ left: 0, width: 0 });

  const recalc = () => {
    const root = containerRef.current;
    if (!root) return;
    const idx = options.indexOf(value);
    const btn = root.querySelectorAll("button")[idx];
    if (!btn) return;
    const { left, width } = btn.getBoundingClientRect();
    const base = root.getBoundingClientRect().left;
    setIndicator({ left: left - base, width });
  };

  useEffect(() => {
    recalc();
    const ro = new ResizeObserver(recalc);
    ro.observe(containerRef.current);
    window.addEventListener("resize", recalc);
    return () => { ro.disconnect(); window.removeEventListener("resize", recalc); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

const activeColor = TYPE_META[value]?.color || '#6366f1';

return (
  <div
    ref={containerRef}
    className="relative flex items-center rounded-2xl border border-black/10 bg-white/70 dark:bg-white/10 overflow-hidden"
  >
    {/* indicateur coloré */}
    <div
      className="absolute top-0 bottom-0 rounded-2xl pointer-events-none transition-all duration-300 ease-out"
      style={{
        width: indicator.width,
        transform: `translateX(${indicator.left}px)`,
        background: `linear-gradient(135deg, ${hexToRgba(activeColor, .22)}, ${hexToRgba(activeColor, .10)})`,
        boxShadow: `0 6px 20px ${hexToRgba(activeColor, .28)}`,
      }}
    />

    {options.map((k) => {
      const isActive = value === k;
      const c = TYPE_META[k].color;
      return (
        <button
          key={k}
          type="button"
          onClick={(e) => {
            const r = document.createElement("span");
            r.className = "pointer-events-none absolute animate-ripple rounded-full";
            r.style.background = hexToRgba(c, .18);
            const rect = e.currentTarget.getBoundingClientRect();
            r.style.width = r.style.height = `${rect.width * 1.5}px`;
            r.style.left = `${e.clientX - rect.left - rect.width * 0.75}px`;
            r.style.top  = `${e.clientY - rect.top  - rect.width * 0.75}px`;
            e.currentTarget.appendChild(r);
            setTimeout(() => r.remove(), 600);
            onChange(k);
          }}
          className={[
            "relative z-10 px-4 py-2 text-sm font-semibold flex items-center gap-2 transition-colors",
            isActive ? "text-gray-900 dark:text-white" : "text-gray-600 dark:text-gray-300 hover:text-gray-900"
          ].join(" ")}
          style={isActive ? { color: c } : undefined}
        >
          <span>{TYPE_META[k].label.charAt(0).toUpperCase()+TYPE_META[k].label.slice(1)}</span>
          <span
            className="rounded-full px-2 text-[11px] font-bold border"
            style={{
              borderColor: hexToRgba(c,.25),
              background: hexToRgba(c,.08),
              color: isActive ? c : undefined,
            }}
          >
            {counts[k] ?? 0}
          </span>
        </button>
      );
    })}
  </div>
);

}


const CrechesMap = () => {
  /* --- states --- */
  const [selectedType, setSelectedType] = useState("creches");
  const [selectedRegion, setSelectedRegion] = useState("Toutes");
  const [selectedEntity, setSelectedEntity] = useState(null);
  const mapRef = useRef(null);

  /* --- memo selon type/région --- */
  const currentData = useMemo(() => DATASETS[selectedType] || [], [selectedType]);
  const regionOptions = useMemo(() => {
    const set = new Set(currentData.map((e) => e.region));
    return ["Toutes", ...Array.from(set)];
  }, [currentData]);

  const filteredEntities = useMemo(
    () => (selectedRegion === "Toutes" ? currentData : currentData.filter((c) => c.region === selectedRegion)),
    [selectedRegion, currentData]
  );

  const heatmapData = useMemo(() => {
    if (!window.google) return [];
    return filteredEntities.map((c) => ({
      location: new window.google.maps.LatLng(c.latitude, c.longitude),
      weight: Math.max(1, c.enfantsInscrits / 20),
    }));
  }, [filteredEntities]);

  /* --- map --- */
  const onMapLoad = (map) => { mapRef.current = map; };
  const focusOn = (ent) => {
    setSelectedEntity(ent);
    mapRef.current?.panTo({ lat: ent.latitude, lng: ent.longitude });
    mapRef.current?.setZoom(11);
  };
  const isDark = document.body.classList.contains("dark");
  const mapOptions = { styles: isDark ? darkMapStyle : lightMapStyle, disableDefaultUI: true, zoomControl: true };

  /* --- helpers UI --- */
  const meta = TYPE_META[selectedType];
  const counts = {
    creches: DATASETS.creches.length,
    garderies: DATASETS.garderies.length,
    ecoles: DATASETS.ecoles.length,
  };

  return (
    <Card extra="group p-6 relative overflow-hidden rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500">
      {/* soft glow */}
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-br from-indigo-500/10 via-transparent to-indigo-500/5 opacity-0 group-hover:opacity-100 transition-all duration-500" />

      {/* HEADER */}
      <div className="relative mb-6 rounded-2xl p-4 bg-gradient-to-r from-white/60 to-white/20 dark:from-navy-800/20 dark:to-navy-900/10 backdrop-blur-xl border border-white/40 dark:border-white/5 shadow-md">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          {/* Title */}
          <div className="relative">
            <h2 className="flex items-center gap-3 text-2xl font-extrabold">
            <span className="relative inline-grid place-items-center w-10 h-10 rounded-full ring-2 ring-black/10 dark:ring-white/10">
  {/* halo coloré */}
  <span
    className="absolute inset-0 rounded-full blur-[6px] opacity-40"
    style={{ background: `radial-gradient(circle, ${hexToRgba(meta.color,.45)}, transparent 60%)` }}
  />
  {/* orbite */}
  <span className="absolute inset-0 rounded-full animate-spin-slow bg-[conic-gradient(from_0deg,transparent_0_72%,rgba(0,0,0,.08)_72%)]" />
  {/* terre */}
  <span className="relative text-3xl animate-earth-wobble">🌍</span>
</span>

              Carte des {meta.label}
            </h2>
            <div className="h-0.5 w-24 mt-1 rounded-full bg-gradient-to-r from-indigo-500 via-sky-400 to-emerald-400 animate-gradient-slide" />
            <p className="mt-1 text-gray-500 dark:text-gray-300 text-sm">
              {filteredEntities.length} {meta.label} affiché(es)
            </p>
          </div>

          {/* Controls */}
          <div className="flex flex-wrap gap-3 items-center">
            {/* Segmented control upgraded */}
            <TypeSegmented
              value={selectedType}
              onChange={(t) => { setSelectedType(t); setSelectedRegion("Toutes"); setSelectedEntity(null); }}
              counts={counts}
            />

            {/* Region select with icon & hover ring */}
            <div className="flex items-center gap-2 bg-white/70 dark:bg-white/10 backdrop-blur-md px-3 py-2 rounded-xl border border-black/10 shadow-sm">
              <span className="text-sm text-gray-600 dark:text-gray-300">Région :</span>
              <div className="relative">
                <select
                  className="peer appearance-none px-3 py-1.5 rounded-lg border text-sm bg-white dark:bg-navy-700 dark:text-white focus:ring-2 focus:ring-indigo-400 pr-8"
                  value={selectedRegion}
                  onChange={(e) => setSelectedRegion(e.target.value)}
                >
                  {regionOptions.map((r) => <option key={r}>{r}</option>)}
                </select>
                <span className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 peer-focus:text-indigo-500">▾</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* GRID : list + map */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
      <div className="h-[420px] overflow-y-auto rounded-2xl bg-white/80 dark:bg-navy-800/60 border border-gray-200 dark:border-navy-700 p-4 shadow-sm backdrop-blur-xl">
  <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-200 mb-3 tracking-wide flex items-center gap-2">
    <span className="w-2 h-2 rounded-full" style={{ backgroundColor: meta.color }} />
    {meta.listTitle}
  </h3>

  {/* le mask ne couvre que les items → le header reste net */}
  <div className="flex flex-col gap-3 [mask-image:linear-gradient(to_bottom,transparent,black_10%,black_90%,transparent)]">
            {filteredEntities.map((e, i) => (
              <button
                key={`${selectedType}-${e.id}`}
                onClick={() => focusOn(e)}
                style={{ animationDelay: `${i * 60}ms` }}
                className={[
                  "group w-full text-left p-4 rounded-xl border transition-all duration-300 animate-fadeUp",
                  "bg-white/70 dark:bg-navy-700/40 backdrop-blur-md shadow-sm relative overflow-hidden",
                  "hover:shadow-lg hover:-translate-y-[2px] hover:bg-white/90 dark:hover:bg-navy-700/70",
                  selectedEntity?.id === e.id
                    ? "border-indigo-400 ring-2 ring-indigo-300/40"
                    : "border-gray-200 dark:border-gray-600",
                ].join(" ")}
              >
                {/* accent bar */}
                <span
                  className="absolute left-0 top-0 bottom-0 w-1 rounded-l-xl"
                  style={{ background: `linear-gradient(${meta.color}, ${meta.color}AA)` }}
                />
                {/* subtle shimmer on hover */}
                <span className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity bg-[radial-gradient(80px_60px_at_var(--mx,0px)_var(--my,0px),rgba(255,255,255,.6),transparent_60%)]" />

                <p className="font-semibold text-navy-700 dark:text-white text-sm">{e.nom}</p>
                <p className="text-xs text-gray-500 dark:text-gray-300 mt-0.5">📍 {e.region}</p>
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-xs text-gray-500 dark:text-gray-400">👶 {e.enfantsInscrits} enfants</span>
                  <span className={[
                    "px-2 py-0.5 rounded-full text-[10px] font-semibold",
                    e.statut === "Active"    && "bg-blue-100 text-blue-600 dark:bg-blue-500/20 dark:text-blue-300",
                    e.statut === "En test"   && "bg-yellow-100 text-yellow-600 dark:bg-yellow-500/20 dark:text-yellow-300",
                    e.statut === "En alerte" && "bg-orange-100 text-orange-600 dark:bg-orange-500/20 dark:text-orange-300",
                    e.statut === "Expirée"   && "bg-red-100 text-red-600 dark:bg-red-500/20 dark:text-red-300",
                  ].join(" ")}>{e.statut}</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Map */}
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
              onMouseMove={(e) => {
                // shimmer position for list items (CSS variables)
                const x = e.domEvent?.clientX ?? 0;
                const y = e.domEvent?.clientY ?? 0;
                document.documentElement.style.setProperty("--mx", `${x}px`);
                document.documentElement.style.setProperty("--my", `${y}px`);
              }}
            >
              <HeatmapLayer data={heatmapData} />

              <MarkerClusterer>
                {(clusterer) =>
                  filteredEntities.map((e) => (
                    <Marker
                      key={`${selectedType}-${e.id}`}
                      clusterer={clusterer}
                      position={{ lat: e.latitude, lng: e.longitude }}
                      onClick={() => focusOn(e)}
                    />
                  ))
                }
              </MarkerClusterer>

              {selectedEntity && (
                <InfoWindow
                  position={{ lat: selectedEntity.latitude, lng: selectedEntity.longitude }}
                  onCloseClick={() => setSelectedEntity(null)}
                >
                  <div>
                    <p className="font-bold">{selectedEntity.nom}</p>
                    <p className="text-xs">{selectedEntity.region}</p>
                    <p className="text-xs">👶 {selectedEntity.enfantsInscrits} — {selectedEntity.statut}</p>
                  </div>
                </InfoWindow>
              )}
            </GoogleMap>
          </LoadScript>
        </div>
      </div>

      {/* Legend */}
      <div className="mt-4 flex items-center gap-4 text-sm">
        <span className="w-3 h-3 bg-blue-500 rounded-full" /> Active
        <span className="w-3 h-3 bg-yellow-500 rounded-full" /> En test
        <span className="w-3 h-3 bg-orange-500 rounded-full" /> En alerte
        <span className="w-3 h-3 bg-red-500 rounded-full" /> Expirée
      </div>
    </Card>
  );
};

export default CrechesMap;

/* one-time keyframes injection (ripple + gradient + fadeUp + slow spin) */
if (typeof document !== "undefined" && !document.getElementById("map-anim-kf")) {
  const style = document.createElement("style");
  style.id = "map-anim-kf";
  style.innerHTML = `
    @keyframes gradient-slide { 
      0% { background-position: 0% 50% } 
      100% { background-position: 100% 50% } 
    }
    .animate-gradient-slide { background-size: 200% 200%; animation: gradient-slide 3s linear infinite; }

    @keyframes ripple { from { transform: scale(.2); opacity:.35 } to { transform: scale(1.2); opacity:0 } }
    .animate-ripple { animation: ripple .6s ease-out forwards }

    @keyframes fadeUp { from { opacity:0; transform: translateY(6px) } to { opacity:1; transform: translateY(0) } }
    .animate-fadeUp { animation: fadeUp .35s ease-out both }

    @keyframes spin-slow { to { transform: rotate(360deg) } }
    .animate-spin-slow { animation: spin-slow 6s linear infinite }
      @keyframes earth-wobble {
    0%   { transform: translateY(0) rotate(0deg) }
    25%  { transform: translateY(-1px) rotate(1.5deg) }
    50%  { transform: translateY(0) rotate(0deg) }
    75%  { transform: translateY(1px) rotate(-1.5deg) }
    100% { transform: translateY(0) rotate(0deg) }
  }
  .animate-earth-wobble { animation: earth-wobble 2.8s ease-in-out infinite }
  `;
  document.head.appendChild(style);
}
