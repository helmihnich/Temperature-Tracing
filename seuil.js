const mongoose = require("mongoose");

mongoose.connect("mongodb://127.0.0.1:27017/inpe");

const seuilSchema = ({
    seuil1: Number,
    seuil2: Number,
    seuil3: Number,
});

const Seuil = mongoose.model("seuils", seuilSchema);

const d1 = new Seuil ({
    seuil1: 4,
    seuil2: 4,
    seuil3: 4,
});

d1.save();

console.log("Data is saved you can exit");