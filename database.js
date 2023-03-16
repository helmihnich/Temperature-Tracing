const mongoose = require("mongoose");

mongoose.connect("mongodb://127.0.0.1:27017/inpe");

const dataSchema = ({
    sensor1: Number,
    sensor2: Number,
    sensor3: Number,
    temperature: Number,
    time: String,
    date: String,
    month: String
});


/*hedhi ta3ti lwa9t wel date s7a7*/
const Data = mongoose.model("datas", dataSchema);
const Data1 = mongoose.model("data1s", dataSchema);
const Data2 = mongoose.model("data2s", dataSchema);
const today = new Date();
date1 = today.getFullYear()+'-'+(today.getMonth()+1).toString().padStart(2,"0")+'-'+today.getDate().toString().padStart(2,"0");
time = today.getHours().toString().padStart(2,"0") + ":" + today.getMinutes().toString().padStart(2,"0") + ":" + today.getSeconds().toString().padStart(2,"0");
month = (today.getMonth()+1).toString().padStart(2,"0") + "-" +today.getFullYear()



const d1 = new Data1 ({
    sensor1: 5.3,
    sensor2: 2.05,
    sensor3: -1.65,
    temperature: 984,
    time: "10:00:12",
    date: "2022-11-14",
    month: "2022-06"
});

d1.save();

const d2 = new Data ({
    sensor1: 0.1,
    sensor2: -1.5,
    sensor3: 2.65,
    temperature: 366,
    time: "10:05:12",
    date: "2022-11-14",
    month: "2022-11"
});

d2.save()

const d3 = new Data2 ({
    sensor1: -2.3,
    sensor2: 1.5,
    sensor3: -0.65,
    temperature: 545,
    time: "10:10:12",
    date: "2022-11-14",
    month: "2022-11"
});

d3.save()

console.log("Data is saved you can exit");