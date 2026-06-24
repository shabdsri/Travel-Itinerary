const express = require('express');
const Model = require('../models/productModel');

const router = express.Router();

router.post( '/add', (req,res) =>{
    console.log(req.body);

    new Model(req.body).save()
    .then((result) =>{
        res.status(200).json(result);
    })
    .catch((err) =>{
        console.log(err);
        res.status(200).json(err);
    })
    
    // res.send('response from user add');

});

router.get( '/getall', (req,res) =>{
    Model.find()
    .then((result) =>{
        res.status(200).json(result);
    })
    .catch((err) =>{
        console.log(err);
        res.status(200).json(err);
    })

});

router.put( '/update/:id', (req,res) =>{
     Model.findByIdAndUpdate(req.params.id , req.body, {new : true})
      .then((result) =>{
            res.status(200).json(result);
        })
        .catch((err) =>{
            console.log(err);
            res.status(200).json(err);
        })

});

router.delete( '/delete/:id', (req,res) =>{
    Model.findByIdAndDelete(req.params.id , req.body, {new : true})
      .then((result) =>{
            res.status(200).json(result);
        })
        .catch((err) =>{
            console.log(err);
            res.status(200).json(err);
        })

});


module.exports = router;