import { useEffect, useState } from "react";
import { MapContainer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import { gpsToLocal } from "./geo";
import MapBackground from "./MapBackground";

const API_URL = "http://localhost:8000";

function makePinIcon(delay) {
  return L.divIcon({
    className: "",
    html: `
      <div class="grave-pin" style="--delay:${delay}ms">
        <div class="grave-pin__halo"></div>
        <svg class="grave-pin__mark" width="18" height="24" viewBox="0 0 30 40">
          <path d="M15 0C6.7 0 0 6.7 0 15c0 11.2 15 25 15 25s15-13.8 15-25C30 6.7 23.3 0 15 0z" fill="#B98D3E"/>
          <circle cx="15" cy="15" r="5.5" fill="#F2ECDD"/>
        </svg>
      </div>
    `,
    iconSize: [18, 24],
    iconAnchor: [9, 24],
    popupAnchor: [0, -22],
  });
}

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

  const visiblePlots = searchTerm ? filteredPlots : plotsWithGps;

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
          {peopleWithoutLocation}{" "}
          {peopleWithoutLocation === 1 ? "person" : "people"} not shown yet
          -- waiting on GPS coordinates.
        </div>
      )}

      <MapContainer
        crs={L.CRS.Simple}
        center={[0, 0]}
        zoom={2}
        minZoom={0}
        maxZoom={6}
        style={{ height: "calc(100vh - 80px)", width: "100%" }}
      >
        <MapBackground />

        {visiblePlots.map((plot, i) => {
          const position = gpsToLocal(plot.latitude, plot.longitude);
          return (
            <Marker
              key={plot.id}
              position={position}
              icon={makePinIcon(i * 80)}
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
          );
        })}
      </MapContainer>
    </div>
  );
}

export default App;
