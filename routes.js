

'use strict';
var login=require("./functions/loginUser")
let ipfs = require('ipfs-api')({host: "localhost", port: 5001, protocol: "http"});
var fs = require('fs');
var cors = require('cors');
var multer  = require('multer')
var upload = multer({ dest: '/tmp/'});
const nem = require("nem-sdk").default;
const register = require('./functions/register');
const contractJs = require('./functions/contract'); 
var users=require("./models/account")
var UploadFunction=require("./functions/upload")
var uploads=require("./models/uploaded")
var IndividualRecordSearchBlockchain= require('./functions/IndividualRecordSearchBlockchain')
const jwt = require('jsonwebtoken');
//==============================================mock services========================================//
module.exports = router => {
router.post('/mock',cors(),function(req,res){
    console.log(req.body);
    res.send({message:"mock mock"})

}
)
//=============================All ipfs hosted file=========================
router.post('/Get',(req,res)=>{
    // var DocumentCategory=req.body.DocumentType;
    IndividualRecordSearchBlockchain.history().then(result=>{
        console.log("Individual of result",result);
        res.status(result.status).json({
            history:result.message 
        });

    })

    





})



///=============================storing in ipfs===============================================
var response;
var usertype;
router.post('/file_upload', upload.single("file"), function (req, res) {
   var documentType=req.body.DocumentType;
   var name=req.body.name;
//    var usertype=req.body.usertype;

    console.log("Type of document",documentType)
    console.log("body=================>",req.body);
    var file = __dirname +"/images"+ "/" + req.file.originalname;
    console.log("file------>>",file)
    fs.readFile( req.file.path, function (err, data) {
        console.log(" req.file.path=====>>>", req.file.path)
        var cont= req.file.path
        ipfs.util.addFromFs(cont, function (err, fileHash) {
        console.log("files================>",fileHash)
        console.log(err)
  
        UploadFunction.UploadDocuments(fileHash,documentType,name,"Admin")
        .then(result=>{
          res.send({
              status:201,
              path:file,
              result:result.Documents

        })
    
    });
  
    })
          })
         
   });







//==================================================================================//
router.post('/render',function(req,resp){
   var file=req.body.fileData
   resp.send({
       "file":file
   })
    });
//=================================registerUser===================================================================//
router.get('/', (req, res) => res.end('Welcome to para-ins!'));

router.post('/login', cors(),function(req,res)
{
    const UserName = req.body.walletName;
    const password = req.body.password;
  
    login
            .login(UserName, password)
            .then(result => {   
                console.log("result ===>>>",result)

                const token = jwt.sign(result,"Rpqb@123", {
                    expiresIn: 60000000000
                })


                res.status(result.status).json({
                    "message": "Login Successful",
                    "status": true,
                     token:token,
                    "usertype":result.users.usertype,
                   
                });
    
              

            })
            .catch(err => res.status(err.status).json({
                message: err.message
            }).json({
                status: err.status
            }));

    


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
                   

    
            

        
