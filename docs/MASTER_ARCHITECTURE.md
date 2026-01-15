# Real Estate UI/UX Hub - Master Technical Specification

**Deployment Target:** Property Shop Investment (PSI)
**Main URL:** [https://www.psinv.net](https://www.psinv.net)
**Version:** 2.1.0 (PSI-Specific)
**Status:** Live Deployment Configuration

---

## 1. Product Vision & Ecosystem Hierarchy

### 1.1 Concept: The Developer Ecosystem
The **Real Estate UI/UX Hub** is a centralized Project Management Workspace designed to audit, monitor, and optimize the digital experience of **Property Shop Investment (PSI)**. 
Instead of treating `psinv.net` as a static brochure, this Hub treats it as a living product requiring continuous "Continuous Optimization" cycles driven by AI Agents.

### 1.2 Data Hierarchy (PSI Live Structure)
The application uses a strict hierarchical data model tailored to PSI's sitemap.

#### Project Level
*   **ID:** `psinv-net`
*   **Name:** Property Shop Investment
*   **Base URL:** `https://www.psinv.net`
*   **Market:** Luxury Real Estate (Abu Dhabi/Dubai)

#### Page Folders (The 10 Critical Audit Targets)
These 10 folders represent the initial audit scope for the AI Agents.

1.  **`homepage`**
    *   **Live URL:** `https://www.psinv.net`
    *   **Audit Priority:** Critical. Focus on LCP (Largest Contentful Paint) and Hero Section Conversion.
2.  **`luxury-projects` (Off-Plan)**
    *   **Live URL:** `https://psinv.net/en/project/luxury-project-uae/`
    *   **Goal:** Fix layout shift (CLS) on the "New Launches" grid and optimize heavy image assets.
3.  **`about-us` (Trust Signals)**
    *   **Live URL:** `https://psinv.net/en/about-us`
    *   **Goal:** Audit "Awards" section visibility and credibility indicators.
4.  **`services-hub`**
    *   **Live URL:** `https://psinv.net/en/services`
    *   **Goal:** Improve navigation clarity between "Sales" vs "Leasing" funnels.
5.  **`sales-services`**
    *   **Live URL:** `https://psinv.net/en/services/sales/sales-services/`
    *   **Goal:** Optimize the "List Your Property" Call-to-Action (CTA).
6.  **`property-management`**
    *   **Live URL:** `https://psinv.net/en/services/sales/property-management/`
    *   **Goal:** Check readability and layout of the "Landlord Benefits" text blocks.
7.  **`marketing-services`**
    *   **Live URL:** `https://psinv.net/en/services/marketing/`
    *   **Goal:** Visual hierarchy check for the "Our Channels" infographic and compliance scan.
8.  **`loyalty-program`**
    *   **Live URL:** `https://loyalty-program.psinv.net/`
    *   **Goal:** Fix mobile responsiveness of the "Partners" grid.
9.  **`contact-us`**
    *   **Live URL:** `https://psinv.net/en/contact-us`
    *   **Goal:** Form accessibility check (Input labels, contrast, and ARIA attributes).
10. **`saadiyat-island-listings` (Sample Listing Page)**
    *   **Live URL:** `https://psinv.net/en/projects/abu-dhabi/saadiyat-island`
    *   **Goal:** Analyze the "Unit Card" design vs. Competitors (Bayut/PropertyFinder).

---

## 2. The AI Agent Roles (Tailored for PSI)

The system is powered by three specialized AI personas (Agents), orchestrating Google Gemini 1.5 Pro to solve specific PSI challenges.

### 2.1 Agent 1: The Visual Strategist
*   **Role:** UX Director & Lead Architect.
*   **Target Task:** Compare `saadiyat-island-listings` against *Bayut.com* listing cards.
*   **Key Logic:**
    *   **Heatmap Generation:** Analyzes screenshots to predict if the "Call Agent" or "WhatsApp" buttons on PSI listing pages are visually distinct enough.
    *   **Feature Gap Analysis:** Detects if competitors offer tools (e.g., "Mortgage Calculator", "ROI Estimator") that PSI is missing.
    *   **Artifact Generation:** Generates React/Tailwind code for missing components (e.g., a "Sticky Lead Form").

### 2.2 Agent 2: The Performance Engineer
*   **Role:** Senior DevOps & Web Performance Expert.
*   **Target Task:** Audit `homepage` Web Vitals.
*   **Specific Issue:** Heavy image payload on the main slider causing slow LCP.
*   **Key Logic:**
    *   **LCP Optimization:** Identifies large hero images slowing down the Largest Contentful Paint.
    *   **Remediation:** Generates `next/image` configurations and script loading strategies to improve the Lighthouse score.

### 2.3 Agent 3: The Compliance Guardian
*   **Role:** Fair Housing Officer & Brand Guardian.
*   **Target Task:** Scan `marketing-services` and listing descriptions.
*   **Key Logic:**
    *   **Fair Housing Scan:** Flags discriminatory language based on protected classes.
    *   **Luxury Tone Check:** Ensures content matches PSI's "Luxury" brand voice.
    *   **Output:** A risk report with "Safe Copy" suggestions.

---

## 3. The "Hub" Features & User Flow

### 3.1 Modern Workspace & Feed
*   **History Feed:** A chronological list of past audits displayed in the Workspace.
    *   *Visual:* "Jan 15: Homepage Speed Audit" (Green status) vs "Jan 12: Commercial Page UX Review" (In Progress).
    *   *Benefit:* Allows the PSI Tech Team to track the evolution of the site over time.
*   **Action Center:** A non-intrusive input zone at the top of the workspace for dragging & dropping new screenshots for immediate analysis.

### 3.2 Instant Preview Engine
*   **Feature:** `CodePreviewModal`.
*   **Function:** When the AI suggests a fix (e.g., a new "Sticky Lead Form"), the user clicks "View Artifact".
*   **Tech:** Renders the generated React code/HTML into a secure `iframe` sandbox instantly.

### 3.3 Integrations
*   **Walk Score API:**
    *   *Target:* `saadiyat-island-listings`
    *   *Context:* Adds neighborhood walkability data to PSI's property details pages to increase location value.
*   **HubSpot/CRM:**
    *   *Target:* `contact-us`
    *   *Context:* Track if specific UX changes (e.g., button color change) correlate with an increase in lead submissions.

---

## 4. Technical Stack & Schema

### 4.1 Frontend Architecture
*   **Framework:** Next.js 14+ (App Router).
*   **Styling:** Tailwind CSS (Utility-first, responsive).
*   **UI Components:** Shadcn/UI patterns + Lucide React icons.
*   **State Management:** React Context + Local Component State.

### 4.2 Database Schema (Firebase Firestore)

**Collection: `projects`**
```typescript
interface Project {
  id: "psinv-net";
  name: "Property Shop Investment";
  propertyType: "Luxury";
  url: "https://www.psinv.net";
  createdAt: Timestamp;
}
```

**Sub-Collection: `projects/{projectId}/pages`**
```typescript
interface Page {
  id: string; // e.g., "luxury-projects"
  name: string; // e.g., "Luxury Projects (Off-Plan)"
  path: string; // e.g., "/en/project/luxury-project-uae/"
  projectId: "psinv-net";
  lastUpdated: Timestamp;
}
```

**Sub-Collection: `projects/{projectId}/pages/{pageId}/tasks`**
```typescript
interface Task {
  id: string; // e.g., "2026-01-15_visual_audit_ax9z"
  type: "competitor_audit" | "lighthouse_speed" | "compliance_scan";
  status: "todo" | "done";
  date: Timestamp;
  assets: {
    myScreenshotUrl: string; // Firebase Storage URL
    competitorScreenshotUrl?: string;
    lighthouseJson?: any;
  };
  aiResult: AnalysisResult; // Complex JSON object from Gemini
}
```

### 4.3 Storage Structure (Firebase Storage)
*   **Structure:** `projects/{projectId}/{pageId}/{date}_{type}_{filename}`
*   **Example:** `projects/psinv-net/off-plan/2026-01-15_competitor-screenshot_bayut.png`

---

## Appendix: Auto-Crawl Script Strategy

To populate the database with the PSI pages automatically, the following logic is used in `src/scripts/scan-psi.ts`:

1.  **Initialize:** Create project `psinv-net`.
2.  **Fetch:** Crawl `https://www.psinv.net`.
3.  **Extract:** Parse Nav and Footer links.
4.  **Filter:** Select links matching keywords (project, services, contact, about, buy, rent).
5.  **Persist:** Create Page documents in Firestore for the filtered links.
