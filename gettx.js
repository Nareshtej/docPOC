var nem = require("nem-sdk").default;

// Create an NIS endpoint object
var endpoint = nem.model.objects.create("endpoint")("http://b1.nem.foundation", nem.model.nodes.mijinPort);

// Address we'll use in some queries
var address = "MADHELDXSCFEX6GNQUK5OQMCAVQI37KPPCMHX4WE";
var txhash;
//Get all transactions of account
function hello(){
nem.com.requests.account.transactions.all(endpoint, address,txhash).then(function(res) {
   for(let a=0;a<res.data.length-1;a++){

       var msg =res.data[a].transaction.message.payload
       var fmt = nem.utils.format.hexToUtf8(msg);
       console.log("fmt=========>>",fmt)
   txhash = (res.data[res.data.length-1].meta.hash.data)
   console.log("txhash=====>>",txhash)
   
   }
   if(res.data.length != 0){
       hello()
   }
}, function(err) {
    console.error(err);
});
}
hello()