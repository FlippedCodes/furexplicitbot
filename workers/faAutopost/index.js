import { Login, Submissions, removeFromInbox, unwatchAuthor } from 'furaffinity-api';

import PQueue from 'p-queue';

import Sequelize from 'sequelize';

import { main as intAutopostfasubmission } from './database/models/autopostfasubmission.js';

import { main as intPostfacache } from './database/models/postfacache.js';

const mainQ = new PQueue({ concurrency: 1 });

import config from './config.json' assert { type: 'json' };

const DEBUG = process.env.NODE_ENV === 'development';

let del = [];

// removes submissions from FA inbox, if they have been imported
async function cleanupDonePosts() {
  setInterval(async () => {
    if (del.length === 0) return;
    await removeFromInbox(del);
    if (DEBUG) console.log('Cleaned submissions');
    del = [];
  }, config.intervalChecker / 2);
}

// creates jobs for the bot to post in the corresponding channels
function createJobs(posts) {
  posts.forEach(async (post) => {
    const artistID = post.author.id;
    const todoChannels = await autopostfasubmission.findAll({ where: { artistID } });
    if (autopostfasubmission.length === 0) unwatchAuthor(artistID);
    const bulkData = todoChannels.map((channel) => {
      return {
        channelID: channel.channelID,
        submissionID: post.id
      }
    });
    if (bulkData.length) await postfacache.bulkCreate(bulkData);
    del.push(post.id);
  });
}

// ============= MAIN =============

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
const autopostfasubmission = intAutopostfasubmission(sequelize);
const postfacache = intPostfacache(sequelize);
// sync DB
await sequelize.sync();
// login FA
await Login(process.env.login_fa_cookie_a, process.env.login_fa_cookie_b);
// startup cleaner interval
cleanupDonePosts();

// main queue
setInterval(async () => {
  await mainQ.add(async () => {
    // get latest posts
    const posts = await Submissions({ sort: 'old' });
    if (posts.length === 0) return;
    await createJobs(posts);
  });
}, config.intervalChecker);
// }, 10000);

// logging error; supress crash
process.on('uncaughtException', (err) => {
  console.error('ERROR:', err);
});
