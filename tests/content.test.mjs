import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const contentPath = new URL("../app/data/site-content.json", import.meta.url);

test("profile content contains the approved identity and links", async () => {
  const content = JSON.parse(await readFile(contentPath, "utf8"));

  assert.equal(content.profile.name, "Long Xu");
  assert.equal(content.profile.chineseName, "徐龙");
  assert.equal(content.profile.email, "xulongbao6@gmail.com");
  assert.equal(content.profile.affiliation, "Sun Yat-sen University");
  assert.equal(content.links.github, "https://github.com/xulong66");
  assert.equal(content.links.orcid, "https://orcid.org/0009-0002-8075-2589");
  assert.match(content.links.scholar, /7kqCdhkAAAAJ/);
});

test("publication content contains the three verified works", async () => {
  const content = JSON.parse(await readFile(contentPath, "utf8"));

  assert.equal(content.publications.length, 3);
  assert.deepEqual(
    content.publications.map(({ url, year }) => [url, year]),
    [
      ["https://doi.org/10.1016/j.dcan.2025.09.002", 2026],
      ["https://doi.org/10.1109/WCNC61545.2025.10978374", 2025],
      ["https://doi.org/10.1016/j.dcan.2024.03.008", 2025],
    ],
  );
  assert.deepEqual(
    content.publications.map(({ title }) => title),
    [
      "Enhanced multi-agent deep reinforcement learning for efficient task offloading and resource allocation in vehicular networks",
      "Adaptive Computation Offloading Based on Enhanced Multi-Agent Deep Reinforcement Learning",
      "Hierarchical detection and tracking for moving targets in underwater wireless sensor networks",
    ],
  );
  assert.deepEqual(
    content.publications.map(({ venue }) => venue),
    [
      "Digital Communications and Networks 12(1), 66–75",
      "2025 IEEE Wireless Communications and Networking Conference (WCNC), 1–6",
      "Digital Communications and Networks 11(2), 556–562",
    ],
  );
  for (const publication of content.publications) {
    assert.ok(publication.authors.includes("Long Xu"));
  }
});

test("approved collections have the expected scope", async () => {
  const content = JSON.parse(await readFile(contentPath, "utf8"));

  assert.equal(content.research.length, 3);
  assert.equal(content.news.length, 3);
  assert.equal(content.education.length, 2);
});

test("unsupported profile categories are absent at every nesting level", async () => {
  const content = JSON.parse(await readFile(contentPath, "utf8"));
  const keys = [];
  const visit = (value) => {
    if (!value || typeof value !== "object") return;
    for (const [key, child] of Object.entries(value)) {
      keys.push(key.toLowerCase());
      visit(child);
    }
  };
  visit(content);

  assert.equal(keys.includes("awards"), false);
  assert.equal(keys.includes("services"), false);
  assert.equal(keys.includes("citationcount"), false);
});
