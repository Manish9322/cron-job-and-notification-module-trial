export function getCronRegistry() {
  if (!global.__cronRegistry) {
    global.__cronRegistry = new Map();
  }

  return global.__cronRegistry;
}
