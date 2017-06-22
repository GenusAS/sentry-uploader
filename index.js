#!/usr/bin/env node
var request = require('request')
var program = require('commander')
var fs      = require('fs')
var find    = require('find')


const sentryToken = process.env.SENTRY_TOKEN 
const auth = 'Bearer ' + sentryToken
const baseUrl = 'https://sentry.io/api/0/projects/'
const project = 'analysis-viewer'
const organization = 'genus-as'
const sentryUrl = baseUrl + organization + '/' + project + '/releases/'


program
    .version('0.0.1')
    .option('-b, --branch [branch]', 'Git branch')

program
    .command('release')
    .description('Creates a new release in sentry')
    .action(function(cmd, options){
        console.log("Running release command")

        createRelease()
    })

program
    .command('versionNumber')
    .description("Prints the version number of the given branch")
    .action(function(cmd, options) {
        

        getVersionNumber()
    })

program
    .command('findfiles')
    .action(function(cmd, options) {
        findFilesToUpload()
    })

program
    .command('uploadsourcemap') 
    .action(function(cmd, options){

        createAndUpload()

    })

program
    .command('delete')
    .option('-r, --release [version number]', 'Version number of release to delete ')
    .action(function(cmd, options){

        let versionNumber = cmd.release
        console.log(versionNumber)
        deleteRelease(versionNumber)
    })


program.parse(process.argv)



function getVersionNumber(callback) {
    console.log("Getting version number from version service")

    let branch = program.branch || process.env.CI_COMMIT_REF_NAME || 'develop'
    let url = 'http://gitlab.genus.net:3000/builder/24/?branch='+branch
    
    console.log(url)

    request(url,  function(error, response, body) {
        if (error) {
            console.log('ERROR')
            throw new Error(error)
        }
        var result = JSON.parse(body)
        
        if (result.err) {
            throw new Error(result.err)
        }

        callback && callback(result.version)
    })
}

function createRelease(callback){
    console.log("Creating release")
    getVersionNumber(function(versionNumber){

        console.log("   with release number" + versionNumber)

        let options = {
                url: sentryUrl,
                method: 'POST',
                headers: {
                    'Authorization': auth,
                    'Content-Type': 'application/json',
                },
                body: '{"version": "'+versionNumber+'"}',
            }
        

        request(
            options,
            function(error, response, body) {
                console.log('error:', error) // Print the error if one occurred
                console.log('statusCode:', response && response.statusCode) // Print the response status code if a response was received
                console.log('body:', body) // Print the HTML for the Google homepage.

                callback && callback(versionNumber)
            }
        )
    })
}

function findFilesToUpload(callback) {
    let filesForUpload = []
    find.eachfile(/(\.map$|\.js$)/, './bundle', function(file){
        console.log(file)
        filesForUpload.push(file)
        console.log(filesForUpload)
    }).end(function(){
        console.log(filesForUpload)
        callback && callback(filesForUpload)
    })
}

function uploadSourceMaps(versionNumber) {
    

    
    let files = findFilesToUpload(function(files) {

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


function createAndUpload() {

    createRelease(uploadSourceMaps)
}

function deleteRelease(versionNumber) {

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