export const SESSION_KEY = "authenticated";
export const SESSION_ERROR_KEY = "error";
export const SESSION_MAX_AGE = 60 * 60 * 24 * 7; // 7 days;
export const REFRESH_THRESHOLD = 60 * 10; // 10 minutes left before token expires

export const DEFAULT_GEO = {
  city: "Charlotte",
  region: "NC",
  country: "US",
  latitude: 35.201134,
  longitude: -80.9787741,
};

export const DO_TOKEN_KEY = "__do_token_key";
export const DO_ACTIVE_PROJECT = "__do_active_project";
export const DO_BASE_URL = "https://api.digitalocean.com/v2";
