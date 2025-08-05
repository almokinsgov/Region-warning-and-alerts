 function initRWAS() {
  // Your entire current RWAS code goes here
  // Can still use global consts and variables inside
  // DOM manipulation, alert rendering, etc.

 
 // Region warning and alerts - created by Amorangi Mathews 
 //version and current functionality 
  //1.2.1.7 to 1.3.2.0 single html file to JS,CSS and HTML, hosted in Github served with a CDN  
  const version = "1.3.2.0";
  let lastUpdatedTime = new Date();
  const functions = "Alert display, Container, Popup, onset window, non far north display, isstillactivecolour classes, simpilfy, cachefix, expiry tag, sorted, expiry hide, CD alerts added, sorting, badges, formatted alrert for cd, custom geo area with proxy and url support,  newgeojsonurl, temp urls for cd and met, area name extraction and apply to alert html,disable far north alerts, custom new geo json url. area definitions , html edit (msgType removed), multi area in alert html with and for multi location, custom sorted custom area,popup header and footer, restyled header and footer, restyle badges, hide cancelled cd alerts, changed icon to thunderstorm, auto change to warning econ when cd alert is present,button stlyling change, border to popup ";
  //Planned 
  const plannedadds = "cors config, js files and package for other systems, geonet cap feed adition, unplanned out power outages with custom alert and config, div mode, expired alert window with config, unplanned outages from top energy,road closures from nzta,button location,refresh button, duration in hours or days in alert html x hours from x to x";
  //alerts config
  const SHOW_EXPIRED_ALERTS = true; // Change to true to show expired alerts
  const SHOW_NON_FAR_NORTH_ALERTS = false; //show all alerts in the feed
  const REQUIRE_ONSET_WITHIN_WINDOW = true; //filter results based on how long to start time
  const HOUR_WINDOW = 24; //Amount of hours between the alert start time and date and the current time and date
  const proxy = "https://corsproxy.io/?"; //cors proxy url
  //Met service feed url with proxy add in, this should be a github url, we dont want to overload metservices infrastructure in an emergency
  const feedURL = proxy + encodeURIComponent("https://raw.githubusercontent.com/almokinsgov/NZSHAPE/refs/heads/main/alerts/archive/latest_2025-07-28T08-21-52-472Z.xml");
  //Civil defence live feed tester and visialsier - https://codepen.io/Amorangi-Mathews/full/QwjGPyv
  //Met service feed visualiser and tester https://codepen.io/Amorangi-Mathews/full/WbQGRvr
// Civil defence alerts 
  const ENABLE_CD_ALERTS = true; // Set to false to disable Civil Defence alerts
const CD_ALERT_FEED_URL = "https://raw.githubusercontent.com/almokinsgov/NZSHAPE/refs/heads/main/alerts/CivilDefenceTest.xml"; //civil defence alert feed (atom)
  const SHOW_CANCELLED_CD_ALERTS = false; // Change to true to display CD alerts with msgType "Cancel"

 //custom geojson area alerts 
const SHOW_CUSTOM_GEOJSON_ALERTS = false; //Show alerts for custom areas that are defined
const USE_PROXY_FOR_CUSTOM_GEOJSON = true;  //use proxy for custom grojson urls under the custom geo areas

const DISABLE_FAR_NORTH_ALERTS = false;    //Hide Far north geo jason alerts 
//const withinTime = true; legacy content, was the alternative to isitactivestill
  let farNorthGeoJSON = null;
//Far north geojson config
  const GEOJSON_KEY = "farNorthGeoJSON";
  const GEOJSON_TIMESTAMP_KEY = "farNorthGeoJSON_timestamp";
  const GEOJSON_EXPIRY_HOURS = 24; //Time period for Far North geojson, script will check every this hours if the stored geojson is the same as the current one

  //check to see if the stored Far North geojson is still ative, uses geo expiry hours
  function isGeoJSONExpired() {
    const saved = localStorage.getItem(GEOJSON_TIMESTAMP_KEY);
    if (!saved) return true;
    const age = (Date.now() - parseInt(saved)) / (1000 * 60 * 60);
    return age > GEOJSON_EXPIRY_HOURS;
  }
//custom geo areas polygon creator https://codepen.io/Amorangi-Mathews/full/yyYgmLM 
  const CustomGeoAreas = {/*
  Area1: {
    type: "FeatureCollection",
    name: "Area 1",
    features: [
      {
        type: "Feature",
        properties: { Name: "Custom Area 1" },
        geometry: {
          type: "Polygon",
          coordinates: [
            [
              [173.295593, -35.250529],
              [173.298374, -35.251049],
              [173.299805, -35.248748],
              [173.295593, -35.250529]
            ]
          ]
        }
      }
    ]
  },*/
  /*  "Far North": "https://raw.githubusercontent.com/almokinsgov/NZSHAPE/refs/heads/main/Areas/farnorth.geojson", */
    "Ōturū Marae": "https://raw.githubusercontent.com/almokinsgov/NZSHAPE/refs/heads/main/Areas/Marae/oturumarae.geojson",
         "Whangārei District": "https://raw.githubusercontent.com/almokinsgov/NZSHAPE/refs/heads/main/Areas/whangarei.geojson",
 /* "Gisborne": "https://raw.githubusercontent.com/almokinsgov/NZSHAPE/refs/heads/main/Areas/gisborne.geojson",
   "Nelson": "https://raw.githubusercontent.com/almokinsgov/NZSHAPE/refs/heads/main/Areas/nelson.geojson", 
     "Southland": "https://raw.githubusercontent.com/almokinsgov/NZSHAPE/refs/heads/main/Areas/cantosouth.geojson", */
};
  
  // or: const newGeoJSON = { type: "FeatureCollection", features: [...] };
const newGeoJSON = "https://raw.githubusercontent.com/almokinsgov/NZSHAPE/refs/heads/main/Areas/farnorth.geojson";

  //try and load far north geo json
  async function loadFarNorthGeoJSON() {
  if (!isGeoJSONExpired()) {
    try {
      const stored = JSON.parse(localStorage.getItem(GEOJSON_KEY));
      if (stored && stored.type === "FeatureCollection") return stored;
    } catch {
      console.warn("Corrupted stored Far North GeoJSON, regenerating.");
    }
  }

  let finalGeoJSON = null;
//if there is a url load through a proxy if enabled
  try {
    if (typeof newGeoJSON === "string") {
      const url = USE_PROXY_FOR_CUSTOM_GEOJSON ? proxy + encodeURIComponent(newGeoJSON) : newGeoJSON;
      const res = await fetch(url);
      finalGeoJSON = await res.json();
    } else if (newGeoJSON?.type === "FeatureCollection") {
      finalGeoJSON = newGeoJSON;
    }
  } catch (e) {
    console.warn("Failed to load newGeoJSON:", e);
  } 

  if (finalGeoJSON) {
    localStorage.setItem(GEOJSON_KEY, JSON.stringify(finalGeoJSON));
    localStorage.setItem(GEOJSON_TIMESTAMP_KEY, Date.now().toString());
  }

  return finalGeoJSON;
}

//custom sorting for areas displayed in the alert html from the custom geo area

const AREA_DISPLAY_ORDER = [
"Far North District",
"Far North",
"Ōturū Marae",
 "Whangārei District",
"Gisborne",
"Nelson",
"Southland",
];


//Format the times

  function formatReadableTime(iso) {
    if (!iso) return '';
    const d = new Date(iso);
    return d.toLocaleString('en-NZ', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  } 
  //predifinitions and clering 
  let customGeoAreas = [];
let combinedAlertList = []; // Holds all alerts for sorting and display
  
  
  //check metservice feed, create html, sort
async function fetchAlerts() {
  try {
    const res = await fetch(feedURL);
    const xmlText = await res.text();
    const xml = new DOMParser().parseFromString(xmlText, "application/xml");
    const ns = "http://www.w3.org/2005/Atom";
    const entries = [...xml.getElementsByTagNameNS(ns, "entry")];
    const links = entries.map(e => e.querySelector("link[rel='related']")?.getAttribute("href")).filter(Boolean);

    const alertList = [];

    for (const url of links) {
      const capRes = await fetch(proxy + encodeURIComponent(url));
      const capText = await capRes.text();
      const capXML = new DOMParser().parseFromString(capText, "application/xml");
      const capNS = "urn:oasis:names:tc:emergency:cap:1.2";

      const info = capXML.getElementsByTagNameNS(capNS, "info")[0];
      if (!info) continue;

      function getParameterValue(infoNode, paramName) {
        const params = infoNode.getElementsByTagNameNS(capNS, "parameter");
        for (const param of params) {
          const name = param.getElementsByTagNameNS(capNS, "valueName")[0]?.textContent;
          const value = param.getElementsByTagNameNS(capNS, "value")[0]?.textContent;
          if (name && value && name === paramName) return value;
        }
        return "";
      }

      const get = tag => info.getElementsByTagNameNS(capNS, tag)[0]?.textContent || '';
      const headline = get("headline");
      const description = get("description");
      const onset = get("onset");
      const expires = get("expires");
      const event = get("event");
      const severity = get("severity");
      const certainty = get("certainty");
      const areaDesc = info.getElementsByTagNameNS(capNS, "areaDesc")[0]?.textContent || '';
      const web = get("web");

      const colourCode = getParameterValue(info, "ColourCode");
      const colourClass = colourCode ? `alert-${colourCode.toLowerCase()}` : 'alert-default';

      const polygons = [...info.getElementsByTagNameNS(capNS, "polygon")];
      const geoCoords = [];

      polygons.forEach(p => {
        const coords = p.textContent.trim().split(" ").map(pair => {
          const [lat, lon] = pair.split(",").map(Number);
          return [lon, lat];
        });
        geoCoords.push(coords);
      });

let intersects = false;
let matchedAreaNames = [];

geoCoords.forEach(coords => {
  const poly = turf.polygon([coords]);

  // Far North
  if (!DISABLE_FAR_NORTH_ALERTS && farNorthGeoJSON && turf.booleanIntersects(poly, farNorthGeoJSON)) {
    intersects = true;
    if (!matchedAreaNames.includes("Far North District")) {
      matchedAreaNames.push("Far North District");
    }
  }

  // Custom Areas
  if (SHOW_CUSTOM_GEOJSON_ALERTS && customGeoAreas.length) {
    const keys = Object.keys(CustomGeoAreas);
    for (let i = 0; i < customGeoAreas.length; i++) {
      const custom = customGeoAreas[i];
      const name = keys[i] || "a custom area";
      if (turf.booleanIntersects(poly, custom)) {
        intersects = true;
        if (!matchedAreaNames.includes(name)) {
          matchedAreaNames.push(name);
        }
      }
    }
  }
});




      const now = new Date();
      let alertStatus = "";
      if (onset && expires) {
        const onsetTime = new Date(onset);
        const expiresTime = new Date(expires);
        if (now >= onsetTime && now <= expiresTime) {
          alertStatus = "active-now";
        } else if (now < onsetTime) {
          alertStatus = "upcoming";
        } else {
          alertStatus = "expired";
        }
      } else {
        alertStatus = "active-now"; // fallback
      }

      const isAllowedStatus =
        alertStatus === "active-now" ||
        alertStatus === "upcoming" ||
        (alertStatus === "expired" && SHOW_EXPIRED_ALERTS);

      const qualifies = intersects && isAllowedStatus;

      matchedAreaNames.sort((a, b) => {
  const iA = AREA_DISPLAY_ORDER.indexOf(a);
  const iB = AREA_DISPLAY_ORDER.indexOf(b);
  return (iA === -1 ? 999 : iA) - (iB === -1 ? 999 : iB); // fallback to end if not found
});

//banner conect for the met service cap feed related alerts      
      const alertHTML = `
<div class="alert-card ${qualifies ? 'far-north' : ''} ${alertStatus} ${colourClass}">
  <b>${headline} issued for ${areaDesc}</b><br>
  MetService has issued a weather alert that includes parts of ${formatAreaList(matchedAreaNames)}
  ${onset ? ` from ${formatReadableTime(onset)} ` : ''}
  ${expires ? `to ${formatReadableTime(expires)}</i>.<br>` : ''}   
  ${web ? `<a href="${web}" target="_blank">Visit MetService website for more information.</a><br>` : ''}
  <span class="badge alert-met">MetService</span>
  ${colourCode ? `<span class="badge ${colourClass}">${colourCode}</span>` : ''}
  ${alertStatus === 'upcoming' ? `<span class="badge upcoming-badge">Upcoming</span> ` : ''} 
  ${alertStatus === 'active-now' ? `<span class="badge active-badge">Active Now</span><br>` : ''}
  ${alertStatus === 'expired' ? `<span class="badge expired-badge">Expired</span>` : ''}
</div>`;

     if (qualifies) {
combinedAlertList.push({ html: alertHTML, status: alertStatus, source: 'met', areas: matchedAreaNames }); // in fetchAlerts 

} else if (  
  SHOW_NON_FAR_NORTH_ALERTS &&
  (alertStatus === "active-now" || alertStatus === "upcoming" || (alertStatus === "expired" && SHOW_EXPIRED_ALERTS))
) {
combinedAlertList.push({ html: alertHTML, status: alertStatus, source: 'met', areas: matchedAreaNames }); // in fetchAlerts

}
    }

    // STEP 2: Sort alerts: active-now > upcoming > expired
    const statusOrder = { "active-now": 1, "upcoming": 2, "expired": 3 };
    alertList.sort((a, b) => (statusOrder[a.status] || 99) - (statusOrder[b.status] || 99));

    const floatingEl = document.getElementById("floating-alerts-container");
    const toggleBtn = document.getElementById("toggle-alerts-btn");

    if (alertList.length) {
      floatingEl.innerHTML = alertList.map(a => a.html).join("\n");
      toggleBtn.style.display = "flex";
    } else {
      floatingEl.innerHTML = "";
      toggleBtn.style.display = "none";
    }
    lastUpdatedTime = new Date().toISOString();
renderCombinedAlerts();
  } catch (err) {
    console.error(err);
  }
}

  
  //check civil denfence atom cap feed, check areas, make alerts html, sort
async function fetchCDAlerts() {
  if (!ENABLE_CD_ALERTS) return;

  try {
    const res = await fetch(proxy + encodeURIComponent(CD_ALERT_FEED_URL));
    const xmlText = await res.text();
    const xml = new DOMParser().parseFromString(xmlText, "application/xml");
    const ns = "http://www.w3.org/2005/Atom";
    const entries = [...xml.getElementsByTagNameNS(ns, "entry")];

    const cdAlertList = [];

    for (const entry of entries) {
      const contentXML = entry.getElementsByTagNameNS(ns, "content")[0]?.textContent;
      if (!contentXML) continue;

      const capXML = new DOMParser().parseFromString(contentXML, "application/xml");
      const capNS = "urn:oasis:names:tc:emergency:cap:1.2";

      const getTag = (parent, tag) => parent.getElementsByTagNameNS(capNS, tag)[0]?.textContent || '';
      const info = capXML.getElementsByTagNameNS(capNS, "info")[0];
      if (!info) continue;

      const areaNodes = [...info.getElementsByTagNameNS(capNS, "area")];

      // Extract base CAP fields
      const identifier = getTag(capXML, "identifier");
      const sent = getTag(capXML, "sent");
      const status = getTag(capXML, "status");
      const msgType = getTag(capXML, "msgType");
      const scope = getTag(capXML, "scope");
      const senderName = getTag(info, "senderName");
      const headline = getTag(info, "headline");
      const effective = getTag(info, "effective");
      const expires = getTag(info, "expires");
      const urgency = getTag(info, "urgency");
      const severity = getTag(info, "severity");
      const certainty = getTag(info, "certainty");

      // Check time windows
      const now = new Date();
      const onsetTime = new Date(effective);
      const expiresTime = new Date(expires);
      let alertStatus = "";

      if (now >= onsetTime && now <= expiresTime) {
        alertStatus = "active-now";
      } else if (now < onsetTime) {
        alertStatus = "upcoming";
      } else {
        alertStatus = "expired";
      }

      const isAllowedStatus =
        alertStatus === "active-now" ||
        alertStatus === "upcoming" ||
        (alertStatus === "expired" && SHOW_EXPIRED_ALERTS);

    let intersects = false;
let areaDesc = "";
let matchedAreaNames = [];
const geoCoords = [];

areaNodes.forEach(area => {
  const desc = area.getElementsByTagNameNS(capNS, "areaDesc")[0]?.textContent || '';
  const polyEls = [...area.getElementsByTagNameNS(capNS, "polygon")];

  areaDesc += desc + "; ";

  polyEls.forEach(p => {
    const coords = p.textContent.trim().split(" ").map(pair => {
      const [lat, lon] = pair.split(",").map(Number);
      return [lon, lat];
    });
    geoCoords.push(coords);
  });
});

geoCoords.forEach(coords => {
  const poly = turf.polygon([coords]);

  // Far North
  if (!DISABLE_FAR_NORTH_ALERTS && farNorthGeoJSON && turf.booleanIntersects(poly, farNorthGeoJSON)) {
    intersects = true;
    if (!matchedAreaNames.includes("Far North District")) {
      matchedAreaNames.push("Far North District");
    }
  }

  // Custom Areas
  if (SHOW_CUSTOM_GEOJSON_ALERTS && customGeoAreas.length) {
    const keys = Object.keys(CustomGeoAreas);
    for (let i = 0; i < customGeoAreas.length; i++) {
      const custom = customGeoAreas[i];
      const name = keys[i] || "a custom area";
      if (turf.booleanIntersects(poly, custom)) {
        intersects = true;
        if (!matchedAreaNames.includes(name)) {
          matchedAreaNames.push(name);
        }
      }
    }
  }
});

      const isCancelled = msgType.toLowerCase() === "cancel";
const qualifies =
  intersects &&
  isAllowedStatus &&
  (!isCancelled || (isCancelled && SHOW_CANCELLED_CD_ALERTS));


      const formatNZTime = iso => {
        if (!iso) return '';
        const dt = new Date(iso);
        return dt.toLocaleString("en-NZ", {
          weekday: "long",
          day: "numeric",
          month: "long",
          hour: "numeric",
          minute: "2-digit",
          hour12: true,
          timeZone: "Pacific/Auckland"
        });
      };
      
      matchedAreaNames.sort((a, b) => {
  const iA = AREA_DISPLAY_ORDER.indexOf(a);
  const iB = AREA_DISPLAY_ORDER.indexOf(b);
  return (iA === -1 ? 999 : iA) - (iB === -1 ? 999 : iB); // fallback to end if not found
});


      const alertHTML = `
<div class="alert-card far-north alert-red ${alertStatus}">
  <b>${headline}</b><br>
  ${senderName} has issued an alert that covers parts of   ${formatAreaList(matchedAreaNames)} from ${formatNZTime(effective)}
  to ${formatNZTime(expires)}.<br>
  <b>Urgency:</b> ${urgency} <b>Severity:</b> ${severity}<br>
  <span class="badge alert-cd">Civil Defence</span>
  ${alertStatus === 'upcoming' ? `<span class="badge upcoming-badge">Upcoming</span>` : ''}
  ${alertStatus === 'active-now' ? `<span class="badge active-badge">Active Now</span>` : ''}
  ${alertStatus === 'expired' ? `<span class="badge expired-badge">Expired</span>` : ''}
${isCancelled ? `<span class="badge cancelled-badge">Cancelled</span><br>` : ''}
  <br><a href="https://www.civildefence.govt.nz/" target="_blank">Visit civildefence.govt.nz for more information</a>
</div>`;

      if (qualifies) {
combinedAlertList.push({ html: alertHTML, status: alertStatus, source: 'cd', areas: matchedAreaNames }); // in fetchCDAlerts

      } else if (
        SHOW_NON_FAR_NORTH_ALERTS &&
        (alertStatus === "active-now" || alertStatus === "upcoming" || (alertStatus === "expired" && SHOW_EXPIRED_ALERTS))
      ) {
combinedAlertList.push({ html: alertHTML, status: alertStatus, source: 'cd', areas: matchedAreaNames }); // in fetchCDAlerts

      }
    }

    // Sort and render CD alerts
    const statusOrder = { "active-now": 1, "upcoming": 2, "expired": 3 };
    cdAlertList.sort((a, b) => (statusOrder[a.status] || 99) - (statusOrder[b.status] || 99));

    const floatingEl = document.getElementById("floating-alerts-container");
    const toggleBtn = document.getElementById("toggle-alerts-btn");

    if (cdAlertList.length) {
      floatingEl.innerHTML += cdAlertList.map(a => a.html).join("\n");
      toggleBtn.style.display = "flex";
    }
    lastUpdatedTime = new Date().toISOString();
renderCombinedAlerts();
  } catch (err) {
    console.error("CD Alert fetch failed", err);
  }
}

Promise.all([loadFarNorthGeoJSON(), loadCustomGeoJSONAreas()])
  .then(([farNorth, customAreas]) => {
    farNorthGeoJSON = farNorth;
    customGeoAreas = customAreas;
    return Promise.all([fetchCDAlerts(), fetchAlerts()]);
  })
  .then(renderCombinedAlerts);

 async function loadCustomGeoJSONAreas() {
  const areas = [];

  for (const key in CustomGeoAreas) {
    const entry = CustomGeoAreas[key];

    if (typeof entry === "string") {
      try {
        const url = USE_PROXY_FOR_CUSTOM_GEOJSON ? proxy + encodeURIComponent(entry) : entry;
        const res = await fetch(url);
        const geojson = await res.json();
        if (geojson.type === "FeatureCollection") {
          areas.push(geojson);
        }
      } catch (e) {
        console.warn(`Failed to fetch custom GeoJSON for ${key}:`, e);
      }
    } else if (entry?.type === "FeatureCollection") {
      areas.push(entry);
    }
  }

  return areas;
} 
  // Order: CD alerts first, then MetService — within each group, sort by status   
function renderCombinedAlerts() {
  const statusOrder = { "active-now": 1, "upcoming": 2, "expired": 3 };

  combinedAlertList.sort((a, b) => {
    if (a.source !== b.source) return a.source === 'cd' ? -1 : 1;
    return (statusOrder[a.status] || 99) - (statusOrder[b.status] || 99);
  });

  const floatingEl = document.getElementById("floating-alerts-container");
  const toggleBtn = document.getElementById("toggle-alerts-btn");

  if (combinedAlertList.length) {
    const allAreaMentions = combinedAlertList
      .flatMap(a => a.areas || [])
      .filter((v, i, a) => a.indexOf(v) === i);
    const areaLabel = formatAreaList(allAreaMentions);
const hasCDAlert = combinedAlertList.some(a => a.source === 'cd');
toggleBtn.textContent = hasCDAlert ? "⚠️" : "🌧️";
    const introHTML = `
      <div class="alert-header">
        <strong>Local warnings and alerts</strong><br>
        Currently showing local warnings and alerts for ${areaLabel}.
       </div>`;

    const footerHTML = `
      <hr>
      <div class="alert-footer">
        <small>
          Last updated: ${formatReadableTime(lastUpdatedTime)}<br>
          <a href="https://almokinsgov.github.io/Region-warning-and-alerts/" target="_blank">Region Warnings and Alert System</a>, Current version ${version}
        </small>
      </div>`;

    floatingEl.innerHTML = introHTML + combinedAlertList.map(a => a.html).join("\n") + footerHTML;
    toggleBtn.style.display = "flex";
  } else {
    floatingEl.innerHTML = "";
    toggleBtn.style.display = "none";
  }
}



  function isStillActive(onsetText, expiresText) {
  const now = new Date();
  const onset = onsetText ? new Date(onsetText) : null;
  const expires = expiresText ? new Date(expiresText) : null;

  if (expires && now > expires) return false;
  if (onset && now < onset) return true;
  if (onset && expires) return now >= onset && now <= expires;
  if (expires) return now <= expires;

  return true;
}

  
 function isWithinHourWindow(onsetText, expiresText) {
  const now = new Date();
  const onset = onsetText ? new Date(onsetText) : null;
  const expires = expiresText ? new Date(expiresText) : null;
 
  if (onset && expires) {
    const isActive = now >= onset && now <= expires;
    const startsSoon = onset > now && (onset - now) / 1000 / 3600 <= HOUR_WINDOW;
    return isActive || startsSoon;
  }

  if (onset) {
    const diffHours = (onset - now) / 1000 / 3600;
    const inWindow = diffHours >= 0 && diffHours <= HOUR_WINDOW;
    return inWindow;
  }

  return false;
}

function formatAreaList(areaArray) {
  if (!areaArray || areaArray.length === 0) return "the alert region";
  if (areaArray.length === 1) return areaArray[0];
  if (areaArray.length === 2) return `${areaArray[0]} and ${areaArray[1]}`;
  return `${areaArray.slice(0, -1).join(", ")}, and ${areaArray[areaArray.length - 1]}`;
}

  document.getElementById("toggle-alerts-btn").addEventListener("click", () => {
    const el = document.getElementById("floating-alerts-container");
    el.style.display = (el.style.display === "none" || !el.style.display) ? "block" : "none";
  });

 } 
