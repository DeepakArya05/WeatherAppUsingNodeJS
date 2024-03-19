const http=require('http');
const fs=require('fs');
var requests=require('requests');
const { json } = require('stream/consumers');
const homeFile=fs.readFileSync("home.html","utf-8");

const replaceVal=(tempVal,orgVal)=>{
    // console.log(orgVal);
    let temperature=tempVal.replace("{%tempval%}",orgVal.current.temperature_2m);
    temperature=temperature.replace("{%tempmin%}",orgVal.daily.temperature_2m_min[0]);
    temperature=temperature.replace("{%tempmax%}",orgVal.daily.temperature_2m_max[0]);
    return temperature;
};

const server=http.createServer((req,res)=>{
    if(req.url=="/"){
        requests('https://api.open-meteo.com/v1/forecast?latitude=26.8393&longitude=80.9231&current=temperature_2m,is_day&hourly=apparent_temperature&daily=temperature_2m_max,temperature_2m_min&timezone=auto&forecast_days=1')
        
        .on('data', (chunk)=> {
            // console.log(chunk);//API Data
            const objdata=JSON.parse(chunk);
            const arrData=[objdata];//Converted to Object
            console.log(arrData[0]) ;//Object Data
            const realTimeData=arrData.map(val=>replaceVal(homeFile,val));
            // console.log(realTimeData);
             res.write(realTimeData.toString());
        })
        .on('end', function (err) {
        if (err) return console.log('connection closed due to errors', err);
        res.end();
        console.log('end');
    });
    }
});

server.listen(8000,"127.0.0.1",()=>
{
    console.log("listening to  the port no 8000");
});