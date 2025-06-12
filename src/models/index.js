const User = require("./User");
const Message = require("./Message");

//user - message - one to many
User.hasMany(Message);
Message.belongsTo(User, { constraints: true, onDelete: "CASCADE" });
