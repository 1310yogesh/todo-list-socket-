module.exports = {
    use: (fn) => (req,res,next) => {
        return Promise.resolve(fn(req,res,next)).catch(next)
    }
};