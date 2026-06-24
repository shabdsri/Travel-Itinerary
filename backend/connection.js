const mongoose = require('mongoose');
const dns = require("node:dns/promises");
dns.setServers(["1.1.1.1", "8.8.8.8"]);

const url = "mongodb+srv://shabd:setup123@cluster0.kuaiyhp.mongodb.net/mydb?appName=Cluster0"

mongoose.connect(url)

.then((result) => {
    console.log("DataBase Connected");
})
.catch((err) => {
    console.log(err);
});