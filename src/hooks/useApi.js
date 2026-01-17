import { useRef, useState, useCallback } from "react";

export default function useApi() {
  const controllerRef = useRef(null);
  const inFlightRef = useRef(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const request = useCallback(async ({
    url,
    method = "GET",
    body = null,
    headers = {},
    credentials = "include", 
    retry = 0,
  }) => {
    if (inFlightRef.current) return null;

    inFlightRef.current = true;
    setLoading(true);
    setError(null);

    if (controllerRef.current) {
      controllerRef.current.abort();
    }

    const controller = new AbortController();
    controllerRef.current = controller;

    try {
      const response = await fetch(url, {
        method,
        body,
        headers,
        credentials,
        signal: controller.signal,
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const data = await response.json();
      return data;

    } catch (err) {
      if (err.name === "AbortError") {
        return null;
      }

      if (retry > 0) {
        await new Promise(r => setTimeout(r, 300));
        return request({ url, method, body, headers, credentials, retry: retry - 1 });
      }

      setError(err);
      throw err;

    } finally {
      inFlightRef.current = false;
      setLoading(false);
    }
  }, []);

  return { request, loading, error };
}
