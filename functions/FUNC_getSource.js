const config = require('../config/main.json');

function buildRequest(uri, url) {
  const version = require('../package.json');
  return {
    method: 'POST',
    uri,
    headers: { 'User-Agent': `FurExplicitBot/${version.version} by Phil | Flipper#3621 on Discord` },
    formData: { url },
    json: true,
  };
}

async function getSource(searchURL) {
  const rp = require('request-promise');
  const awnser = await rp(await buildRequest(config.imageFinder.uri, searchURL));
  if (awnser.error) return null;
  return awnser.results[0];
}

module.exports.run = async (searchURL) => {
  const result = await getSource(searchURL);
  if (!result) return null;
  const imageFinderCnfg = config.imageFinder;
  const similarity = result.similarity;
  if (similarity < imageFinderCnfg.minSimilarity) return null;
  const post = result.sources[0];
  const website = imageFinderCnfg.websiteCodes[post.websiteid];
  return {
    title: post.title,
    artist: post.artist,
    source: post.source,
    website,
    similarity,
    sha1: post.sha1,
  };
};

module.exports.help = {
  name: 'FUNC_getSource',
};
