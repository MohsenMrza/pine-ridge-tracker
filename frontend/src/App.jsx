import { useEffect, useRef, useState } from "react";
import { MapContainer, ImageOverlay, Marker, Popup, Polygon } from "react-leaflet";
import L from "leaflet";
import { SECTIONS } from "./sections";

const API_URL = "http://localhost:8000";

const pinIcon = new L.Icon({
  iconUrl:
    "data:image/svg+xml;base64," +
    btoa(
      `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="42" viewBox="0 0 32 42">
        <path d="M16 0C7.2 0 0 7.2 0 16c0 12 16 26 16 26s16-14 16-26c0-8.8-7.2-16-16-16z" fill="#6b5b95"/>
        <circle cx="16" cy="16" r="6" fill="#fff"/>
      </svg>`
    ),
  iconSize: [32, 42],
  iconAnchor: [16, 42],
  popupAnchor: [0, -38],
});

// Real dimensions of frontend/public/cemetery-map.png (Pine Ridge site plan)
const IMAGE_WIDTH = 924;
const IMAGE_HEIGHT = 1126;
const bounds = [
  [0, 0],
  [IMAGE_HEIGHT, IMAGE_WIDTH],
];

function percentToLatLng(map_x, map_y) {
  return [(map_y / 100) * IMAGE_HEIGHT, (map_x / 100) * IMAGE_WIDTH];
}

function sectionPolygon(section) {
  return section.points.map(([x, y]) => percentToLatLng(x, y));
}

function App() {
  const [plots, setPlots] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedSection, setSelectedSection] = useState(null);

  const mapRef = useRef(null);

  useEffect(() => {
    fetch(`${API_URL}/api/plots/`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load plots");
        return res.json();
      })
      .then((data) => {
        setPlots(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  const filteredPlots = plots.filter((plot) =>
    plot.people.some((person) =>
      person.full_name.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  function handleSectionClick(section) {
    setSelectedSection(section.name);
    if (mapRef.current) {
      const polyBounds = L.latLngBounds(sectionPolygon(section));
      mapRef.current.flyToBounds(polyBounds, { padding: [40, 40], duration: 0.6 });
    }
  }

  function resetView() {
    setSelectedSection(null);
    if (mapRef.current) {
      mapRef.current.flyToBounds(bounds, { padding: [20, 20], duration: 0.6 });
    }
  }

  return (
    <div className="app-shell">
      <header className="app-header">
        <h1>Pine Ridge Grave Tracker</h1>
        <div className="header-controls">
          {selectedSection && (
            <button className="reset-btn" onClick={resetView}>
              &larr; {selectedSection}
            </button>
          )}
          <input
            type="text"
            className="search-box"
            placeholder="Search by name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </header>

      {loading && <div className="status-banner">Loading plots...</div>}
      {error && (
        <div className="status-banner error">
          Couldn't reach the backend ({error}). Is the API running?
        </div>
      )}

      <MapContainer
        ref={mapRef}
        crs={L.CRS.Simple}
        bounds={bounds}
        style={{ height: "calc(100vh - 80px)", width: "100%" }}
        maxBounds={bounds}
        minZoom={-1}
      >
        <ImageOverlay url="/cemetery-map.png" bounds={bounds} />

        {SECTIONS.map((section) => {
          const isSelected = selectedSection === section.name;
          return (
            <Polygon
              key={section.name}
              positions={sectionPolygon(section)}
              pathOptions={{
                color: isSelected ? "#6b5b95" : "#8a9a82",
                weight: isSelected ? 3 : 1,
                fillColor: isSelected ? "#6b5b95" : "#8a9a82",
                fillOpacity: isSelected ? 0.22 : 0.06,
              }}
              eventHandlers={{
                click: () => handleSectionClick(section),
                mouseover: (e) => e.target.setStyle({ fillOpacity: 0.18 }),
                mouseout: (e) =>
                  e.target.setStyle({ fillOpacity: isSelected ? 0.22 : 0.06 }),
              }}
            >
              <Popup>{section.name}</Popup>
            </Polygon>
          );
        })}

        {(searchTerm ? filteredPlots : plots).map((plot) => {
          if (plot.map_x == null || plot.map_y == null) return null;
          const position = percentToLatLng(plot.map_x, plot.map_y);
          return (
            <Marker key={plot.id} position={position} icon={pinIcon}>
              <Popup>
                <div className="popup-content">
                  <strong>
                    Section {plot.section}, Row {plot.row}, Plot{" "}
                    {plot.plot_number}
                  </strong>
                  {plot.people.map((person) => (
                    <div key={person.id} className="popup-person">
                      <div className="popup-name">{person.full_name}</div>
                      <div className="popup-dates">
                        {person.birth_date} – {person.death_date}
                      </div>
                      {person.bio && (
                        <div className="popup-bio">{person.bio}</div>
                      )}
                    </div>
                  ))}
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
}

export default App;
