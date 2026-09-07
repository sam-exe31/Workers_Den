/**
 * Utility helper to manage permanently hidden / deleted cancelled request IDs
 * so they never reappear on page reloads even if the backend retains the historical SQL row.
 */

export function getDeletedRequestIds() {
  try {
    const raw = localStorage.getItem('deleted_request_ids');
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function markRequestAsDeleted(requestId) {
  if (!requestId) return;
  const current = getDeletedRequestIds();
  const numId = Number(requestId);
  if (!current.includes(numId)) {
    const updated = [...current, numId];
    localStorage.setItem('deleted_request_ids', JSON.stringify(updated));
  }
}

export function filterOutDeletedRequests(jobsList) {
  if (!Array.isArray(jobsList)) return [];
  const deletedIds = getDeletedRequestIds();
  return jobsList.filter(j => !deletedIds.includes(Number(j.requestId || j.id)));
}
