const fs = require("fs");
const http = require("http");
const requests = require("requests");
const homeFile = fs.readFileSync("index.html", "utf-8");
const replaceVal = (temData, orgiData) => {
    let data = temData.replace("{%location%}", orgiData.name);
    data = data.replace("{%country%}", orgiData.sys.country);
    data = data.replace("{%tempval%}", orgiData.main.temp);
    data = data.replace("{%tempmax%}", orgiData.main.temp_max);
    data = data.replace("{%tempmin%}", orgiData.main.temp_min);
    data = data.replace("{%dayStatus%}", orgiData.weather[0].main);
    return data;
}
// console.log(replaceVal)
const server = http.createServer((req, res) => {
    if (req.url == "/") {
        requests('http://api.openweathermap.org/data/2.5/weather?q=Osaka&appid=4b95e03c80f66e11f9c1d5100f000705')
            .on('data', (chunk) => {
                const objdata = JSON.parse(chunk);
                const arydata = new Array(objdata);
                const realTimeData = arydata.map((val) => {
                    val.main.temp = Math.round((val.main.temp - 273.15) * 100) / 100;
                    val.main.temp_max = Math.round((val.main.temp_max - 273.15) * 100) / 100;
                    val.main.temp_min = Math.round((val.main.temp_min - 273.15) * 100) / 100;
                    return replaceVal(homeFile, val)
                }).join("");
                res.write(realTimeData);
                // console.log(realTimeData)
            })
            .on('end', (err) => {
                if (err) return console.log('connection closed due to errors', err);
                res.end();
                // console.log('end');
            });
    }
})
server.listen(8080, "127.0.0.1");
