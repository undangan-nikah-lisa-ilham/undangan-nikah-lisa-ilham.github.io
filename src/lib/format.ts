export function formatRelative(input: string | number): string {
  const then = typeof input === "number" ? input : new Date(input).getTime();
  if (!Number.isFinite(then)) return "";

  const diff = Date.now() - then;
  if (diff < 0) return "baru saja";

  const min = Math.floor(diff / 60000);
  if (min < 1) return "baru saja";
  if (min < 60) return `${min} menit lalu`;

  const hour = Math.floor(min / 60);
  if (hour < 24) return `${hour} jam lalu`;

  const day = Math.floor(hour / 24);
  if (day < 30) return `${day} hari lalu`;

  return new Date(then).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      return true;
    }
  } catch {}

  try {
    const area = document.createElement("textarea");
    area.value = text;
    area.style.position = "fixed";
    area.style.opacity = "0";
    document.body.appendChild(area);
    area.select();
    const ok = document.execCommand("copy");
    document.body.removeChild(area);
    return ok;
  } catch {
    return false;
  }
}