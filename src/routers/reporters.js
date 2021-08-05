const express = require('express')
const Reporter = require('../models/reporters')
const auth = require('../middleware/auth')

const router = new express.Router()

//insert
router.post('/reporter', async(req, res) => {
    const reporter = new Reporter(req.body)
    try {
        await reporter.save()
        const token = await reporter.generateToken()
        res.status(200).send({ reporter, token })
    } catch (e) {
        res.status(400).send(e)
    }
})

//search all
router.get('/reporter', auth, async(req, res) => {
    try {
        const reporter = await Reporter.find({})
        res.status(200).send(reporter)
    } catch (e) {
        res.status(400).send(e)
    }
})

//search by id
router.get('/reporter/:id', auth, async(req, res) => {
    const _id = req.params.id
    try {
        const reporter = await Reporter.findById(_id)
            // console.log(reporter)
        if (!reporter) {
            return res.status(400).send('Cannot Find The News You Are trying To Find Please Check News : ID')
        }
        res.status(200).send(reporter)
    } catch (e) {
        res.status(500).send(e)
    }
})

//update
router.patch('/reporter/:id', auth, async(req, res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ['name', 'address', 'age', 'password']
    var isValid = updates.every((el) => allowedUpdates.includes(el))
    if (!isValid) {
        return res.status(400).send('Cannot Update Email')
    }
    const _id = req.params.id
    try {
        const reporter = await Reporter.findById(_id)
        updates.forEach((el) => (reporter[el] = req.body[el]))
        await reporter.save()
        if (!reporter) {
            return res.status(400).send('Cannot Find Reporter Please Check Reporter : ID')
        }
        res.status(200).send(reporter)
    } catch (e) {
        res.status(500).send(e)
    }
})

//delete

router.delete('/reporter/:id', auth, async(req, res) => {
    const _id = req.params.id
    try {
        const reporter = await Reporter.findByIdAndDelete(_id)
        if (!reporter) {
            return res.status(400).send('Cannot Find The Reporter That You Want To Delete Please Check Reporter : ID')
        }
        res.status(200).send(reporter)
    } catch (e) {
        res.status(500).send(e)
    }
})

//Login 
router.post('/reporter/login', async(req, res) => {
    try {
        const reporter = await Reporter.findByCredentials(req.body.email, req.body.password)
        const token = await reporter.generateToken()
        res.status(200).send({ reporter, token })
    } catch (e) {
        res.status(400).send(e)
    }
})

router.get('/profile',auth,async(req,res)=>{
    res.send(req.reporter)
  })

//logout  with post if u are gonna use it on postman
//logout with delete if u are gonna use Angular
router.delete('/logout', auth, async(req, res)=>{
    try {
        req.reporter.tokens = req.reporter.tokens.filter((el) => {
            return el.token !== req.token
        })
        await req.reporter.save()
        res.send()//no messages if u are gonna use angular / but if u gonna test it on post man u should put message
    } catch (e) {
        res.status(500).send()
    }
})

//logout All  with post if u are gonna use it on postman
//logout All  with delete if u are gonna use Angular
router.delete('/logoutAll', auth, async(req, res) => {
    try {
        req.reporter.tokens = []
        await req.reporter.save()
        res.status(200).send()//no messages if u are gonna use angular / but if u gonna test it on post man u should put message
    } catch (e) {
        res.status(400).send()
    }
})

module.exports = router