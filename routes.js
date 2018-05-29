

'use strict';


var fs = require('fs');
var cors = require('cors');
const nem = require("nem-sdk").default;
const register = require('./functions/register');
const contractJs = require('./functions/contract'); 
var users=require("./models/account")
//==============================================mock services========================================//
module.exports = router => {
router.post('/mock',cors(),function(req,res){
    console.log(req.body);
    res.send({message:"mock mock"})

}
)

//=================================registerUser===================================================================//
router.get('/', (req, res) => res.end('Welcome to para-ins!'));
router.post('/login', cors(),function(req,res)
{
    const UserName = req.body.FirstName;
    const password = req.body.password;
    users.find({"name":UserName}).then(results=>{
        console.log(results)
    })
    // find( { qty: { $gt: 25 } } )


})
    
router.post('/registerUser', cors(),function(req,res)
{

const walletName = req.body.walletName;
console.log("walletName==========>>>",walletName)
// Set a password
const password = req.body.password;
console.log("password==========>>>",password)
// Set a usertype
const usertype = req.body.usertype;
console.log("usertype==========>>>",usertype)
// Create PRNG wallet
const nem_id = nem.model.wallet.createPRNG(walletName, password, nem.model.network.data.mijin.id);

var endpoint =nem.model.objects.create("endpoint")("http://b1.nem.foundation", "7895");
// Create a common object
 var common = nem.model.objects.create("common")(password, "");
 console.log("common===========>>",common)

 // Get the wallet account to decrypt

var walletAccount = nem_id.accounts[0];
console.log("walletAccount===========>>",walletAccount)

 // Decrypt account private key 
 nem.crypto.helpers.passwordToPrivatekey(common, walletAccount, "pass:bip32");

 // The common object now has a private key
 console.log("my private key :"+ JSON.stringify(common.privateKey))
 const privateKey = common.privateKey;


            register.registerUser(nem_id,privateKey,walletName, password,usertype)

            .then(result => {
        
                        res.status(result.status).json({
                            message: result.message,
                            usertype:usertype
                           
                          
                        });
    
                    })
                    .catch(err => res.status(err.status).json({message: err.message}).json({status: err.status}));
            
        });
        
//=============================================create discharge summary==============================================================//
        router.post('/createContract', cors(),function(req,res){

        var conditions =req.body.patientData;
        console.log("body=================>",req.body)
                        var HospitalName=req.body.HospitalName;
                        var submitID=req.body.SubmitId;
                        var status = req.body.status;
                        var TotalClaimedAmount=req.body.TotalClaimedAmount
         
             contractJs.createContract(conditions,HospitalName,submitID,status,TotalClaimedAmount)
             .then(result => {
                
        
                        res.status(result.status).json({
                            message: result.message
                          
                        });
    
                    })
                    .catch(err => res.status(err.status).json({
                        message: err.message
                    }))
                });

            }               
                   

    
            

        
