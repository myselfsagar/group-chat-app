const User = require("./User");
const Message = require("./Message");
const Group = require("./Group");
const UserGroup = require("./UserGroup");

//message - user - one to many
User.hasMany(Message, { as: "SentMessages", foreignKey: "userId" });
User.hasMany(Message, { as: "ReceivedMessages", foreignKey: "receiverId" });
Message.belongsTo(User, { as: "Sender", foreignKey: "userId" });
Message.belongsTo(User, { as: "Receiver", foreignKey: "receiverId" });

//message - group - one to many
Group.hasMany(Message);
Message.belongsTo(Group, { constraints: true, onDelete: "CASCADE" });

//Group - user - one to one
Group.belongsTo(User, { foreignKey: "createdBy" });
User.hasMany(Group, { foreignKey: "createdBy" });

//user - group - many to many
User.belongsToMany(Group, { through: UserGroup });
Group.belongsToMany(User, { through: UserGroup });

//Group - UserGroup
UserGroup.belongsTo(Group);
Group.hasMany(UserGroup);

//user - UserGroup
UserGroup.belongsTo(User);
User.hasMany(UserGroup);
