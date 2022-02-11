const File = require('./models/file')
const connectDb = require('./config/db')
connectDb(); //connection 
const fs = require('fs');
console.log('started');
const fetchData = async () => {
    const pastDate = new Date(Date.now() - 24 * 60 * 60 * 1000)
    const files = await File.find({ createdAt: { $lt: pastDate } })
    if (files.length) {
        for (const file of files) {
            try {
                fs.unlinkSync(file.path);
                await file.remove();
                console.log(`success deleted ${file.filename}`);

            } catch (error) {
                console.log(`Error while deleting file ${error}`)
            }
        }
        console.log('Job done');
    }
}
// node scheduler 
const schedule = require('node-schedule')
const job = schedule.scheduleJob('0 0 * * *', fetchData);
module.exports = job;