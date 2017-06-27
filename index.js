#!/usr/bin/env node
const request = require('request')
const program = require('commander')
const fs      = require('fs')

const sentry            = require('./functions/sentry')
const findFilesToUpload = require('./functions/findFiles')



program
    .version('0.0.1')
    .option('-s, --source [sourcefile]', 'File containing the version number')
    .option('-v, --version [versionNumber]', 'Version number of the sentry release')

program
    .command('release')
    .description('Creates a new release in sentry')
    .action(function(cmd, options){
        console.log("Running release command")

        let version
        console.log(program)
        if (program.source) {
            version = fs.readFileSync(program.source, 'utf-8')
        } else if (program.version) {
            version = program.version
        } else {
            console.log("no version file")
            return
        }

        sentry.createRelease(version)
            .catch(function(err) {
                console.log(err)
            })
    })


program
    .command('findfiles')
    .action(function(cmd, options) {
        findFilesToUpload()
    })

program
    .command('uploadsourcemap') 
    .description('Creates a new release in sentry and uploads files to it')
    .action(function(cmd, options){
        
        let version
        console.log(program)
        if (program.source) {
            version = fs.readFileSync(program.source, 'utf-8')
        } else if (program.version) {
            version = program.version
        } else {
            console.log("no version file")
            return
        }
        sentry.createRelease(version)
            .then(sentry.uploadSourceMaps)
            .catch(function(err){
                console.log(err)
            })

    })

program
    .command('delete')
    .action(function(cmd, options){

        let version
        console.log(program)
        if (program.source) {
            version = fs.readFileSync(program.source, 'utf-8')
        } else if (program.version) {
            version = program.version
        } else {
            console.log("no version file")
            return
        }

        deleteRelease(version)
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

