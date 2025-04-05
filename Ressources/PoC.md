## 🧪 **Proof of Concept (PoC) – Lernplatz-Leitsystem BBB**

### 📌 **Titel**

**Effizientes Lernplatz-Leitsystem mit Access-Point-Zählung – Proof of Concept**

### 👤 **Autor**

Keanu Koelewijn, Alberto Manser, Julius Burlet, Yen Sauliak, Enis Shorra  
Modul 245 – Innovative ICT-Lösungen umsetzen  
Berufsfachschule BBB, Baden

### 📅 **Datum**

4. April 2025

---

## 📚 **Inhaltsverzeichnis**

1. Einleitung & Ziel  
2. Anforderungen  
3. Machbarkeitsstudie  
4. Risikoanalyse  
5. Prototyp (Frontend + Backend)  
6. Ergebnis & Empfehlung  

---

## 🎯 **1. Einleitung & Ziel**

Ziel ist es, die Echtzeit-Belegung von Lernräumen **ohne** Buchungssystem zu erfassen und benutzerfreundlich anzuzeigen. Anders als bei RFID setzen wir hier auf die vorhandene WLAN-Infrastruktur. Durch die Auswertung der mit dem Access Point verbundenen Endgeräte lässt sich erkennen, wie viele Personen sich in einem Raum aufhalten. Ergänzend gibt es ein Adminpanel für Konfiguration sowie eine öffentliche Anzeige für Schüler.

---

## ✅ **2. Anforderungen**

- **Echtzeit-Erfassung der Belegung**:  
  Nutzung der Access-Points, um verbundene Endgeräte zu zählen
- **Geräteerkennung bei Betreten/Verlassen**:  
  Aktualisierung der Zählerstände pro Raum durch Zu- und Abgang
- **Anzeige der Auslastung**:  
  Visualisierung der Raumbelegung (z. B. Map mit Farbmarkierung)
- **Adminpanel**:  
  - Verwaltung der Räume und Access-Points  
  - Monitoring der Verbindungsqualität  
- **Datensicherheit & Privatsphäre**:  
  - Anonymisierte Erfassung (kein Tracking einzelner Nutzer)

---

## 🧠 **3. Machbarkeitsstudie**

**Technisch realisierbar?** ✔️  
- Nutzung vorhandener WLAN-Hardware (Access Points), die eine Übersicht über verbundene Geräte liefern.  
- REST-API + SQL-Datenbank zur Speicherung und Auswertung.  

**Integration?** ✔️  
- Kartenvisualisierung (z. B. Leaflet, D3.js)  
- Frontend mit React.js oder Vue.js  
- Backend in ASP.NET oder Node.js  
- Skalierbar auf mehrere Access Points in verschiedenen Räumen  

**Finanziell tragbar?** ✔️  
- Oftmals können bestehende Netzwerkkomponenten weiterverwendet werden  
- Lokaler oder minimaler Cloud-Serverbetrieb  

---

## ⚠️ **4. Risikoanalyse**

| Risiko                           | Wahrscheinlichkeit | Auswirkung | Gegenmassnahme                                                |
| -------------------------------- | ------------------ | ---------- | ------------------------------------------------------------- |
| Ausfall des Access Points        | Mittel            | Hoch       | Backup-AP bereitstellen, Monitoring im Adminpanel            |
| Ungenaue Zählungen (z. B. Geräte in Standby) | Mittel | Mittel    | Bessere Algorithmen zur Erkennung & Timeout-Mechanismen       |
| Fehlende Akzeptanz (Datenschutz) | Mittel            | Mittel     | Anonymisierung sicherstellen, Kommunikation an die Nutzer     |
| Unzureichende Netzabdeckung      | Niedrig           | Mittel     | Netzplanung optimieren, zusätzliche Repeater/Access Points    |

---

## 🧪 **5. Prototyp**

**Frontend**  
- Mockup einer Karte oder Raumübersicht mit aktueller Auslastung  
- Adminpanel mit:  
  - Verwaltung der Räume (Mapping Raum ↔ Access Point)  
  - Live-Status der Netzwerkgeräte  

**Backend**  
- REST API mit:  
  - `POST /wifiScan` (z. B. Statusmeldung vom Access Point)  
  - `GET /rooms/:id/occupancy` (aktuelle Belegung)  
  - `GET /admin/dashboard` (Übersicht & Monitoring)  
- SQL-Datenbank zum Speichern von Verbindungsevents (Zeitpunkt, AP-ID, Gerät-ID [anonymisiert])  

---

## ✅ **6. Ergebnis & Empfehlung**

**Fazit:**  
Die Umsetzung ist **technisch, organisatorisch und wirtschaftlich machbar**, da vorhandene WLAN-Infrastruktur genutzt wird.

**Empfehlung:**  
> ✅ Umsetzung wird empfohlen.  
> Optional: Erweiterung um zusätzliche Sensorik (z. B. Bewegungssensoren oder Kamera-Zählung) für noch genauere Ergebnisse.
