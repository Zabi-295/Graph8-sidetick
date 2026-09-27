# 🚀 Graph8 Sidekick — Autonomous B2B Desktop Sales Companion

[![Graph8 Integration](https://img.shields.io/badge/Graph8-REST%20API%20Connected-emerald)](https://graph8.com)
[![Platform](https://img.shields.io/badge/Platform-Electron%20%7C%20Windows-blue)](https://electronjs.org)
[![Framework](https://img.shields.io/badge/Framework-React%2019%20%7C%20TypeScript-purple)](https://react.dev)

> **An always-on, floating desktop companion powered by Graph8's 700M+ B2B contact graph and real-time intent telemetry.**  
> Built for the Graph8 Hackathon to eliminate context switching and accelerate pipeline velocity from the desktop.

---

## 🌐 Live Deployment & Links

* 🔗 **Live Web Demo (GitHub Pages):** [https://zabi-295.github.io/Graph8-sidetick/](https://zabi-295.github.io/Graph8-sidetick/)
* ⚡ **1-Click Deploy to Vercel:** [![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2FZabi-295%2FGraph8-sidetick)
* 📦 **GitHub Repository:** [https://github.com/Zabi-295/Graph8-sidetick](https://github.com/Zabi-295/Graph8-sidetick)
* 💻 **Windows Desktop Executable (.exe):** Built and packaged in `release/Graph8Sidekick-win32-x64/Graph8Sidekick.exe` (Portable zip available: `release/Graph8Sidekick-Windows.zip`)

---

## 🌟 Overview

B2B sales reps lose up to 4 hours every day switching between CRM tabs, Apollo, LinkedIn, inbox threads, and VoIP dialers. **Graph8 Sidekick** lives right on the desktop as an ambient, non-intrusive floating pill that expands into a full command center (`Ctrl+K`).

### 🎯 4 Core Action Pillars

1. **👥 Quick Prospects (Live Search Across 700M+ Contacts)**
   * Real-time search by company (e.g. *Microsoft*, *Google*), role (*CTO*, *VP Infra*), or industry.
   * Direct connection to Graph8's global commercial open-data graph.
   * Verified contact badges, match propensity scores (85%–98%), and 1-click sequence enrollments.

2. **⚡ Intent Signals (Real-Time Buyer Radar)**
   * Captures stealth buyer spikes across Graph8 edge telemetry before forms are submitted.
   * Automated verification filter: excludes raw/unverified contacts (`confidence_score: 0`) so reps only focus on verified decision makers.
   * Priority tiers: `HIGH INTENT`, `BUYING SIGNAL`, and `PRICING INTEREST`.

3. **📥 AI Inbox Triage (Intelligent Response Categorization)**
   * Categorizes inbound replies using Graph8 AI (`Wants Demo`, `Pricing Question`, `Follow Up`).
   * Generates 1-click contextual AI reply drafts with meeting scheduling integration.

4. **🔁 Automated Sequences & VoIP Dialing**
   * 1-click enrollment into multi-touch outbound cadences with automated stop-on-reply protection.
   * Integrated Graph8 Voice VoIP dialer for instant live phone calls directly from the desktop.

---

## 🛠️ Architecture & Tech Stack

* **Frontend:** React 19, TypeScript, Tailwind CSS, Lucide Icons
* **Desktop Runtime:** Electron (Frameless, transparent, always-on-top HUD, auto-idle transparency after 7s)
* **API Middleware:** Secure local Node/Express proxy ensuring `GRAPH8_API_KEY` is never leaked to renderer processes
* **Bundler & Tooling:** Vite, Oxlint

---

## 🚀 Getting Started

### Prerequisites
* Node.js v18+ 
* Windows 10/11 (or macOS/Linux with native Electron)
* A valid Graph8 API Key

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Zabi-295/Graph8-sidetick.git
   cd Graph8-sidetick
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure Environment:**
   Create a `.env` file in the project root:
   ```env
   GRAPH8_API_KEY=your_graph8_api_key_here
   ```

4. **Run in Development:**
   ```bash
   npm run dev
   ```

5. **Launch Desktop Companion:**
   * Double-click `Launch Graph8 Sidekick.bat` or run:
   ```bash
   npm run desktop
   ```

---

## ⌨️ Shortcuts & Navigation
* **`Ctrl + K` (Windows) / `Cmd + K` (Mac):** Toggle floating command center.
* **Auto-Dimming:** Idles into 35% transparency after 7 seconds of inactivity; instantly wakes up on mouse hover.

---

## 📄 License
MIT License. Built for the Graph8 Hackathon.
