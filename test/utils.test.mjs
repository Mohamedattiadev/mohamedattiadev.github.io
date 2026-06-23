import { test } from "node:test";
import assert from "node:assert/strict";
import {
  slugify, readingTime, escapeHtml, escapeAttr, byDateDesc, routeFromPath,
} from "../assets/js/utils.js";

test("slugify lowercases, strips punctuation, dashifies spaces", () => {
  assert.equal(slugify("Hello, World!"), "hello-world");
  assert.equal(slugify("  Multi   spaces  "), "multi-spaces");
  assert.equal(slugify("Already-slug-like"), "already-slug-like");
  assert.equal(slugify("Émojis 🙂 dropped"), "mojis-dropped");
});

test("slugify caps length at 80 characters", () => {
  const long = "a".repeat(200);
  assert.equal(slugify(long).length, 80);
});

test("slugify collapses repeated dashes", () => {
  assert.equal(slugify("a -- b -- c"), "a-b-c");
});

test("readingTime returns minimum of one minute", () => {
  assert.equal(readingTime(""), 1);
  assert.equal(readingTime("just a few words"), 1);
});

test("readingTime scales with word count at 220 wpm", () => {
  const words = (n) => Array(n).fill("word").join(" ");
  assert.equal(readingTime(words(220)), 1);
  assert.equal(readingTime(words(440)), 2);
  assert.equal(readingTime(words(2200)), 10);
});

test("escapeHtml escapes the five HTML-sensitive characters", () => {
  assert.equal(escapeHtml("<script>"), "&lt;script&gt;");
  assert.equal(escapeHtml('say "hi" & don\'t'), "say &quot;hi&quot; &amp; don&#39;t");
});

test("escapeHtml is safe on non-string input", () => {
  assert.equal(escapeHtml(42), "42");
  assert.equal(escapeHtml(null), "null");
});

test("escapeAttr matches escapeHtml", () => {
  assert.equal(escapeAttr("<a>"), escapeHtml("<a>"));
});

test("byDateDesc sorts newest first", () => {
  const arr = [
    { date: "2026-01-01" },
    { date: "2026-06-15" },
    { date: "2025-12-31" },
  ];
  arr.sort(byDateDesc);
  assert.deepEqual(arr.map((p) => p.date), ["2026-06-15", "2026-01-01", "2025-12-31"]);
});

test("byDateDesc tolerates missing dates", () => {
  const arr = [{ date: "2026-01-01" }, {}, { date: "2025-01-01" }];
  arr.sort(byDateDesc);
  assert.equal(arr[0].date, "2026-01-01");
});

test("routeFromPath normalises empty paths to /", () => {
  assert.equal(routeFromPath(""), "/");
  assert.equal(routeFromPath(undefined), "/");
});

test("routeFromPath preserves real paths", () => {
  assert.equal(routeFromPath("/"), "/");
  assert.equal(routeFromPath("/journal"), "/journal");
  assert.equal(routeFromPath("/work"), "/work");
});

test("routeFromPath strips trailing slash (except root)", () => {
  assert.equal(routeFromPath("/work/"), "/work");
  assert.equal(routeFromPath("/journal/"), "/journal");
  assert.equal(routeFromPath("/"), "/");
});
