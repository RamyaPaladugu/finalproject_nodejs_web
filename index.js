const http = require('http');
const path = require('path');
const fs= require("fs");
const { emitWarning } = require('process');
const cors = require('cors')
const {MongoClient} = require('mongodb');



const server = http.createServer((req, res)=> {
    console.log(req.url)
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST')
    if(req.url == "/") {
        fs.readFile(path.join(__dirname, 'public', 'resumePage.html'), 
        (err, content)=> {
            if(err) throw err;
            res.writeHead(200, {'Content-Type': 'text/html'}); 
            res.end(content, 'utf-8');
        })
    }
    else if (req.url == "/api") {
    
        async function main(){
            /**
             * Connection URI. Update <username>, <password>, and <your-cluster-url> to reflect your cluster.
             * See https://docs.mongodb.com/ecosystem/drivers/node/ for more details
             */
            const uri ="mongodb+srv://rpala3:Mongoproject@cluster0.nsnp4gc.mongodb.net/iphonecollection?retryWrites=true&w=majority";
         
        
            const client = new MongoClient(uri);
         
            try {
                await client.connect();
                console.log("connected")
                await getIphoneData(client);
         
            } catch (e) {
                console.error(e);
            } finally {
                await client.close();
            }
        }
        
        main().catch(console.error);
        
        
        async function getIphoneData(client ){
            const cursor = client.db("iphonecollection").collection("iphone").find({});
            const results = await cursor.toArray();
            const js= (JSON.stringify(results));
            console.log(js);
            res.setHeader('Content-Type','application/json')
            res.writeHead(200, { 'Content-Type': 'application/json' })
            res.end(js);
        
        };
        
    }
    else {
        fs.readFile(path.join(__dirname, 'public', '404.html'), 
        (err, content)=> {
            if(err) throw err;
            res.writeHead(200, {'Content-Type': 'text/html'});
            res.end(content, 'utf-8');
        })
    }
        


});

const PORT = process.env.PORT || 3336;
server.listen(PORT, ()=> console.log(`The server is running at ${PORT}`));