const jwt = require('jsonwebtoken')
const Reporter = require('../models/reporters')



const auth = async(req, res, next) => {
    try {
        const token = req.header('Authorization').replace('Bearer ','')
            // console.log(token)
        const decode = jwt.verify(token,'news-app')
            // console.log(decode)
        const reporter = await Reporter.findOne({_id:decode._id,'tokens.token': token })
        // console.log(decode._id)
        // console.log(reporter)
        if (!reporter) {
            throw new Error('Unknown Reporter')
        }
        req.reporter = reporter
        req.token = token
        next()
    } catch (e) {
        res.status(400).send(e)
    }
}

module.exports = auth