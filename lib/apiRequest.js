/*
  Thin wrapper around fetch for our own API routes. Centralizes two
  repeated concerns:
    1. Always sending JSON with the right Content-Type header.
    2. Parsing the { success, data, error } envelope our routes all
       return (see app/api/.../route.js files) and throwing a real Error
       with the server's message when success is false — this lets
       calling code use a plain try/catch instead of manually checking
       response.ok and result.success every single time.
*/
export async function apiRequest(url, options = {}) {
  const response = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
  });

  const result = await response.json();

  if (!response.ok || !result.success) {
    throw new Error(result.error || "Something went wrong");
  }

  return result.data;
}
