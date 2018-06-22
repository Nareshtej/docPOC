const nem = require("nem-sdk").default;
const crypto= require("crypto");
const uploads=require("../models/uploaded")


exports.history=()=>{
    // Create an NIS endpoint object
var endpoint = nem.model.objects.create("endpoint")("http://b1.nem.foundation", nem.model.nodes.mijinPort);

// Address we'll use in some queries
var address = "MCDJYXQWCRFJUBUZK5QGIWUFSB3GLZW4VKAC72QM";
var txhash;
    // console.log(DocumentCategory)
    return new Promise(async(resolve,reject)=>{
    var historyArray=[];
    // let results= await uploads.find({"DocumentType":DocumentCategory})
    // console.log(results)
    // var str=(JSON.stringify(results));
    // console.log("str=========================>",str);
   var store=await nem.com.requests.account.transactions.all(endpoint, address,txhash).then(function(res) {
        for(var a=0;a<res.data.length-1;a++){
     
            var msg =res.data[a].transaction.message.payload
            var fmt = nem.utils.format.hexToUtf8(msg);
            console.log(fmt)
        txhash = (res.data[res.data.length-1].meta.hash.data)
        console.log("array inside s=============>>",historyArray.push(fmt))
        }
       if(a==res.data.length-1){
            return resolve({"status":200,
            "message":historyArray})
        }

   })
   
  
   //Get all transactions of account
//    function hello(){
//     nem.com.requests.account.transactions.all(endpoint, address,txhash).then(function(res) {
//        for(let a=0;a<res.data.length-1;a++){
    
//            var msg =res.data[a].transaction.message.payload
//            var fmt = nem.utils.format.hexToUtf8(msg);
//            console.log(fmt)
//        txhash = (res.data[res.data.length-1].meta.hash.data)
//        }
//        if(res.data.length != 0){
//            hello()
//        }
//     },
//  function(err) {
//          console.error(err);
//      });
//     }  
})  
}
