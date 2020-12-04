var express = require('express')
var lots = express.Router()
const cors = require('cors')
const jwt = require('jsonwebtoken')

const Lot = require('../models/Lot')

lots.use(cors())

process.env.SECRET_KEY = 'secret'

lots.get('/lots', function(req, res, next) {
    if (req.headers['authorization']) {
        var decoded = jwt.verify(req.headers['authorization'], process.env.SECRET_KEY)
        Lot.findAll({
                where: {
                    user_id: decoded.id
                }
            })
            .then(lots => {
                res.json(lots)
            })
            .catch(err => {
                res.send('error: ' + err)
            })
    } else {
        res.json({ status: 'failed', message: 'Token not passed !' })
        console.log("Token Not Passed");
    }
})

lots.get('/lot/:id', function(req, res, next) {
    if (req.headers['authorization']) {
        Lot.findOne({
                where: {
                    id: req.params.id
                }
            })
            .then(lot => {
                if (lot) {
                    res.json(lot)
                } else {
                    res.send('Lot does not exist')
                }
            })
            .catch(err => {
                res.send('error: ' + err)
            })
    } else {
        res.json({ status: 'failed', message: 'Token not passed !' })
        console.log("Token Not Passed");
    }
})

lots.post('/lot', function(req, res, next) {
    if (req.headers['authorization']) {
        if (!req.body.name && !req.body.status) {
            res.status(400)
            res.json({
                error: 'Bad Data'
            })
        } else {
            var decoded = jwt.verify(req.headers['authorization'], process.env.SECRET_KEY)
            const user_id = decoded.id;
            req.body.user_id = user_id;
            console.log("req-body", req.body);
            Lot.create(req.body)
                .then(data => {
                    res.send(data)
                })
                .catch(err => {
                    res.json('error: ' + err)
                })
        }
    } else {
        res.json({ status: 'failed', message: 'Token not passed !' })
        console.log("Token Not Passed");
    }
})

lots.delete('/lot/:id', function(req, res, next) {
    if (req.headers['authorization']) {

        var decoded = jwt.verify(req.headers['authorization'], process.env.SECRET_KEY)
        console.log("user_decoded_id", decoded.id);
        Lot.findOne({
                where: {
                    user_id: decoded.id,
                    id: req.params.id
                }
            })
            .then(lot => {
                if (lot) {
                    Lot.destroy({
                            where: {
                                id: req.params.id
                            }
                        })
                        .then(() => {
                            res.json({ status: 'Lot Deleted!' })
                        })
                        .catch(err => {
                            res.send('error: ' + err)
                        })
                } else {
                    res.json({ status: 'failed', message: 'Lot not found' })
                }
            }).catch(err => {
                res.json({ status: 'failed', message: 'Lot not found' })
            })

    } else {
        res.json({ status: 'failed', message: 'Token not passed !' })
        console.log("Token Not Passed");
    }
})

lots.put('/lot/:id', function(req, res, next) {
    if (req.headers['authorization']) {
        if (!req.body.name && !req.body.status) {
            res.status(400)
            res.json({
                error: 'Bad Data'
            })
        } else {

            var decoded = jwt.verify(req.headers['authorization'], process.env.SECRET_KEY)
            console.log("user_decoded_id", decoded.id);
            Lot.findOne({
                    where: {
                        user_id: decoded.id,
                        id: req.params.id
                    }
                })
                .then(lot => {
                    if (lot) {
                        Lot.update({ name: req.body.name, status: req.body.status }, { where: { id: req.params.id } })
                            .then(() => {
                                res.json({ status: 'success', message: 'Lot Updated !' })
                            })
                            .error(err => handleError(err))
                    } else {
                        res.json({ status: 'failed', message: 'Lot not found' })
                    }
                }).catch(err => {
                    res.json({ status: 'failed', message: 'Lot not found' })
                })

        }
    } else {
        res.json({ status: 'failed', message: 'Token not passed !' })
        console.log("Token Not Passed");
    }
})

module.exports = lots