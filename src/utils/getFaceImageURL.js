
export const getFaceImageURL = (path) => {
  if (!path) return null;

  // Jika sudah URL lengkap, return langsung
  if (path.startsWith("http")) return path;
  let clean = String(path).trim().replace(/\\/g, "/");
  // Normalize path: hapus leading slash
  clean = clean.replace(/^\/+/, "");

  // Dapatkan base URL dari axios (support dev & prod)
  const baseURL = "http://localhost:8000";
  const base = baseURL.replace(/\/+$/, "");

  return `${base}/${clean}`;
};
