const express = require('express')
const News = require('../models/news')
const auth = require('../middleware/auth')
const router = new express.Router()

//insert
router.post('/news', auth, async(req, res) => {
    const news = new News({...req.body, ownerID: req.reporter._id })
    try {
        await news.save()
        res.status(200).send(news)
    } catch (e) {
        res.status(400).send(e)
    }

})

//Search All
router.get('/news', auth, async(req, res) => {
    try {
        await req.reporter.populate('reporterNews').execPopulate()
        res.status(200).send(req.reporter.reporterNews)
    } catch (e) {
        res.status(400).send(e)
    }

})

//search by id
router.get('/news/:id', auth, async(req, res) => {
    const _id = req.params.id
    try {
        const news = await News.findOne({ _id, ownerID: req.reporter._id })
        if (!news) {
            return res.status(400).send('Cannot Find These News ')
        }
        res.status(200).send(news)
    } catch (e) {
        res.status(500).send('Error has Occurred: ' + e)
    }
})

//update
router.patch('/news/:id', auth, async(req, res) => {
    const updates = Object.keys(req.body)
    const _id = req.params.id
    try {
        const news = await News.findOne({ _id, ownerID: req.reporter._id })
        updates.forEach((el) => news[el] = req.body[el])
        await news.save()
        res.status(200).send(news)
    } catch (e) {
        res.status(400).send(e)
    }
})

//delete
router.delete('/news/:id', auth, async(req, res) => {
    const _id = req.params.id
    try {
        const news = await News.findOneAndDelete({ _id,ownerID:req.reporter._id })
        if (!news) {
            return res.status(400).send('The News That you Want to Delete Not Found Check News : ID')
        }
        res.status(200).send(news)
    } catch (e) {
        res.status(500).send('Error has Occured: ' + e)
    }

})

module.exports = router