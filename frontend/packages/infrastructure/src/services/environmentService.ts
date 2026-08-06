let _apiBaseUrl = '';

export const environmentService = {
  configure(config: { apiBaseUrl: string }) {
    if (!config.apiBaseUrl) {
      throw new Error('VITE_API_BASE_URL is not configured. Set it in your .env file.');
    }
    _apiBaseUrl = config.apiBaseUrl;
  },
  get apiBaseUrl() {
    return _apiBaseUrl;
  },
};
