export const INSTAGRES_HOST = 'https://neon.new';

export const INSTAGRES_URLS = {
  GET_DATABASE_DATA: (dbId: string) => `${INSTAGRES_HOST}/api/v1/database/${dbId}`,
  CREATE_DATABASE_POST: (dbId: string, referrer?: string) =>
    `${INSTAGRES_HOST}/api/v1/database/${dbId}${
      referrer ? `?referrer=${encodeURIComponent(referrer)}` : ''
    }`,
  CLAIM_DATABASE: (dbId: string) => `${INSTAGRES_HOST}/database/${dbId}`,
};