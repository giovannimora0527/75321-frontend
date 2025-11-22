import packageInfo from '../../package.json';

export const environment = {
  appVersion: packageInfo.version,
  production: false,
  apiUrl: '/clinica/v1'  // URL relativa, NGINX hará el proxy
};
