import { Rectangle, Circle, Polyline } from "react-leaflet";
import { LANDMARKS } from "./geo";

// A stylized, hand-tunable backdrop for the grounds -- not a literal trace
// of the property, just enough visual structure (paths, tree clusters, the
// pond) to feel like a real place while staying in the same meter-based
// coordinate system as the grave pins. Swap or extend this freely once you
// have your own custom artwork; nothing about pin placement depends on it.

const FIELD_BOUNDS = [
  [-600, -600],
  [600, 600],
];

// Loosely scattered tree clusters (rough coordinates, adjust to taste)
const TREE_CLUSTERS = [
  [120, -180], [90, -210], [150, -140],
  [-40, 160], [-70, 190], [-20, 140],
  [200, 40], [230, 10], [180, 70],
  [-160, -60], [-190, -30], [-140, -90],
];

const PATHS = [
  [
    [0, 0],
    [80, -30],
    [180, -20],
    LANDMARKS.parkingOffice,
  ],
  [
    [0, 0],
    [-40, 60],
    [-20, 140],
    LANDMARKS.pond,
  ],
];

function MapBackground() {
  return (
    <>
      <Rectangle
        bounds={FIELD_BOUNDS}
        pathOptions={{ fillColor: "#3B4A2F", fillOpacity: 1, stroke: false }}
      />

      {PATHS.map((points, i) => (
        <Polyline
          key={`path-${i}`}
          positions={points}
          pathOptions={{ color: "#E8DCC0", weight: 6, opacity: 0.55, lineCap: "round" }}
        />
      ))}

      {TREE_CLUSTERS.map(([y, x], i) => (
        <Circle
          key={`tree-${i}`}
          center={[y, x]}
          radius={14}
          pathOptions={{ fillColor: "#5C7A4C", fillOpacity: 0.55, stroke: false }}
        />
      ))}

      <Circle
        center={LANDMARKS.pond}
        radius={22}
        pathOptions={{ fillColor: "#7FA8B3", fillOpacity: 0.8, stroke: false }}
      />
    </>
  );
}

export default MapBackground;
