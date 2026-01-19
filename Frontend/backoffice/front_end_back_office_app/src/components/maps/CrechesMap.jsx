// src/components/maps/CrechesMap.jsx
import React, { useState, useRef, useMemo, useEffect } from "react";
import Card from "components/card";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import api from "services/api"; // 👈 IMPORTANT: ton axios préconfiguré

const containerStyle = { width: "100%", height: "420px", borderRadius: "20px" };
const defaultCenter = { lat: 35.5, lng: 10.0 };

const icon = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const TYPE_META = {
  creches:   { label: "crèches",   color: "#6366f1", emoji: "🧸", listTitle: "Crèches partenaires" },
  garderies: { label: "garderies", color: "#f59e0b", emoji: "🧩", listTitle: "Garderies partenaires" },
  ecoles:    { label: "écoles",    color: "#10b981", emoji: "📚", listTitle: "Écoles partenaires" },
};

const hexToRgba = (hex, a=1) => {
  const v = hex.replace("#",""); const b = parseInt(v.length===3 ? v.split("").map(x=>x+x).join("") : v, 16);
  const r=(b>>16)&255,g=(b>>8)&255,bl=b&255; return `rgba(${r}, ${g}, ${bl}, ${a})`;
};

/* ---------- helpers backend → front ---------- */
// "CRECHE" | "GARDERIE" | "ECOLE" -> "creches"|"garderies"|"ecoles"
function mapType(t) {
  const x = (t||"").toString().toUpperCase();
  if (x === "CRECHE" || x === "CRÈCHE") return "creches";
  if (x === "GARDERIE") return "garderies";
  if (x === "ECOLE" || x === "ÉCOLE") return "ecoles";
  return null;
}

// Essaye de lire ?q=lat,lng ou .../@lat,lng,zoom dans l’URL
function parseLatLngFromUrl(url) {
  if (!url) return null;
  try {
    const u = new URL(url);
    const q = u.searchParams.get("q");
    if (q && q.includes(",")) {
      const [lat, lng] = q.split(",").map(Number);
      if (Number.isFinite(lat) && Number.isFinite(lng)) return { lat, lng };
    }
    // fallback pattern .../@36.8123,10.1234,14z
    const m = url.match(/@(-?\d+(\.\d+)?),\s*(-?\d+(\.\d+)?)/);
    if (m) {
      const lat = Number(m[1]); const lng = Number(m[3]);
      if (Number.isFinite(lat) && Number.isFinite(lng)) return { lat, lng };
    }
  } catch {}
  return null;
}

/* ---------- segmented control (identique) ---------- */
function TypeSegmented({ value, onChange, counts }) {
  const options = ["creches", "garderies", "ecoles"];
  const containerRef = React.useRef(null);
  const [indicator, setIndicator] = useState({ left: 0, width: 0 });
  const recalc = () => {
    const root = containerRef.current; if (!root) return;
    const idx = options.indexOf(value); const btn = root.querySelectorAll("button")[idx];
    if (!btn) return; const { left, width } = btn.getBoundingClientRect(); const base = root.getBoundingClientRect().left;
    setIndicator({ left: left - base, width });
  };
  useEffect(() => { recalc(); const ro = new ResizeObserver(recalc); ro.observe(containerRef.current);
    window.addEventListener("resize", recalc); return () => { ro.disconnect(); window.removeEventListener("resize", recalc); };
  }, [value]);
  const activeColor = TYPE_META[value]?.color || "#6366f1";
  return (
    <div ref={containerRef} className="relative flex items-center rounded-2xl border border-black/10 bg-white/70 dark:bg-white/10 overflow-hidden">
      <div className="absolute top-0 bottom-0 rounded-2xl pointer-events-none transition-all duration-300 ease-out"
           style={{ width: indicator.width, transform:`translateX(${indicator.left}px)`,
           background:`linear-gradient(135deg, ${hexToRgba(activeColor,.22)}, ${hexToRgba(activeColor,.10)})`,
           boxShadow:`0 6px 20px ${hexToRgba(activeColor,.28)}` }} />
      {options.map((k)=> {
        const isActive = value === k; const c = TYPE_META[k].color;
        return (
          <button key={k} type="button"
            onClick={(e)=>{ const r=document.createElement("span"); r.className="pointer-events-none absolute animate-ripple rounded-full";
              r.style.background=hexToRgba(c,.18); const rect=e.currentTarget.getBoundingClientRect();
              r.style.width=r.style.height=`${rect.width*1.5}px`; r.style.left=`${e.clientX-rect.left-rect.width*0.75}px`;
              r.style.top=`${e.clientY-rect.top-rect.width*0.75}px`; e.currentTarget.appendChild(r); setTimeout(()=>r.remove(),600); onChange(k);}}
            className={["relative z-10 px-4 py-2 text-sm font-semibold flex items-center gap-2 transition-colors",
              isActive ? "text-gray-900 dark:text-white" : "text-gray-600 dark:text-gray-300 hover:text-gray-900"].join(" ")}
            style={isActive?{color:c}:undefined}>
            <span>{TYPE_META[k].label.charAt(0).toUpperCase()+TYPE_META[k].label.slice(1)}</span>
            <span className="rounded-full px-2 text-[11px] font-bold border"
              style={{ borderColor:hexToRgba(c,.25), background:hexToRgba(c,.08), color:isActive?c:undefined }}>
              {counts[k] ?? 0}
            </span>
          </button>
        );
      })}
    </div>
  );
}

/* ---------- UI bouton IA (inchangé) ---------- */
function LocateAIButton({ onClick }) {
  return (
    <button onClick={onClick}
      className={[
        "inline-flex h-10 items-center gap-2 rounded-xl",
        "px-4 text-sm font-bold",
        "border border-indigo-200 bg-indigo-50 text-indigo-700",
        "shadow-sm hover:bg-indigo-100",
        "whitespace-nowrap",
      ].join(" ")}
      title="Trouver et centrer automatiquement"
      aria-label="Localiser par IA"
    >
      <span className="text-base">🤖</span>
      <span>Localiser par IA</span>
    </button>
  );
}
// Centroids (approx) des gouvernorats de Tunisie
const REGION_CENTERS = {
  "Tunis":            { lat: 36.8065, lng: 10.1815 },
  "Ariana":           { lat: 36.8665, lng: 10.1647 },
  "Ben Arous":        { lat: 36.7435, lng: 10.2310 },
  "Manouba":          { lat: 36.8080, lng: 10.0970 },
  "Nabeul":           { lat: 36.4510, lng: 10.7350 },
  "Zaghouan":         { lat: 36.4020, lng: 10.1420 },
  "Bizerte":          { lat: 37.2746, lng: 9.8739 },
  "Béja":             { lat: 36.7256, lng: 9.1817 },
  "Jendouba":         { lat: 36.5010, lng: 8.7802 },
  "Le Kef":           { lat: 36.1742, lng: 8.7049 },
  "Siliana":          { lat: 36.0840, lng: 9.3700 },
  "Sousse":           { lat: 35.8256, lng: 10.6360 },
  "Monastir":         { lat: 35.7777, lng: 10.8262 },
  "Mahdia":           { lat: 35.5047, lng: 10.9956 },
  "Kairouan":         { lat: 35.6781, lng: 10.0963 },
  "Kasserine":        { lat: 35.1676, lng: 8.8365 },
  "Sidi Bouzid":      { lat: 35.0382, lng: 9.4857 },
  "Sfax":             { lat: 34.7406, lng: 10.7603 },
  "Gabès":            { lat: 33.8815, lng: 10.0982 },
  "Médenine":         { lat: 33.3549, lng: 10.5055 },
  "Tataouine":        { lat: 32.9297, lng: 10.4518 },
  "Gafsa":            { lat: 34.4250, lng: 8.7842 },
  "Tozeur":           { lat: 33.9197, lng: 8.1335 },
  "Kébili":           { lat: 33.7055, lng: 8.9653 }
};

// petit helper (tolérant aux accents/cases)
function regionToLatLng(region) {
  if (!region) return null;
  const key = region.normalize('NFD').replace(/\p{Diacritic}/gu,''); // supprime accents
  // essaie match exact
  for (const k of Object.keys(REGION_CENTERS)) {
    const kk = k.normalize('NFD').replace(/\p{Diacritic}/gu,'');
    if (kk.toLowerCase() === key.toLowerCase()) return REGION_CENTERS[k];
  }
  // essaie "contient" (ex: "Grand Tunis" → "Tunis")
  for (const k of Object.keys(REGION_CENTERS)) {
    const kk = k.normalize('NFD').replace(/\p{Diacritic}/gu,'');
    if (key.toLowerCase().includes(kk.toLowerCase())) return REGION_CENTERS[k];
  }
  return null;
}

const CrechesMap = () => {
  const [selectedType, setSelectedType] = useState("creches");
  const [selectedRegion, setSelectedRegion] = useState("Toutes");
  const [selectedEntity, setSelectedEntity] = useState(null);
  const [showLocateAI, setShowLocateAI] = useState(false);
  const [items, setItems] = useState([]); // 👈 données dynamiques normalisées
  const mapRef = useRef(null);

  // 1) Fetch + normalisation
  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const { data = [] } = await api.get("/etablissement/all");
        // normalise vers {id, nom, type(grp), region, latitude, longitude, enfantsInscrits, statut}
        const norm = (data || [])
          .map((e) => {
            const grp = mapType(e?.type);
            const geoUrl = parseLatLngFromUrl(e?.url_localisation);
            const geoReg = regionToLatLng(e?.region);
            return {
              id: e?.idEtablissment || e?.id || crypto.randomUUID(),
              nom: e?.nomEtablissement || "—",
              type: grp, // "creches"|"garderies"|"ecoles"|null
              region: e?.region || "—",
              latitude: (geoUrl?.lat ?? geoReg?.lat) ?? null,
              longitude: (geoUrl?.lng ?? geoReg?.lng) ?? null,
              enfantsInscrits: Number(e?.nombreEnfants ?? 0),
              statut: e?.isActive ? "Active" : "Inactif",
              email: e?.email || "",
            };
          })
          .filter((e) => !!e.type); // garde seulement ceux avec type connu
        if (alive) setItems(norm);
      } catch (err) {
        console.error("Erreur /etablissement/all :", err);
        if (alive) setItems([]);
      }
    })();
    return () => { alive = false; };
  }, []);

  // 2) Dérivés (par type + région)
  const currentData = useMemo(
    () => items.filter((x) => x.type === selectedType),
    [items, selectedType]
  );

  const regionOptions = useMemo(() => {
    const set = new Set(currentData.map((e) => e.region).filter(Boolean));
    return ["Toutes", ...Array.from(set)];
  }, [currentData]);

  const filteredEntities = useMemo(
    () => (selectedRegion === "Toutes" ? currentData : currentData.filter((c) => c.region === selectedRegion)),
    [selectedRegion, currentData]
  );

  // 3) Compteurs dynamiques par type
  const counts = useMemo(() => ({
    creches: items.filter(e => e.type === "creches").length,
    garderies: items.filter(e => e.type === "garderies").length,
    ecoles: items.filter(e => e.type === "ecoles").length,
  }), [items]);

  useEffect(() => {
  if (!mapRef.current) return;

  const pts = filteredEntities
    .filter(e => Number.isFinite(e.latitude) && Number.isFinite(e.longitude))
    .map(e => [e.latitude, e.longitude]);

  if (pts.length === 0) {
    // rien à afficher → centre par défaut
    mapRef.current.setView([defaultCenter.lat, defaultCenter.lng], 6, { animate: true });
    return;
  }
  if (pts.length === 1) {
    mapRef.current.setView(pts[0], 11, { animate: true });
    return;
  }
  const bounds = L.latLngBounds(pts);
  mapRef.current.fitBounds(bounds, { padding: [30, 30] });
}, [filteredEntities]);


  // 4) Map handlers
  const onMapLoad = (map) => { mapRef.current = map; };
  const focusOn = (ent) => {
    setSelectedEntity(ent);
    if (Number.isFinite(ent.latitude) && Number.isFinite(ent.longitude)) {
      mapRef.current?.setView([ent.latitude, ent.longitude], 11, { animate: true });
    }
  };

  // 5) UI helpers
  const meta = TYPE_META[selectedType];

  return (
    <Card extra="group p-6 relative overflow-hidden rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500">
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-br from-indigo-500/10 via-transparent to-indigo-500/5 opacity-0 group-hover:opacity-100 transition-all duration-500" />

      {/* HEADER */}
      <div className="relative mb-6 rounded-2xl p-4 bg-gradient-to-r from-white/60 to-white/20 dark:from-navy-800/20 dark:to-navy-900/10 backdrop-blur-xl border border-white/40 dark:border-white/5 shadow-md">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div className="relative">
            <h6 className="flex items-center gap-3 text-md font-extrabold">
              <span className="relative inline-grid place-items-center w-10 h-10 rounded-full ring-2 ring-black/10 dark:ring-white/10">
                <span className="absolute inset-0 rounded-full blur-[6px] opacity-40"
                      style={{ background: `radial-gradient(circle, ${hexToRgba(meta.color,.45)}, transparent 60%)` }} />
                <span className="absolute inset-0 rounded-full animate-spin-slow bg-[conic-gradient(from_0deg,transparent_0_72%,rgba(0,0,0,.08)_72%)]" />
                <span className="relative text-3xl animate-earth-wobble">🌍</span>
              </span>
              Carte  <br/> des {meta.label}
            </h6>
            <div className="h-0.5 w-24 mt-1 rounded-full bg-gradient-to-r from-indigo-500 via-sky-400 to-emerald-400 animate-gradient-slide" />
            <p className="mt-1 text-gray-500 dark:text-gray-300 text-sm">
              {filteredEntities.length} {meta.label} affiché(es)
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <LocateAIButton onClick={() => setShowLocateAI(true)} />
            <TypeSegmented
              value={selectedType}
              onChange={(t) => { setSelectedType(t); setSelectedRegion("Toutes"); setSelectedEntity(null); }}
              counts={counts}
            />
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
        {/* Liste */}
        <div className="h-[420px] overflow-y-auto rounded-2xl bg-white dark:bg-navy-800 border border-gray-200 dark:border-navy-700 p-5 shadow-sm">
          <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-200 mb-3 tracking-wide flex items-center gap-2">
            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: meta.color }} />
            {meta.listTitle}
          </h3>

          <div className="flex flex-col gap-3">
            {filteredEntities.map((e, i) => (
              <button
                key={`${selectedType}-${e.id}`}
                onClick={() => focusOn(e)}
                style={{ animationDelay: `${i * 60}ms` }}
                className={[
                  "group w-full text-left p-4 rounded-xl border transition-all duration-300 animate-fadeUp",
                  "bg-white/70 dark:bg-navy-700/40 backdrop-blur-md shadow-sm relative overflow-hidden",
                  "hover:shadow-lg hover:-translate-y-[2px] hover:bg-white/90 dark:hover:bg-navy-700/70",
                  selectedEntity?.id === e.id ? "border-indigo-400 ring-2 ring-indigo-300/40" : "border-gray-200 dark:border-gray-600",
                ].join(" ")}
              >
                <span className="absolute left-0 top-0 bottom-0 w-1 rounded-l-xl"
                      style={{ background: `linear-gradient(${meta.color}, ${meta.color}AA)` }} />
                <span className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity bg-[radial-gradient(80px_60px_at_var(--mx,0px)_var(--my,0px),rgba(255,255,255,.6),transparent_60%)]" />

                <p className="font-semibold text-navy-700 dark:text-white text-sm">{e.nom}</p>
                <p className="text-xs text-gray-500 dark:text-gray-300 mt-0.5">📍 {e.region}</p>
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-xs text-gray-500 dark:text-gray-400">👶 {e.enfantsInscrits} enfants</span>
                  <span className={[
                    "px-2 py-0.5 rounded-full text-[10px] font-semibold",
                    e.statut === "Active" ? "bg-blue-100 text-blue-600 dark:bg-blue-500/20 dark:text-blue-300"
                                          : "bg-slate-100 text-slate-600 dark:bg-slate-500/20 dark:text-slate-300",
                  ].join(" ")}>{e.statut}</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Carte */}
        <div
          className="lg:col-span-2"
          onMouseMove={(e) => {
            const x = e.clientX ?? 0; const y = e.clientY ?? 0;
            document.documentElement.style.setProperty("--mx", `${x}px`);
            document.documentElement.style.setProperty("--my", `${y}px`);
          }}
        >
          <MapContainer
            center={[defaultCenter.lat, defaultCenter.lng]}
            zoom={6}
            style={containerStyle}
            whenCreated={onMapLoad}
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; OpenStreetMap contributors'
            />

            {filteredEntities
              .filter((e) => Number.isFinite(e.latitude) && Number.isFinite(e.longitude))
              .map((e) => (
                <Marker
                  key={`${selectedType}-${e.id}`}
                  position={[e.latitude, e.longitude]}
                  icon={icon}
                  eventHandlers={{ click: () => focusOn(e) }}
                />
              ))}

            {selectedEntity && Number.isFinite(selectedEntity.latitude) && Number.isFinite(selectedEntity.longitude) && (
              <Popup
                position={[selectedEntity.latitude, selectedEntity.longitude]}
                onClose={() => setSelectedEntity(null)}
                autoPan
              >
                <div>
                  <p className="font-bold">{selectedEntity.nom}</p>
                  <p className="text-xs">{selectedEntity.region}</p>
                  <p className="text-xs">👶 {selectedEntity.enfantsInscrits} — {selectedEntity.statut}</p>
                </div>
              </Popup>
            )}
          </MapContainer>
        </div>
      </div>

      {/* Légende */}
      <div className="mt-4 flex items-center gap-4 text-sm">
        <span className="w-3 h-3 bg-blue-500 rounded-full" /> Active
        <span className="w-3 h-3 bg-slate-400 rounded-full" /> Inactif
      </div>

      {showLocateAI && (
        <div className="fixed inset-0 z-[999] grid place-items-center bg-black/35 p-4">
          <div className="w-full max-w-xl rounded-2xl border border-white/30 bg-white p-5 shadow-2xl">
            <div className="mb-3 flex items-center justify-between">
              <div className="text-lg font-extrabold">Localiser par IA </div>
              <button onClick={()=>setShowLocateAI(false)} className="rounded-lg px-2 py-1 text-sm text-gray-600 hover:bg-gray-100">✕</button>
            </div>
            <p className="text-sm text-slate-600">Ici tu brancheras ton prompt ou ton workflow.</p>
          </div>
        </div>
      )}

      {/* print styles / animations (inchangés) */}
      <style>{`
        @media print { section { box-shadow: none !important; } table { print-color-adjust: exact; -webkit-print-color-adjust: exact; } }
        @keyframes gradient-slide { 0%{background-position:0% 50%} 100%{background-position:100% 50%} }
        .animate-gradient-slide { background-size:200% 200%; animation: gradient-slide 3s linear infinite; }
        @keyframes ripple { from{transform:scale(.2);opacity:.35} to{transform:scale(1.2);opacity:0} }
        .animate-ripple { animation:ripple .6s ease-out forwards }
        @keyframes fadeUp { from{opacity:0;transform:translateY(6px)} to{opacity:1;transform:translateY(0)} }
        .animate-fadeUp { animation: fadeUp .35s ease-out both }
        @keyframes spin-slow { to{ transform: rotate(360deg) } }
        .animate-spin-slow { animation: spin-slow 6s linear infinite }
        @keyframes earth-wobble { 0%{transform:translateY(0) rotate(0)} 25%{transform:translateY(-1px) rotate(1.5deg)}
          50%{transform:translateY(0) rotate(0)} 75%{transform:translateY(1px) rotate(-1.5deg)} 100%{transform:translateY(0) rotate(0)}}
        .animate-earth-wobble { animation: earth-wobble 2.8s ease-in-out infinite }
      `}</style>
    </Card>
  );
};

export default CrechesMap;
