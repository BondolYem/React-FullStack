const {
    getList,
    create,
    update,
    remove,
} = require("../controller/student.controller")
const student = (app) => {
    app.get("/api/student",getList);
    app.post("/api/student",create);
    app.put("/api/student",update);
    app.delete("/api/student/:id",remove);
}
module.exports = {
    student
}