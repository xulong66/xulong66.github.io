import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const contentPath = new URL("../app/data/site-content.json", import.meta.url);

test("profile content contains the approved identity and links", async () => {
  const content = JSON.parse(await readFile(contentPath, "utf8"));

  assert.equal(content.profile.name, "Long Xu");
  assert.equal("chineseName" in content.profile, false);
  assert.equal(content.profile.email, "xulongbao6@gmail.com");
  assert.equal(content.profile.affiliation, "Sun Yat-sen University");
  assert.equal(content.links.github, "https://github.com/xulong66");
  assert.equal(content.links.orcid, "https://orcid.org/0009-0002-8075-2589");
  assert.match(content.links.scholar, /7kqCdhkAAAAJ/);
});

test("publication content includes the accepted FCN 2026 paper first", async () => {
  const content = JSON.parse(await readFile(contentPath, "utf8"));

  assert.equal(content.publications.length, 4);
  assert.deepEqual(
    content.publications.map(({ url, year }) => [url, year]),
    [
      ["https://www.future-forum.org.cn/en/fcn2026/About.html", 2026],
      ["https://doi.org/10.1016/j.dcan.2025.09.002", 2026],
      ["https://doi.org/10.1109/WCNC61545.2025.10978374", 2025],
      ["https://doi.org/10.1016/j.dcan.2024.03.008", 2025],
    ],
  );
  assert.deepEqual(
    content.publications.map(({ title }) => title),
    [
      "Adaptive Offloading Based on MH-GAT-MAPPO for Satellite-Terrestrial Integration Systems",
      "Enhanced multi-agent deep reinforcement learning for efficient task offloading and resource allocation in vehicular networks",
      "Adaptive Computation Offloading Based on Enhanced Multi-Agent Deep Reinforcement Learning",
      "Hierarchical detection and tracking for moving targets in underwater wireless sensor networks",
    ],
  );
  assert.deepEqual(
    content.publications.map(({ venue }) => venue),
    [
      "2026 International Conference on Future Communications and Networks (FCN): Edge and Cloud Computing Networks",
      "Digital Communications and Networks 12(1), 66–75",
      "2025 IEEE Wireless Communications and Networking Conference (WCNC), 1–6",
      "Digital Communications and Networks 11(2), 556–562",
    ],
  );
  for (const publication of content.publications) {
    assert.ok(publication.authors.includes("Long Xu"));
  }
  assert.equal(
    content.publications[0].authors,
    "Jiale Tan, Long Xu, Hongcheng Zhuang",
  );
  assert.equal(content.publications[0].kind, "Conference · Accepted");
});

test("patent content contains four verified records in reverse chronological order", async () => {
  const content = JSON.parse(await readFile(contentPath, "utf8"));

  assert.deepEqual(
    content.patents.map(({ number, year, status }) => [number, year, status]),
    [
      ["CN121368013B", 2026, "Granted Chinese Invention Patent"],
      ["CN119938160A", 2025, "Published Chinese Patent Application"],
      ["CN117880887A", 2024, "Published Chinese Patent Application"],
      ["CN116209103B", 2024, "Granted Chinese Invention Patent"],
    ],
  );
  assert.deepEqual(
    content.patents.map(({ url }) => url),
    [
      "https://patents.google.com/patent/CN121368013B/en",
      "https://patents.google.com/patent/CN119938160A/en",
      "https://patents.google.com/patent/CN117880887A/en",
      "https://patents.google.com/patent/CN116209103B/en",
    ],
  );
  for (const patent of content.patents) {
    assert.ok(patent.inventors.includes("Long Xu"));
  }
  assert.equal(content.patents[1].applicationNumber, "202411778024.X");
});

test("approved collections have the expected scope", async () => {
  const content = JSON.parse(await readFile(contentPath, "utf8"));

  assert.equal(content.research.length, 3);
  assert.equal(content.news.length, 4);
  assert.equal(
    content.news[0].text,
    "Our paper on MH-GAT-MAPPO-based adaptive offloading for satellite-terrestrial integrated systems was accepted at FCN 2026.",
  );
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
