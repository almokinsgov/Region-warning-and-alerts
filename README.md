🌩️ Region Warning and Alert System
-----------------------------------

**National messaging with a local context**

### 🚁 What It Is

A lightweight, embeddable web tool that displays official **MetService** and **Civil Defence** alerts - filtered by location so users only see warnings that apply to their 
**specific district, suburb, or marae**.

### 🛠️ Tool Overview

The Region Warning and Alert System is a **public-facing component** for council and organisational websites. It uses national CAP feeds and overlays **local boundaries** to show only relevant alerts. It’s designed for clarity, minimal setup, and **real-world use in emergencies**.

### ⚙️ System Capabilities

✅ **Clear, Easy-to-Read Alerts** Concise cards with strong visual cues and minimal noise

📦 **Standards-Based Messaging** Uses official Common Alerting Protocol (CAP) feeds from MetService and Civil Defence

🖘 **Geospatial Filtering** Shows alerts only when they intersect with defined boundaries (e.g., district, marae)

🧽 **Highly Configurable** Filter by agency, timeframe, message type (e.g., cancelled), or custom-drawn areas

🌐 **National Feeds, Local Impact** Localises national messaging to support grounded, place-based response

👥 **Expanded Emergency Reach** Helps warnings reach people checking local websites rather than national ones

🕒 **Activates Only When Needed** Interface remains hidden unless relevant alerts are active or upcoming

⚡ **Lightweight and Serverless** Built in HTML/JavaScript, deployable on any modern website or GitHub Pages

🔗 **Authoritative by Design** Summarises alerts clearly while linking back to full official sources

🔄 **Supports Custom GeoJSON** Use your own polygons or external shapefiles for flexible boundary control

💻 **CMS-Friendly and Embeddable** Works with modern content management systems and public sector platforms

### 🔄 How It Works - Front-End Process

1.  **GeoJSON Boundary Loaded** District or custom boundary files are loaded from URL or local config
2.  **Fetch Official Alert Feeds** CAP XML feeds are retrieved from MetService and Civil Defence (via proxy if needed)
3.  **Parse and Filter Alerts** Alerts are checked for geographic intersection with defined boundaries
4.  **Time and Status Filtering** The system checks if the alert is active, upcoming, expired, or cancelled — based on configuration
5.  **Display Interface** If alerts qualify, a floating widget or inline alert area becomes visible 
6.  **User Reads and Responds** Alerts are formatted for fast scanning, clearly showing severity, agency, coverage area, and expiry time, with links to full official information

### Getting started
Add the code below to your website, please note you will need to change the config settings. 
Config page coming soon.
```
<!-- Region Warning and Alerts created by Amorangi Mathews -->
<!-- Version 1.3.2.0 -->
<!-- Stylesheet -->
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/almokinsgov/Region-warning-and-alerts@main/V1320/RWASJS.css" />
<!-- Turf, used for geospatial processing -->
<script src="https://unpkg.com/@turf/turf@6/turf.min.js"></script>
<!-- Config and RWAS core-->
<script src="https://cdn.jsdelivr.net/gh/almokinsgov/Region-warning-and-alerts@main/V1320/RWASJS.js" defer></script>
<!-- Floating Alerts UI, needed to trigger-->
<div id="floating-alerts-container"></div>
<button id="toggle-alerts-btn" title="Weather Alerts">⛈️</button>
```
### Check out the demo
A demo can be found on the landing page - [RWAS homepage](https://almokinsgov.github.io/Region-warning-and-alerts/)

### Register your interest
Want to add local warnings and alerts to your website? Register your interest here. [Google Forms](https://forms.gle/wP68BVjsRVyvMVZi9)
