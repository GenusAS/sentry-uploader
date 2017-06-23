const find = require('find')


function findFilesToUpload(rootDir, callback) {
    let filesForUpload = []
    
    find.eachfile(/(\.map$|\.js$)/, 'bundle/', function(file){
        filesForUpload.push(file)
    }).end(function(){
        console.log("Found files: ", filesForUpload)
        callback && callback(filesForUpload)
    })
}

module.exports = findFilesToUpload