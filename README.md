# Rodel Ilagan — personal portfolio

A monochrome editorial portfolio built with React, Vite and Tailwind CSS. Static hosting; no backend, paid services or secret tokens. Responsive fixed desktop sidebar and mobile menu. Original local SVG product-inspired marks and discipline symbols; no remote fonts, images or tracking.

## Local setup

Install Node.js 22.12+ (or 24), then run:

```sh
npm ci
npm run dev
```

Open the URL printed by Vite. `npm run check` validates content and `npm run build` creates `dist/`. `npm run preview` serves that build.

## Edit content

All published content lives in **public/portfolio.json**. Edit this file directly or open **/#/admin** (Maintenance in the footer). Under a project path, use `/repository-name/#/admin`. Hash routing works on GitHub Pages without server rewrites. No `/admin` server route is required.

The editor supports identity, hero, about, services, projects, experience / qualifications, skills and symbols, contact, photo and résumé. Add/remove items and move them up. Preview uses `?preview=1#overview`, so section navigation preserves the draft. Empty projects and experience are hidden, as are absent CV and email links. Confirmed capabilities are the only initial skill entries. Background placeholders are explicitly labeled; project and experience placeholders appear in the editor rather than empty public sections.

Save draft stores content in this browser's IndexedDB, including uploaded files. Drafts do not change the public site, do not sync between devices, and may be removed by clearing browser storage. Export backups regularly. If storage is blocked, you can still edit and export. Leaving the editor without saving discards unsaved edits.

Upload a PNG/JPEG/WebP photo (up to 2 MB), and PDF résumé (up to 8 MB). Assets are embedded as data URLs in the central JSON for a portable export. They become public when committed. Compress large files first. The résumé link appears only after upload; photos use a compact portrait crop. The reference image's biography, location, career history and years of experience were not treated as confirmed facts.

To publish edits: export the publishing ZIP, extract it, replace `public/portfolio.json` with the included file, commit and push. Backup JSON / Import JSON also lets you transfer a draft. The editor is not password protected: it has no server privileges and cannot write to GitHub. Never put credentials or sensitive information in content. Public visitors can create only their own local drafts.

## Theme & accessibility

Appearance defaults to the system theme and follows system changes. Light and Dark choices persist in localStorage; System removes the override. A small inline initializer prevents a theme flash. Semantic sections, a skip link, keyboard focus rings, native buttons/inputs, mobile navigation with expanded state, and reduced-motion CSS are included. No automatic animation or external web fonts.

## GitHub Pages — exact initial publishing steps

**Do not publish until contact email and placeholder content have been reviewed.** This project has not been published by the implementation process.

1. Create a public repository named **idevdel03.github.io** in the **idevdel03** GitHub account.
2. Commit these files, including `package-lock.json` and `.github/workflows/deploy.yml`, to its **main** branch and push. If you use GitHub Desktop, add this local repository, choose Publish repository, verify the name, and leave it public. Do this only when ready to publish.
3. In GitHub, open repository **Settings → Pages → Build and deployment → Source**, and select **GitHub Actions**.
4. Open **Actions → Deploy portfolio to GitHub Pages → Run workflow**, choose **main**, and run it. Subsequent pushes to main deploy automatically.
5. Wait for both build and deploy jobs to succeed. Visit **https://idevdel03.github.io/**. Check the contact, theme toggle, photo and CV on your phone.

The workflow reads GitHub Pages' `base_path` to configure Vite. The same code also supports **https://idevdel03.github.io/repository-name/** if moved to a project repository. All content and favicon paths use Vite's base URL; navigation uses anchors and hash routes. For a local project-path build in PowerShell:

```powershell
$env:PAGES_BASE='/repository-name/'
npm run build
npm run preview
Remove-Item Env:PAGES_BASE
```

Use the prefixed URL when previewing this build. The root repository defaults to `/`. No GitHub token belongs in the frontend. The Actions workflow uses GitHub's built-in short-lived deployment permissions.

## Before publishing

- Required: a real contact email.
- Replace/remove the About background placeholder.
- Add confirmed project case studies: challenge, contribution, solution, outcome and optional URL. Empty selected work is hidden.
- Add confirmed experience and qualifications if desired. Empty experience is hidden.
- Optional: portrait and PDF CV; their links appear only when supplied.
- Review the drafted service descriptions and skill symbols.

## Structure

`src/main.jsx`: public layout, navigation, logos and theme. `src/Admin.jsx`: content editor and publishing export. `src/storage.js`: local draft storage and backup validation. `src/styles.css`: Tailwind import, responsive layouts and theme tokens. `public/portfolio.json`: editable content. `.github/workflows/deploy.yml`: build and deployment.
