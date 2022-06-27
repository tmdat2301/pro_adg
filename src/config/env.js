import { STAGING_BASE_URL, DEV_BASE_URL, GOONG_MAP_KEY, ADG_SOCKET_DOMAIN, WS_ENDPONIT } from '@env';

const devEnvironmentVariables = {
  BACKEND_URL: DEV_BASE_URL,
  GOONG_MAP_KEY: GOONG_MAP_KEY,
  ADG_SOCKET_DOMAIN: ADG_SOCKET_DOMAIN,
  WS_ENDPONIT: WS_ENDPONIT,
};

const stagEnvironmentVariables = {
  BACKEND_URL: STAGING_BASE_URL,
  GOONG_MAP_KEY: GOONG_MAP_KEY,
  ADG_SOCKET_DOMAIN: ADG_SOCKET_DOMAIN,
  WS_ENDPONIT: WS_ENDPONIT,
};

export default __DEV__ ? devEnvironmentVariables : stagEnvironmentVariables;
