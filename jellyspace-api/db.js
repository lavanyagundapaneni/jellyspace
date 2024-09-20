const {Client} =require('pg')

const client=new Client({
    host:'34.221.241.177',
    port:5432,
    database:'registration',
    user:'postgres',
    password:'sivasai',
})

client.connect((err)=>{
    if(err)
    {
        console.log("Connection Error",err.stack)
    }
    else{
        console.log("Connected")
    }
})

module.exports=client;