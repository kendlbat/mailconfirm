const mailSchema = require('./mailschema');
const mongoose = require('mongoose');

async function addToDatabase(sender, reciever, subject, hash) {
    const mail = new mailSchema({
        sender: sender,
        reciever: reciever,
        hash: hash,
        subject: subject,
        time: new Date()
    });
    await mail.save();
}

async function getByHash(hash) {
    const mail = await mailSchema.findOne({hash: hash});
    return mail;
}

async function removeByHash(hash) {
    await mailSchema.deleteOne({hash: hash});
}

async function getBySender(sender) {
    const mail = await mailSchema.find({sender: sender});
    return mail;
}

async function connectToDatabase() {
    mongoose.connect(process.env.DB_URL || "mongodb://localhost/mailconfirm", {useNewUrlParser: true});
}

async function clearDatabase() {
    await mailSchema.deleteMany({});
}

module.exports = {
    addToDatabase,
    getByHash,
    removeByHash,
    getBySender,
    connectToDatabase,
    clearDatabase
}