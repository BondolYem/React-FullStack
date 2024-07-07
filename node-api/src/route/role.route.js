const { getList, getOne, create, update, remove } = require("../controller/role.controller");
const role = (app) => {
  app.get("/api/role", getList);
  app.get("/api/role/:id", getOne);
  app.post("/api/role", create);
  app.put("/api/role", update);
  app.delete("/api/role/:id", remove);
};

module.exports = {
  role,
};
