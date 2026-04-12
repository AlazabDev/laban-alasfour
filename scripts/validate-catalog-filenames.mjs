import { readdir } from "node:fs/promises";
import path from "node:path";
import process from "node:process";

const catalogRoot = path.resolve("public/assets/catalog");
const allowedPattern = /^[a-z0-9._-]+$/;
const violations = [];

async function walk(currentDir) {
  const entries = await readdir(currentDir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(currentDir, entry.name);
    const relativePath = path.relative(catalogRoot, fullPath);

    if (!allowedPattern.test(entry.name)) {
      violations.push(relativePath);
    }

    if (entry.isDirectory()) {
      await walk(fullPath);
    }
  }
}

try {
  await walk(catalogRoot);

  if (violations.length > 0) {
    console.error("Catalog filename validation failed.");
    console.error("Use lowercase letters, numbers, dots, underscores, and hyphens only.");
    for (const violation of violations) {
      console.error(`- ${violation}`);
    }
    process.exit(1);
  }

  console.log("Catalog filename validation passed.");
} catch (error) {
  console.error("Unable to validate catalog filenames.");
  console.error(error instanceof Error ? error.message : String(error));
  process.exit(1);
}
