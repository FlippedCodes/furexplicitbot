// TODO: Eventually also offer a App>link inside of discord to look for the source

const { MessageEmbed } = require('discord.js');

const axios = require('axios');

const uptimeConfig = config.commands.status;

const api = axios.create({ baseURL: uptimeConfig.api.endpoint });

function setOverallStatus(params) {
  const { isUpOverall, embed } = params;
  // checkes if all services are true
  if (isUpOverall.every((isUp) => isUp)) {
    embed.setTitle('All Systems Operational');
    embed.setColor('GREEN');
  } else {
    embed.setTitle('Partially Degraded');
    embed.setColor('ORANGE');
  }
}

module.exports.run = async (interaction) => {
  if (!DEBUG) await interaction.deferReply({ ephemeral: false });
  // get services from uptime kuma api
  const servicesRaw = await api.get(uptimeConfig.api.apiCall.services);
  const services = servicesRaw.data.publicGroupList.find((group) => group.name === uptimeConfig.api.groupName).monitorList;
  const uptimeRaw = await api.get(uptimeConfig.api.apiCall.uptime);
  const uptime = uptimeRaw.data;
  // parse data
  const isUpOverall = [];
  const uptimeInfo = services.map((service) => {
    const id = service.id;
    const uptimePercentage = uptime.uptimeList[`${id}_24`] * 100;
    const isUp = uptime.heartbeatList[id].at(-1).status === 1;
    isUpOverall.push(isUp);
    return { name: service.name, uptimePercentage, isUp };
  });
  const embed = new MessageEmbed();
  embed.setAuthor({ name: 'Flipped Codes - Status Page [Link]', iconURL: uptimeConfig.embed.icon, url: uptimeConfig.embed.url });
  embed.setFooter({ text: 'Updated every minute' });
  setOverallStatus({ isUpOverall, embed });
  // add all services to embed
  uptimeInfo.forEach((service) => embed.addField(service.name, `${service.isUp ? '🟢' : '🔴'} ${service.uptimePercentage.toFixed(2)}%`, true));
  reply(interaction, { embeds: [embed] });
};

module.exports.data = new CmdBuilder()
  .setName('status')
  .setDescription('Showos the statwus for a...all services uwsed by the app.');
