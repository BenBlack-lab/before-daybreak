import { spawnSync } from 'node:child_process';
import { cpSync, existsSync, mkdirSync, renameSync, rmSync } from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const output = path.resolve(root, 'dist');
if (output !== path.join(root, 'dist')) throw new Error('Unexpected output path');
if (existsSync(output)) rmSync(output, { recursive: true });
function run(file, args) {
  const result = spawnSync(process.execPath, [file, ...args], { stdio: 'inherit' });
  if (result.status !== 0) process.exit(result.status || 1);
}
run('node_modules/@opennextjs/cloudflare/dist/cli/index.js', ['build']);
run('node_modules/wrangler/bin/wrangler.js', ['deploy', '--dry-run', '--outdir', 'dist/server']);
renameSync('dist/server/worker.js', 'dist/server/index.js');
rmSync('dist/server/worker.js.map', { force: true });
mkdirSync('dist/client', { recursive: true });
cpSync('.open-next/assets', 'dist/client', { recursive: true });
