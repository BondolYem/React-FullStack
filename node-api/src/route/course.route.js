const {
  getList,
  create,
  update,
  remove,
} = require("../controller/course.controller");
const { upload } = require("../config/service");
const course = (app) => {
  app.get("/api/course", getList);
  app.post("/api/course", upload.single("ImageUpload"), create);
  app.put("/api/course", upload.single("ImageUpload"), update);
  app.delete("/api/course/:id", remove);
};
module.exports = {
  course,
};
