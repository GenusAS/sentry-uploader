const find = require('find')


const findFilesToUpload = () => new Promise((resolve, reject) => {
    let filesForUpload = []
    
    find.eachfile(/(\.map$|\.js$)/, 'bundle/', function(file){

        filesForUpload.push(file)

    }).end(function(){

        resolve(filesForUpload)
        
    }).error(reject)

})

module.exports = findFilesToUpload