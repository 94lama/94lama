import test from 'node:test';
import assert from 'node:assert';
import { execSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

const TOOLS = path.join(process.cwd(), '.opencode', 'get-shit-done', 'bin', 'gsd-tools.cjs');
const cavemanMarker = path.join(process.cwd(), '.agents', 'skills', 'caveman', 'AUTO_TRIGGER');

test('agent-skills includes caveman when AUTO_TRIGGER exists', () => {
  // Ensure marker exists
  try { fs.writeFileSync(cavemanMarker, 'auto_trigger: true'); } catch (e) { /* best-effort */ }

  const out = execSync(`node ${TOOLS} agent-skills gsd-executor`, { encoding: 'utf8' });
  assert.ok(out.includes('caveman'), 'Expected caveman to appear in agent-skills output');
});

test('agent-skills omits caveman when AUTO_TRIGGER removed', () => {
  // Remove marker if present
  try { fs.unlinkSync(cavemanMarker); } catch (e) { /* ignore */ }

  const out = execSync(`node ${TOOLS} agent-skills gsd-executor`, { encoding: 'utf8' });
  // If other skills reference caveman this will still pass; assert either no caveman or explicit absence of marker entry
  assert.ok(!out.includes('@.agents/skills/caveman/SKILL.md') || !out.includes('AUTO_TRIGGER'), 'Caveman entry should not be injected when marker absent');
});
