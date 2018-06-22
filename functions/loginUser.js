'use strict';
const user=require('../models/account')

exports.login=(UserName,password)=>

   new Promise(function(resolve, reject){

    console.log("Entering into login fun");
    

    user.find({ $and: [{ "walletName": UserName}, {"password":password}] })
        .then(function(users){
            console.log("resopdksepksd===========>",users)
            if (users.length!=0){
              
                resolve({
                    status: 200,
                    users: users[0]
                });

            } else if(users.length==0) {

                reject({
                    status: 401,
                    message: 'Invalid Credentials !'
                });
            }
        })


    });