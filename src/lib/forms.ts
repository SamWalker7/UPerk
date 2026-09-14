export const INTAKE_ENDPOINT = "https://nbttrereyf.execute-api.us-east-1.amazonaws.com/prod/api/form/submit-form";

export const SOCIAL_PLATFORMS = ["LinkedIn", "Instagram", "Facebook", "X", "GitHub"] as const;
export type SocialProfile = { platform: string; handle: string };

export function isWebUrl(value: string) {
  try {
    const url = new URL(value);
    return ["https:", "http:"].includes(url.protocol) && Boolean(url.hostname);
  } catch {
    return false;
  }
}

export function socialProfilesError(profiles: SocialProfile[]) {
  const filled = profiles.filter(profile => profile.handle.trim());
  if (filled.some(profile => !SOCIAL_PLATFORMS.some(platform => platform === profile.platform))) return "Choose a platform for each social profile.";
  if (filled.some(profile => profile.handle.length > 200)) return "Keep each social handle under 200 characters.";
  if (new Set(filled.map(profile => profile.platform)).size !== filled.length) return "Use each social platform once.";
  return "";
}

export function cleanSocialProfiles(profiles: SocialProfile[]) {
  return profiles.filter(profile => profile.platform && profile.handle.trim()).map(profile => ({ platform: profile.platform, handle: profile.handle.trim() }));
}
