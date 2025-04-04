## 🧪 **Proof of Concept (PoC) – Lernplatz-Leitsystem BBB**

### 📌 **Titel**

**Effizientes Lernplatz-Leitsystem mit RFID-Erfassung – Proof of Concept**

### 👤 **Autor**

Keanu Koelewijn, Alberto Manser, Julius Burlet, 
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

Ziel ist es, die Echtzeit-Belegung von Lernräumen ohne Buchungssystem zu erfassen und benutzerfreundlich anzuzeigen. Dafür wird RFID-Tracking an Türen eingesetzt, ergänzt durch ein Adminpanel für Konfiguration und ein öffentliches Display für Schüler.

---

## ✅ **2. Anforderungen**

- Echtzeit-Erfassung der Belegung
- RFID-Scans bei Betreten/Verlassen
- Anzeige der Auslastung auf Map
- Adminpanel zur Verwaltung von Räumen & Scannern
- Datensicherheit

---

## 🧠 **3. Machbarkeitsstudie**

**Technisch realisierbar?** ✔️  

- RFID-Reader an Türen.
- REST API + SQL für Auswertung & Anzeige.

**Integration?** ✔️  

- Kartenvisualisierung mit z. B. Leaflet oder D3.js
- Frontend: React.js oder Vue.js
- Backend: ASP .NET

**Finanziell tragbar?** ✔️  

- Serverbetrieb: lokal oder minimal in der Cloud

---

## ⚠️ **4. Risikoanalyse**

| Risiko                 | Wahrscheinlichkeit | Auswirkung | Gegenmassnahme                  |
| ---------------------- | ------------------ | ---------- | ------------------------------- |
| Scanner offline (WLAN) | Mittel             | Hoch       | Status-Monitoring im Adminpanel |
| RFID nicht erkannt     | Niedrig            | Mittel     | Reader-Qualität prüfen          |
| Fehlende Akzeptanz     | Niedrig            | Mittel     | User-Test & gutes UX/UI         |

---

## 🧪 **5. Prototyp**

**Frontend**

- Mockup einer Karte mit Auslastung je Raum
- Adminpanel mit:
  - Raumverwaltung
  - Live-Status

**Backend**

- REST API mit:
  - POST `/scan` (RFID-Ereignis)
  - GET `/rooms/:id/occupancy`
  - GET `/admin/dashboard`
- MS SQL als DB

---

## ✅ **6. Ergebnis & Empfehlung**

**Fazit:**  
Die Umsetzung ist **technisch, organisatorisch und wirtschaftlich machbar**.

**Empfehlung:**  

> ✅ Umsetzung wird empfohlen.  
> Optional: Weitere Ausbaustufen wie smarte LED-Anzeigen oder Kamera-Zählung.


