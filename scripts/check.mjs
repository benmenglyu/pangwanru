import assert from 'node:assert/strict';
import { readFile, readdir } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { createHash } from 'node:crypto';
const root=fileURLToPath(new URL('../',import.meta.url));
const read=async p=>readFile(path.join(root,p),'utf8');
const papers=JSON.parse(await read('content/publications.json'));
assert.equal(new Set(papers.map(p=>p.id)).size,papers.length,'Paper IDs must be unique');
for (const p of papers) {
  assert(p.authors.includes('Pang, W.'),'Every listed work must include the profile owner');
  if(p.status==='Under review') assert(!p.year&&!p.doi&&!p.journal,'Under-review work must not carry a publication year or published metadata');
  else assert(/^10\.\d{4,9}\/.+/.test(p.doi)&&p.year&&p.journal,'Published papers need complete identification');
}
const pageNames=['index.html','publications.html','experience.html','teaching.html','awards.html','cv.html'];
for(const filename of pageNames) {
  const html=await read(`dist/${filename}`);
  assert(!/github/i.test(html),'Public website must not contain GitHub branding or links');
  // Reject phone-sized numeric strings; retain only identifiers from the published DOI list.
  const bibliographyNumbers = new Set(papers.flatMap(p => [...(p.doi || '').matchAll(/\d{8,}/g)].map(match => match[0])));
  assert([...html.matchAll(/\d{8,}/g)].every(match => bibliographyNumbers.has(match[0])), 'Unapproved phone-sized number in the public website');
  const ids=[...html.matchAll(/\bid="([^"]+)"/g)].map(m=>m[1]);
  assert.equal(new Set(ids).size,ids.length,'HTML IDs must be unique');
  for(const match of html.matchAll(/(?:href|src)="([^"?#]+)(?:[?#][^"]*)?"/g)) {
    if(/^(?:https?:|mailto:|data:)/.test(match[1])) continue;
    await readFile(path.join(root,'dist',match[1]));
  }
  for(const match of html.matchAll(/href="#([^"]+)"/g)) assert(ids.includes(match[1]),`Missing anchor: ${match[1]}`);
  for(const match of html.matchAll(/href="([^":]+\.html)#([^"]+)"/g)) {
    const target=await read('dist/'+match[1]);
    assert(target.includes(`id="${match[2]}"`),`Missing cross-page anchor: ${match[0]}`);
  }
  assert(html.includes('href="publications.html"'),'All pages must expose full publications');
}
const home=await read('dist/index.html');
assert.equal((home.match(/class="publication"/g)||[]).length,4,'Home features four papers');
assert.equal(((await read('dist/publications.html')).match(/class="publication"/g)||[]).length,9,'Full publication page includes all published works');
assert(home.includes('class="education-research section"')&&home.includes('class="portrait"'),'Home needs the requested two-column section and portrait');
assert.equal((home.match(/class="brand-icon /g)||[]).length,3,'All scholarly profile links need their platform mark');
const pdf=await readFile(path.join(root,'dist/assets/Wanru-Pang-CV.pdf'));
assert(pdf.subarray(0,5).equals(Buffer.from('%PDF-')),'Download must be a real PDF');
const normalized=async filename=>(await read(filename)).replace(/\r\n/g,'\n').trim();
const sourceHash=createHash('sha256').update((await normalized('content/profile.json'))+'\n'+(await normalized('content/publications.json'))).digest('hex');
assert(pdf.includes(Buffer.from('content-sha256:'+sourceHash)),'CV PDF is stale: regenerate scripts/build-pdf.py');
const profile=JSON.parse(await read('content/profile.json'));
if(profile.siteUrl){
  assert((await read('dist/robots.txt')).includes('Allow: /'),'Live website must allow crawling');
  const sitemap=await read('dist/sitemap.xml');
  assert.equal((sitemap.match(/<url>/g)||[]).length,6,'Sitemap must cover all six pages');
  assert(!home.includes('noindex'),'Live home must be indexable');
}
assert(!(await readdir(path.join(root,'dist'))).some(p=>/docx|analysis|review|content/i.test(p)),'Publish output must contain only the public website');
console.log('PASS: six pages, links and cross-page anchors, selected/full publications, portrait and platform marks, under-review status, public output, and up-to-date PDF.');
