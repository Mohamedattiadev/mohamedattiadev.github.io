#!/usr/bin/env node
// Journal publisher, one post every 4 days, in queue order.
//
// The queue is posts/queue/*.md, and the files publish in filename order, so
// 01-... goes out first and 09-... last. That matters here: the posts are the
// Terminal-101 chapters and a chapter only makes sense after the one before it.
//
// A post is due when INTERVAL_DAYS whole days have passed since the last one.
// The hour of day is a deterministic hash of the slug, so posts do not all
// land at 00:00 UTC, and the same slug always picks the same hour.
//
// Usage:
//   node scripts/publish-post.mjs            # respects the schedule
//   node scripts/publish-post.mjs --force    # ignore the schedule, publish now
//   node scripts/publish-post.mjs --dry-run  # show what it would do

import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const QUEUE_DIR     = path.join(ROOT, "posts", "queue");
const PUBLISHED_LOG = path.join(ROOT, "posts", "published.json");
const JOURNAL_FILE  = path.join(ROOT, "assets", "data", "journal.json");

const INTERVAL_DAYS = 4;
const DAY_MS = 86400000;

const FORCE   = process.argv.includes("--force");
const DRY_RUN = process.argv.includes("--dry-run");

const now = new Date();
const dateStr = now.toISOString().slice(0, 10);

const log = readJSON(PUBLISHED_LOG, {});
log.slugs ??= [];

// Next post is whatever is first in the queue and not published yet.
const queue = fs.readdirSync(QUEUE_DIR)
  .filter((f) => f.endsWith(".md"))
  .sort()
  .map((f) => parsePost(path.join(QUEUE_DIR, f)))
  .filter((p) => !log.slugs.includes(p.slug));

if (!queue.length) {
  console.log("[done] queue empty. Add more posts to posts/queue/ and they publish on the next interval.");
  process.exit(0);
}
const picked = queue[0];

if (!FORCE && log.last) {
  const elapsed = wholeDaysBetween(log.last, dateStr);
  if (elapsed < INTERVAL_DAYS) {
    console.log(`[skip] last post was ${log.last}, ${elapsed} of ${INTERVAL_DAYS} days elapsed.`);
    process.exit(0);
  }
  // Due today. Wait for this slug's hour slot so it does not always land at 00:00.
  const slot = seededInt(picked.slug + ":hour", 24);
  if (now.getUTCHours() < slot) {
    console.log(`[skip] "${picked.slug}" is due today at hour ${slot} UTC. Now: hour ${now.getUTCHours()}.`);
    process.exit(0);
  }
}

const entry = {
  id: `auto_${picked.slug}_${dateStr}`,
  title: picked.title,
  date: dateStr,
  body: picked.body,
  source: "auto",
};

console.log(`[pick] "${picked.title}" (${picked.slug}), ${queue.length - 1} left in the queue after this.`);
if (DRY_RUN) { console.log("[dry-run] no files written."); process.exit(0); }

const journal = readJSON(JOURNAL_FILE, []);
journal.unshift(entry);
writeJSON(JOURNAL_FILE, journal);

log.last = dateStr;
log.slugs.push(picked.slug);
writeJSON(PUBLISHED_LOG, log);

console.log(`[ok] published "${picked.title}" to ${path.relative(ROOT, JOURNAL_FILE)}`);

/* ---------- helpers ---------- */

function readJSON(p, fallback) {
  try { return JSON.parse(fs.readFileSync(p, "utf8")); }
  catch { return fallback; }
}
function writeJSON(p, data) {
  fs.writeFileSync(p, JSON.stringify(data, null, 2) + "\n");
}
function parsePost(file) {
  const raw = fs.readFileSync(file, "utf8");
  const m = raw.match(/^---\s*\n([\s\S]*?)\n---\s*\n([\s\S]*)$/);
  const meta = {};
  let body = raw;
  if (m) {
    body = m[2].trim();
    m[1].split("\n").forEach((line) => {
      const idx = line.indexOf(":");
      if (idx > 0) meta[line.slice(0, idx).trim()] = line.slice(idx + 1).trim();
    });
  }
  return {
    title: meta.title || path.basename(file, ".md"),
    slug:  meta.slug  || path.basename(file, ".md"),
    body,
  };
}
// Whole days between two YYYY-MM-DD strings, counted at UTC midnight so a
// publish at 23:00 and a check at 01:00 four days later still says 4.
function wholeDaysBetween(fromISO, toISO) {
  const a = Date.parse(fromISO + "T00:00:00Z");
  const b = Date.parse(toISO + "T00:00:00Z");
  if (Number.isNaN(a) || Number.isNaN(b)) return Infinity;
  return Math.floor((b - a) / DAY_MS);
}
function seededInt(seed, mod) {
  const h = crypto.createHash("sha256").update(seed).digest();
  return h.readUInt32BE(0) % mod;
}
