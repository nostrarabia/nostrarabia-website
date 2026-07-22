import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const contentDirectory = path.join(process.cwd(), 'content/ar');

export interface ContentFrontmatter {
  title: string;
  description?: string;
  level?: string;
  lastReviewed?: string;
  technicalReviewer?: string;
  securityReviewer?: string;
  sources?: string[];
  adaptedFrom?: string;
  status?: string;
}

export interface ContentDocument {
  id: string;
  frontmatter: ContentFrontmatter;
  content: string;
}

export function getAllContentIds(): string[] {
  try {
    const fileNames = fs.readdirSync(contentDirectory);
    return fileNames
      .filter((fileName) => fileName.endsWith('.md'))
      .map((fileName) => fileName.replace(/\.md$/, ''));
  } catch {
    return [];
  }
}

export function getContentData(id: string): ContentDocument | null {
  /**
   * Defence in depth. Traversal here is not reachable today: the only caller is
   * /learn/[slug], which now sets dynamicParams = false, and four encodings were
   * probed against a running production build and all returned 404 with no file
   * content. But that control lives in a different file, and it holds only for
   * as long as nobody sets dynamicParams back to true or adds a second caller
   * such as a search route or an OG-image handler that passes an unvalidated id.
   * The check belongs next to the filesystem read that would be the victim.
   */
  if (!getAllContentIds().includes(id)) return null;

  const fullPath = path.join(contentDirectory, `${id}.md`);
  try {
    const fileContents = fs.readFileSync(fullPath, 'utf8');
    const matterResult = matter(fileContents);

    const data = matterResult.data as Record<string, unknown>;
    if (data.lastReviewed instanceof Date) {
      data.lastReviewed = data.lastReviewed.toISOString().split('T')[0];
    }

    return {
      id,
      frontmatter: data as unknown as ContentFrontmatter,
      content: matterResult.content,
    };
  } catch {
    return null;
  }
}
