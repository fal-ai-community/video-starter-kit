export async function register() {
  // Before any outbound HTTPS. A failure here must not stop the server.
  if (process.env.NEXT_RUNTIME === "nodejs") {
    await import("./lib/distrusted-roots")
      .then(({ dropDistrustedRoots }) => dropDistrustedRoots())
      .catch((error) => console.error("distrusted root filter failed", error));
  }
}
