# AI Supply Chain Simulator

## Overview

AI Supply Chain Simulator is a browser-based, role-playing operations simulation. You act as a Supply Chain Manager at SCS, moving 4,300 units from Shanghai to Los Angeles and Rotterdam over 30 simulated days while responding to ten supply-chain disruptions within a $150,000 budget.

The simulator runs entirely in the browser as static HTML, CSS, and JavaScript. No build step or backend is required.

## Features

- Introduction screen with mission briefing and editorial landing layout
- Rules screen explaining simulation flow before play begins
- Four transportation strategies (100% air, 100% sea, 40/60 balanced, 20/80 cost-focused)
- Interactive global network map with live ETA, cost impact, and risk indicators
- Ten scripted crisis events with three decision options each
- Probabilistic outcomes for selected negotiation decisions
- Real-time metrics panel covering cost, delivery, inventory, carbon, customer satisfaction, and supplier relationship
- Activity log tracking operational decisions
- Strategic Debrief with decision quality, outcome analysis, luck factor, and benchmark comparison
- Reset and replay support
- Export/report views for final assessment review
- Responsive layout for desktop and mobile
- GitHub Pages compatible static deployment

## Technologies

- **HTML** — page structure and content (`index.html`)
- **CSS** — visual styling (`styles.css`)
- **JavaScript** — simulator logic, data, and UI behavior (`app.js`)
- **Python validation utility** — repository and simulator-source checks (`scripts/validate_simulator_data.py`)

Python is used only for offline validation of project structure and simulator source integrity. It does not run the web simulator.

## Project Structure

```
AI-Supply-Chain-Simulator/
├── index.html                              # Page structure and content
├── app.js                                  # Simulator logic, crisis data, UI behavior
├── styles.css                              # Styles and responsive layout
├── assets/
│   └── images/
│       └── supply-chain-terminal.webp      # Introduction hero image
├── scripts/
│   └── validate_simulator_data.py          # Source and data validation tool
├── AI-Supply-Chain-Simulator-social-preview.png
└── README.md
```

## Run Locally

From the project root, start a static file server:

```bash
python -m http.server 8000
```

On Windows, you can also use:

```bash
py -m http.server 8000
```

Open:

http://localhost:8000

Do not rely on opening `index.html` directly via `file://`; use a local HTTP server so relative asset paths resolve correctly.

## Run Validation

```bash
python scripts/validate_simulator_data.py
```

Or on Windows:

```bash
py scripts/validate_simulator_data.py
```

The validator checks required files, asset references, crisis data integrity, probability ranges, and that large Base64 images are not embedded in HTML.

## Deployment

This project is compatible with GitHub Pages. Deploy the repository root (or project folder within a user/organization site) as static files. No build process, npm install, or server-side runtime is required.

Relative paths such as `./assets/images/supply-chain-terminal.webp`, `styles.css`, and `app.js` work from a repository subdirectory when served over HTTP.
