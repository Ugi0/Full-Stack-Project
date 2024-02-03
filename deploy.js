const Client = require("ssh2-sftp-client");
const fs = require("fs");
const sftpconfig = require("./sftp.json");

const sftp = new Client();
const options = {
    host: sftpconfig.host,
    port: sftpconfig.port,
    username: sftpconfig.username,
    passphrase: sftpconfig.passphrase,
    privateKey: fs.readFileSync(sftpconfig.privateKey),
};
async function exec(){
    console.log(`Forming SFTP connection to: ${sftpconfig.username}@${sftpconfig.host}:${sftpconfig.port}`);
    try {
        await sftp.connect(options);
        console.log("Connected!\n");
        const promises = [];
        promises.push(sftp.uploadDir(`./my-app/react_build`,`./react_build`))
        promises.push(sftp.put(`./my-app/servePage.js`,`./servePage.js`))
        fs.readdir("./backend/backend_build",(e,files)=> { //Handle uploading the backend files
            files.filter(x => x.endsWith(".js")).forEach(async filename => {
                promises.push(sftp.put(`${__dirname}/backend/backend_build/${filename}`,`./backend_build/${filename}`));
            });
            files.filter(x => !x.split("").includes(".")).forEach(async foldername => {
                promises.push(sftp.uploadDir(`${__dirname}/backend/backend_build/${foldername}`,`./backend_build/${foldername}`));
            });
            Promise.all(promises).then(()=>{
                sftp.end();
            });
        });
    } catch(e){
        console.error(e);
    }
}

exec();