const express = require('express');
const router = express.Router();

const transpixel_raw = "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=";
const transpixel = Buffer.from(transpixel_raw, 'base64');

const generateHash = require('../util/generateHash');
const dbhandler = require('../db/dbhandler');
const mailhandler = require('../mail/mailhandler');

router.get('/', (req, res) => {
    res.status(200).send('API is running');
});

// In any query to /img/hash.png, the hash is the path after /img/
router.get('/img/:hash', (req, res) => {
    // Respond with the base64 image as png and set the content type to image/png
    // Check whether it is a valid hash
    if (/^([0-9a-f]{32}|[0-9a-f]{64})?(\.png)$/g.test(req.params.hash)) {
        mailhandler.sendConfirmation(req.params.hash.replace(/\.png$/, ''));
        res.status(200).type('image/png').send(transpixel);
    } else {
        res.status(400).send('Invalid hash');
    }
});

router.post('/newentry', (req, res) => {
    if (req.is('application/json')) {
        if (req.body.sender && req.body.reciever && req.body.subject) {
            let mailregex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            if (mailregex.test(req.body.sender) && mailregex.test(req.body.reciever)) {
                if (req.body.subject.length <= 100) {
                    const hash = generateHash.byMaildata(req.body.sender, req.body.reciever, req.body.subject, Date.now());
                    dbhandler.addToDatabase(req.body.sender, req.body.reciever, req.body.subject, hash).then(() => {
                        res.status(200).json({"hashurl": `/api/img/${hash}.png`});
                    }).catch((err) => {
                        console.error(err);
                        res.status(500).send(err);
                    })
                } else {
                    res.status(400).send('Subject too long');
                }
            } else {
                res.status(400).send('Invalid mail');
            }
        } else {
            res.status(400).send('Missing data');
        }
    } else {
        res.status(400).send('Invalid content type');
    }
});


module.exports = router;