const rp = require('request-promise');

// TODO: check error code, try login, if failed again, give error. Give error if code is other then invalid session
// function checkResult(result) {
//   if (result.error_code) {}
// }

function httpRequest(apiFunction, args) {
  let uri = `https://inkbunny.net/api_${apiFunction}.php?output_mode=json&${args}`;
  let request = {
    method: 'GET',
    uri,
    headers: { 'User-Agent': 'DiscordBot - FurExplicitBot' },
  };
  // return checkResult(rp(request));
  return rp(request);
}

function loginAssembly(params) {
  let apiFunction = 'login';
  let args = 'username=guest&password=';
  return httpRequest(apiFunction, args).sid;
}

function userRatingAssembly(sid) {
  let apiFunction = 'userrating';
  let args = `sid=${sid}&tag[2]=yes&tag[3]=yes&tag[4]=yes&tag[5]=yes`;
  httpRequest(apiFunction, args);
}

async function newSession() {
  let sid = await loginAssembly();
  await userRatingAssembly(sid);
  return sid;
}

function seachAssembly(sid, seachQuery) {
  let apiFunction = 'search';
  let args = `sid=${sid}&&text=${seachQuery}&random=yes&type=1,2,3,4,5,8,9`;
  httpRequest(apiFunction, args);
}

module.exports.run = async (client, message, args, config, RichEmbed, messageOwner) => {

};

module.exports.help = {
  name: 'inkbunny_core',
};
