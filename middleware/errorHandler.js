const errorHandler = (err,req,res,next) => {
    return res
    .status(err.status || 500)
    .json({ ...err, message: err.message});
};

module.exports = errorHandler;