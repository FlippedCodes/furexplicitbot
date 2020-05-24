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
  } else {
    config.env.set('inDev', false);
    config.env.set('token', process.env.BotToken);
    config.env.set('fa_cookie_a', process.env.FA_COOKIE_A);
    config.env.set('fa_cookie_b', process.env.FA_COOKIE_B);
  }
  console.log(`[${module.exports.help.name}] Environment variables set!`);
};

module.exports.help = {
  name: 'STARTUP_envPrep',
};
