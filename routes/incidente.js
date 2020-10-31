const express = require('express');
const mongoose = require('mongoose');
const RestError = require('../rest-error');
const Router = express.Router();

const incidenteSchema = require('../schemas/incidente');
const incidente = mongoose.model('Incidente', incidenteSchema);

// CREAR INCIDENTE
Router.post('/incidentes', function (req, res, next) {

    Inc = new incidente(req.body);

    Inc.save(function (err, inc) {
        if (err) {
            if (err.code == 11000) {
                next(new RestError(err.message, 409));
            } else {
                errors = {};
                for (const key in err.errors) {
                    if (err.errors[key].constructor.name != 'ValidationError') {
                        errors[key] = err.errors[key].message;
                    }
                }
                next(new RestError(errors, 400));
            }
        } else {
            inc.__v = undefined;
            res.json(inc);
        }
    });
});

// OBTENER INCIDENTE por ID
Router.get('/incidentes/:id', function (req, res) {
    const id = req.params.id;
    Query = incidente.findById(id)
    Query.exec(function (err, inc) {
        if (!err) {
            inc.__v = undefined;
            res.json(inc);
        }
    });
});

module.exports = Router;
