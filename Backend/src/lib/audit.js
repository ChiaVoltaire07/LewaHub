/**
 * Lightweight structured audit logging.
 *
 * Phase 2 requirement: at minimum track successful/failed admin login,
 * school creation, school update, school deletion and admin logout.
 * There is no dedicated audit table yet — structured server logs are used.
 */
export function logAudit(event, meta = {}) {
  const entry = {
    ts: new Date().toISOString(),
    event,
    ...meta,
  };
  console.log(`[audit] ${JSON.stringify(entry)}`);
}
