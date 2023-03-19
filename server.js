require('dotenv').config()
const express = require('express')
const app = express()
const bodyParser = require("body-parser");
const http = require('http');
const port = process.env.PORT || 3000;
const mongoose = require("mongoose");
const socket_io = require("socket.io")
const axios = require("axios");
var moment = require('moment'); // require

moment().format(); 

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + '/public'));
app.use(express.json())
app.set('view engine', 'ejs');
let server = http.createServer(app);
let io = socket_io(server);

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

const seuilSchema = ({
    seuil1: Number,
    seuil2: Number,
    seuil3: Number,
});

const alertSchema = ({
    alert1: String,
    alert2: String,
    alert3: String,
});

const Data = mongoose.model("datas", dataSchema);
const Data1 = mongoose.model("data1s", dataSchema);
const Data2 = mongoose.model("data2s", dataSchema);
const Seuil = mongoose.model("seuils", seuilSchema);
const Alert = mongoose.model("alerts", alertSchema);

app.get("/", function(req, res) {
    res.render("login")
});


app.post("/", function(req, res){
    if(req.body.password[0]=="inpe2022"){
        res.redirect("/home")
    }else{
        res.redirect("/");
    }
}); 


app.get("/home",async (req, res)=> {
        const last_temperature = await Data.find().sort({_id:-1}).limit(1)
        const last_temperature2 = await Data1.find().sort({_id:-1}).limit(1)
        const last_temperature3 = await Data2.find().sort({_id:-1}).limit(1)
    res.render("Home", {temperature: last_temperature[0].temperature,temperature2: last_temperature2[0].temperature,temperature3: last_temperature3[0].temperature});
});


app.get("/dashboard",async (req, res) =>{
    io.on("connection", (socket)=> {
        const today = new Date();
        let current_day = today.getFullYear()+'-'+(today.getMonth()+1).toString().padStart(2,"0")+'-'+today.getDate().toString().padStart(2,"0");
        Data.find({date:current_day}, (err,data)=>{
            let tab=[]
            let tab2=[]
            data.forEach( function(data){
                tab.push(data.temperature)
                tab2.push(data.time)
            })
            socket.emit("today",{
                temperature: tab ,
                time: tab2,
            })
        })
        socket.on("date",(message)=>{
            Data.find({date:message.text}, (err,data)=>{
            let tab=[]
            let tab2=[]
            data.forEach( function(data){
                tab.push(data.temperature)
                tab2.push(data.time)
            })
            socket.emit("chart",{
                temperature: tab ,
                time: tab2,
            })
        })
    })
    socket.on("select_value",(message)=>{
        console.log(message.text)
        if (message.text == "month"){
            socket.on("month",(message)=>{
                Data.find({month:message.text}, (err,data)=>{
                    let tab=[]
                    let tab2=[]
                    data.forEach( function(data){
                        tab.push(data.temperature)
                        a = data.date + "/" + data.time
                        tab2.push(a)
                    })

                    socket.emit("month",{
                        temperature: tab ,
                        time: tab2,
                    })
                })
            })
        } else if (message.text == "week"){
            socket.on("week",(message)=>{
                var data = message.text.substr(6)
                var dateformat = "YYYY-MM-DD";
                
                var date = moment().isoWeek(data||1).startOf("week");
                    
                var start = (date.format(dateformat));
                var date2 = date.add(7,"day")
                var end = (date2.format(dateformat));
                Data.find({date:{$gte:start,$lt:end}}, (err,data)=>{
                    let tab=[]
                    let tab2=[]
                    data.forEach( function(data){
                        tab.push(data.temperature)
                        a = data.date + "/" + data.time
                        tab2.push(a)
                    })
                    socket.emit("week",{
                        temperature: tab ,
                        time: tab2,
                    })
                })
            })
            }
        else if (message.text == "day") {
            socket.on("create_message",(message)=>{
                console.log(message.text);
                Data.find({date:message.text}, (err,data)=>{
                let tab=[]
                let tab2=[]
                data.forEach( function(data){
                    tab.push(data.temperature)
                    tab2.push(data.time)
                })
                socket.emit("day",{
                    temperature: tab ,
                    time: tab2,
                })
            })
        })
        }
    })
})
    const last_temperature = await Data.find().sort({_id:-1}).limit(1)
    const today = new Date();
    let current_day = today.getFullYear()+'-'+(today.getMonth()+1).toString().padStart(2,"0")+'-'+today.getDate().toString().padStart(2,"0");
    const data = await Data.find().sort({_id:-1}).limit(1)
    res.render("Dashboard", {database: last_temperature[0].sensor1,database2: last_temperature[0].sensor2,database3: last_temperature[0].sensor3, temperature: last_temperature[0].temperature});
});

app.get("/dashboard-2",async (req, res) =>{
        io.on("connection", (socket)=> {
            const today = new Date();
            let current_day = today.getFullYear()+'-'+(today.getMonth()+1).toString().padStart(2,"0")+'-'+today.getDate().toString().padStart(2,"0");
            Data1.find({date:current_day}, (err,data)=>{
                let tab=[]
                let tab2=[]
                data.forEach( function(data){
                    tab.push(data.temperature)
                    tab2.push(data.time)
                })
                socket.emit("today2",{
                    temperature: tab ,
                    time: tab2,
                })
            })
            socket.on("date",(message)=>{
                Data1.find({date:message.text}, (err,data)=>{
                let tab=[]
                let tab2=[]
                data.forEach( function(data){
                    tab.push(data.temperature)
                    tab2.push(data.time)
                })
                socket.emit("chart2",{
                    temperature: tab ,
                    time: tab2,
                })
            })
        })
        socket.on("select_value",(message)=>{
            console.log(message.text)
            if (message.text == "month"){
                socket.on("month",(message)=>{
                    Data1.find({month:message.text}, (err,data)=>{
                        let tab=[]
                        let tab2=[]
                        data.forEach( function(data){
                            tab.push(data.temperature)
                            a = data.date + "/" + data.time
                            tab2.push(a)
                        })
    
                        socket.emit("month2",{
                            temperature: tab ,
                            time: tab2,
                        })
                    })
                })
            } else if (message.text == "week"){
                socket.on("week",(message)=>{
                    var data = message.text.substr(6)
                    var dateformat = "YYYY-MM-DD";
                    
                    var date = moment().isoWeek(data||1).startOf("week");
                        
                    var start = (date.format(dateformat));
                    var date2 = date.add(7,"day")
                    var end = (date2.format(dateformat));
                    Data1.find({date:{$gte:start,$lt:end}}, (err,data)=>{
                        let tab=[]
                        let tab2=[]
                        data.forEach( function(data){
                            tab.push(data.temperature)
                            a = data.date + "/" + data.time
                            tab2.push(a)
                        })
                        socket.emit("week2",{
                            temperature: tab ,
                            time: tab2,
                        })
                    })
                })
                }
            else if (message.text == "day") {
                socket.on("create_message",(message)=>{
                    console.log(message.text);
                    Data1.find({date:message.text}, (err,data)=>{
                    let tab=[]
                    let tab2=[]
                    data.forEach( function(data){
                        tab.push(data.temperature)
                        tab2.push(data.time)
                    })
                    socket.emit("day2",{
                        temperature: tab ,
                        time: tab2,
                    })
                })
            })
            }
        })
    })
        const last_temperature = await Data1.find().sort({_id:-1}).limit(1)
        const today = new Date();
        let current_day = today.getFullYear()+'-'+(today.getMonth()+1).toString().padStart(2,"0")+'-'+today.getDate().toString().padStart(2,"0");
        const data = await Data1.find().sort({_id:-1}).limit(1)
        res.render("Dashboard-2", {database: last_temperature[0].sensor1,database2: last_temperature[0].sensor2,database3: last_temperature[0].sensor3, temperature: last_temperature[0].temperature});
});

app.get("/dashboard-3",async (req, res) =>{
        io.on("connection", (socket)=> {
            const today = new Date();
            let current_day = today.getFullYear()+'-'+(today.getMonth()+1).toString().padStart(2,"0")+'-'+today.getDate().toString().padStart(2,"0");
            Data2.find({date:current_day}, (err,data)=>{
                let tab=[]
                let tab2=[]
                data.forEach( function(data){
                    tab.push(data.temperature)
                    tab2.push(data.time)
                })
                socket.emit("today3",{
                    temperature: tab ,
                    time: tab2,
                })
            })
            socket.on("date",(message)=>{
                Data2.find({date:message.text}, (err,data)=>{
                let tab=[]
                let tab2=[]
                data.forEach( function(data){
                    tab.push(data.temperature)
                    tab2.push(data.time)
                })
                socket.emit("chart3",{
                    temperature: tab ,
                    time: tab2,
                })
            })
        })
        socket.on("select_value",(message)=>{
            console.log(message.text)
            if (message.text == "month"){
                socket.on("month",(message)=>{
                    Data2.find({month:message.text}, (err,data)=>{
                        let tab=[]
                        let tab2=[]
                        data.forEach( function(data){
                            tab.push(data.temperature)
                            a = data.date + "/" + data.time
                            tab2.push(a)
                        })
    
                        socket.emit("month3",{
                            temperature: tab ,
                            time: tab2,
                        })
                    })
                })
            } else if (message.text == "week"){
                socket.on("week",(message)=>{
                    var data = message.text.substr(6)
                    var dateformat = "YYYY-MM-DD";
                    
                    var date = moment().isoWeek(data||1).startOf("week");
                        
                    var start = (date.format(dateformat));
                    var date2 = date.add(7,"day")
                    var end = (date2.format(dateformat));
                    Data2.find({date:{$gte:start,$lt:end}}, (err,data)=>{
                        let tab=[]
                        let tab2=[]
                        data.forEach( function(data){
                            tab.push(data.temperature)
                            a = data.date + "/" + data.time
                            tab2.push(a)
                        })
                        socket.emit("week3",{
                            temperature: tab ,
                            time: tab2,
                        })
                    })
                })
                }
            else if (message.text == "day") {
                socket.on("create_message",(message)=>{
                    console.log(message.text);
                    Data2.find({date:message.text}, (err,data)=>{
                    let tab=[]
                    let tab2=[]
                    data.forEach( function(data){
                        tab.push(data.temperature)
                        tab2.push(data.time)
                    })
                    socket.emit("day3",{
                        temperature: tab ,
                        time: tab2,
                    })
                })
            })
            }
        })
    })
        const last_temperature = await Data2.find().sort({_id:-1}).limit(1)
        const today = new Date();
        let current_day = today.getFullYear()+'-'+(today.getMonth()+1).toString().padStart(2,"0")+'-'+today.getDate().toString().padStart(2,"0");
        const data = await Data2.find().sort({_id:-1}).limit(1)
        res.render("Dashboard-3", {database: last_temperature[0].sensor1,database2: last_temperature[0].sensor2,database3: last_temperature[0].sensor3, temperature: last_temperature[0].temperature});

});

app.get("/contact",function(req, res) {
    res.render("contact")
});

app.get('/dashboard/:id',(req,res)=>{
    res.redirect(`/${req.params.id}`)
})

app.get('/dashboard-2/:id',(req,res)=>{
    res.redirect(`/${req.params.id}`)
})

app.get('/dashboard-3/:id',(req,res)=>{
    res.redirect(`/${req.params.id}`)
})

app.get('/contact/:id',(req,res)=>{
    res.redirect(`/${req.params.id}`)
})

app.get('/settings/:id',(req,res)=>{
    res.redirect(`/${req.params.id}`)
})


app.get('/home/:id',(req,res)=>{
    res.redirect(`/${req.params.id}`)
})


app.post('/fridge_1',async (req, res) => {
    
const today = new Date();
date11 = today.getFullYear()+'-'+(today.getMonth()+1).toString().padStart(2,"0")+'-'+today.getDate().toString().padStart(2,"0");
time = today.getHours().toString().padStart(2,"0") + ":" + today.getMinutes().toString().padStart(2,"0") + ":" + today.getSeconds().toString().padStart(2,"0");
month = today.getFullYear()+"-" +(today.getMonth()+1).toString().padStart(2,"0")

    sensor_value_1_1 = parseFloat(req.body.sensor_value1_1);
    sensor_value_1_2 = parseFloat(req.body.sensor_value1_2);
    sensor_value_1_3 = parseFloat(req.body.sensor_value1_3);
    temperature_moyen_1 = parseFloat(req.body.temperature_moyen1);
    carte = req.body.carte;

    if (carte == "true"){
        const d1 = new Data ({
            sensor1: sensor_value_1_1,
            sensor2: sensor_value_1_2,
            sensor3: sensor_value_1_3,
            temperature: temperature_moyen_1,
            time: time,
            date: date11,
            month: month
        });
        
        d1.save();
    }

    var x = req.body.data;
    var y = req.body.text;
    if (y == "sent")
    {
        const d1 = new Seuil ({
            seuil1: Number(x),
        });
        d1.save()
    }
    
    
    
    const suil = await Seuil.find().sort({_id:-1}).limit(1)
    res.status(200);
	res.json(suil[0].seuil1);

});

app.post('/fridge_2',async (req, res) => {
    
    const today = new Date();
    date11 = today.getFullYear()+'-'+(today.getMonth()+1).toString().padStart(2,"0")+'-'+today.getDate().toString().padStart(2,"0");
    time = today.getHours().toString().padStart(2,"0") + ":" + today.getMinutes().toString().padStart(2,"0") + ":" + today.getSeconds().toString().padStart(2,"0");
    month = today.getFullYear()+"-" +(today.getMonth()+1).toString().padStart(2,"0")
    
        sensor_value_2_1 = parseFloat(req.body.sensor_value2_1);
        sensor_value_2_2 = parseFloat(req.body.sensor_value2_2);
        sensor_value_2_3 = parseFloat(req.body.sensor_value2_3);
        temperature_moyen_2 = parseFloat(req.body.temperature_moyen2);
        const d1 = new Data1 ({
            sensor1: sensor_value_2_1,
            sensor2: sensor_value_2_2,
            sensor3: sensor_value_2_3,
            temperature: temperature_moyen_2,
            time: time,
            date: date11,
            month: month
        });
        
        d1.save();
    
        var x = req.body.data;
        var y = req.body.text;
        if (y == "sent")
        {
            const d1 = new Seuil ({
                seuil2: x,
            });
            d1.save()
        }
        
        
        
        const suil = await Seuil.find().sort({_id:-1}).limit(1)
        res.status(200);
        res.json(suil[0].seuil2);
    
});

app.post('/fridge_3',async (req, res) => {
    
    const today = new Date();
    date11 = today.getFullYear()+'-'+(today.getMonth()+1).toString().padStart(2,"0")+'-'+today.getDate().toString().padStart(2,"0");
    time = today.getHours().toString().padStart(2,"0") + ":" + today.getMinutes().toString().padStart(2,"0") + ":" + today.getSeconds().toString().padStart(2,"0");
    month = today.getFullYear()+"-" +(today.getMonth()+1).toString().padStart(2,"0")
    
        sensor_value_3_1 = parseFloat(req.body.sensor_value3_1);
        sensor_value_3_2 = parseFloat(req.body.sensor_value3_2);
        sensor_value_3_3 = parseFloat(req.body.sensor_value3_3);
        temperature_moyen_3 = parseFloat(req.body.temperature_moyen3);
        const d1 = new Data2 ({
            sensor1: sensor_value_3_1,
            sensor2: sensor_value_3_2,
            sensor3: sensor_value_3_3,
            temperature: temperature_moyen_3,
            time: time,
            date: date11,
            month: month
        });
        
        d1.save();
    
        var x = req.body.data;
        var y = req.body.text;
        if (y == "sent")
        {
            const d1 = new Seuil ({
                seuil3: x, 
            });
            d1.save()
        }
        
        
        
        const suil = await Seuil.find().sort({_id:-1}).limit(1)
        res.status(200);
        res.json(suil[0].seuil3);
    
});
    

app.post('/buzz_esp1',async (req, res) => {
    const d6 = new Alert ({
        alert1: "alert",
    });
    d6.save()
})

app.post('/buzz_esp2',async (req, res) => {
    const d6 = new Alert ({
        alert1: "alert",
    });
    d6.save()
})
app.post('/buzz_esp3',async (req, res) => {
    const d6 = new Alert ({
        alert1: "alert",
    });
    d6.save()
})
app.post('/buzz1',async (req, res) => {
    var x = req.body.text; 
    if (x == "bzz"){
        const d6 = new Alert ({
            alert1: "stop",
        });
        d6.save()
    }
    const buzz = await Alert.find().sort({_id:-1}).limit(1)
    res.status(200);
    res.json(buzz[0].alert1)

})
app.post('/buzz2',async (req, res) => {
    var x = req.body.text; 
    if (x == "bzz"){
        const d6 = new Alert ({
            alert2: "stop",
        });
        d6.save()
    }
    const buzz = await Alert.find().sort({_id:-1}).limit(1)
    res.status(200);
    res.json(buzz[0].alert2)

})

app.post('/buzz3',async (req, res) => {
    console.log("cbon");
    var x = req.body.text; 
    if (x == "bzz"){
        const d6 = new Alert ({
            alert3: "stop",
        });
        d6.save()
    }
    const buzz = await Alert.find().sort({_id:-1}).limit(1)
    res.status(200);
    res.json(buzz[0].alert3)

})



server.listen(port, ()=>{
    console.log(`server is up on port ${port}`)
});