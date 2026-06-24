const { model, Schema } = require('mongoose')

const mySchema = new Schema({
    product : { type: String, required: true, unique: true  },
    brand: { type: String, required: true},
    price: { type: Number } ,
    category : { type : String}

},

    { timestamps: true });

module.exports = model('products', mySchema)
