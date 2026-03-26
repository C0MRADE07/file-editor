# FileEditor — Redefine Your Files

## Overview
**FileEditor** is a conceptual, modern, web-based UI for uploading, processing, and managing a wide variety of file formats. The application uses a stark, cyberpunk-inspired visual aesthetic with glowing neon accents, deep dark backgrounds, and monospace fonts. The layout feels like an advanced sci-fi terminal or operating system aimed at "precision file editing for the modern era."

## Architecture & Tech Stack
The interface was originally built as a single, consolidated **HTML5** file containing all structure, styles, and logic. It has now been cleanly separated into three files:
- `File_Editor.html` : Contains the document structure and layout tags.
- `File_Editor.css` : Contains all the custom styles, variables, keyframe animations, and responsive utilities.
- `File_Editor.js` : Contains the interactive logic for the UI, including navigation, tab switching, and visual effects.

Dependencies:
- **Fonts**: Orbitron, Rajdhani, and Share Tech Mono (from Google Fonts)
- **Vanilla Web Technologies**: No external frameworks (like React or Tailwind) are strictly required. It relies strictly on standard CSS (variables, grid, flexbox) and Vanilla JavaScript (DOM manipulation and IntersectionObserver).

## Key Features & UI Components

### 1. Global UI & Aesthetic
- Real-time Clock and Animated Status Dots.
- A fixed **Background Grid** and pulsing **Glow Orb** providing a digital overlay sensation.
- A sweeping **Scanline animation** moving over the interface.

### 2. Navigation
- **Top Navbar:** Displays the brand identity and includes an animated hamburger menu.
- **Drawer Menu:** A sliding side-menu containing quick links to Home, Files, Upload, Alerts, Profile, and quick tools (Convert, Encrypt, Compress).
- **Bottom Navigation Bar:** Mobile-friendly tabs allowing seamless switching between different workspace areas (Home, Files, Upload, Alerts, Profile).

### 3. Interactive Views (Tabs)
- **Home:** A dashboard showing a hero section (mission statement), metrics, drag-and-drop upload zone, active processing activity bars, recent files, and a grid of quick actions (Merge, Split, Rotate, Translate, etc.).
- **Files:** A storage module containing searchable and filterable processed files.
- **Upload:** An advanced "Ingestion Bay" where users can browse, drag and drop, or paste a URL to ingest files, alongside toggles for auto-convert, encryption, and automatic compression.
- **Alerts:** A system Notification Center tracking conversion results, upload status, and warnings.
- **Profile:** A user dashboard displaying user tier ("PRO TIER"), operational statistics, settings toggles (Dark Mode, Biometric Lock), and account management links.

### 4. Special Effects
- **Metrics Counter:** Uses an `IntersectionObserver` to animate counters from 0 to their target values when scrolled into view.
- **Fake Terminal Output:** A looping system message string replacing text every few seconds (e.g., `// initializing file_editor.core — all systems nominal_`).
- **Dynamic Activity Bars:** A live visualization of server/processing load implemented by continually randomizing the heights of flex bars.

## Usage
Since it is static client-side code:
1. Ensure `File_Editor.html`, `File_Editor.css`, and `File_Editor.js` are in the same folder.
2. Open `File_Editor.html` in any modern web browser.
3. Interact with the tabs, drawer, and toggles to explore the responsive UI.
