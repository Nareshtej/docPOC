'use strict';
const nem = require("nem-sdk").default;
const uploads=require("../models/uploaded")


exports.UploadDocuments = (filesHash,usertype) =>

    new Promise(async(resolve, reject) => {
    
        // let result= await  patientData.find({status:"initiated"})
        // console.log("result===============================+>",result)

        const Documents = new uploads({
           filesHash:filesHash,
           usertype:usertype,
           created_at: new Date(),
           });
        console.log("Document========>>>>>",Documents)
        var endpoint =nem.model.objects.create("endpoint")("http://b1.nem.foundation", "7895");    
        // Create a common object holding key
        var common = nem.model.objects.create("common")("","df80a6ccf1f539be59b5621605399b559e2dcde5eaef01272f9277775b4deeeb");
        
        // Create an un-prepared transfer transaction object


        var transferTransaction = nem.model.objects.create("transferTransaction")("MANWHVH3PUUHVZUJ7XIWDMAWWGBCLICWVLFQ4RNP", 0,filesHash[0].hash);
        // Prepare the transfer transaction object
        var transactionEntity = nem.model.transactions.prepare("transferTransaction")(common, transferTransaction, nem.model.network.data.mijin.id);
        
        //Serialize transfer transaction and announce
        var ee= await nem.model.transactions.send(common, transactionEntity, endpoint)
        console.log(ee)
        Documents.save()
            .then(() => resolve({
                status: 200,
                usertype:usertype,
                message: "saved hash sucess",
                Documents:Documents
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
    