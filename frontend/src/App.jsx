import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";

const API_URL = "http://localhost:8000";

// Pine Ridge Memorial Gardens, Ajax -- roughly centered on the burial
// fields (not the ornamental garden near the entrance, which is a
// different part of the property).
const CEMETERY_CENTER = [43.8858, -79.0665];
const DEFAULT_ZOOM = 18;

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

function App() {
  const [plots, setPlots] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

  const plotsWithGps = plots.filter(
    (plot) => plot.latitude != null && plot.longitude != null
  );

  const filteredPlots = plotsWithGps.filter((plot) =>
    plot.people.some((person) =>
      person.full_name.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const peopleWithoutLocation = plots.filter(
    (plot) => plot.latitude == null || plot.longitude == null
  ).length;

  return (
    <div className="app-shell">
      <header className="app-header">
        <h1>Pine Ridge Grave Tracker</h1>
        <div className="header-controls">
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
      {!loading && !error && peopleWithoutLocation > 0 && (
        <div className="status-banner">
          {peopleWithoutLocation} {peopleWithoutLocation === 1 ? "person" : "people"} not shown yet -- waiting on GPS coordinates.
        </div>
      )}

      <MapContainer
        center={CEMETERY_CENTER}
        zoom={DEFAULT_ZOOM}
        style={{ height: "calc(100vh - 80px)", width: "100%" }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {(searchTerm ? filteredPlots : plotsWithGps).map((plot) => (
          <Marker
            key={plot.id}
            position={[plot.latitude, plot.longitude]}
            icon={pinIcon}
          >
            <Popup>
              <div className="popup-content">
                {plot.section && (
                  <strong>
                    Section {plot.section}, Row {plot.row}, Plot{" "}
                    {plot.plot_number}
                  </strong>
                )}
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
        ))}
      </MapContainer>
    </div>
  );
}

export default App;
