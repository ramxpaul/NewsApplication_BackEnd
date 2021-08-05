const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const reporterSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    address: {
        type: String,
        required: true,
        default: ''
    },
    age: {
        type: Number,
        required: true,
        default: 22
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error('Email Invalid Please Check')
            }
        }
    },
    password: {
        type: String,
        required: true,
        // lowercase: true,
        minLength: 8,
        validate(value) {
            if (value.includes('password')) {
                throw new Error('Password Cannot Contain Word Password')
            }
        }
    },
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }]
})

//Update and post pass hash check
reporterSchema.pre('save', async function(next) {
    const reporter = this
    if (reporter.isModified('password')) {
        reporter.password = await bcrypt.hash(reporter.password, 8);
    }
    next();
})

//Virtual Relation
reporterSchema.virtual('reporterNews', {
    ref: 'News',
    localField: '_id',
    foreignField: 'ownerID'
})

//login function to check email and password if they are exists on db or not
reporterSchema.statics.findByCredentials = async(email, password) => {
    const reporter = await Reporter.findOne({ email })
        // console.log(reporter)
    if (!reporter) {
        throw new Error('Unable To Login')
    }
    //test the compare of password befor hash and after hash
    // console.log(reporter.password)
    // console.log(password)
    const isMatch = await bcrypt.compare(password, reporter.password)
    // console.log(isMatch)
    if (!isMatch) {
        // console.log('test2')
        throw new Error('Unable To Login')
    }
    return reporter
}


//token 
reporterSchema.methods.generateToken = async function() {
    const reporter = this
    const token = jwt.sign({_id:reporter._id.toString()},'news-app')
    reporter.tokens = reporter.tokens.concat({token:token})
    await reporter.save()
    return token
}

const Reporter = mongoose.model('Reporter', reporterSchema)
module.exports = Reporter