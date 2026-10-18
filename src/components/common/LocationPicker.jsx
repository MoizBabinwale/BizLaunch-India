import { useEffect, useRef, useState } from "react";
import { MapPin, Search, X } from "lucide-react";

const LEAFLET_VERSION = "1.9.4";
const LEAFLET_CSS_ID = "leaflet-css";
let leafletPromise;
let lastGeocodingRequest = 0;
let geocodingQueue = Promise.resolve();

const loadLeaflet = () => {
  if (window.L) return Promise.resolve(window.L);
  if (leafletPromise) return leafletPromise;

  leafletPromise = new Promise((resolve, reject) => {
    if (!document.getElementById(LEAFLET_CSS_ID)) {
      const stylesheet = document.createElement("link");
      stylesheet.id = LEAFLET_CSS_ID;
      stylesheet.rel = "stylesheet";
      stylesheet.href = `https://unpkg.com/leaflet@${LEAFLET_VERSION}/dist/leaflet.css`;
      document.head.appendChild(stylesheet);
    }

    const script = document.createElement("script");
    script.src = `https://unpkg.com/leaflet@${LEAFLET_VERSION}/dist/leaflet.js`;
    script.async = true;
    script.onload = () => {
      if (window.L) resolve(window.L);
      else {
        leafletPromise = null;
        reject(new Error("The map library did not initialize. Check your internet connection and try again."));
      }
    };
    script.onerror = () => {
      leafletPromise = null;
      reject(new Error("The map could not be loaded. Check your internet connection and try again."));
    };
    document.head.appendChild(script);
  });

  return leafletPromise;
};

const requestNominatim = async (params) => {
  const request = geocodingQueue.then(async () => {
    const delay = Math.max(0, 1100 - (Date.now() - lastGeocodingRequest));
    if (delay) await new Promise((resolve) => setTimeout(resolve, delay));
    lastGeocodingRequest = Date.now();

    const response = await fetch(`https://nominatim.openstreetmap.org/${params}`);
    if (!response.ok) {
      throw new Error("Address lookup is temporarily unavailable. You can still select the map point and enter the address manually.");
    }
    return response.json();
  });
  geocodingQueue = request.catch(() => {});
  return request;
};

const toLocation = (result) => {
  const address = result.address || {};
  const street = [address.house_number, address.road].filter(Boolean).join(" ");
  const latitude = Number(result.lat);
  const longitude = Number(result.lon);
  return {
    address: street || result.name || result.display_name || "",
    area: address.neighbourhood || address.suburb || address.quarter || address.city_district || "",
    city: address.city || address.town || address.village || address.municipality || "",
    state: address.state || address.region || "",
    postalCode: address.postcode || "",
    latitude: latitude.toFixed(6),
    longitude: longitude.toFixed(6),
    googleMapsUrl: `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`,
  };
};

export default function LocationPicker({ latitude, longitude, onSelect }) {
  const [isOpen, setIsOpen] = useState(false);
  const [leaflet, setLeaflet] = useState(null);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [selection, setSelection] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const mapElement = useRef(null);
  const mapRef = useRef(null);
  const markerRef = useRef(null);

  useEffect(() => {
    if (!isOpen) return undefined;
    let active = true;
    setLoading(true);
    setError("");

    loadLeaflet()
      .then((library) => {
        if (active) setLeaflet(library);
      })
      .catch((reason) => {
        if (active) setError(reason.message || "The map could not be loaded.");
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen || !leaflet || !mapElement.current || mapRef.current) return undefined;

    const hasLocation =
      latitude !== "" &&
      longitude !== "" &&
      Number.isFinite(Number(latitude)) &&
      Number.isFinite(Number(longitude));
    const center = hasLocation
      ? [Number(latitude), Number(longitude)]
      : [22.9734, 78.6569];
    const map = leaflet.map(mapElement.current).setView(center, hasLocation ? 15 : 5);
    leaflet
      .tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 19,
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      })
      .addTo(map);
    const marker = leaflet.circleMarker(center, {
      radius: 9,
      color: "#ffffff",
      weight: 3,
      fillColor: "#2563eb",
      fillOpacity: 1,
    });
    if (hasLocation) marker.addTo(map);
    mapRef.current = map;
    markerRef.current = marker;

    const onMapClick = async ({ latlng }) => {
      marker.setLatLng(latlng).addTo(map);
      map.panTo(latlng);
      setSelection({
        latitude: latlng.lat.toFixed(6),
        longitude: latlng.lng.toFixed(6),
        googleMapsUrl: `https://www.google.com/maps/search/?api=1&query=${latlng.lat},${latlng.lng}`,
      });
      setError("");
      setLoading(true);
      try {
        const result = await requestNominatim(
          `reverse?format=jsonv2&addressdetails=1&lat=${encodeURIComponent(latlng.lat)}&lon=${encodeURIComponent(latlng.lng)}`
        );
        if (result) setSelection(toLocation(result));
        else setError("No address was found for this point. You can still use the coordinates and enter the address manually.");
      } catch (reason) {
        setError(reason.message || "Address lookup failed. You can still use the coordinates.");
      } finally {
        setLoading(false);
      }
    };

    map.on("click", onMapClick);
    const timer = window.setTimeout(() => map.invalidateSize(), 0);

    return () => {
      window.clearTimeout(timer);
      map.off("click", onMapClick);
      map.remove();
      mapRef.current = null;
      markerRef.current = null;
    };
  }, [isOpen, leaflet, latitude, longitude]);

  const searchPlaces = async (event) => {
    event.preventDefault();
    const search = query.trim();
    if (!search) return;
    setLoading(true);
    setError("");
    setResults([]);
    try {
      const matches = await requestNominatim(
        `search?format=jsonv2&addressdetails=1&countrycodes=in&limit=5&q=${encodeURIComponent(search)}`
      );
      setResults(matches);
      if (!matches.length) setError("No matching places were found. Try a fuller address or click the map.");
    } catch (reason) {
      setError(reason.message || "Place search failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const chooseResult = (result) => {
    const location = toLocation(result);
    setSelection(location);
    setResults([]);
    if (mapRef.current && markerRef.current) {
      const point = [Number(location.latitude), Number(location.longitude)];
      markerRef.current.setLatLng(point).addTo(mapRef.current);
      mapRef.current.setView(point, 16);
    }
  };

  const close = () => {
    setIsOpen(false);
    setLeaflet(null);
    setSelection(null);
    setResults([]);
    setError("");
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="inline-flex items-center gap-2 rounded-xl border border-primary px-4 py-2.5 text-sm font-semibold text-primary hover:bg-primary-sky"
      >
        <MapPin size={16} /> Pick location on map
      </button>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/60 p-3 sm:p-6">
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="location-picker-title"
            className="flex max-h-[95vh] w-full max-w-4xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl"
          >
            <header className="flex items-center justify-between gap-4 border-b border-border p-4 sm:px-6">
              <div>
                <h2 id="location-picker-title" className="text-lg font-bold">Choose your shop location</h2>
                <p className="mt-1 text-sm text-muted">Search for your shop or click its exact location on the map.</p>
              </div>
              <button type="button" onClick={close} aria-label="Close map" className="rounded-lg p-2 text-muted hover:bg-slate-100">
                <X size={20} />
              </button>
            </header>
            <div className="space-y-3 p-4 sm:px-6">
              <form onSubmit={searchPlaces} className="flex gap-2">
                <input
                  type="search"
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Search a shop, street, or place in India"
                  className="block min-w-0 flex-1 rounded-xl border border-border px-3 py-2.5 text-sm leading-5 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/10"
                  aria-label="Search for a shop location"
                />
                <button type="submit" disabled={loading || !query.trim()} className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-white disabled:opacity-50">
                  <Search size={16} /> Search
                </button>
              </form>
              {results.length > 0 && (
                <ul className="max-h-36 overflow-auto rounded-xl border border-border">
                  {results.map((result) => (
                    <li key={result.place_id}>
                      <button type="button" onClick={() => chooseResult(result)} className="w-full border-b border-border px-3 py-2 text-left text-sm last:border-b-0 hover:bg-primary-sky">
                        {result.display_name}
                      </button>
                    </li>
                  ))}
                </ul>
              )}
              {error && <p role="alert" className="text-sm text-red-700">{error}</p>}
              {loading && <p role="status" className="text-sm text-muted">Loading map or finding the address…</p>}
              <div ref={mapElement} className="h-[48vh] min-h-72 w-full rounded-xl bg-slate-100" />
              {selection && (
                <p className="text-sm text-text-secondary">
                  <strong>Selected:</strong> {[selection.address, selection.area, selection.city, selection.state, selection.postalCode].filter(Boolean).join(", ") || `${selection.latitude}, ${selection.longitude}`}
                </p>
              )}
              <p className="text-xs text-muted">Map data © OpenStreetMap contributors. Address search uses OpenStreetMap Nominatim.</p>
            </div>
            <footer className="flex justify-end gap-3 border-t border-border p-4 sm:px-6">
              <button type="button" onClick={close} className="rounded-xl border border-border px-4 py-2.5 text-sm font-semibold">Cancel</button>
              <button
                type="button"
                disabled={!selection || loading}
                onClick={() => {
                  onSelect(selection);
                  close();
                }}
                className="rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50"
              >
                Use this location
              </button>
            </footer>
          </section>
        </div>
      )}
    </>
  );
}
