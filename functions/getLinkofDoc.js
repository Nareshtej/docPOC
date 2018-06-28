// const nem = require("nem-sdk").default;
const uploads = require("../models/uploaded")

exports.documentDetails = (name)=> {

    return new Promise((resolve, reject) => {

        uploads.find({"name":name}).then((result) => {
            console.log(result)

            resolve({
                status: 201,
                result: result,
               message: 'data fetched successfully',
                
            })
        })
           .catch(err =>{

                  if(err.code == 11000) {

                    return reject({
                        status: 409,
                        message: 'No documents uploaded'
                    });
                  } else {
                      console.log("error occured" + err);

                      return reject({
                          status: 500,
                          message: 'Internal Server Error!!!'
                      });
                  }
           })
    })
};