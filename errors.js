exports.psqlErrorHandler = (err, req, res, next) => {
    console.log("psqlerrorhandler")
    if (err.code === "22P02") {
        res.status(400).send({msg: "Bad Request"})
    } else res.status(404).send({ msg: 'Not found' })
}