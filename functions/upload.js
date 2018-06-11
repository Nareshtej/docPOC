'use strict';

const uploads=require("../models/uploaded")


exports.UploadDocuments = (filesHash,usertype) =>

    new Promise((resolve, reject) => {
    
        // let result= await  patientData.find({status:"initiated"})
        // console.log("result===============================+>",result)

        const Document = new uploads({
           filesHash:filesHash,
           usertype:usertype,
           created_at: new Date(),
           });
        console.log("Document========>>>>>",Document)
        // var endpoint =nem.model.objects.create("endpoint")("http://b1.nem.foundation", "7895");    
        // Create a common object holding key
        // var common = nem.model.objects.create("common")("123","cf07b9b0d72a0320aea551c67e994729284b044dd7f9ccea9612762f4e988d4e");
        
        // Create an un-prepared transfer transaction object
       
        // var transferTransaction = nem.model.objects.create("transferTransaction")(addressofProvider2, 0,string);
        // Prepare the transfer transaction object
        // var transactionEntity = nem.model.transactions.prepare("transferTransaction")(common, transferTransaction, nem.model.network.data.mijin.id);
        
        //Serialize transfer transaction and announce
        //   var ee=nem.model.transactions.send(common, transactionEntity, endpoint)
          Document.save()
            .then(() => resolve({
                status: 200,
                usertype:usertype,
                message: "saved hash sucessfully"
            }))

            .catch(err => {

                if (err.code == 11000) {

                    reject({
                        status: 409,
                        message: 'User Already Registered !'
                    });

                } else {

                    reject({
                        status: 500,
                        message: 'Please Register !'
                    });
                }
            });
    });
    