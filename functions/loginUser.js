'use strict';
const user=require('../models/account')

exports.login=(UserName,password)=>

   new Promise(function(resolve, reject){

    console.log("Entering into login fun");
    

    user.find({ $and: [{ "walletName": UserName}, {"password":password}] })
        .then(function(users){
            if (users) {
              
                resolve({
                    status: 200,
                    users: users[0]
                });

            } else {

                reject({
                    status: 401,
                    message: 'Invalid Credentials !'
                });
            }
        })


    });