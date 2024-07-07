const { Config } = require("../config/config");
const db = require("../config/db");
const { logError, isEmptyOrNull } = require("../config/service");

const getList = async (req, res) => {
  //api/student?key1=value1&key2=value2@keyn=valuen
  const { page, txtSearch, status, fromDate, toDate } = req.query;
  try {
    var sqlTotal = "SELECT COUNT(Id) AS totalRecords FROM student  WHERE 1=1 ";
    var sql = "SELECT * FROM student WHERE 1=1";
    var sqlWhere = "",
      sqlParm = {};
    if (!isEmptyOrNull(txtSearch)) {
      sqlWhere +=
        " AND (FirstName LIKE :txtSearch OR LastName LIKE :txtSearch OR Tel LIKE :txtSearch)";
      sqlParm.txtSearch = "%" + txtSearch + "%";
    }
    if (!isEmptyOrNull(fromDate) && !isEmptyOrNull(toDate)) {
      sqlWhere += " AND CreateAt BETWEEN :fromDate AND :toDate";
      sqlParm.fromDate = fromDate;
      sqlParm.toDate = toDate;
    }
    if (!isEmptyOrNull(status)) {
      sqlWhere += " AND IsActive = :status ";
      sqlParm.status = status;
    }
    const sqlOrder = " ORDER BY Id DESC";
    const pageSize = 5;
    const offest = (page - 1) * pageSize;
    const limit = ` LIMIT  ${offest}, ${pageSize}`;
    const [data] = await db.query(sql + sqlWhere + sqlOrder + limit, sqlParm);
    var totalRecords = 0;
    if (page == 1) {
      const [total] = await db.query(sqlTotal + sqlWhere, sqlParm);
      totalRecords = total[0].totalRecords;
    }
    res.json({
      list: data,
      totalRecords: totalRecords,
    });
  } catch (error) {
    logError("student.getList", error, res);
  }
};

const create = async (req, res) => {
  try {
    var {
      FirstName,
      LastName,
      Gender,
      Tel,
      Dob,
      Email,
      Current_Address,
      Note,
      IsActive,
    } = req.body;
    var error = {};

    if (isEmptyOrNull(FirstName)) {
      error.FirstName = "Firstname required!";
    }
    if (isEmptyOrNull(LastName)) {
      error.LastName = "Lastname required!";
    }
    if (Object.keys(error).length > 0) {
      res.json({
        error: error,
      });
      return false;
    }

    console.log("Error:", error);

    var parameter = {
      FirstName: FirstName,
      LastName: LastName,
      Gender: Gender,
      Dob: Dob,
      Tel: Tel,
      Email: Email,
      Current_Address: Current_Address,
      Note: Note,
      IsActive: IsActive,
    };

    console.log("Students:", parameter);

    const [students] = await db.query(
      "INSERT INTO Student (FirstName,LastName,Gender,Tel, Dob, Email,Current_Address,Note,IsActive) VALUES (:FirstName,:LastName,:Gender, :Tel, :Dob, :Email, :Current_Address, :Note , :IsActive)",
      parameter
    );

    res.json({
      message: "Created Successfully!",
      list: students,
    });
  } catch (error) {
    logError("Student.create", error, res);
  }
};
const update = async (req, res) => {
  try {
    var {
      Id,
      FirstName,
      LastName,
      Gender,
      Tel,
      Dob,
      Email,
      Current_Address,
      Note,
      IsActive,
    } = req.body;
    var error = {};

    if (isEmptyOrNull(Id)) {
      error.Id = "Id required!";
    }
    if (isEmptyOrNull(FirstName)) {
      error.FirstName = "Firstname required!";
    }
    if (isEmptyOrNull(LastName)) {
      error.LastName = "Lastname required!";
    }
    if (Object.keys(error).length > 0) {
      res.json({
        error: error,
      });
      return false;
    }
    var parameter = {
      Id: Id,
      FirstName: FirstName,
      LastName: LastName,
      Gender: Gender,
      Tel: Tel,
      Dob: Dob,
      Email: Email,
      Current_Address: Current_Address,
      Note: Note,
      IsActive: IsActive,
    };

    const [students] = await db.query(
      "UPDATE Student SET FirstName=:FirstName, LastName=:LastName, Gender=:Gender, Tel=:Tel,Dob=:Dob, Email=:Email,Current_Address=:Current_Address,Note=:Note,IsActive=:IsActive WHERE Id=:Id",
      parameter
    );
    res.json({
      message: "Updated Successfully!",
      list: students,
    });
  } catch (error) {
    logError("Student.update", error, res);
  }
};
const remove = async (req, res) => {
  try {
    var Id = req.params.id;
    var error = {};
    if (isEmptyOrNull(Id)) {
      error.Id = "Id required!";
    }
    if (Object.keys(error).length > 0) {
      res.json({
        error: error,
      });
      return false;
    }
    var parameter = {
      Id: Id,
    };
    const [list] = await db.query(
      "DELETE FROM Student WHERE Id=:Id",
      parameter
    );
    res.json({
      message: "Removed Student Successfully",
      list: list,
    });
  } catch (error) {
    logError("user.remove", error, res);
  }
};
module.exports = {
  getList,
  create,
  update,
  remove,
};
