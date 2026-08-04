let _apiBaseUrl = 'http://localhost:3000';

export const environmentService = {
  configure(config: { apiBaseUrl: string }) {
    _apiBaseUrl = config.apiBaseUrl;
  },
  get apiBaseUrl() {
    return _apiBaseUrl;
  },
};
