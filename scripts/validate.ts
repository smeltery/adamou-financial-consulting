import { dirname, resolve } from "node:path";
import { Window } from "happy-dom";
const window = new Window();
Object.assign(globalThis, { window, document: window.document });
const { default: mermaid } = await import("mermaid");
mermaid.initialize({ startOnLoad: false });
import budgets from "./budgets.json";
const result = Bun.spawnSync(["git", "ls-files", "-z"]);
if (result.exitCode) throw new Error("Cannot list tracked files");
const files = result.stdout
  .toString()
  .split("\0")
  .filter(Boolean)
  .filter(
    (path) =>
      !/^(public\/assets\/|\.flox\/|\.openai\/)/.test(path) &&
      path !== "bun.lock",
  );
const errors: string[] = [];
const directories = new Map<string, number>();
let total = 0;
for (const path of files) {
  directories.set(dirname(path), (directories.get(dirname(path)) || 0) + 1);
  if (!/\.(ts|css|md|json|jsonc|yml|yaml)$/.test(path)) continue;
  const text = await Bun.file(path).text();
  const lines = text.trimEnd().split("\n").length;
  total += lines;
  const limit =
    (budgets.files as Record<string, number>)[path] || budgets.default_lines;
  if (lines > limit) errors.push(`${path}: ${lines} lines > budget ${limit}`);
  if (!path.endsWith(".md")) continue;
  for (const match of text.matchAll(/```mermaid\n([\s\S]*?)```/g)) {
    try {
      await mermaid.parse(match[1]);
    } catch (error) {
      errors.push(`${path}: invalid Mermaid: ${error}`);
    }
  }
  for (const match of text.matchAll(/\]\(([^)]+)\)/g)) {
    const link = match[1];
    if (/^(https?:|mailto:|#)/.test(link)) continue;
    const target = resolve(dirname(path), link.split("#")[0]);
    if (!(await Bun.file(target).exists()))
      errors.push(`${path}: broken link ${link}`);
  }
}
for (const [path, count] of directories) {
  if (count > budgets.default_files)
    errors.push(`${path}: ${count} files > budget ${budgets.default_files}`);
}
if (total > budgets.total_lines)
  errors.push(`Total: ${total} lines > budget ${budgets.total_lines}`);
if (errors.length) throw new Error(errors.join("\n"));
console.log(
  `Validated docs, Mermaid, file/directory budgets: ${total}/${budgets.total_lines} lines.`,
);
