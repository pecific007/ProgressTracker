import { useState, useEffect } from 'react';

const ValidRoutes = ["", "add", "entry", "edit", "delete"];


export function validateRoute(hash: string): boolean {
  for (const route of ValidRoutes) {
    if (hash == route || hash == "") {
      return true;
    }
  }
  return false;
}

export function getRoute() {
  const [hash, setHash] = useState(window.location.hash)
  useEffect(() => {
    const onHashChange = () => setHash(window.location.hash)
    window.addEventListener('hashchange', onHashChange)
    return () => window.removeEventListener('hashchange', onHashChange)
  }, [])
  const [pathPart, queryPart] = hash.replace(/^#\//, '').split("?");
  const segments = pathPart.split("/")
  const params = new URLSearchParams(queryPart ?? '');

  return { segments, params };
}
