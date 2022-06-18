const express = require('express');
const app = express();
const bodyparser = require('body-parser');

const apirouter = require('./api/apirouter');
const dbhandler = require('./db/dbhandler');
const mailschema = require('./db/mailschema');

const argv = require('yargs').argv;
const clearDB = argv.cleardb || false;


app.use(bodyparser.json());
app.use('/api', apirouter);
app.use(express.static('public'));

// Connect to database
dbhandler.connectToDatabase().then(() => {
    console.log('Connected to database');
    if (clearDB) {
        dbhandler.clearDatabase().then(() => {
            console.log('Database cleared');
        });
    }
}).catch((err) => {
    console.error(err);
});


/* setInterval(() => {
    dbhandler.getAll().then((mails) => {
        mails.forEach((mail) => {
            if (mail.time.getTime() < Date.now() - 1000 * 60 * 60 * 24 * 365) {
                dbhandler.deleteFromDatabase(mail.id).then(() => {
                    console.log(`Deleted mail with id ${mail.id}`);
                }).catch((err) => {
                    console.error(err);
                });
            }
        });
    }).catch((err) => {
        console.error(err);
    });
}, 1000 * 60 * 60 * 24); */

// Listen at 3000
app.listen(3000, () => {
    console.log('Server is running on port 3000');
});