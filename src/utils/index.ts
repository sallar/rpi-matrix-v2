/**
 * A small helper to pause execution for t milliseconds
 */
export const wait = (t: number) => new Promise(ok => setTimeout(ok, t));
