import PQueue from 'p-queue';

import Sequelize from 'sequelize';

import intPostcache from './database/models/postcache.js';

import intPostjob from './database/models/postjob.js';

const mainQ = new PQueue({ concurrency: 1 });

import config from './config.json';

import packageData from './package.json';

config.package = packageData;

const DEBUG = process.env.NODE_ENV === 'development';

const ERR = (err) => {
  console.error(`[${currentShardID}] ERROR:`, err);
  return;
}

// connect DB
const sequelize = await new Sequelize(
  process.env.db_name,
  process.env.db_user,
  process.env.db_passw,
  {
    host: process.env.db_host,
    dialect: process.env.db_dialect,
    logging: DEBUG ? console.log() : DEBUG,
  },
);
// init db models
const postcache = intPostcache(sequelize);
const postjob = intPostjob(sequelize);
// sync DB
await sequelize.sync();

function uptimeHeartbeat() {
  setInterval(() => fetch(`${config.uptimeEndpoint}${process.env.token_uptime_worker_e621}?status=up&msg=OK`),
  config.uptimeInterval * 1000);
}

async function requestPictures(tags) {
  const url = new URL(config.endpoint);
  url.search =  new URLSearchParams({
    tags: `${tags} order:random`,
    limit: config.commands.autopost.maxCache,
    login: process.env.login_e621_user,
    api_key: process.env.token_e621,
  }).toString();
  const responseRaw = await fetch(
    url,
    {
      method: "GET",
      headers: { 'User-Agent': `${config.package.name}/${config.package.version} by Flipper on e621` },
    },
  );
  const postDataBody = await postDataRaw.json();
  return postDataBody.posts;
}

async function storePictures(channelID, pool) {
  const poolCurated = pool
    .filter((post) => !(post.tags.artist.length === 0 || post.file.url === null || post.id === null))
    .map((post) => ({
      channelID,
      postID: post.id,
      artist: post.tags.artist[0],
      directLink: post.file.url,
    }));
  await postcache.destroy({ where: { channelID } }).catch(ERR);
  await postcache.bulkCreate(poolCurated).catch(ERR);
  await postjob.destroy({ where: { channelID } }).catch(ERR);
}

// ============= MAIN =============

// startup uptime monitoring
uptimeHeartbeat();

// main queue
setInterval(async () => {
  await mainQ.add(async () => {
    // get oldest jobs
    const jobs = await postcache.findAll({ limit: 2, order: [ 'createdAt', 'DESC' ] }).catch(ERR);
    console.log(jobs);
    jobs.forEach(async (job) => {
      const results = await requestPictures(job.tags);
      await storePictures(job.channelID, results);
    });
  });
}, config.intervalChecker);

// logging error; suppress crash
process.on('uncaughtException', (err) => {
  console.error('ERROR:', err);
});
