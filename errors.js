const customErrorHandler = (err, req, res, next) => {
    if (err.status && err.msg) {
        res.status(err.status).send({msg: err.msg})
    } else {
        next(err)
    }
}

const psqlErrorHandler = (err, req, res, next) => {
    if (err.code === "22P02") {
        res.status(400).send({msg: "Bad request"})
    } else if (err.code === "23503"){
        console.log("Caught 23503")
    } else {
        next(err)
    }
}

module.exports = { psqlErrorHandler, customErrorHandler}

