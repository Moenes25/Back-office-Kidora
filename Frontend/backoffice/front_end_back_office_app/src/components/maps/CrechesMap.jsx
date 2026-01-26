// src/components/maps/CrechesMap.jsx
import React, { useState, useRef, useMemo, useEffect } from "react";
import Card from "components/card";
import { MapContainer, TileLayer, Marker, Popup, Circle } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import api from "services/api";
// npm i lucide-react
import { Map as MapIcon, Compass, Target, Sun } from "lucide-react";

/* ====== réglage rapide de hauteur ====== */
const MAP_HEIGHT = 490; // ⬅️ augmente/descends cette valeur
const containerStyle = { width: "100%", height: `${MAP_HEIGHT}px`, borderRadius: "16px" };
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
  creches:   { label: "crèches",   color: "#6366f1" },
  garderies: { label: "garderies", color: "#f59e0b" },
  ecoles:    { label: "écoles",    color: "#10b981" },
};

const hexToRgba = (hex, a = 1) => {
  const v = hex.replace("#", "");
  const b = parseInt(v.length === 3 ? v.split("").map(x => x + x).join("") : v, 16);
  const r = (b >> 16) & 255, g = (b >> 8) & 255, bl = b & 255;
  return `rgba(${r}, ${g}, ${bl}, ${a})`;
};

/* ---------- helpers backend → front ---------- */
function mapType(t) {
  const x = (t || "").toString().toUpperCase();
  if (x === "CRECHE" || x === "CRÈCHE") return "creches";
  if (x === "GARDERIE") return "garderies";
  if (x === "ECOLE" || x === "ÉCOLE") return "ecoles";
  return null;
}
function parseLatLngFromUrl(url) {
  if (!url) return null;
  try {
    const u = new URL(url);
    const q = u.searchParams.get("q");
    if (q && q.includes(",")) {
      const [lat, lng] = q.split(",").map(Number);
      if (Number.isFinite(lat) && Number.isFinite(lng)) return { lat, lng };
    }
    const m = url.match(/@(-?\d+(\.\d+)?),\s*(-?\d+(\.\d+)?)/);
    if (m) {
      const lat = Number(m[1]); const lng = Number(m[3]);
      if (Number.isFinite(lat) && Number.isFinite(lng)) return { lat, lng };
    }
  } catch {}
  return null;
}

/* ---------- centroïdes ---------- */
const REGION_CENTERS = {
  "Tunis": { lat: 36.8065, lng: 10.1815 }, "Ariana": { lat: 36.8665, lng: 10.1647 },
  "Ben Arous": { lat: 36.7435, lng: 10.2310 }, "Manouba": { lat: 36.8080, lng: 10.0970 },
  "Nabeul": { lat: 36.4510, lng: 10.7350 }, "Zaghouan": { lat: 36.4020, lng: 10.1420 },
  "Bizerte": { lat: 37.2746, lng: 9.8739 }, "Béja": { lat: 36.7256, lng: 9.1817 },
  "Jendouba": { lat: 36.5010, lng: 8.7802 }, "Le Kef": { lat: 36.1742, lng: 8.7049 },
  "Siliana": { lat: 36.0840, lng: 9.3700 }, "Sousse": { lat: 35.8256, lng: 10.6360 },
  "Monastir": { lat: 35.7777, lng: 10.8262 }, "Mahdia": { lat: 35.5047, lng: 10.9956 },
  "Kairouan": { lat: 35.6781, lng: 10.0963 }, "Kasserine": { lat: 35.1676, lng: 8.8365 },
  "Sidi Bouzid": { lat: 35.0382, lng: 9.4857 }, "Sfax": { lat: 34.7406, lng: 10.7603 },
  "Gabès": { lat: 33.8815, lng: 10.0982 }, "Médenine": { lat: 33.3549, lng: 10.5055 },
  "Tataouine": { lat: 32.9297, lng: 10.4518 }, "Gafsa": { lat: 34.4250, lng: 8.7842 },
  "Tozeur": { lat: 33.9197, lng: 8.1335 }, "Kébili": { lat: 33.7055, lng: 8.9653 }
};
const GOV_NORD   = ["Tunis","Ariana","Ben Arous","Manouba","Nabeul","Zaghouan","Bizerte","Béja","Jendouba","Le Kef","Siliana"];
const GOV_CENTRE = ["Sousse","Monastir","Mahdia","Kairouan","Sidi Bouzid","Kasserine","Sfax"];
const GOV_SUD    = ["Gabès","Médenine","Tataouine","Gafsa","Tozeur","Kébili"];

const normalize = (s) => s?.normalize("NFD").replace(/\p{Diacritic}/gu,"") ?? "";
const inList = (name, list) => list.some(g => normalize(g).toLowerCase() === normalize(name).toLowerCase());

/* ---------- heat color ---------- */
const lerp = (a,b,t)=>a+(b-a)*t;
const colorScale = (v) => {
  const g = { r:34,g:197,b:94 }, r = { r:239,g:68,b:68 };
  const rr = Math.round(lerp(g.r, r.r, v));
  const gg = Math.round(lerp(g.g, r.g, v));
  const bb = Math.round(lerp(g.b, r.b, v));
  return `rgba(${rr},${gg},${bb},0.55)`;
};

/* ---------- KPI card (dark-mode safe) ---------- */
function KPIRegionCard({ title, value, percent, Icon, tones }) {
  const p = Math.max(0, Math.min(100, percent || 0));
  const r = 18, C = 2 * Math.PI * r, dash = (p / 100) * C;

  return (
    <div className="relative rounded-2xl border border-gray-200 bg-white p-4 shadow-lg dark:border-white/10 dark:bg-navy-800 ">
      {/* halo doux (moins intense en dark) */}
      <div className={`pointer-events-none absolute -right-10 -top-10 h-28 w-28 rounded-full blur-2xl ${tones.glow} dark:opacity-60`} />
      <div className="flex items-center justify-between ">
        <div className="flex items-center gap-2">
          <span className={`grid h-8 w-8 place-items-center rounded-lg ${tones.iconBg} dark:bg-white/10`}>
            {/* lucide utilise currentColor → on force une couleur visible */}
            <Icon className={`h-4 w-4 ${tones.icon} dark:text-white`} strokeWidth={2.25} />
          </span>
          <span className="text-[11px] font-semibold tracking-wide text-gray-600 dark:text-gray-300">{title}</span>
        </div>

        {/* Anneau progress (SVG) */}
        <svg width="54" height="54" viewBox="0 0 54 54" className="overflow-visible">
          <circle cx="27" cy="27" r={r} fill="none" className="stroke-gray-200 dark:stroke-gray-700" strokeWidth="6" />
          <circle
            cx="27" cy="27" r={r} fill="none"
            stroke={tones.ring}
            className="dark:stroke-white/70"
            strokeWidth="6"
            strokeDasharray={`${dash} ${C - dash}`}
            strokeLinecap="round"
            transform="rotate(-90 27 27)"
          />
          <text x="27" y="29.5" textAnchor="middle" className="fill-gray-600 dark:fill-gray-200" fontSize="10" fontWeight="700">
            {p}%
          </text>
        </svg>
      </div>

      <div className="mt-2 text-3xl font-extrabold text-gray-900 dark:text-white">{value}</div>

      <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-gray-100 dark:bg-gray-700">
        <div className={`${tones.bar} h-full rounded-full`} style={{ width: `${p}%`, transition: "width .45s ease" }} />
      </div>
    </div>
  );
}

const CrechesMap = () => {
  const [selectedType, setSelectedType] = useState("creches");
  const [items, setItems] = useState([]);
  const mapRef = useRef(null);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const { data = [] } = await api.get("/etablissement/all");
        const norm = (data || [])
          .map((e) => {
            const grp = mapType(e?.type);
            const geoUrl = parseLatLngFromUrl(e?.url_localisation);
            const geoReg = REGION_CENTERS[e?.region] || null;
            return {
              id: e?.idEtablissment || e?.id || (crypto?.randomUUID ? crypto.randomUUID() : String(Math.random())),
              nom: e?.nomEtablissement || "—",
              type: grp,
              region: e?.region || "—",
              latitude: (geoUrl?.lat ?? geoReg?.lat) ?? null,
              longitude: (geoUrl?.lng ?? geoReg?.lng) ?? null,
              enfantsInscrits: Number(e?.nombreEnfants ?? 0),
              actif: !!e?.isActive,
            };
          })
          .filter((e) => !!e.type);
        if (alive) setItems(norm);
      } catch (err) { console.error("Erreur /etablissement/all :", err); if (alive) setItems([]); }
    })();
    return () => { alive = false; };
  }, []);

  const meta = TYPE_META[selectedType];
  const current = useMemo(() => items.filter(x => x.type === selectedType), [items, selectedType]);

  useEffect(() => {
    if (!mapRef.current) return;
    const pts = current.filter(e => Number.isFinite(e.latitude) && Number.isFinite(e.longitude))
      .map(e => [e.latitude, e.longitude]);
    if (pts.length === 0) { mapRef.current.setView([defaultCenter.lat, defaultCenter.lng], 6); return; }
    if (pts.length === 1) { mapRef.current.setView(pts[0], 11); return; }
    const bounds = L.latLngBounds(pts);
    mapRef.current.fitBounds(bounds, { padding: [30, 30] });
  }, [current]);

  const counts = useMemo(() => {
    let n=0,c=0,s=0;
    for (const e of current) {
      if (!e.region) continue;
      if (inList(e.region, GOV_NORD)) n++;
      else if (inList(e.region, GOV_CENTRE)) c++;
      else if (inList(e.region, GOV_SUD)) s++;
    }
    return { nord:n, centre:c, sud:s };
  }, [current]);

  const maxChildren = useMemo(() => Math.max(1, ...current.map(e => e.enfantsInscrits || 0)), [current]);
  const onMapLoad = (map) => { mapRef.current = map; };

  const total = current.length || 1;
  const pctNord   = Math.round((counts.nord   / total) * 100);
  const pctCentre = Math.round((counts.centre / total) * 100);
  const pctSud    = Math.round((counts.sud    / total) * 100);

  return (
    <Card extra="relative overflow-hidden rounded-3xl p-0 shadow-xl">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-gray-100 bg-indigo-600 px-5 py-4 text-white dark:from-indigo-700 dark:via-indigo-800 dark:to-violet-700">
        <div className="flex items-center gap-3">
          <span className="grid size-9 place-items-center rounded-lg bg-white/15 ring-1 ring-white/20">
            <MapIcon className="h-5 w-5 text-white" strokeWidth={2.2} />
          </span>
          <div>
            <h3 className="text-sm font-semibold leading-tight">Carte des {meta.label}</h3>
            <p className="text-xs/relaxed text-white/85">{current.length} établissements</p>
          </div>
        </div>

        <div className="flex overflow-hidden rounded-xl ring-1 ring-white/25">
          {["creches","garderies","ecoles"].map((t) => {
            const active = selectedType === t;
            return (
              <button
                key={t}
                onClick={() => setSelectedType(t)}
                className={["px-3 py-1.5 text-xs font-semibold transition-colors",
                  active ? "bg-white/20" : "bg-white/10 hover:bg-white/15"].join(" ")}
                style={{ color: active ? "#fff" : "rgba(255,255,255,.9)" }}
              >
                {TYPE_META[t].label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Corps : Map + Cards */}
      <div className="grid gap-0 p-0 lg:grid-cols-3">
        {/* MAP */}
        <div className="relative lg:col-span-2">
          <div className="p-4">
            <div className="overflow-hidden rounded-2xl ring-1 ring-gray-200 dark:ring-white/10">
              <MapContainer
                center={[defaultCenter.lat, defaultCenter.lng]}
                zoom={6}
                style={containerStyle}
                whenCreated={onMapLoad}
              >
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution="&copy; OpenStreetMap contributors"
                />
                {current.filter(e => Number.isFinite(e.latitude) && Number.isFinite(e.longitude)).map((e) => {
                  const intensity = Math.min(1, (e.enfantsInscrits || 0) / maxChildren);
                  const color = colorScale(intensity);
                  const radius = 12000 * (0.4 + intensity * 1.2);
                  return (
                    <Circle
                      key={`heat-${e.id}`}
                      center={[e.latitude, e.longitude]}
                      radius={radius}
                      pathOptions={{ color, fillColor: color, fillOpacity: 0.55, weight: 0 }}
                    />
                  );
                })}
                {current.filter(e => Number.isFinite(e.latitude) && Number.isFinite(e.longitude)).map((e) => (
                  <Marker key={`mk-${e.id}`} position={[e.latitude, e.longitude]} icon={icon}>
                    <Popup>
                      <div>
                        <p className="font-semibold">{e.nom}</p>
                        <p className="text-xs">📍 {e.region}</p>
                        <p className="text-xs">👶 {e.enfantsInscrits || 0}</p>
                      </div>
                    </Popup>
                  </Marker>
                ))}
              </MapContainer>
            </div>
          </div>
        </div>

        {/* COLONNE DROITE — KPI */}
        <div className="flex flex-col gap-3 bg-gray-50/60 p-4 dark:bg-navy-800">
          <KPIRegionCard
            title="Nord"
            value={counts.nord}
            percent={pctNord}
            Icon={Compass}
            tones={{
              ring: "#10b981",
              glow: "from-emerald-400/25 to-transparent bg-gradient-to-br",
              iconBg: "bg-emerald-100",
              icon: "text-emerald-600",
              bar: "bg-emerald-500",
            }}
          />
          <KPIRegionCard
            title="Centre"
            value={counts.centre}
            percent={pctCentre}
            Icon={Target}
            tones={{
              ring: "#f59e0b",
              glow: "from-amber-400/25 to-transparent bg-gradient-to-br",
              iconBg: "bg-amber-100",
              icon: "text-amber-600",
              bar: "bg-amber-500",
            }}
          />
          {/* Icône SUD corrigée (= même style) */}
          <KPIRegionCard
            title="Sud"
            value={counts.sud}
            percent={pctSud}
            Icon={Sun}
            tones={{
              ring: "#ef4444",
              glow: "from-red-400/25 to-transparent bg-gradient-to-br",
              iconBg: "bg-red-100",
              icon: "text-red-600",
              bar: "bg-red-500",
            }}
          />
        </div>
      </div>

      {/* Légende */}
      <div className="flex items-center justify-between border-t border-gray-100 px-5 py-3 text-xs text-gray-600 dark:border-white/10 dark:text-gray-300">
        <div className="flex items-center gap-4">
          <span className="inline-flex items-center gap-2">
            <span className="inline-block size-3 rounded-full bg-emerald-500/90" />
            faible
          </span>
          <span className="inline-flex items-center gap-2">
            <span className="inline-block size-3 rounded-full bg-amber-500/90" />
            moyen
          </span>
          <span className="inline-flex items-center gap-2">
            <span className="inline-block size-3 rounded-full bg-red-500/90" />
            élevé
          </span>
        </div>

        <div className="hidden sm:flex items-center gap-2">
          {Object.entries(TYPE_META).map(([k,v]) => (
            <button
              key={k}
              onClick={() => setSelectedType(k)}
              className="rounded-full border px-2 py-0.5 text-[11px] font-semibold"
              style={{
                borderColor: hexToRgba(v.color, .25),
                background: hexToRgba(v.color, selectedType===k ? .14 : 0),
                color: selectedType===k ? v.color : "#475569"
              }}
            >
              {v.label}
            </button>
          ))}
        </div>
      </div>
    </Card>
  );
};

export default CrechesMap;
