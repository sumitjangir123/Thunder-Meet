const env= require('./environment');
const fs= require('fs');
const path= require('path');

module.exports = (app) => {
        app.locals.assetPath= function(filePath){
            if(env.name=='development'){
                if(filePath.split('.').pop()=="mp4"){
                    console.log('/images' + filePath.split('/').pop());
                    return '/images/' + filePath.split('/').pop();
                }
                if(filePath.split('.').pop()=="ogg"){
                    console.log(filePath);
                    return '/images' + filePath.split('/').pop();
                }
                return '/' + filePath;
            }
            
            if(filePath.split('.').pop()=="mp4"){
                console.log(filePath);
                return '/' + filePath;
            }
            if(filePath.split('.').pop()=="ogg"){
                console.log(filePath);
                return '/' + filePath;
            }
            return '/' + JSON.parse(fs.readFileSync(path.join(__dirname,'../public/assets/rev-manifest.json')))[filePath];
        }
}