const cron = require("node-cron");
const Message = require("../models/Message");
const ArchivedMessage = require("../models/ArchivedMessage");
const { Op } = require("sequelize");

cron.schedule("0 2 * * *", async () => {
  try {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - 1);

    const oldMessages = await Message.findAll({
      where: { createdAt: { [Op.lt]: cutoffDate } },
    });

    if (oldMessages.length === 0) return;

    const archived = oldMessages.map((msg) => msg.toJSON());

    await ArchivedMessage.bulkCreate(archived);
    await Message.destroy({ where: { createdAt: { [Op.lt]: cutoffDate } } });

    console.log(
      `Archived ${archived.length} messages from ${cutoffDate.toDateString()}`
    );
  } catch (error) {
    console.error("Archiving failed:", error.message);
  }
});
