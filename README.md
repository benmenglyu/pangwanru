# Wanru Pang — Academic website

A portable, responsive academic website with six static pages and a downloadable full CV. The public pages contain no GitHub links, trackers, remote fonts, or runtime API keys.

## Pages

- `index.html`: biography, education and research interests in parallel columns, four selected papers, academic experience, and three first-author conference presentations.
- `publications.html`: all nine published papers and two manuscripts under review. Both the header and the homepage's Full publications link open this page.
- `experience.html`: all research projects, visits and academic programmes, five conference presentations, and the AERA 2027 submission labelled Under review.
- `teaching.html`: teaching, journal reviewing, professional experience and leadership.
- `awards.html`: awards and honours.
- `cv.html`: complete web CV, with a real PDF download at `assets/Wanru-Pang-CV.pdf`.

## Preview and build

Open `index.html` directly, or run `npm run build` and `npm start`. The server prints `http://127.0.0.1:4173` and binds only to this computer. Run `npm run check` to check all six pages, assets, cross-page anchors and PDF freshness. Node.js 20+ is sufficient; the website has no npm dependencies.

## Maintain content

Edit `content/profile.json` for the biography, education, supervisor, projects, conferences, service, awards and methods. Edit `content/publications.json` for papers. Preserve author order and keep Under review manuscripts separate from published papers. The PhD supervisor, Prof. Xinhua Zhu, was explicitly confirmed by the owner on 7 November 2026.

After changing either content file, regenerate the PDF with Python and ReportLab, then rebuild and check:

```sh
python scripts/build-pdf.py
npm run build
npm run check
```

The PDF builder uses Windows Arial, Georgia and SimSun fonts and writes `output/pdf/Wanru-Pang-CV.pdf`, then copies it into the website assets. Its metadata carries a content fingerprint; checks reject a PDF that no longer matches the content files. A prebuilt PDF is committed so the hosting service needs only Node.js. For PDF generation on other operating systems, configure equivalent installed fonts in `scripts/build-pdf.py`.

Commit source, generated root HTML, `sitemap.xml`, citations and the PDF together. Deploy only `dist/`; private analysis, source DOCX, QA outputs, build scripts and content JSON are excluded from that directory.

## Hosting and search

Source repository: https://github.com/benmenglyu/pangwanru. The public site is configured for https://pangwanru.fresh-morel-1341.chatgpt.site, supplied by the Sites plugin. The tracked `.openai/hosting.json` binds this checkout to that existing Site; preserve its project ID during updates. GitHub holds the maintained source; uploading to GitHub alone does not publish a Sites update. Build and check, then publish the corresponding source commit through Sites.

For an optional migration to Cloudflare Pages: use the repository's `main` branch, build command `npm run build && npm run check`, output directory `dist`, and Node.js 22 or later. Set `siteUrl` to the new verified public HTTPS URL, set `prettyUrls` to `true` for Cloudflare Pages, regenerate the PDF, and rebuild. The configured public URL enables indexing, canonical URLs, Open Graph URLs, Person structured data and a six-page sitemap. Setting `siteUrl` to an empty string disables indexing for private previews.

GitHub source hosting does not determine the public address. A `.site` registration is a separate paid product; it is not supplied free by GitHub Pages or Cloudflare Pages. No domain was purchased. An owned custom domain can be attached later.

Google crawling/indexing is not guaranteed or instantaneous. After deployment, submit the verified sitemap through the owner's Google Search Console property when access is available; add the homepage URL to relevant academic profiles when the owner requests those changes.

## Assets and validation

The portrait is the owner's unretouched Google Scholar photo. Platform marks come from Simple Icons v16; see `assets/ASSET-SOURCES.txt`. The image-generation concepts guide layout only; real author order, contact details and education always come from the curated CV data. The complete confirmed PhD education and supervisor supersede any abbreviated concept text.

Version 2 was checked in the Codex in-app browser at 320, 390, 768 and 1488 pixel widths, plus the user's desktop viewport. All six pages fit; header navigation, full-publication navigation, citation copy and PDF download worked, with no browser console errors. The downloaded PDF matched the built file; all seven pages were rendered and visually reviewed. White background, forest-green accents, serif heading hierarchy, date rails, portrait, platform marks and section order were compared with the visual references. The real photo and source data are preserved; invented addresses and author names in conceptual mockups are not used.
