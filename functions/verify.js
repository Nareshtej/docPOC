'use strict';


//const user = require('../models/account');
const uploads = require("../models/uploaded")
const nem = require("nem-sdk").default;
exports.verifydoc = (Comparehash) =>{
console.log("provided for verify hash", Comparehash);

//creating end point
var endpoint = nem.model.objects.create("endpoint")("http://b1.nem.foundation", "7895")
 //creating a common object holding key
var common = nem.model.objects.create("common")("1234", "");
console.log("connected")
// getting nem account data
var get = nem.com.requests.account.data(endpoint, "MBIOMNZP3PREFD3HAJGYEIVQ6GNZ4GRQP53CERHP").then({
        

});




return new Promise((resolve, reject) => {
       uploads.find({"filesHash":Comparehash}).then(result=>{
             console.log("db data",result)
            // if (filehash == Comparehash){

                resolve({
                    status: 200,
                    message:"success"
                });

            // }
            })
           })
       
        };