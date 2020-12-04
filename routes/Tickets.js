var express = require('express')
var tickets = express.Router()
const cors = require('cors')
const jwt = require('jsonwebtoken')

const Ticket = require('../models/Ticket')
const Lot = require('../models/Lot')

tickets.use(cors())

process.env.SECRET_KEY = 'secret'

tickets.get('/tickets', function(req, res, next) {
    if (req.headers['authorization']) {
        var decoded = jwt.verify(req.headers['authorization'], process.env.SECRET_KEY)
        Ticket.findAll({
                where: {
                    user_id: decoded.id
                }
            })
            .then(tickets => {
                res.json(tickets)
            })
            .catch(err => {
                res.send('error: ' + err)
            })
    } else {
        res.json({ status: 'failed', message: 'Token not passed !' })
        console.log("Token Not Passed");
    }
})

tickets.get('/ticket/:id', function(req, res, next) {
    if (req.headers['authorization']) {
        Ticket.findOne({
                where: {
                    id: req.params.id
                }
            })
            .then(ticket => {
                if (ticket) {
                    res.json(ticket)
                } else {
                    res.send('Ticket does not exist')
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

tickets.post('/ticket', function(req, res, next) {
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
            Ticket.create(req.body)
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

tickets.delete('/ticket/:id', function(req, res, next) {
    if (req.headers['authorization']) {

        var decoded = jwt.verify(req.headers['authorization'], process.env.SECRET_KEY)
        console.log("user_decoded_id", decoded.id);
        Ticket.findOne({
                where: {
                    user_id: decoded.id,
                    id: req.params.id
                }
            })
            .then(ticket => {
                if (ticket) {
                    Ticket.destroy({
                            where: {
                                id: req.params.id
                            }
                        })
                        .then(() => {
                            res.json({ status: 'Ticket Deleted!' })
                        })
                        .catch(err => {
                            res.send('error: ' + err)
                        })
                } else {
                    res.json({ status: 'failed', message: 'Ticket not found' })
                }
            }).catch(err => {
                res.json({ status: 'failed', message: 'Ticket not found' })
            })

    } else {
        res.json({ status: 'failed', message: 'Token not passed !' })
        console.log("Token Not Passed");
    }
})

tickets.put('/ticket/:id', function(req, res, next) {
    if (req.headers['authorization']) {
        if (!req.body.name && !req.body.status) {
            res.status(400)
            res.json({
                error: 'Bad Data'
            })
        } else {

            var decoded = jwt.verify(req.headers['authorization'], process.env.SECRET_KEY)
            console.log("user_decoded_id", decoded.id);
            Ticket.findOne({
                    where: {
                        user_id: decoded.id,
                        id: req.params.id
                    }
                })
                .then(ticket => {
                    if (ticket) {
                        Ticket.update({ name: req.body.name, status: req.body.status }, { where: { id: req.params.id } })
                            .then(() => {
                                res.json({ status: 'success', message: 'Ticket Updated !' })
                            })
                            .error(err => handleError(err))
                    } else {
                        res.json({ status: 'failed', message: 'Ticket not found' })
                    }
                }).catch(err => {
                    res.json({ status: 'failed', message: 'Ticket not found' })
                })

        }
    } else {
        res.json({ status: 'failed', message: 'Token not passed !' })
        console.log("Token Not Passed");
    }
})

module.exports = tickets