const assert = require('assert')
const findFilesToUpload = require('../functions/findFiles')

describe('findFiles', function(){
    describe('findFilesToUpload', function() {

        it('Should resolve its promise with an array as input parameter', function(){
            return findFilesToUpload().then(function(files){

                assert.equal(Array.isArray(files), true)

            })
        })
    })
})