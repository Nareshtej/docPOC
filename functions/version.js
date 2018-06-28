'use strict'

const nem = require("nem-sdk").default;
const uploads = require("./models/uploads")
const crypto = require("crypto")


exports.versionHistory = (filesHash,documentType,name,usertype)
 
    new Promise(async(resolve, reject) =>{
        const Document = new uploads({
            filesHash: filesHash,
            DocumentType: documentType,
            name: name,
            usertype: usertype,
            modified_at: modified_at
        });
    console.log("Document========>>>>>",Documents)

    var endpoint = nem.model.objects.create("endpoint")("http://b1.nem.foundation", "7895"); 
     // Create a common object holding key
     var common = nem.model.objects.create("common")("123","df80a6ccf1f539be59b5621605399b559e2dcde5eaef01272f9277775b4deeeb");
       
     // Create an un-prepared transfer transaction object
        var Transfer={
            "ContentHash":filesHash[0].hash,
            "Document":documentType,
            "name":name,
            modified_at: new Date()
            } 
            uploads.find({"name":name}) 
            var TransferObject=JSON.stringify(Transfer)
            var transferTransaction = nem.model.objects.create("transferTransaction")(AddressProvider2, 0,TransferObject ); 
            console.log(ee.transactionHash.data)
            Documents.save()
                .then(() => resolve({
                    status: 200,
                    usertype:usertype,
                    message: "saved hash success",
                    Documents:Documents,
                    name:name
                  
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
        

