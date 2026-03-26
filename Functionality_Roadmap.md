# FileEditor: Interactions & Functionality Roadmap

This document outlines every interactive element inside the FileEditor UI, alongside an explanation of how it can be wired up with real JavaScript and backend functionality.

---

### 🎛️ Toggles & Switches
*Currently, these animate beautifully but do not save their states.*

1. **Dark Mode Toggle** *(Profile Tab)* 
   - **Function:** Can be wired to toggle a `.light-theme` class on the `<body ` element and store the user's preference in `localStorage`.
2. **Push Notifications Toggle** *(Profile Tab)*
   - **Function:** Should trigger the native HTTP `Notification.requestPermission()` API to send system alerts (e.g. "Conversion Complete") even if the browser tab is minimized.
3. **Auto-Backup Toggle** *(Profile Tab)*
   - **Function:** Could integrate with an external API (like Google Drive, Dropbox) or use IndexedDB to sync local files automatically to a cloud state.
4. **Biometric Lock Toggle** *(Profile Tab)*
   - **Function:** Could invoke the Web Authentication API (`navigator.credentials.get()`) to prompt the user's Windows Hello, FaceID, or TouchID device upon opening the web app.
5. **Auto-Convert on Upload** *(Upload Tab)*
   - **Function:** Determines whether the `onChange` event of an upload instantly pushes the file to the conversion pipeline, or waits for user confirmation.
6. **Encrypt after Upload** *(Upload Tab)*
   - **Function:** If active, forces files to be encrypted client-side using `window.crypto.subtle` (AES-256) before they are sent to any server.
7. **Compress Automatically** *(Upload Tab)*
   - **Function:** When true, applies a client-side squashing library (like `browser-image-compression` or FFMPEG.wasm) to shrink file sizes instantly.

---

### 🖱️ File Ingestion & Action Buttons
8. **"↑ UPLOAD FILE" Button** *(Hero Section)*
   - **Function:** Needs to trigger a hidden `<input type="file" multiple>` element using `input.click()` to open the native OS file picker.
9. **"DEMO" Button** *(Hero Section)*
   - **Function:** Instead of uploading a real file, this could inject a dummy test file into your processing activity UI so users can see how the application works instantly.
10. **Drop Zone Area** *(Home & Upload Tabs)*
    - **Function:** Requires JavaScript `dragover`, `dragleave`, and `drop` event listeners to physically capture files dropped by a mouse (`event.dataTransfer.files`).
11. **URL "→" Go Button** *(Upload Tab)*
    - **Function:** Reads the value of the URL `<input>` box and triggers a `fetch(url)` command, or passes the URL to a proxy server to bypass CORS, downloading the remote file directly to the app.

---

### 🛠️ Core Tools & Quick Actions
12. **Convert / Compress / Encrypt / Repair Cards** *(Home Tab)*
    - **Function:** Clicking these shouldn't just switch tabs—it should open a specific File Picker Modal designed for that exact tool. E.g., clicking "Repair" only lets you select corrupted files.
13. **Quick Action: Inspect** *(Quick Tools)*
    - **Function:** Could pop open a side-panel displaying advanced metadata for a selected file (EXIF data, Mime Types, file headers, binary sizes).
14. **Quick Action: Print / Sign** *(Quick Tools)*
    - **Function:** *Print* could invoke `window.print()` after generating a PDF blob. *Sign* could open a canvas where the user can physically draw a digital signature over a PDF.
15. **Quick Action: Merge / Split** *(Quick Tools)*
    - **Function:** Clicking these could change the "Files" tab into 'multi-select mode' where checkboxes appear, allowing users to select several Pdfs or images to combine into one.

---

### 📂 Navigation, Search, & Filtering
16. **File Filter Chips (All / PDF / Images / Docs / Video)** *(Files Tab)*
    - **Function:** Wired up to an array filter (e.g. `filesArray.filter(file => file.type.includes('image'))`) to dynamically change the DOM elements shown on the page without reloading.
17. **File Search Input** *(Files Tab)*
    - **Function:** Requires a keyup event listener that hides non-matching files dynamically as the user types letters.
18. **"⋯" Action Menus on Recent Files** *(Home & Files Tab)*
    - **Function:** Clicking this dots-icon should mount a floating context menu granting options to: `[Download]`, `[Rename]`, `[Share / Create Link]`, or `[Delete]`.

---

### ⚙️ System & Profile Contexts
19. **Sign Out Button** *(Drawer & Profile Tab)*
    - **Function:** Cleans out all authentication cookies, wipes the app state from `Memory`, and forces a page redirect `window.location.href = '/login.html'`.
20. **Billing & Plan / Storage Links** *(Profile Tab)*
    - **Function:** Could connect directly to a Stripe customer portal where users can manage their "PRO TIER" subscription and wipe/upgrade their storage quotas.
