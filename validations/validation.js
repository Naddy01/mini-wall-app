const joi = require("joi");

const registerValidation = (data) => {
  const schemaValidation = joi.object({
    username: joi.string().required().min(3).max(256),
    email: joi.string().required().min(6).max(256).email(),
    password: joi.string().required().min(6).max(1024),
  });
  return schemaValidation.validate(data);
};
const loginValidation = (data) => {
  const schemaValidation = joi.object({
    email: joi.string().required().min(6).max(256).email(),
    password: joi.string().required().min(6).max(1024),
  });
  return schemaValidation.validate(data);
};
const postValidation = (data) => {
  const schemaValidation = joi.object({
    userId: joi.string().required(),
    username: joi.string().required().min(3).max(256),
    title: joi.string().required().min(3).max(256),
    text: joi.string().required().not().empty(),
    hashtag: joi.string().max(256),
  });
  return schemaValidation.validate(data);
};
const commentValidation = (data) => {
  const schemaValidation = joi.object({
    userId: joi.string().required(),
    //user:joi.string().required().min(3).max(256),
    text: joi.string().required().min(3).max(1024),
  });
  return schemaValidation.validate(data);
};

/*const likeValidation = (data) => {
    const schemaValidation = joi.object({
        userId:joi.string().required()

    })
    return schemaValidation.validate(data)
}*/
module.exports.registerValidation = registerValidation;
module.exports.loginValidation = loginValidation;
module.exports.postValidation = postValidation;
module.exports.commentValidation = commentValidation;
//module.exports.likeValidation = likeValidation
