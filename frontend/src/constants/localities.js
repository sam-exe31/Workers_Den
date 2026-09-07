// Pune service localities — SHARED controlled vocabulary.
//
// CRITICAL: the backend matches jobs to workers by EXACT, case-sensitive string
// equality on `locality` (Service_Request_Repository). If a customer posts in
// "Karve Nagar" and a worker's profile says "Kothrud" (or "karve nagar"), the
// worker sees zero jobs. Every locality dropdown in the app MUST source from
// this one list so the strings line up.

export const LOCALITIES = [
  'Kothrud',
  'Karve Nagar',
  'Warje',
  'Baner',
  'Wakad',
  'Hinjawadi',
  'Aundh',
  'Viman Nagar',
  'Kharadi',
  'Hadapsar',
  'Koregaon Park',
  'Shivaji Nagar',
];

export default LOCALITIES;
