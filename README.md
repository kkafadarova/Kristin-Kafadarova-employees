# Pair of Employees – Longest Overlap

A React + TypeScript app that finds the pair of employees who have worked together the **longest** across shared projects. It lets you upload a CSV, see all pairs (ranked by total overlapping days), inspect the project breakdown for a selected pair, and **export** that breakdown to CSV.

---

## Features

- Upload a CSV from your file system
- File validation (type/empty) with friendly errors
- Multiple date formats supported
- `DateTo` of `NULL` (or empty) is treated as **today**
- Overlap is computed in **inclusive days**
- “All Pairs” view (sorted by total days) + per-project breakdown
- **Export CSV** (BOM + CRLF for Excel compatibility)
- **Clear** button to reset selected data
- Tailwind CSS, **no** custom CSS modules required
- Vitest + Testing Library unit tests

---

## Quick Start

```bash
# 1) Install deps
npm install

# 2) Start dev server
npm run dev

### Testing

# Run tests once
npm test

# Watch mode
npm run test:watch

# Coverage report
npm run coverage
```

---

## CSV Format

**Columns:** `EmpID, ProjectID, DateFrom, DateTo`  
The header row is **optional** (auto-detected).

**Example:**

```csv
EmpID,ProjectID,DateFrom,DateTo
143,12,2013-11-01,2014-01-05
218,12,2013-12-20,NULL
143,10,2009-01-01,2011-04-27
```

### Supported date formats

- `yyyy-MM-dd` → `2013-11-01`
- `yyyy/MM/dd` → `2013/11/01`
- `dd.MM.yyyy` → `01.11.2013`
- `dd/MM/yyyy` **or** `MM/dd/yyyy`
- `d-MMM-yyyy` → `1-Jan-2013`
- `MMM d, yyyy` → `Jan 1, 2013`
- `yyyymmdd` → `20131101`
- Fallback to `new Date(...)`, then **locked to UTC midnight**

> `DateTo` can be `NULL` (or empty). It will be treated as **today**.

---

## How to Use

1. Click **CSV file** and select your CSV.
2. The **All Pairs** table lists every pair (sorted by total common days).
3. Click a pair to see the **project breakdown** and total days.
4. Use **Export CSV** to download the breakdown for the selected pair.
5. Use **Clear** to reset everything.

---

## How It Works (Algorithm)

1. **Group**: build `project → employee → [intervals]` from the CSV.
2. **Merge**: merge only **overlapping** intervals for each employee within each project (no “touching by next day” merge).
3. **Aggregate**: for each pair within a project, sum **inclusive** overlaps (in days). Accumulate across projects.
4. **Sort**: rank pairs by total days; show per-project breakdown for the selected pair.

### Date & Time Safety

- All parsed dates are normalized to **UTC midnight** to avoid time-zone/DST issues.
- Day counts use `inclusive` arithmetic (e.g., `2024-01-01` to `2024-01-01` = **1** day).

---

## Project Structure (short)

```
src/
  components/
    Header/
    FilePicker/
    AllPairsTable/
    ProjectsTable/
    ExportButton/
    Stats/
  hooks/
    useCsvRows/
    useEmployees/           # or useTopPairs, depending on your naming
  utils/
    dates/                  # UTC helpers, date parsing
    csv/                    # CSV parser
    overlap/                # interval merge + overlap days
    exportCsv/              # CSV building & download
  types.ts
  App.tsx
```
