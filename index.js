#!/usr/bin/env node
const request = require('request')
const program = require('commander')
const fs      = require('fs')

const getVersionNumber  = require('./functions/versionNumber')
const sentry            = require('./functions/sentry')
const findFilesToUpload = require('./functions/findFiles')



program
    .version('0.0.1')
    .option('-b, --branch [branch]', 'Git branch')

program
    .command('release')
    .description('Creates a new release in sentry')
    .action(function(cmd, options){
        console.log("Running release command")

        let branch = program.branch || process.env.CI_COMMIT_REF_NAME
        console.log(branch)
        getVersionNumber(branch)
        .then(sentry.createRelease)
        .catch(function(err) {
            console.log(err)
        })
    })

program
    .command('versionnumber')
    .description("Prints the version number of the given branch")
    .action(function(cmd, options) {
        
        let branch = program.branch || process.env.CI_COMMIT_REF_NAME
        getVersionNumber(branch)
    })

program
    .command('findfiles')
    .action(function(cmd, options) {
        findFilesToUpload(__dirname)
    })

program
    .command('uploadsourcemap') 
    .action(function(cmd, options){
        let branch = program.branch || process.env.CI_COMMIT_REF_NAME

        getVersionNumber(branch)
            .then(sentry.createRelease)
            .then(sentry.uploadSourceMaps)
            .catch(function(err){
                console.log(err)
            })

    })

program
    .command('delete')
    .option('-r, --release [version number]', 'Version number of release to delete ')
    .action(function(cmd, options){

        let versionNumber = cmd.release
        console.log(versionNumber)
        deleteRelease(versionNumber)
    })


program
    .command('test')
    .action(function(cmd, options) {
        console.log('test')

        const testPromise = (a, b) => new Promise((resolve, reject) => {
            console.log("a", a)
            console.log("b", b)
            resolve(a)    
        })

        testPromise("hei", "hallo").then(function(a){console.log("yo", a)})
    })

program.parse(process.argv)

