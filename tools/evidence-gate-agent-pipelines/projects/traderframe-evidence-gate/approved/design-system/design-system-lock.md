**TraderFrame — Evidence Gate Design System Lock**  
*Stage: Design System Approval*  
*Objective: Assemble the design system lock for the Evidence Gate interactive 3D narrative experience.*

---

## 🧩 **Design System Lock Overview**

The **TraderFrame Evidence Gate** is a **premium interactive 3D narrative** that demonstrates the **evidence-first decision process** of TraderFrame. It is designed for **independent traders, portfolio managers, and research-led market participants** who demand **transparency, risk awareness, and control** over their decision-making.

This design system lock ensures **consistency, accessibility, and brand alignment** across the 3D narrative interface, while maintaining **calm precision** and **transparent reasoning**.

---

## 🎨 **Visual Language & Brand Principles**

### 1. **Color Palette**
- **Primary**: `#007BFF` (Blue) – Trust, control, and precision
- **Secondary**: `#6C757D` (Gray) – Neutral, rational, and evidence-based
- **Accent**: `#FF4B4B` (Red) – Risk, urgency, and challenge
- **Background**: `#F5F5F5` – Clean, calm, and evidence-focused

### 2. **Typography**
- **Primary Font**: `Inter` (Google Fonts) – Modern, clean, and readable
- **Font Sizes**:
  - Body: `16px`
  - Headings: `24px` (h2), `32px` (h1)
  - Subtle Text: `14px`

### 3. **Spacing & Layout**
- **Margins**: `1rem` (16px)
- **Padding**: `0.5rem` (8px)
- **Gutters**: `1rem` (16px)
- **Line Height**: `1.5`
- **Vertical Rhythm**: 1.5x line height

### 4. **Iconography**
- **Font Awesome** (v6) – for consistent, scalable, and accessible icons
- **Icon Size**: `1.5rem` (24px)
- **Icon Color**: `#6C757D` (Gray) by default, `#FF4B4B` (Red) on hover or in risk states

---

## 🧾 **Tokens (Design Tokens)**

```json
{
  "colors": {
    "primary": "#007BFF",
    "secondary": "#6C757D",
    "accent": "#FF4B4B",
    "background": "#F5F5F5",
    "text": "#212529",
    "error": "#DC3545",
    "success": "#28A745"
  },
  "typography": {
    "fontFamily": "Inter, sans-serif",
    "fontSize": {
      "body": "16px",
      "h2": "24px",
      "h1": "32px"
    },
    "lineHeight": "1.5"
  },
  "spacing": {
    "margin": "1rem",
    "padding": "0.5rem",
    "gutter": "1rem"
  },
  "icon": {
    "size": "1.5rem",
    "color": "#6C757D"
  }
}
```

---

## 🧠 **Accessibility System**

### 1. **Color Contrast**
- Ensure all text and UI elements meet **WCAG AA** standards (minimum contrast ratio of 4.5:1)
- Use `#007BFF` (primary) with `#F5F5F5` (background) for high contrast

### 2. **Keyboard Navigation**
- All interactive elements must be accessible via keyboard
- Focus states must be clearly visible (`outline: 2px solid #007BFF`)

### 3. **Screen Reader Support**
- All UI elements must have **aria-labels** or **aria-labelledby**
- Use semantic HTML (`<button>`, `<nav>`, `<section>`, `<article>`, etc.)

### 4. **Text Alternatives**
- All icons must have **alt text** or **aria-label**
- All non-text content must have a **text alternative**

### 5. **Focus Management**
- Ensure focus order is logical and predictable
- Provide **focus-visible** styling for interactive elements

---

## 📦 **Component Library (Skeleton)**

### 1. **Header (Evidence Gate Title)**
- **Text**: "Evidence Gate"
- **Font**: `h1`
- **Color**: `#007BFF`
- **Background**: `transparent`
- **Padding**: `1rem`
- **Accessibility**: `aria-label="Evidence Gate"`

### 2. **Evidence Card**
- **Structure**: Title, Description, Status (Approved / Under Review / Challenged)
- **Color**: `#F5F5F5` background
- **Border**: `1px solid #6C757D`
- **Padding**: `1rem`
- **Accessibility**: `aria-label="Evidence Card"`

### 3. **Risk Indicator**
- **Icon**: `danger` (red) or `neutral` (gray)
- **Text**: "High Risk" or "Low Risk"
- **Color**: `#FF4B4B` (danger), `#6C757D` (neutral)
- **Accessibility**: `aria-label="Risk Level"`

### 4. **Control Panel**
- **Buttons**: "Appro