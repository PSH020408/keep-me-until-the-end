// The game's scripts in load order, read from public/index.html, without the files that only drive the screen.
// Shared by sim.mjs, fevtest.mjs, lethal.mjs and check_facts.mjs so a new file is picked up everywhere.
import {readFileSync} from 'node:fs';
const UI_ONLY=['share','dir','endhero','turnui','factorui','fishart'];
export function gameScripts(root){
  const idx=readFileSync((root?root+'/':new URL('../',import.meta.url).pathname)+'public/index.html','utf8');
  return [...idx.matchAll(/<script src="js\/([^"]+)\.js"><\/script>/g)].map(m=>m[1]).filter(f=>!UI_ONLY.includes(f));
}
