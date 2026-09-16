import { readdir, readFile } from "node:fs/promises";
import { extname, join, relative } from "node:path";

const root = new URL("../packages/core/src/", import.meta.url);
const forbidden = [
  /^next(?:\/|$)/,
  /^react(?:\/|$)/,
  /^better-auth(?:\/|$)/,
  /^drizzle-orm(?:\/|$)/,
  /^pg$/,
  /^@aws-sdk(?:\/|$)/,
  /^openai(?:\/|$)/
];

async function files(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  const nested = await Promise.all(entries.map(async (entry) => {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) return files(path);
    return [path];
  }));
  return nested.flat();
}

const violations = [];
for (const file of await files(root)) {
  if (![".ts", ".tsx"].includes(extname(file))) continue;
  const source = await readFile(file, "utf8");
  const specifiers = source.matchAll(/(?:from\s+|import\s*\()(["'])([^"']+)\1/g);
  for (const match of specifiers) {
    const specifier = match[2];
    if (specifier && forbidden.some((rule) => rule.test(specifier))) {
      violations.push(`${relative(root.pathname, file)} -> ${specifier}`);
    }
  }
}

if (violations.length > 0) {
  console.error("Architecture boundary violations:\n" + violations.map((v) => `- ${v}`).join("\n"));
  process.exit(1);
}

console.log("Architecture boundary check passed: packages/core has no forbidden runtime/provider imports.");
