'use strict';
const nem = require("nem-sdk").default;
const uploads=require("../models/uploaded")
const crypto= require("crypto");
var AddressProvider1="MBIOMNZP3PREFD3HAJGYEIVQ6GNZ4GRQP53CERHP"
var AddressProvider2="MDG2VZA2FBYDTRFN3I3BWRVDMDMIYJ4CIW3MOTMS"

var filesHash;
var DocumentType;
var name;
var seatNo;
var usertype;
var created_at;
exports.UploadDocuments = (filesHash,documentType,name,seatNo,usertype) =>
console.log("seatNo: seatNo",seatNo)
    new Promise(async(resolve, reject) => {
        const Documents = new uploads({
           filesHash :filesHash,
           documentType:DocumentType,
           name:name,
           seatNo: seatNo,
           usertype:usertype,
           created_at: new Date()
           });
        console.log("Document========>>>>>",Documents)
        
        var endpoint =nem.model.objects.create("endpoint")("http://b1.nem.foundation", "7895");    
        // Create a common object holding key
        var common = nem.model.objects.create("common")("123","df80a6ccf1f539be59b5621605399b559e2dcde5eaef01272f9277775b4deeeb");
       console.log("print", filesHash);
        // Create an un-prepared transfer transaction object
        var Transfer={
        "ContentHash":filesHash[0].hash,
        "Document":documentType,
        "name":name,
        "seatNo": seatNo,
         "created_at": new Date(),

        }
        var TransferObject=JSON.stringify(Transfer)
        var transferTransaction = nem.model.objects.create("transferTransaction")(AddressProvider2, 0,TransferObject );
        // Prepare the transfer transaction object
        var transactionEntity = nem.model.transactions.prepare("transferTransaction")(common, transferTransaction, nem.model.network.data.mijin.id);
        
        //Serialize transfer transaction and announce
        var ee= await nem.model.transactions.send(common, transactionEntity, endpoint)
        console.log(ee.transactionHash.data)
        Documents.save()
            .then(() => resolve({
                status: 200,
                usertype:usertype,
                message: "saved hash success",
                Documents:Documents,
                name:name,
                seatNo: seatNo

              
            }))

            .catch(err => {

                if (err.code == 11000) {

                    reject({
                        status: 409,
                        message: ' Already uploaded !'
                    });

                } else {

                    reject({
                        status: 500,
                        message: 'upload !'
                    });
                }
            });
    });
    