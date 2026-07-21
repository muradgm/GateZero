**TraderFrame – Evidence Gate**  
**3D–DOM Integration Specification**  
**Stage: 2D–3D Integration**  
**Objective: Define relationships between 3D objects and DOM UI for the Evidence Gate interactive 3D narrative.**

---

## ✅ **Core Design Principles Applied**

- **Evidence First**: All UI elements and 3D objects must reflect the integrity and traceability of market data.
- **Transparent Reasoning**: UI and 3D interactions must visually and logically express the reasoning behind each evidence step.
- **User Control**: Provide clear, actionable UI controls that map to 3D object states and transitions.
- **Risk Awareness**: Visual and auditory cues must reflect risk levels and confidence in evidence.
- **Calm Precision**: Maintain a clean, focused, and intuitive interaction model.

---

## 🧱 **3D Object–DOM UI Relationship Specification**

### 1. **Evidence Gate (Main 3D Object)**  
**Purpose**: Central hub for filtering, challenging, approving, and recording evidence.  
**UI Relationship**:
- **DOM Element**: `<div id="evidence-gate">` (Container)
- **Visual Mapping**:
  - **3D Object**: A transparent, geometric gate with a central "evidence core" (sphere or cube).
  - **UI Controls**:
    - **Filter Panel** (`<div id="filter-panel">`) – positioned to the left of the gate.
    - **Challenge Panel** (`<div id="challenge-panel">`) – positioned to the right of the gate.
    - **Approval Panel** (`<div id="approval-panel">`) – positioned at the bottom of the gate.
    - **Record Panel** (`<div id="record-panel">`) – positioned at the top of the gate.
- **Interaction**:
  - Clicking on the gate opens the **evidence core** in 3D, revealing the current evidence set.
  - Dragging the gate allows users to rotate and inspect the evidence structure.

---

### 2. **Evidence Core (3D Object)**  
**Purpose**: Represents the current set of evidence being evaluated.  
**UI Relationship**:
- **DOM Element**: `<div id="evidence-core">` (Visual overlay)
- **Visual Mapping**:
  - **3D Object**: A dynamic sphere or cube that changes color and opacity based on the confidence level of the evidence.
  - **UI Controls**:
    - **Evidence List** (`<ul id="evidence-list">`) – displayed as a floating panel near the core.
    - **Evidence Filters** (`<div id="evidence-filters">`) – displayed as a dropdown or toggle panel.
- **Interaction**:
  - Clicking on an evidence item in the list highlights the corresponding 3D object.
  - Hovering over an evidence item shows a tooltip with metadata and risk indicators.

---

### 3. **Filter Panel (DOM UI)**  
**Purpose**: Allows users to filter evidence by type, source, confidence, and risk.  
**3D Relationship**:
- **3D Object**: A floating panel with icons representing filter categories (e.g., "Market Data", "Analyst Notes", "Risk Score").
- **UI Controls**:
  - **Filter Toggle** (`<button id="filter-toggle">`) – toggles the visibility of the filter panel.
  - **Filter Options** (`<select id="filter-type">`, `<input type="range" id="confidence-slider">`, etc.)
- **Interaction**:
  - Applying a filter updates the **evidence core** in real-time.
  - Filter changes are reflected in the **evidence list** and **evidence core** color/opacity.

---

### 4. **Challenge Panel (DOM UI)**  
**Purpose**: Enables users to challenge or question the validity of evidence.  
**3D Relationship**:
- **3D Object**: A floating panel with a "challenge" icon and a "question mark" overlay.
- **UI Controls**:
  - **Challenge Button** (`<button id="challenge-button">`) – triggers a modal or panel for evidence review.
  - **Evidence Review Modal** (`<div id="evidence-review-modal">`) – displays the evidence in a 2D/3D review interface.
- **Interaction**:
  - Clicking the challenge button opens the review modal.
  - Users can mark evidence as "inconclusive" or "unverified" via UI toggles.
  - Changes are reflected in the **evidence core** and **evidence list**.

---

### 5. **Approval Panel (DOM UI)**  
**Purpose**: Enables users to approve or reject evidence after review.  
**3D Relationship**:
- **3D Object**: A floating panel with a "checkmark" and "cross" icon.
- **UI Controls**:
  - **Approve Button** (`<button id="approve-button">`)
  - **Reject Button** (`<button id="reject-button">`)
- **Interaction**:
  - Approval/rejection updates the **evidence core** and adds a log entry to the **record panel**.
  - A confirmation modal is shown before finalizing the decision.

---

### 6. **Record Panel (DOM UI)**  
**Purpose**: Displays a log of all evidence decisions and their outcomes.  
**3D Relationship**:
- **3D Object**: A floating panel with a "record book" icon and a scrollable log.
- **UI Controls**:
  - **Log Viewer** (`<div id="log-viewer">`) – displays a timeline of evidence decisions.
  - **Export Button** (`<button id="export-button">`) – exports the log as a PDF or CSV.
- **Interaction**