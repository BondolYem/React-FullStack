const db = require("../config/db");
const { logError, isEmptyOrNull, removeFile } = require("../config/service");

const getList = async (req, res) => {
  const { page, txtSearch, status, fromDate, toDate } = req.query;
  try {
    var sqlTotal = "SELECT COUNT(Id) AS totalRecords FROM category  WHERE 1=1 ";
    var sql = "SELECT * FROM category WHERE 1=1";
    var sqlWhere = "",
      sqlParm = {};
    if (!isEmptyOrNull(txtSearch)) {
      sqlWhere += " AND (Name LIKE :txtSearch)";
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
    logError("category.getList", error, res);
  }
};

const getOne = async (req, res) => {
  try {
    var parameter = {
      Id: req.params.id,
    };
    const [list] = await db.query(
      "SELECT * FROM category WHERE Id = :Id",
      parameter
    );
    res.json({
      list: list,
    });
  } catch (error) {
    logError("category.getOne", error, res);
  }
};

const create = async (req, res) => {
  try {
    var { Name, Description, IsActive } = req.body;
    var error = {};

    if (isEmptyOrNull(Name)) {
      error.Name = "Name required!";
    }

    if (Object.keys(error).length > 0) {
      res.json({
        error: error,
      });
      return false;
    }

    var Image = null;
    if (req.file) {
      Image = req.file.filename;
    }

    //show upload test response
    // res.json({
    //   body: req.body,
    //   file: req.file,
    // });

    var parameter = {
      Name: Name,
      Description: Description,
      Image: Image,
      IsActive: parseInt(IsActive),
    };
    const [list] = await db.query(
      "INSERT INTO category (Name,Description,Image, IsActive) VALUES (:Name,:Description, :Image, :IsActive)",
      parameter
    );
    res.json({
      message: "Created Successfully!",
      list: list,
    });
  } catch (error) {
    logError("category.create", error, res);
  }
};

const update = async (req, res) => {
  try {
    var { Id, Name, Description, IsActive, OldImage } = req.body;
    var error = {};
    if (isEmptyOrNull(Id)) {
      error.Id = "Id required!";
    }
    if (isEmptyOrNull(Name)) {
      error.Name = "Name required!";
    }

    if (Object.keys(error).length > 0) {
      res.json({
        error: error,
      });
      return false;
    }

    var Image = null;
    if (req.file) {
      Image = req.file.filename;
    } else {
      Image = OldImage;
      if (req.body.isRemoveFile == "true") {
        Image = null;
      }
    }

    var parameter = {
      Id: Id,
      Name: Name,
      Description: Description,
      Image: Image,
      IsActive: parseInt(IsActive),
    };
    const [list] = await db.query(
      "UPDATE category SET Name=:Name ,Description=:Description ,Image=:Image, IsActive=:IsActive WHERE Id=:Id",
      parameter
    );

    // try remove file in server.
    if (!isEmptyOrNull(OldImage) && req.file) {
      await removeFile(OldImage);
    } else if (!isEmptyOrNull(OldImage) && req.body.isRemoveFile == "true") {
      await removeFile(OldImage);
    }

    res.json({
      message: "Updated Successfully!",
      list: list,
    });
  } catch (error) {
    logError("category.update", error, res);
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
      "DELETE FROM category WHERE Id=:Id",
      parameter
    );
    res.json({
      list: list,
    });
  } catch (error) {
    logError("category.remove", error, res);
  }
};

module.exports = {
  getList,
  getOne,
  create,
  update,
  remove,
};
