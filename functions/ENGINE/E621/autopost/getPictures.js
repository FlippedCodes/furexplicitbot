const axios = require('axios');

const postcache = require('../../../../database/models/postcache');

const postjob = require('../../../../database/models/postjob');

async function getTags(tagsRaw, serverID, nsfw) {
  const tags = tagsRaw.replaceAll(', ', ' ');
  const interaction = { guild: { id: serverID } };
  const safeTags = await client.functions.get('ENGINE_tagsCleanup').run(interaction, tags);
  return `${safeTags} ${nsfw ? '' : 'rating:s'}`;
}

async function getPicture(channelID) {
  const result = await postcache.findOne({ where: { channelID } }).catch(ERR);
  if (!result) return null;
  await postcache.destroy({ where: { ID: result.ID } }).catch(ERR);
  return result;
}

module.exports.run = async (tags, serverID, channelID, nsfw) => {
  const post = await getPicture(channelID);
  if (post) return post;

  const cleanTags = await getTags(tags, serverID, nsfw);
  // create job to get new stack of pictures
  await postjob.findOrCreate({ where: { channelID }, defaults: { tags: cleanTags } }).catch(ERR);
  return null;
  // // store requested pics
  // const results = await requestPictures(cleanTags, nsfw);
  // await storePictures(channelID, results);
  // // get first pic
  // post = await getPicture(channelID);
  // return post;
};

module.exports.help = {
  name: 'getPictures',
};
