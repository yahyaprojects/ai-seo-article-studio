import { mkdir, readFile, readdir, writeFile } from "node:fs/promises";
import path from "node:path";

import { STORAGE_CONFIG } from "@/lib/constants";
import type { GeneratedArticle } from "@/lib/types";
import { createSlug } from "@/lib/utils";

export type ArticleStatus = "draft" | "published";

export interface StoredArticleRecord {
  status: ArticleStatus;
  article: GeneratedArticle;
  updatedAt: string;
}

const articleDirectoryPath = path.join(process.cwd(), STORAGE_CONFIG.articlesDirectory);

export async function ensureArticleDirectory() {
  await mkdir(articleDirectoryPath, { recursive: true });
}

export function getArticleFilePath(slug: string) {
  return path.join(articleDirectoryPath, `${slug}.json`);
}

export async function titleExistsInStorage(title: string) {
  await ensureArticleDirectory();

  const slug = createSlug(title);
  const bySlugPath = getArticleFilePath(slug);

  try {
    const content = await readFile(bySlugPath, "utf-8");
    const parsed = JSON.parse(content) as StoredArticleRecord;
    if (parsed.status === "published") {
      return true;
    }
  } catch {
    // Continue with directory scan below.
  }

  const files = await readdir(articleDirectoryPath);
  const normalizedTitle = title.trim().toLowerCase();

  for (const file of files) {
    if (!file.endsWith(".json")) {
      continue;
    }
    const content = await readFile(path.join(articleDirectoryPath, file), "utf-8");
    const parsed = JSON.parse(content) as StoredArticleRecord;
    if (parsed.status !== "published") {
      continue;
    }
    const existingTitle = parsed.article.seo.title.trim().toLowerCase();
    if (existingTitle === normalizedTitle) {
      return true;
    }
  }

  return false;
}

export async function saveArticleToStorage(article: GeneratedArticle, status: ArticleStatus) {
  await ensureArticleDirectory();
  const targetPath = getArticleFilePath(article.seo.slug);

  const record: StoredArticleRecord = {
    status,
    article,
    updatedAt: new Date().toISOString(),
  };

  await writeFile(targetPath, JSON.stringify(record, null, 2), "utf-8");
}
