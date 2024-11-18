


var net = require('net');
var TrackerController = require('./controller/TrackerController');
var OmejeBuffer = require('./controller/OmejeBuffer');
var ApiController = require('./controller/ApiController');
var DataDecoder = require('./controller/DataDecoder.js');

/*Device heads*/
var serverHead = "4040";
var deviceHead = "2424";
/*End communication Heads*/


var serverHead = 40;
var serverTail = 41;
/*Device Commands*/
var gprsPacket = 0x52;
/*End Device Commands*/







var deviceClents = [];



/*setInterval(()=>{
    
    ApiController.checkActiveGenDevices().then(myresponse=>{
          //console.log(myresponse);
          
          console.log('Checking devices to off');
    }).catch(err=>{
          console.log(err);
    })
    
},10000);*/

var server = net.createServer(function(connection) {
    console.log('new connection');
    
    connection.on('error', function(error){
         console.log(error);
    });

    connection.on('data', async function(data) {

        var tData = new Buffer.from(data);
        var dHead = tData.slice(0,2);
        var imei = tData.slice(2,9);
        var command = tData.slice(9,10);
        var commandA = OmejeBuffer.toArray(command);
        var length = tData.slice(10,12);
        var lengthA = OmejeBuffer.toArray(length);
        var dataLength = ((lengthA[0] << 8) & 0xFF) |  (lengthA[1] & 0xFF);
        var information = tData.slice(12,(12+dataLength));
        
        console.log(imei.toString('hex'))

        if(commandA[0] == gprsPacket){
            try{
                let outData = {}
                let myDevice
                var gpsData = information.toString().split('|')[0];
                var sensorData = information.toString().split('|')[1];
                var deviceStatus = information.toString().split('|')[2];
                console.log("*************************** ",deviceStatus)
                if(gpsData.length > 20){
                    //0626.071365,N,00315.219009,E,230124,182521.0,5.9,0.0,
                    console.log("0626.071365,N,00315.219009,E,230124,182521.0,5.9,0.0,");
                    var myData = gpsData.split(",");
                    outData = {
                        imei: imei.toString('hex'),
                        longitude: DataDecoder.decodeLatLon(myData[0],myData[1]),
                        latitude: DataDecoder.decodeLatLon(myData[2],myData[3]),
                        gpsDate: DataDecoder.decodeDate(myData[4]),
                        gpsTime: DataDecoder.decodeTime(myData[5])
                    }
                    console.log(outData);
                    await TrackerController.saveGpsData(outData);
                }
            
                

                if(sensorData.length > 20 && sensorData.split(",").length > 0){
                    var myData = sensorData.split(",");
                    outData = {
                        imei: imei.toString('hex'),
                        minutes: (myData[2]/1),
                        height: (myData[3]/10),
                        temperature: (((myData[6]/1) - 400)/10),
                        deviceStatus: deviceStatus == "off" ? 0 : 1,
                        timeelapsed: 0
                    }
                }
                else{
                    outData = {
                        imei: imei.toString('hex'),
                        deviceStatus: deviceStatus == "off" ? 0 : 1,
                        timeelapsed: 0
                    }
                }

                myDevice = await TrackerController.saveDeviceData(outData);
 
                
                if(myDevice.status != outData.deviceStatus){
                        if(outData.deviceStatus == 1){
                            await TrackerController.savePowerTime(outData);
                        }
                        else{
                            console.log("__________________saving off device ________________")
                            await TrackerController.saveOffTime(outData);
                        }
                }
            }
            catch(err){
                console.log(err)
            }
            /*console.log(imei.toString('hex'));
            console.log(gprsData);
            console.log(sensorData);
            console.log(deviceStatus);*/
        }
       
    })
  
   connection.pipe(connection);

})



server.listen({
	host: "18.175.229.83",
    //host: "127.0.0.1",
	port: 5500
}, function() { 
   console.log('server is listening to %j', server.address().port);
});