import { VFSDirectory, VFSNode, isDirectory } from "@/types";

export function resolvePath(currentPath: string, target: string): string {
  if (target.startsWith("/")) {
    return normalizePath(target);
  }

  const parts = currentPath.split("/").filter(Boolean);

  for (const segment of target.split("/")) {
    if (segment === "..") {
      parts.pop();
    } else if (segment !== "." && segment !== "") {
      parts.push(segment);
    }
  }

  return "/" + parts.join("/");
}

export function normalizePath(path: string): string {
  const parts = path.split("/").filter(Boolean);
  const resolved: string[] = [];

  for (const part of parts) {
    if (part === "..") {
      resolved.pop();
    } else if (part !== ".") {
      resolved.push(part);
    }
  }

  return "/" + resolved.join("/");
}

export function getNodeAtPath(
  root: VFSDirectory,
  path: string
): VFSNode | null {
  if (path === "/") return root;

  const parts = path.split("/").filter(Boolean);
  let current: VFSNode = root;

  for (const part of parts) {
    if (!isDirectory(current)) return null;
    const child: VFSNode | undefined = current.children[part];
    if (!child) return null;
    current = child;
  }

  return current;
}

export function getParentAndName(
  root: VFSDirectory,
  path: string
): { parent: VFSDirectory; name: string } | null {
  const parts = path.split("/").filter(Boolean);
  if (parts.length === 0) return null;

  const name = parts.pop()!;
  const parentPath = "/" + parts.join("/");
  const parent = getNodeAtPath(root, parentPath);

  if (!parent || !isDirectory(parent)) return null;

  return { parent, name };
}
