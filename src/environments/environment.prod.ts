const LOCAL_PORT = '3000'
const LOCAL_HOST = `http://localhost:${LOCAL_PORT}/`;
const HEROKU_UAT = 'https://maharaja-ams.herokuapp.com/';

export const environment = {
  production: true,
  host: HEROKU_UAT
};
