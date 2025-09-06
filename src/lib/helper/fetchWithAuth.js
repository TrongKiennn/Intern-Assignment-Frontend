
import { store } from "../../store/store";
import { refreshAccessToken, logout } from "../../store/authSlice";

export async function fetchWithAuth(url, options = {}) {
  let accessToken = store.getState().auth.accessToken;

  const headers = {
    ...options.headers,
    Authorization: `Bearer ${accessToken}`,
  };
  let response = await fetch(url, { ...options, headers });

  if (response.status === 401) {
    try {
      const refreshResult = await store.dispatch(refreshAccessToken());
      accessToken = refreshResult.payload.accessToken;
      const retryHeaders = {
        ...options.headers,
        Authorization: `Bearer ${accessToken}`,
      };
      response = await fetch(url, { ...options, headers: retryHeaders });
    } catch {
      store.dispatch(logout());
      throw new Error("Session expired. Please login again.");
    }
  }

  return response;
}
