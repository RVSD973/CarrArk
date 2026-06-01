export function generateShareLink({
  baseUrl = 'https://carrark.rvsd.fr/',
  title,
  size,
  distance,
  omDistances = {}
}) {
  const params = new URLSearchParams();
  if (title) params.set('title', title);
  if (size) params.set('size', String(size));
  if (distance) params.set('distance', String(distance));

  ['om1', 'om2', 'om3', 'om4', 'om5', 'om6'].forEach((key) => {
    const value = Number(omDistances[key]);
    if (Number.isFinite(value) && value > 0) {
      params.set(key, String(value));
    }
  });

  return `${baseUrl}?${params.toString()}`;
}
