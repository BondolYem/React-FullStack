const db = require("../config/db");
const { logError, isEmptyOrNull } = require("../config/service");

const getList = async (req, res) => {
  try {
    const [data] = await db.query("SELECT * FROM role;");
    res.json({
      list: data,
    });
  } catch (error) {
    logError("role.getList", error, res);
  }
};

const getOne = async (req, res) => {
  try {
    var parameter = {
      Id: req.params.id,
    };
    const [data] = await db.query(
      "SELECT * FROM role WHERE Id = :Id",
      parameter
    );
    res.json({
      list: data,
    });
  } catch (error) {
    logError("role.getOne", error, res);
  }
};

const create = async (req, res) => {
  try {
    var { Name, Code } = req.body;
    var error = {};
    if (isEmptyOrNull(Name)) {
      error.Name = "Name required!";
    }
    if (isEmptyOrNull(Code)) {
      error.Code = "Code required!";
    }
    if (Object.keys(error).length > 0) {
      res.json({
        error: error,
      });
      return false;
    }
    var parameter = {
      Name: Name,
      Code: Code,
    };
    const [data] = await db.query(
      "INSERT INTO role (Name,Code) VALUES (:Name,:Code);",
      parameter
    );
    res.json({
      message: "insert success!",
      data: data,
    });
  } catch (error) {
    logError("role.create", error, res);
  }
};

const update = async (req, res) => {
  try {
    var { Id, Name, Code } = req.body;
    var error = {};
    if (isEmptyOrNull(Name)) {
      error.Name = "Name required!";
    }
    if (isEmptyOrNull(Code)) {
      error.Code = "Code required!";
    }
    if (Object.keys(error).length > 0) {
      res.json({
        error: error,
      });
      return false;
    }
    var parameter = {
      Name: Name,
      Id: Id,
      Code: Code,
    };
    const [data] = await db.query(
      "UPDATE role SET Name=:Name, Code=:Code WHERE Id = :Id;",
      parameter
    );
    res.json({
      data: data,
    });
  } catch (error) {
    logError("role.update", error, res);
  }
};

const remove = async (req, res) => {
  try {
    var parameter = {
      Id: req.params.id,
    };
    const [data] = await db.query("DELETE FROM role WHERE Id = :Id", parameter);
    res.json({
      data: data,
    });
  } catch (error) {
    logError("role.remove", error, res);
  }
};

module.exports = {
  getList,
  getOne,
  create,
  update,
  remove,
};
