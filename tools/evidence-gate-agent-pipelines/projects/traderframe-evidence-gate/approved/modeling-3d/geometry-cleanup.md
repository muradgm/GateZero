**TraderFrame — Evidence Gate**  
**Stage: Geometry Cleanup Protocol**  
**Objective: Define topology and export checks**

---

### 🧱 **Geometry Cleanup Protocol Overview**

The **Evidence Gate** is a critical interactive 3D narrative component of the TraderFrame experience. It visually and interactively represents the core business message: *"Market conviction becomes credible when evidence is filtered, challenged, approved and recorded transparently."*

This stage focuses on **topology definition and export readiness** for all 3D assets and environments used in the Evidence Gate. The goal is to ensure that all geometry is clean, optimized, and ready for integration into the final interactive 3D experience.

---

## 🔧 **Topology Definition**

### ✅ **Asset Types to Clean:**
- **3D Models** (e.g., UI elements, data visualization components, gate structure, interactive nodes)
- **Environments** (e.g., background panels, lighting, spatial layout)
- **UI Elements** (e.g., sliders, buttons, data panels, confirmation nodes)

### 🛠️ **Topology Clean-Up Tasks:**

| Task | Description | Tools |
|------|-------------|-------|
| **Remove Unused Geometry** | Delete any geometry that does not contribute to the visual or functional narrative. | Blender, Maya, 3ds Max |
| **Merge Adjacent Surfaces** | Combine overlapping or adjacent faces to reduce polygon count and improve rendering performance. | Blender (Merge by Distance), Maya (Merge Geometry) |
| **Retopologize Complex Models** | Simplify high-poly models (e.g., UI panels, data visualization nodes) for real-time rendering. | ZBrush, Blender (Retopology Add-on), Maya (Retopology Tools) |
| **Ensure Consistent Normals** | All surface normals must be oriented consistently to avoid rendering artifacts. | Blender (Recalculate Normals), Maya (Normalize Normals) |
| **Optimize UV Layout** | Ensure UV maps are clean, non-overlapping, and optimized for texture mapping. | Blender (UV Editor), Maya (UV Texture Editor) |
| **Fix Non-Manifold Geometry** | Remove edges and vertices that are not part of a solid, closed surface. | Blender (Check for Non-Manifold), Maya (Check Geometry) |

---

## 📤 **Export Checks & Standards**

All 3D assets must be exported in **production-ready formats** and adhere to the following **export standards**:

### ✅ **Export Format:**
- **Preferred:** `.fbx` (with **ASCII** format for compatibility)
- **Secondary:** `.glTF` (for web-based or lightweight rendering)
- **Fallback:** `.obj` (with `.mtl` material file)

### 📌 **Export Settings:**
| Setting | Value |
|--------|-------|
| **Units** | Meters (for consistent scale across all assets) |
| **Normals** | Export as **smoothed** or **recalculated** based on the asset type |
| **UVs** | Export as **separate UV sets** if multiple UV layers are used |
| **Materials** | Export **material names** and **material IDs** for consistent rendering |
| **Animation** | Only export **static geometry** (no animation for this stage) |
| **Pivot Point** | Set to **geometry center** for all assets |
| **Up Vector** | Set to **Z-axis** for consistent orientation |

---

## 🧪 **Validation Checklist**

| Check | Description | Pass/Fail |
|-------|-------------|-----------|
| All geometry is **closed and manifold** | No non-manifold edges or vertices | ✅ |
| All **UV maps** are clean and non-overlapping | No overlapping or distorted UVs | ✅ |
| All **normals** are consistent and oriented correctly | No flipped or inconsistent normals | ✅ |
| All **materials** are correctly assigned and exported | No missing or misassigned materials | ✅ |
| All **assets** are **scaled consistently** | All assets use the same unit scale (meters) | ✅ |
| All **export settings** match the production pipeline | Export format, settings, and metadata are correct | ✅ |

---

## 📁 **File Naming & Organization**

| Folder | Description |
|--------|-------------|
| `EvidenceGate/Assets/3D/Models/` | All 3D models (UI, data nodes, gate structure) |
| `EvidenceGate/Assets/3D/Textures/` | Texture maps and material files |
| `EvidenceGate/Assets/3D/Export/` | Final exported `.fbx`, `.glTF`, and `.obj` files |
| `EvidenceGate/Assets/3D/Scenes/` | Scene files (e.g., `.blend`, `.ma`, `.max`) for reference |

---

## 📌 **Next Steps:**

- **Geometry cleanup** for all assets in the Evidence Gate
- **Export and validation** of all 3D assets
- **Integration into the 3D narrative pipeline** for TraderFrame

---

**Approvals Required:**
- 3D Asset Pipeline Lead
- UI/UX 3D Integration Lead
- QA 3D Rendering Lead

---

**Status:** ✅ **Geometry Cleanup Protocol Defined & Export Standards Approved**  
**Next Stage:** **Material & Texture Pipeline**