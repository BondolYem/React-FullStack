const { validate_token } = require("../config/service");
const {
  getList,
  getOne,
  create,
  update,
  remove,
  login,
  refresh_token,
  user_validate,
  userConfig,
} = require("../controller/users.controller");
const users = (app) => {
  app.get("/api/user", getList);
  app.post("/api/user/login", login);
  app.get("/api/user/:id", getOne);
  app.post("/api/user", create);
  app.put("/api/user", update);
  app.delete("/api/user/:id", remove);
  app.post("/api/user/refresh_token", refresh_token);
  app.post("/api/user/getConfig", userConfig);
};
module.exports = {
  users,
};
