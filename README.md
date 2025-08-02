# 🌩️ Region Warning and Alerts

A lightweight, geospatially aware public alert system that fetches and displays live weather and emergency alerts using official CAP feeds. Designed for use by local government, Civil Defence groups, and community organisations.

---

## ⚙️ Features

- 🛰 **Real-Time Alert Detection**  
  Fetches CAP alerts from trusted sources like MetService and Civil Defence feeds

- 🗺 **Geospatial Filtering**  
  Displays only alerts that intersect with defined GeoJSON areas (e.g. districts, regions)

- 🧭 **Custom Zones**  
  Supports manually drawn polygons using Leaflet export tools or external GeoJSON files

- 🧰 **Flexible Configuration**  
  Easily enable/disable alert sources, define regions, and toggle display modes

- 🧾 **Readable Alert Display**  
  Transforms structured CAP XML into user-friendly summaries with severity, expiry, and badges

- 🔁 **Serverless Architecture**  
  Works with just HTML + JavaScript — deployable to GitHub Pages or static sites

- 🧪 **Archived Feed Testing**  
  Swap in archived alerts for demos or disaster response simulations

- 🖼 **Embeddable UI**  
  Supports floating widgets or targeted container mode for integration flexibility

---

## 🛠 Example Config

```js
const SHOW_CUSTOM_GEOJSON_ALERTS = true;
const USE_PROXY_FOR_CUSTOM_GEOJSON = true;

const PROXY_URL = "https://yourproxy.example.com?url=";

const CustomGeoAreas = {
  AreaOfInterest1: {
    "type": "FeatureCollection",
    "name": "Test Area",
    "features": [ /* polygon */ ]
  },
  AreaOfInterest2: "https://example.com/area2.geojson"
};
