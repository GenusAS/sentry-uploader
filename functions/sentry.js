const fs      = require('fs')
const request = require('request')

const findFilesToUpload = require('./findFiles')


const sentryToken = process.env.SENTRY_TOKEN 
const auth = 'Bearer ' + sentryToken
const baseUrl = 'https://sentry.io/api/0/projects/'
const project = 'analysis-viewer'
const organization = 'genus-as'
const sentryUrl = baseUrl + organization + '/' + project + '/releases/'

/**
 * Will create a release in sentry with the version number of the given branch
 */
exports.createRelease = (versionNumber) => new Promise((resolve, reject) => {

    console.log("Creating release")
    console.log("   with release number " + versionNumber)

    let options = {
            url: sentryUrl,
            method: 'POST',
            headers: {
                'Authorization': auth,
                'Content-Type': 'application/json',
            },
            body: '{"version": "' + versionNumber + '"}',
        }
    

    request(
        options,
        function(error, response, body) {
            if (error ) {
                console.log('ERROR')
                reject()
            }

            resolve(versionNumber)
        }
    )

})
    

exports.uploadSourceMaps = function(versionNumber) {
    console.log("Uploading source maps")
    
    let files = findFilesToUpload()
        .then(function(files) {

            let url = sentryUrl + versionNumber+'/files/'
        
            files.forEach(file => {
                let fileName = "~/"+file.replace(/\\/g, "/")
                request(
                    {
                        url: url,
                        method: 'POST',
                        headers: {
                            'Authorization': auth
                        },
                        formData: {
                            name: fileName,
                            file: fs.createReadStream(file)
                        }
                    },  function(error, response, body) {
                        console.log('error:', error) // Print the error if one occurred
                        console.log('statusCode:', response && response.statusCode) // Print the response status code if a response was received
                        console.log('body:', body) // Print the HTML for the Google homepage.

                    }
                )
            })
        })
}


exports.deleteRelease = function(versionNumber) {

    let url = sentryUrl + versionNumber +'/'
    console.log(url)
    let options = {
        url: url,
        method: 'DELETE',
        headers: {
            'Authorization': auth
        },
    }
    

    request(
        options,
        function(error, response, body) {
            console.log('error:', error) // Print the error if one occurred
            console.log('statusCode:', response && response.statusCode) // Print the response status code if a response was received
            console.log('body:', body) // Print the HTML for the Google homepage.

        }
    )
}