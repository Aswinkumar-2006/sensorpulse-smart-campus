# ⚡ SensorPulse™ - Smart Campus IoT Simulation Platform

Real-time IoT Sensor detection, ON/OFF toggle simulation, live power consumption telemetry, and JWT-authenticated session security.

---

## 🌟 Features

- **IoT Sensor Simulation**: Real-time physical ON/OFF state transitions with continuous telemetry (Temperature, Vibration, Battery Level).
- **Live Oscilloscope**: Dynamic HTML5 canvas waveform visualizer rendering carrier waves and active vibration harmonics.
- **Power Consumption Monitoring**: Live power analytics for connected campus appliances (Air Conditioner, Ceiling Fan, LED Lights, Smart TV, Server / CPU, Wi-Fi Router) with active load and cost estimation.
- **Persistent Event History**: Historical state logging with duration tracking, operator attribution, search filtering, and CSV export.
- **JWT Security & Token Rotation**: Stateless REST architecture with short-lived access tokens and 7-day database-backed refresh tokens.

---

## 🏗️ Architecture

- **Frontend**: React, Lucide Icons, Modern Glassmorphism CSS Design System.
- **Backend**: Java 21, Spring Boot 3.4.3, Spring Security, Spring Data JPA, JJWT.
- **Database**: H2 Embedded Relational Database (zero configuration, persistent file store).

---

## 🚀 Quick Start (Local Run)

### 1. Requirements
- Node.js (v18+)
- Java 21 (Microsoft OpenJDK 21 or Eclipse Temurin 21)

### 2. One-Click Launch (Windows)
Double-click `RUN_PROJECT.bat` in the repository root.

### 3. Manual Launch
- **Backend**:
  ```bash
  cd "smart campus 2/backend"
  mvn spring-boot:run
  # Or with pre-built jar:
  java -jar target/sensor-simulator-backend-1.0.0.jar
  ```
  API available at `http://localhost:8080/api`

- **Frontend**:
  ```bash
  cd "smart campus 3/frontend/frontend/frontend"
  npx --yes serve -s dist -l 5173
  ```
  Web UI available at `http://localhost:5173`

---

## 🔐 Demo Credentials
- **Email**: `admin@sensorsimulator.com`
- **Password**: `Password123!`
*(Or click "⚡ Autofill Demo Credentials" on the Sign In modal)*
