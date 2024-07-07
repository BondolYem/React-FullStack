const { Config } = require("../config/config");
const db = require("../config/db");
const {
  logError,
  isEmptyOrNull,
  getPermissonMenuByRole,
  getConfig,
} = require("../config/service");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const { body, validationResult } = require("express-validator");

const getList = async (req, res) => {
  try {
    // FOR LOCAL
    var sql =
      "SELECT users.* , role.Name as RoleName FROM users  LEFT JOIN Role ON (users.RoleId = role.Id);";
    // var sql_role = "SELECT * FROM role";

    // FOR DOCKER
    //var sql = "SELECT User.* , Role.Name as RoleName FROM User  LEFT JOIN Role ON (User.RoleId = Role.Id);;";
    const [list] = await db.query(sql);
    res.json({
      message: "Get User Successfully!",
      list: list,
    });
  } catch (error) {
    logError("users.getList", error, res);
  }
};

const getOne = async (req, res) => {
  try {
    var parameter = {
      Id: req.params.id,
    };
    const [list] = await db.query(
      "SELECT * FROM users WHERE Id = :Id",
      parameter
    );
    res.json({
      list: list,
    });
  } catch (error) {
    logError("users.getOne", error, res);
  }
};

const create = async (req, res) => {
  try {
    var username = req.body.Username;
    var password = req.body.Password;
    var RoleId = req.body.RoleId;
    var IsActive = req.body.IsActive;
    var error = {};
    if (isEmptyOrNull(RoleId)) {
      error.RoleId = "RoleId requered!";
    }
    if (isEmptyOrNull(username)) {
      error.username = "username required!";
    }
    if (isEmptyOrNull(password)) {
      error.password = "password required!";
    }
    if (Object.keys(error).length > 0) {
      res.json({
        error: error,
      });
      return false;
    }
    var hashPassword = bcrypt.hashSync(password, 10);
    var parameter = {
      username: username,
      password: hashPassword,
      RoleId: RoleId,
      IsActive: IsActive,
    };

    const [list] = await db.query(
      "INSERT INTO users (Username,Password,RoleId,IsActive) VALUES (:username,:password,:RoleId, :IsActive)",
      parameter
    );
    res.json({
      message: "Created Successfully!",
      list: list,
    });
  } catch (error) {
    logError("users.create", error, res);
  }
};

const update = async (req, res) => {
  try {
    var { Id, Username, Password, RoleId, IsActive } = req.body;
    var error = {};

    if (isEmptyOrNull(RoleId)) {
      error.RoleId = "RoleId required!";
    }
    if (isEmptyOrNull(Username)) {
      error.Username = "Username required!";
    }
    // if (isEmptyOrNull(Password)) {
    //   error.Password = "Password requered!";
    // }

    if (Object.keys(error).length > 0) {
      res.json({
        error: error,
      });
      return false;
    }
    var parameter = {
      Id: Id,
      Username: Username,
      // password: Password,
      RoleId: RoleId,
      IsActive: IsActive,
    };
    const [list] = await db.query(
      "UPDATE  users SET  Username=:Username, RoleId=:RoleId, IsActive=:IsActive WHERE Id=:Id",
      parameter
    );

    res.json({
      message: "Updated Successfully!",
      list: list,
    });
  } catch (error) {
    logError("users.update", error, res);
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
    const [list] = await db.query("DELETE FROM users WHERE Id=:Id", parameter);
    res.json({
      message: "Removed User Successfully",
      list: list,
    });
  } catch (error) {
    logError("user.remove", error, res);
  }
};

// const login = async (req, res) => {
//   try {
//     var Username = req.body.Username;
//     var Password = req.body.Password;
//     var error = {};
//     if (isEmptyOrNull(Username)) {
//       error.Username = "Username required!";
//     }
//     if (isEmptyOrNull(Password)) {
//       error.Password = "Password required!";
//     }
//     if (Object.keys(error).length > 0) {
//       res.json({
//         error: error,
//       });
//       return false;
//     }
//     var parameter = {
//       Username: Username,
//       Password: Password,
//     };
//     const [data] = await db.query(
//       "SELECT * FROM users  WHERE Username=:Username",
//       parameter
//     );

//     if (data.length > 0) {
//       var user = data[0];

//       var isCorrectPassword = bcrypt.compareSync(Password, user.Password); // true or false
//       console.log("isCorrectPassword", isCorrectPassword);

//       if (isCorrectPassword) {
//         delete user.Password; // remove property Password from object user
//         // generate JWT
//         // var access_token = await jwt.sign({ data: user[0] }, ACCESS_TOKEN_KEY, { expiresIn: "60s" })
//         var access_token = await jwt.sign(
//           { data: user },
//           Config.ACCESS_TOKEN_KEY,
//           { expiresIn: "60s" }
//         );
//         var refresh_token = await jwt.sign(
//           { data: user },
//           Config.REFRESH_TOKEN_KEY
//         );

//         res.json({
//           message: "Login success",
//           user: user,
//           access_token: access_token,
//           refresh_token: refresh_token,
//         });
//         return;
//       } else {
//         res.json({
//           error: {
//             Password: "Password incorrect!",
//           },
//         });
//         return;
//       }
//     } else {
//       res.json({
//         error: {
//           Username: "Username does not exist!",
//         },
//       });
//       return;
//     }
//   } catch (error) {
//     logError("user.login", error, res);
//   }
// };

const login = async (req, res) => {
  try {
    var Username = req.body.Username;
    var Password = req.body.Password;
    var error = {};
    if (isEmptyOrNull(Username)) {
      error.Username = "Username required!";
    }
    if (isEmptyOrNull(Password)) {
      error.Password = "Password required!";
    }
    if (Object.keys(error).length > 0) {
      res.json({
        error: error,
      });
      return false;
    }
    var parameter = {
      Username: Username,
      Password: Password,
    };
    const [data] = await db.query(
      "SELECT role.Name as RoleName, users.* FROM users inner join role on (users.RoleId = role.Id)  WHERE users.Username=:Username",
      parameter
    );
    if (data.length > 0) {
      var user = data[0];
      var isCorrectPassword = bcrypt.compareSync(Password, user.Password); // true or false
      if (isCorrectPassword) {
        delete user.Password; // remove property Password from object user
        // generate JWT
        // var access_token = await jwt.sign({ data: user[0] }, ACCESS_TOKEN_KEY, { expiresIn: "60s" })
        var access_token = await jwt.sign(
          { data: user },
          Config.ACCESS_TOKEN_KEY,
          { expiresIn: "60s" }
        );
        var refresh_token = await jwt.sign(
          { data: user },
          Config.REFRESH_TOKEN_KEY
        );
        res.json({
          message: "Login success",
          user: user,
          permison_menu: getPermissonMenuByRole(user.RoleName),
          access_token: access_token,
          refresh_token: refresh_token,
        });
        return;
      } else {
        res.json({
          error: {
            Password: "Password incorrect!",
          },
        });
        return;
      }
    } else {
      res.json({
        error: {
          Username: "Username does not exist!",
        },
      });
      return;
    }
  } catch (error) {
    logError("user.remove", error, res);
  }
};

// refresh_token
const refresh_token = async (req, res) => {
  try {
    const { refres_token } = req.body;
    console.log("refresh token :", refres_token);

    jwt.verify(
      refres_token,
      Config.REFRESH_TOKEN_KEY,
      async (error, result) => {
        if (error) {
          console.log("error", error);
          res.status(401).send({
            message: "Unauthorized",
            error: error,
          });
        } else {
          console.log("Success");
          // Renew access_token and refresh_token
          var user_from_token = result.data;
          const [data] = await db.query("SELECT * FROM users  WHERE Id=:Id", {
            Id: user_from_token.Id,
          });
          var user = data[0];
          delete user.Password;
          var access_token = await jwt.sign(
            { data: user },
            Config.ACCESS_TOKEN_KEY,
            { expiresIn: "60s" }
          );
          var refresh_token = await jwt.sign(
            { data: user },
            Config.REFRESH_TOKEN_KEY
          );
          res.json({
            message: "refresh token success",
            user: user,
            access_token: access_token,
            refresh_token: refresh_token,
          });
        }
      }
    );
  } catch (error) {
    logError("user.refresh_token", error, res);
  }
};

const user_validate = async (req, res) => {
  try {
    var username = body("username")
      .isLength({ min: 5 })
      .withMessage("Username must be at least 5 characters long");
    var password = body("Password")
      .isString()
      .withMessage("Password must be Charactor");
    var RoleId = body("RoleId").isInt().withMessage("RoleId must be integer");
    var IsActive = body("IsActive")
      .isInt()
      .withMessage("IsActive must be integer");

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    var hashPassword = bcrypt.hashSync(password, 10);
    var parameter = {
      username: username,
      password: hashPassword,
      RoleId: RoleId,
      IsActive: IsActive,
    };

    const [list] = await db.query(
      "INSERT INTO users (Username,Password,RoleId,IsActive) VALUES (:username,:password,:RoleId, :IsActive)",
      parameter
    );
    res.json({
      list: list,
    });
  } catch (error) {
    logError("users.user_validator", error, res);
  }
};

const userConfig = async (req, res) => {
  res.json({
    config: getConfig(),
  });
};

module.exports = {
  getList,
  getOne,
  create,
  update,
  remove,
  login,
  refresh_token,
  user_validate,
  userConfig,
};
