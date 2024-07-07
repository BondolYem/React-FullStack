const { validate_token } = require("../config/service");
const {
  getList,
  create,
  update,
  remove,
  getOne,
} = require("../controller/teacher.controller");
// register route of teacher
const teacher = (app) => {
  // function name "teacher" //arrow function
  app.get("/api/teacher", getList);
  app.get("/api/teacher/:id", getOne);
  app.post("/api/teacher", create);
  app.put("/api/teacher", update);
  app.delete("/api/teacher/:id", remove);
};

module.exports = {
  teacher,
};
