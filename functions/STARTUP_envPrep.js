const credetialFile = './config/config.json';

module.exports.run = async (client, fs, config) => {
  // setting inDev var
  console.log(`[${module.exports.help.name}] Setting environment variables...`);
  if (fs.existsSync(credetialFile)) {
    const credetials = require('../config/config.json');
    config.env.set('inDev', true);
    config.env.set('token', credetials.token);
    config.env.set('fa_cookie_a', credetials.fa_cookie_a);
    config.env.set('fa_cookie_b', credetials.fa_cookie_b);
    config.env.set('e621_login', credetials.e621.login);
    config.env.set('e621_api_key', credetials.e621.api_key);
    config.env.set('token_discordbotlist', credetials.authToken.discordbotlist);
  } else {
    config.env.set('inDev', false);
    config.env.set('token', process.env.BotToken);
    config.env.set('fa_cookie_a', process.env.FA_COOKIE_A);
    config.env.set('fa_cookie_b', process.env.FA_COOKIE_B);
    config.env.set('e621_login', process.env.e621_login);
    config.env.set('e621_api_key', process.env.e621_api_key);
    config.env.set('token_discordbotlist', process.env.token_discordbotlist);
  }
  console.log(`[${module.exports.help.name}] Environment variables set!`);
};

module.exports.help = {
  name: 'STARTUP_envPrep',
};
