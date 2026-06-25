module.exports = async function createPaperFromOpenAlex(tp) {
  const query = await tp.system.prompt("论文标题、DOI 或关键词 / OpenAlex search");
  if (!query) return "";

  const data = await getJson(tp, `https://api.openalex.org/works?search=${encodeURIComponent(query)}&per-page=8`);
  const results = (data.results ?? [])
    .sort((left, right) => (right.cited_by_count ?? 0) - (left.cited_by_count ?? 0));
  if (results.length === 0) return `> 未在 OpenAlex 找到 "${query}"。`;

  const choice = await tp.system.suggester(
    results.map(formatWorkChoice),
    results,
    false,
    "选择文献"
  );
  if (!choice) return "";

  const citeKey = buildCiteKey(choice);
  await tp.file.rename(citeKey);

  const authors = unique((choice.authorships ?? []).map(item => item.author?.display_name).filter(Boolean));
  const institutions = unique(
    (choice.authorships ?? [])
      .flatMap(item => item.institutions ?? [])
      .map(item => item.display_name)
      .filter(Boolean)
  );
  const venue = choice.primary_location?.source?.display_name ?? choice.host_venue?.display_name ?? "";
  const abstract = invertAbstract(choice.abstract_inverted_index);

  return `---
tags:
  - paper
status: unread
aliases:
  - ${yamlString(choice.title)}
year: ${choice.publication_year ?? ""}
title: ${yamlString(choice.title)}
doi: ${yamlString(choice.doi)}
url: ${yamlString(choice.id)}
venue: ${yamlString(venue)}
openalex: ${yamlString(choice.id)}
pdf:
reading:
images:
image_index:
authors:
${yamlWikiList(authors)}
institutions:
${yamlWikiList(institutions)}
topics:
${yamlList((choice.topics ?? []).slice(0, 6).map(item => item.display_name))}
---

# ${choice.title}

- [ ] PDF:: 
- [ ] 精读稿:: 待整理
- [ ] 地图维护:: 在 [[论文地图]] 的快速索引中加入本篇，并运行 \`python setting/scripts/check_paper_map.py --sync-reading-markers\`
- [ ] 阅读状态:: unread

related:: 
affiliation:: ${institutions.map(value => `[[${value}]]`).join(", ")}

## Abstract

${abstract}

## 一句话问题


## 方法


## 证据


## 局限


## 我的阅读笔记


\`\`\`dataviewjs
const {Research} = customJS
Research.topic(dv)
\`\`\`
`;
};

async function getJson(tp, url) {
  const request = globalThis.requestUrl ?? tp.obsidian?.requestUrl;
  if (!request) throw new Error("Obsidian requestUrl is unavailable.");
  const response = await request({ url, method: "GET", headers: { Accept: "application/json" } });
  return response.json ?? JSON.parse(response.text);
}

function formatWorkChoice(work) {
  const venue = work.primary_location?.source?.display_name ?? work.host_venue?.display_name ?? "-";
  return `${work.publication_year ?? "-"} | ${work.title} | ${venue} | cites ${work.cited_by_count ?? 0}`;
}

function buildCiteKey(work) {
  const firstAuthor = work.authorships?.[0]?.author?.display_name ?? "paper";
  const family = firstAuthor.trim().split(/\s+/).at(-1)?.toLowerCase() ?? "paper";
  const year = work.publication_year ?? "yyyy";
  const titleWord = (work.title ?? "untitled")
    .toLowerCase()
    .replace(/[^a-z0-9 ]/g, " ")
    .trim()
    .split(/\s+/)
    .find(word => !["the", "a", "an", "of", "for", "and", "with", "to", "in", "on"].includes(word))
    ?? "paper";
  return `@${family}${year}${titleWord}`.replace(/[\\/:*?"<>|#^[\]]/g, "");
}

function invertAbstract(index) {
  if (!index) return "";
  const words = [];
  for (const [word, positions] of Object.entries(index)) {
    for (const position of positions) words[position] = word;
  }
  return words.join(" ");
}

function unique(values) {
  return [...new Set(values.filter(Boolean))];
}

function yamlString(value) {
  return value ? JSON.stringify(String(value)) : "";
}

function yamlList(values) {
  if (!values || values.length === 0) return "";
  return values.map(value => `  - ${yamlString(value)}`).join("\n");
}

function yamlWikiList(values) {
  if (!values || values.length === 0) return "";
  return values.map(value => `  - "[[${String(value).replaceAll('"', '\\"')}]]"`).join("\n");
}
