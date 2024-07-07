const {
  getList,
  getOne,
  create,
  update,
  remove,
} = require("../controller/category.controller");
const { upload } = require("../config/service");
const category = (app) => {
  app.get("/api/category", getList);
  app.get("/api/category/:id", getOne);
  app.post("/api/category", upload.single("ImageUpload"), create);
  app.put("/api/category", upload.single("ImageUpload"), update);
  app.delete("/api/category/:id", remove);
};
module.exports = {
  category,
};
