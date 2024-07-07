const db = require("../config/db");
const { logError, isEmptyOrNull } = require("../config/service");

// work database
const getList = async (req, res) => {
  //api/teacher?key1=value1&key2=value2@keyn=valuen
  const { page, txtSearch, status, fromDate, toDate } = req.query;
  try {
    var sqlTotal = "SELECT COUNT(Id) AS totalRecords FROM teacher  WHERE 1=1 ";
    var sql = "SELECT * FROM teacher WHERE 1=1";
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
    // if (page == 1) {
    const [total] = await db.query(sqlTotal + sqlWhere, sqlParm);
    totalRecords = total[0].totalRecords;
    // }
    res.json({
      list: data,
      totalRecords: totalRecords,
    });
  } catch (error) {
    logError("teacher.getList", error, res);
  }
};

const getOne = async (req, res) => {
  try {
    var parameter = {
      Id: req.params.id, // id from route
    };
    const [list] = await db.query(
      "SELECT * FROM Teacher WHERE Id = :Id",
      parameter
    );

    console.log("teachers:", list);
    res.json({
      list: list,
    });
  } catch (error) {
    logError("teacher.getOne", error, res);
  }
};
// FirstName
// LastName
// Gender
// Dob
// Tel
// Image
// Email
// Current_Address
// Note
// IsActive
// CreateBy
const create = async (req, res) => {
  try {
    var {
      FirstName,
      LastName,
      Gender,
      Dob,
      Tel,
      Image,
      Email,
      Current_Address,
      Note,
      IsActive,
      CreateBy,
    } = req.body;
    var error = {};
    if (isEmptyOrNull(FirstName)) {
      error.FirstName = "FirstName Required!";
    }
    if (isEmptyOrNull(LastName)) {
      error.LastName = "LastName Required!";
    }
    if (isEmptyOrNull(Tel)) {
      error.Tel = "Tel Required!";
    }
    if (Object.keys(error).length > 0) {
      res.json({
        error: error,
      });
      return;
    }
    var param = {
      FirstName: FirstName,
      LastName: LastName,
      Gender: Gender,
      Dob: Dob,
      Tel: Tel,
      Image: Image,
      Email: Email,
      Current_Address: Current_Address,
      Note: Note,
      IsActive: IsActive || 1,
      CreateBy: req.user_name,
    };
    const [findTeacher] = await db.query(
      "SELECT * FROM Teacher WHERE (Tel=:Tel OR Email=:Email)",
      param
    );
    if (findTeacher.length > 0) {
      res.json({
        error: {
          acount_exist: "Account Already Exist! Please try other!",
        },
      });
    } else {
      var sql =
        "INSERT INTO Teacher (FirstName, LastName, Gender, Dob, Tel, Image, Email, Current_Address, Note, IsActive, CreateBy) VALUES (:FirstName, :LastName, :Gender, :Dob, :Tel, :Image, :Email, :Current_Address, :Note, :IsActive, :CreateBy)";
      const [data] = await db.query(sql, param);
      res.json({
        message: "Created Successfully!",
        list: data,
      });
    }
  } catch (error) {
    logError("teacher.create", error, res);
  }
};
const update = async (req, res) => {
  try {
    var {
      FirstName,
      LastName,
      Gender,
      Dob,
      Tel,
      Image,
      Email,
      Current_Address,
      Note,
      IsActive,
      Id,
    } = req.body;
    var error = {};
    if (isEmptyOrNull(Id)) {
      error.Id = "Id Required!";
    }
    if (isEmptyOrNull(FirstName)) {
      error.FirstName = "FirstName Required!";
    }
    if (isEmptyOrNull(LastName)) {
      error.LastName = "LastName Required!";
    }
    if (isEmptyOrNull(Tel)) {
      error.Tel = "Tel Required!";
    }
    if (Object.keys(error).length > 0) {
      res.json({
        error: error,
      });
      return;
    }
    var param = {
      Id: Id,
      FirstName: FirstName,
      LastName: LastName,
      Gender: Gender,
      Dob: Dob,
      Tel: Tel,
      Image: Image,
      Email: Email,
      Current_Address: Current_Address,
      Note: Note,
      IsActive: IsActive,
    };
    const [findTeacher] = await db.query(
      "SELECT * FROM Teacher WHERE (Tel=:Tel OR Email=:Email) AND Id != :Id",
      param
    );
    if (findTeacher.length > 0) {
      res.json({
        error: {
          acount_exist: "Tel Or Email Already Exist! Please try other!",
        },
      });
    } else {
      var sql =
        "UPDATE  Teacher SET FirstName=:FirstName, LastName=:LastName, Gender=:Gender, Dob=:Dob, Tel=:Tel, Image=:Image, Email=:Email, Current_Address=:Current_Address, Note=:Note, IsActive=:IsActive WHERE Id=:Id";
      const [data] = await db.query(sql, param);
      res.json({
        message: "Updated Successfully!",
        list: data,
      });
    }
  } catch (error) {
    logError("teacher.create", error, res);
  }
};
const remove = async (req, res) => {
  try {
    var sql = "DELETE FROM Teacher WHERE Id=:Id";
    var param = {
      Id: req.params.id,
    };
    const [data] = await db.query(sql, param);
    res.json({
      message: "Removed Teacher Successfully",
      list: data,
    });
  } catch (error) {
    logError("teacher.remove", error, res);
  }
};
module.exports = {
  getList,
  create,
  update,
  remove,
  getOne,
};
