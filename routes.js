

'use strict';
var verificationDoc=require("./functions/verify");
var login=require("./functions/loginUser")
let ipfs = require('ipfs-api')({host: "localhost", port: 5001, protocol: "http"});
var fs = require('fs');
var cors = require('cors');
var multer  = require('multer')
var tmpupload = multer({ dest: '/tmp/'});
const nem = require("nem-sdk").default;
const register = require('./functions/register');
const contractJs = require('./functions/contract'); 
var users=require("./models/account")
var UploadFunction=require("./functions/upload")
var version = require("./functions/version")
var uploads=require("./models/uploaded")
var IndividualRecordSearchBlockchain= require('./functions/IndividualRecordSearchBlockchain')
const jwt = require('jsonwebtoken');
const userDetails = require('./functions/getLinkofDoc');
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

//==============version history=========
// router.post('/versionHistory', upload.single("file"), function (req, res) {
//     var documentType = req.body.DocumentType;
//     var name = req.body.name;

//    console.log("Type of document", documentType);
//    console.log("body of request", req.body);
   
//    var file = _dirname +"/images"+ "/" + req.file.originalname
//    console.log("file details:   ", file);
  
//    fs.readFile ( req.file.path, function(err, data){
//        console.log("requested file path: ", req.file.path)
  
//        var path = req.file.path;
//        ipfs.util.addFromFs(path, function(err, fileHash){
//            console.log("hash of the file", fileHash);
//            console.log(err);
//        })
//    })
// })

///=============================storing in ipfs===============================================
var response;
router.post('/file_upload', tmpupload.single("file"), function (req, res) {

    var file = __dirname +"/images"+ "/" + req.file.originalname;
    console.log("file------>>",file)
    console.log(req.body)
    var documentType=req.body.DocumentType;
    console.log("Type of document",documentType)
    var name=req.body.name;
    var seatNo= req.body.seatNo;
    var usertype=req.body.usertype;
    console.log("body=================>",req.body);
    fs.readFile( req.file.path, function (err, data) {
        console.log(" req.file.path=====>>>", req.file.path)
        var cont= req.file.path
       
        ipfs.util.addFromFs(cont, function (err, fileHash) {
        console.log("files================>",fileHash)
        console.log("error",err)
  
        UploadFunction.UploadDocuments(fileHash,documentType,name,seatNo,"Admin")
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

//============get user data including hash========                
      router.post('/getUserDetails', cors(), (req, res) => {
        var user = req.body.name
        console.log("user name", user)
        //var fileHash = req.body.fileHash; Here you are passing values from user 
        //console.log("file hash".fileHash) that values are storing in bodyparser
        userDetails.documentDetails(user)
        .then(result =>{
            res.status(result.status).json({
                message: result
            });
        })
        .catch(err => res.status(err.status).json({
            message: err.message
        }))
      });
 //=========== verifying document with the blockchain hash=========   
       router.post('/verifyDocument', cors(), (req, res) => {
         var Comparehash = req.body.hash;
         console.log("hash of document", Comparehash)
         verificationDoc.verifydoc(Comparehash)
         .then(result => {
             res.send({
                 message: "Hash verified successfullly"
             });
         })
         .catch(err => {
             res.status(err.status).json({
                 message: err.message
             })
            });
       })
//======================       
            }             
                   

    
            

        
