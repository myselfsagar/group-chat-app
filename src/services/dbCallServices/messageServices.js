const Message = require("../../models/Message");
const User = require("../../models/User");
const { Op } = require("sequelize");

exports.sendMessage = async (
  message,
  userId,
  receiverId = null,
  groupId = null
) => {
  try {
    const newMessage = await Message.create({
      message,
      userId,
      receiverId,
      groupId,
    });
    return newMessage;
  } catch (error) {
    throw error;
  }
};

exports.getMessages = async (
  lastMessageId = 0,
  userId,
  receiverId = null,
  groupId = null
) => {
  try {
    let whereCondition = { id: { [Op.gt]: lastMessageId } };

    if (groupId) {
      whereCondition.groupId = groupId;
    } else if (receiverId) {
      whereCondition = {
        id: { [Op.gt]: lastMessageId },
        groupId: null,
        [Op.or]: [
          { userId, receiverId },
          { userId: receiverId, receiverId: userId },
        ],
      };
    } else {
      whereCondition = {
        id: { [Op.gt]: lastMessageId },
        groupId: null,
        receiverId: null,
        userId,
      };
    }

    const messages = await Message.findAll({
      where: whereCondition,
      include: [
        {
          model: User,
          as: "Sender",
          attributes: ["id", "name"],
        },
      ],
      order: [["createdAt", "ASC"]],
      limit: 20,
    });
    return messages;
  } catch (error) {
    throw error;
  }
};

exports.getOlderMessages = async (
  oldMessageId = 0,
  userId,
  receiverId = null,
  groupId = null
) => {
  try {
    let whereCondition = { id: { [Op.lt]: oldMessageId } };

    if (groupId) {
      whereCondition.groupId = groupId;
    } else if (receiverId) {
      whereCondition = {
        id: { [Op.lt]: oldMessageId },
        groupId: null,
        [Op.or]: [
          { userId, receiverId },
          { userId: receiverId, receiverId: userId },
        ],
      };
    } else {
      whereCondition = {
        id: { [Op.lt]: oldMessageId },
        groupId: null,
        receiverId: null,
        userId,
      };
    }

    const oldMessages = await Message.findAll({
      where: whereCondition,
      include: [
        {
          model: User,
          as: "Sender",
          attributes: ["id", "name"],
        },
      ],

      order: [["createdAt", "DESC"]],
      limit: 10,
    });
    return oldMessages;
  } catch (error) {
    throw error;
  }
};
