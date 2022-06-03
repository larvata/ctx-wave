const WAVE_EVENTS = {
  REFRESH: 'REFRESH',
  GET_PROFILE: 'GET_PROFILE',
};

const URL_BASE = 'https://langchao.org';
const API_BASE = 'https://api.langchao.org';

const PAGE_URL = {
  HOME: URL_BASE,
  LOGIN: `${URL_BASE}/login`,
  ABOUT: `${URL_BASE}/about`,
  GITHUB: 'https://github.com/surgefm',
  TWITTER: 'ttps://twitter.com/langchao_org',
  WEIBO: 'https://www.weibo.com/v2land',
  TELEGRAM: 'https://t.me/+o5T_HxHHgYdjMTJl',
};

const API_URL = {
  CLIENT: `${API_BASE}/client`,
  CLIENT_ME: `${API_BASE}/client/me`,
  EVENT: `${API_BASE}/event`,
};

export {
  WAVE_EVENTS,
  PAGE_URL,
  API_URL,
};
