function getApiUrl(): string {
  const raw = process.env.EXPO_PUBLIC_API_URL;
  return (raw ?? "https://caregiver-7y0y.onrender.com").replace(/\/$/, "");
}

export const env = {
  apiUrl: getApiUrl(),
};
