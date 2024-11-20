
var net = require('net');
var ApiController = require('./controller/ApiController');
var OmejeBuffer = require('./controller/OmejeBuffer');

/*Device heads*/
var serverHead = "4040";
var deviceHead = "2424";
/*End communication Heads*/


/*Device Commands*/
  var heartBeat = "7980";
  var tankHeartBeat = "7981";
  var turnOnn = "7940";
  var turnOff = "7941";
  var deviceData = "7942";
  var tankGaugeData = "7966";
  var outputControl = "7943";
  var setDeviceTime = "7944";
  var deviceLogin = "7945";
  
  var batteryData = "9066";
  var inverterLogin = "9045";
  
  var fuelCon = "7950";
/*End Device Commands*/







var deviceClents = [];



setInterval(()=>{
    
    ApiController.checkActiveGenDevices().then(myresponse=>{
          //console.log(myresponse);
          
          console.log('Checking devices to off');
    }).catch(err=>{
          console.log(err);
    })
    
    try{
       ApiController.updateGauge2(); 
    }
    catch(err){
        console.log(err);
    }
    
    
    
},10000);

var server = net.createServer(function(connection) {
    console.log('new connection');
    
    connection.on('error', function(error){
         console.log(error);
    });

    connection.on('data', function(data) {

        var tData = new Buffer(data);
        var dHead = new Buffer(tData.slice(0,2));
        console.log(data);
        console.log(dHead);

        if(dHead.toString('hex') == deviceHead && tData.length > 14){
            
               console.log("Data from device");
               console.log(data);

               var mainDataLength = tData.length - 4;
               var dataWithCrcLength = tData.length - 2;
              
               var mainData = new Buffer(tData.slice(4,(mainDataLength)));
               var mainDataWithCrc = new Buffer(tData.slice(4,(dataWithCrcLength)));
               var crcData = new Buffer(tData.slice(0,(mainDataLength)));

               
               var dLength = new Buffer(tData.slice(2,4));
               var deviceId = new Buffer(tData.slice(4,18));
               var command = new Buffer(tData.slice(18,20));
               var checksum = new Buffer(tData.slice((tData.length -4),(tData.length - 2)));
               console.log(command);

               if(command.toString('hex') == deviceLogin){
                    console.log("Device login \n");
                    ApiController.loginDevice({duid:deviceId}).then(myresp=>{
                         if(myresp.status == 20){
                            
                            var client = {
                                id: deviceId.toString(),
                                socket: connection
                            }


                            var isConnectionSaved = deviceClents.find(x=>x.id == deviceId.toString());

                            if(isConnectionSaved){
                                 deviceClents.push(client);
                            }
                            
                            var mydate = new Date();
                            var myyear = mydate.getFullYear();
                            var mydateset = '|'+mydate.getSeconds()+'|'+mydate.getMinutes()+'|'+(mydate.getHours()+ 1)+'|'+mydate.getDate()+'|'+(mydate.getMonth()+1)+'|'+myyear+'|';
                            var hexDate = OmejeBuffer.stringToHexString(mydateset);
                            var mydatalength = 22 + mydateset.length;
                            
                            var LL = mydatalength && 0x00FF;
                            var LH = mydatalength >> 8;
                            
                            LLString = Number(LL).toString(16);
                            LHString = Number(LH).toString(16);
                            
                            LHString = LHString.length > 1 ? LHString : "0"+LHString;
                            LLString = LLString.length > 1 ? LLString : "0"+LLString;
                            
                            
                            var outData =  serverHead.toString('hex')+LHString+LLString+deviceId.toString('hex')+command.toString('hex')+"01"+hexDate+"2424"+"040a";
                            console.log(OmejeBuffer.hexToBuffer(outData));
                            connection.write(OmejeBuffer.hexToBuffer(outData)); 
                         }
                         else{

                            var outData =  serverHead.toString('hex')+"0017"+deviceId.toString('hex')+command.toString('hex')+"00"+"2424"+"040a";
                            console.log(OmejeBuffer.hexToBuffer(outData));
                            connection.write(OmejeBuffer.hexToBuffer(outData));

                         }

                    }).catch(err=>{
                        console.log(err);
                    })

               }
               else if(command.toString('hex') == batteryData){
                   var datedata = new Buffer(tData.slice(20,(mainDataLength)));
                   console.log(datedata.toString());
                   //1.56(A)8.67|-8.67|8.70|-3.28|3.30|-0.07|0.08|0.04(V)0.67|0.13|0.94|0.67|0.94|-0.42|0.13|0.13(C) 
                   var split1 = datedata.toString().split('(A)');
                   var split2 = split1[1].split('(V)');
                   var split3 = split2[1].split('(C)');
                   var current = split1[0];
                   var voltages = split2[0].split('|');
                   var socs = split3[0].split('|');
                   
                   var reeivedData = {
                       duid: deviceId.toString(),
                       current: current,
                       voltages: voltages,
                       socs: socs
                   };
                   
                   console.log(reeivedData);
                   var count_low_battery = 0;
                   
                   if((voltages[0]/1) < 12.5){
                       count_low_battery = count_low_battery + 1;
                   }
                   if((voltages[1]/1) < 12.5){
                       count_low_battery = count_low_battery + 1;
                   }
                   if((voltages[2]/1) < 12.5){
                       count_low_battery = count_low_battery + 1;
                   }
                   if((voltages[3]/1) < 12.5){
                       count_low_battery = count_low_battery + 1;
                   }
                   if((voltages[4]/1) < 12.5){
                       count_low_battery = count_low_battery + 1;
                   }
                   if((voltages[5]/1) < 12.5){
                       count_low_battery = count_low_battery + 1;
                   }
                   if((voltages[6]/1) < 12.5){
                       count_low_battery = count_low_battery + 1;
                   }
                   if((voltages[7]/1) < 12.5){
                       count_low_battery = count_low_battery + 1;
                   }
                   
                   if(count_low_battery >= 4){
                       
                       ApiController.checkBatterySoc(reeivedData).then(()=>{
                       
                           ApiController.saveInverterBatteryData(reeivedData).then(resp=>{
                               console.log(' saving battery data 1');
                           }).catch(err=>{
                              console.log(err);
                           })
                           
                       }).catch(err=>{
                           console.log(err);
                       })   
                   }
                   else{
                       ApiController.saveInverterBatteryData(reeivedData).then(resp=>{
                           console.log(' saving battery data 2');
                       }).catch(err=>{
                          console.log(err);
                       })
                   }
                   
               }
               else if(command.toString('hex') == inverterLogin){
                    ApiController.InverterLogin({duid:deviceId}).then(myresp=>{
                         if(myresp.status == 20){

                              
                            var client = {
                                id: deviceId.toString(),
                                socket: connection
                            }


                            var isConnectionSaved = deviceClents.find(x=>x.id == deviceId.toString());

                            if(isConnectionSaved){
                                 deviceClents.push(client);
                            }
                            
                            
                            setTimeout(()=>{
                                var mydate = new Date();
                                var myyear = mydate.getFullYear();
                                var mydateset = '|'+mydate.getSeconds()+'|'+mydate.getMinutes()+'|'+(mydate.getHours()+ 1)+'|'+mydate.getDate()+'|'+(mydate.getMonth()+1)+'|'+myyear+'|';
                                var hexDate = OmejeBuffer.stringToHexString(mydateset);
                                var mydatalength = 22 + mydateset.length;
                                
                                var LL = mydatalength && 0x00FF;
                                var LH = mydatalength >> 8;
                                
                                LLString = Number(LL).toString(16);
                                LHString = Number(LH).toString(16);
                                
                                LHString = LHString.length > 1 ? LHString : "0"+LHString;
                                LLString = LLString.length > 1 ? LLString : "0"+LLString;
                                
                                
                                var outData =  serverHead.toString('hex')+LHString+LLString+deviceId.toString('hex')+command.toString('hex')+"01"+hexDate+"2424"+"040a";
                                console.log(OmejeBuffer.hexToBuffer(outData));
                                connection.write(OmejeBuffer.hexToBuffer(outData));
                            },2000);

                         }
                    }).catch(err=>{
                        console.log(err);
                    })
               }
               else if(command.toString('hex') == heartBeat){
                   
                   ApiController.loginDevice({duid:deviceId}).then(myresp=>{
                         if(myresp.status == 20){

                              
                              var datedata = new Buffer(tData.slice(20,(mainDataLength)));
                              console.log(datedata.toString());
                              var mydateArray = datedata.toString().split("|");
                              var dataObject = {
                                  duid: deviceId.toString(),
                                  timetaken: mydateArray[0],
                                  datetaken: mydateArray[1],
                                  timeelapsed: mydateArray[2],
                                  devicestatus: mydateArray[3],
                              };
                              
                              console.log(dataObject);

                              ApiController.saveDeviceData(dataObject).then(myresponse=>{
                                    //console.log(myresponse);
                              }).catch(err=>{
                                    console.log(err);
                              })

                         }
                    }).catch(err=>{
                        console.log(err);
                    })
                   
               }
               else if(command.toString('hex') == tankHeartBeat){
                   ApiController.loginDevice({duid:deviceId}).then(myresp=>{
                       if(myresp.status == 20){

                            //"1|"+String(getBatteryLevel())+"|"+String(getTankHeight())+"|"+String(getDateOnly())+"|"+String(getTimeOnly());
                            var datedata = new Buffer(tData.slice(20,(mainDataLength)));
                            console.log(datedata.toString());
                            var mydateArray = datedata.toString().split("|");
                            var datetaken = mydateArray[3].split("/");
                            var myowndate = datetaken[2]+'-'+datetaken[1]+'-'+datetaken[0];
                            var dataObject = {
                                duid: deviceId.toString(),
                                status: mydateArray[0],
                                voltage: mydateArray[1],
                                gauge: mydateArray[2],
                                datetaken: myowndate,
                                timetaken: mydateArray[4]
                            };
                            
                            console.log(dataObject);

                            ApiController.saveTankStatus(dataObject).then(myresponse=>{
                                  //console.log(myresponse);
                            }).catch(err=>{
                                  console.log(err);
                            })

                       }
                  }).catch(err=>{
                      console.log(err);
                  })
               }
               else if(command.toString('hex') == tankGaugeData){
                   ApiController.loginDevice({duid:deviceId}).then(myresp=>{
                         if(myresp.status == 20){

                              
                              var datedata = new Buffer(tData.slice(20,(mainDataLength)));
                              console.log(datedata.toString());
                              var mydateArray = datedata.toString().split("|");
                              var datetaken = mydateArray[3].split("/");
                              var myowndate = datetaken[2]+'-'+datetaken[1]+'-'+datetaken[0];
                              var dataObject = {
                                  duid: deviceId.toString(),
                                  status: mydateArray[0],
                                  voltage: mydateArray[1],
                                  gauge: mydateArray[2],
                                  datetaken: myowndate,
                                  timetaken: mydateArray[4]
                              };
                              
                              console.log(dataObject);

                              ApiController.saveTankGauge(dataObject).then(myresponse=>{
                                    //console.log(myresponse);
                              }).catch(err=>{
                                    console.log(err);
                              })

                         }
                    }).catch(err=>{
                        console.log(err);
                    })
               }
               else if(command.toString('hex') == turnOnn){

                   ApiController.loginDevice({duid:deviceId}).then(myresp=>{
                         if(myresp.status == 20){

                            

                              var datedata = new Buffer(tData.slice(20,(mainDataLength)));
                              console.log(datedata.toString());
                              var mydateArray = datedata.toString().split("|");
                              var dataObject = {
                                  duid: deviceId.toString(),
                                  timetaken: mydateArray[0],
                                  datetaken: mydateArray[1],
                                  timeelapsed: mydateArray[2],
                                  devicestatus: mydateArray[3],
                              };
                              
                              console.log(dataObject);

                              ApiController.saveOnnTime(dataObject).then(myresponse=>{
                                    console.log(myresponse);
                              }).catch(err=>{
                                    console.log(err);
                              })

                         }
                    }).catch(err=>{
                        console.log(err);
                    })

               }
               else if(command.toString('hex') == turnOff){

                    ApiController.loginDevice({duid:deviceId}).then(myresp=>{
                         if(myresp.status == 20){

                               

                              var datedata = new Buffer(tData.slice(20,(mainDataLength)));
                              console.log(datedata.toString());
                              var mydateArray = datedata.toString().split("|");
                              var dataObject = {
                                  duid: deviceId.toString(),
                                  timetaken: mydateArray[0],
                                  datetaken: mydateArray[1],
                                  timeelapsed: mydateArray[2],
                                  devicestatus: mydateArray[3],
                              };
                              
                              console.log(dataObject);

                              ApiController.saveOffTime(dataObject).then(myresponse=>{
                                    console.log(myresponse);
                              }).catch(err=>{
                                    console.log(err);
                              })

                         }
                    }).catch(err=>{
                        console.log(err);
                    })

               }
               else if(command.toString('hex') == deviceData){
                   
                   ApiController.loginDevice({duid:deviceId}).then(myresp=>{
                         if(myresp.status == 20){

                              
                              var datedata = new Buffer(tData.slice(21,(mainDataLength)));
                              console.log(datedata.toString());
                              var mydateArray = datedata.toString().split("|");
                              var dataObject = {
                                  duid: deviceId.toString(),
                                  runtime: mydateArray[0],
                                  status: mydateArray[1]
                              };

                              ApiController.saveDeviceData(dataObject).then(myresponse=>{
                                    //console.log(myresponse);
                              }).catch(err=>{
                                    console.log(err);
                              })

                         }
                    }).catch(err=>{
                        console.log(err);
                    })
               }
               else if(command.toString('hex') == fuelCon){
                   
                   ApiController.loginDevice({duid:deviceId}).then(myresp=>{
                         if(myresp.status == 20){

                              
                              var datedata = new Buffer(tData.slice(21,(mainDataLength)));
                              console.log(datedata.toString());
                              var mydateArray = datedata.toString().split("|");
                              var dataObject = {
                                  duid: deviceId.toString(),
                                  voltage: mydateArray[1],
                                  gauge: mydateArray[0]
                              };

                              ApiController.saveDeviceFuelCon(dataObject).then(myresponse=>{
                                    //console.log(myresponse);
                              }).catch(err=>{
                                    console.log(err);
                              })

                         }
                    }).catch(err=>{
                        console.log(err);
                    })
               }
               

        }
        else if(dHead.toString('hex') == serverHead && tData.length > 14){

               console.log("Data from server");
               console.log(data);

               var mainDataLength = tData.length - 4;
               var dataWithCrcLength = tData.length - 2;
              
               var mainData = new Buffer(tData.slice(4,(mainDataLength)));
               var mainDataWithCrc = new Buffer(tData.slice(4,(dataWithCrcLength)));
               var crcData = new Buffer(tData.slice(0,(mainDataLength)));

               
               var dLength = new Buffer(tData.slice(2,4));
               var deviceId = new Buffer(tData.slice(4,18));
               var command = new Buffer(tData.slice(18,20));
               var checksum = new Buffer(tData.slice((tData.length -4),(tData.length - 2)));
               console.log(command);

               if(command.toString('hex') == outputControl){
                   var sentControl = new Buffer(tData.slice(21,(mainDataLength)));
                   var outData =  serverHead.toString('hex')+"0017"+deviceId.toString('hex')+sentControl.toString('hex')+"00"+"2424"+"040a";
                   console.log(OmejeBuffer.hexToBuffer(outData));

                    var myclient = deviceClents.find(x=>x.id == deviceId.toString());

                    if(myclient){
                        myclient.socket.write(OmejeBuffer.hexToBuffer(outData));
                    }

               }
               else if(command.toString('hex') == setDeviceTime){
                   var sentControl = new Buffer(tData.slice(21,(mainDataLength)));
                   var outData =  serverHead.toString('hex')+"0017"+deviceId.toString('hex')+sentControl.toString('hex')+"00"+"2424"+"040a";
                   console.log(OmejeBuffer.hexToBuffer(outData));

                    var myclient = deviceClents.find(x=>x.id == deviceId.toString());

                    if(myclient){
                        myclient.socket.write(OmejeBuffer.hexToBuffer(outData));
                    }
               }

        }

       
    })
  
   connection.pipe(connection);

})



server.listen(5000, function() { 
   console.log('server is listening to %j', server.address().port);
});