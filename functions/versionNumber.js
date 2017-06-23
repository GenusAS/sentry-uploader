const program = require('commander')
const request = require('request')

/**
 * Will call the version service to require about the latest version number of a given branch.
 * @param {*} callback 
 */
const getVersionNumber = (branch) => new Promise((resolve, reject) => {
    console.log("Getting version number from version service")

    
    let url = 'http://gitlab.genus.net:3000/builder/24/?branch='+branch
    
    console.log("URL: ", url)

    request(url,  function(error, response, body) {
        if (error) {
            console.log('ERROR')
            reject()
            throw new Error(error)
        }
        const result = JSON.parse(body)
        
        if (result.err) {
            reject()
            throw new Error(result.err)
        }

        console.log(result.version)
        resolve(result.version)
    })

})

module.exports = getVersionNumber