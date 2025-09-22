export function parseMemory(str:string) {
    if (!str) return 0;
    const num = parseInt(str, 10);
    if (str.endsWith("Mi")) return num * 1024 * 1024;
    if (str.endsWith("Gi")) return num * 1024 * 1024 * 1024;
    return num;
  }