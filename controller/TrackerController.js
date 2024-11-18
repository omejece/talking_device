const EventEmitter = require('events');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const User = require('../models').User;
const SubUser = require('../models').SubUser;
const Vercode = require('../models').Vercode;
const PhcnDevice = require('../models').PhcnDevice;
const PhcnDeviceData = require('../models').PhcnDeviceData;
const InverterDevice = require('../models').InverterDevice;
const GenDevice = require('../models').GenDevice;
const TankDevice = require('../models').TankDevice;
const DeviceList = require('../models').DeviceList;
const Subscription = require('../models').Subscription;
const UpTime = require('../models').UpTime;
const DownTime = require('../models').DownTime;
const FConsumption = require('../models').FConsumption;
const PowerTime = require('../models').PowerTime;
const FuelGauge = require('../models').FuelGauge;
const RunTime = require('../models').RunTime;
const Site = require('../models').Site;
const Genofftime = require('../models').genofftime;
const InverterUptime = require('../models').inverteruptime;




async function saveGpsData(data){
     try{
        var myDevice = await GenDevice.findOne({where:{duid: data.imei}});
        if(myDevice){
             await GenDevice.update(
                {
                    longitude: data.longitude,
                    latitude: data.latitude,
                    gpstimestamp: `${data.gpsDate} ${data.gpsTime}`
                },
                {
                    where:{
                        duid: data.imei
                    }
                }
             )
        }
        else{
            throw new Error("Invalid device");
        }
     }
     catch(err){
        console.log(err);
     }
}

async function saveDeviceData(data){
    try{
        console.log(" saving device data ----",data)
        var myDevice = await GenDevice.findOne({where:{duid: data.imei}});
        if(myDevice){
            var mysdt = new Date();
            var sTimeTaken = (mysdt.getHours())+":"+mysdt.getMinutes()+":"+mysdt.getSeconds();
            var sDateTaken = mysdt.getFullYear()+"-"+(mysdt.getMonth()+1)+"-"+mysdt.getDate();
            var mysdate = sDateTaken+" "+sTimeTaken;
            if('height' in data){
                await GenDevice.update(
                    {
                      status:data.deviceStatus,
                      lastupdated: mysdate,
                      gauge: (myDevice.tankheight/1) - (data.height/10)
                    },
                    {
                        where:{
                            duid:data.imei
                        }
                    }
                 );
            }
            else{
                await GenDevice.update(
                    {
                      status:data.deviceStatus,
                      lastupdated: mysdate
                    },
                    {
                        where:{
                            duid:data.imei
                        }
                    }
                 );
            }
            

             if(data.deviceStatus == 1){

                let myOnnPowerTime = await PowerTime.findAll({
                    limit: 1,
                    where: {
                      duid: data.imei,
                      status: 1,
                      isactive: 1
                    },
                    order: [ [ 'createdAt', 'DESC' ]]
                });

	                                    
                if(myOnnPowerTime.length > 0){

                    var mylastpower = myOnnPowerTime[0];
                    console.log(" my last power is ");
                    console.log(mylastpower.workingtimetaken);
                    var activePowerTime = new Date(`${mylastpower.workingdatetaken} ${mylastpower.workingtimetaken}`);
                    
                    var myrawdate = new Date();
                    var cHour = parseInt(myrawdate.getHours() + 1) >= 24 ? 0 : parseInt(myrawdate.getHours());
                    var cMinutes = parseInt(myrawdate.getMinutes()) >= 60 ? 0 : parseInt(myrawdate.getMinutes());
                    var cSeconds = parseInt(myrawdate.getSeconds()) >= 60 ? 0 : parseInt(myrawdate.getSeconds());
                    
                    var currentTime = new Date(`${myrawdate.getFullYear()+"-"+(myrawdate.getMonth()+1)+"-"+myrawdate.getDate()} ${cHour+':'+cMinutes+':'+cSeconds}`);
                    
                    
                    if(parseInt(myrawdate.getHours()) >= 23 ){
                        currentTime.setDate(currentTime.getDate() + 1);
                    }
                    
                    if(currentTime.getHours() <= 0 ){
                        currentTime = new Date(`${myrawdate.getFullYear()+"-"+(myrawdate.getMonth()+1)+"-"+myrawdate.getDate()} ${(cHour+1)+':'+cMinutes+':'+cSeconds}`);
                    }
                    
                    
                    if(currentTime.getHours() > 0 && parseInt(myrawdate.getHours()) < 23){
                        currentTime = new Date(`${myrawdate.getFullYear()+"-"+(myrawdate.getMonth()+1)+"-"+myrawdate.getDate()} ${(cHour+1)+':'+cMinutes+':'+cSeconds}`);
                    }
                    
                    
                    
                    
                    var totalSecondsElapsed = currentTime.getTime() - activePowerTime.getTime();
                    totalSecondsElapsed = totalSecondsElapsed < 0 ? 0 : totalSecondsElapsed;
                    
                    console.log(currentTime, " My current time");
                    console.log(mylastpower, " My active power");
                    console.log(totalSecondsElapsed," my to tal time elapsed is");
                    
                    
                    var myTimeTaken = (currentTime.getHours())+":"+currentTime.getMinutes()+":"+currentTime.getSeconds();
                    var myDateTaken = currentTime.getFullYear()+"-"+(currentTime.getMonth()+1)+"-"+currentTime.getDate();
                    
                    
                    let runtime = await RunTime.findOne(
                        {
                          where:{
                           duid:myDevice.duid,
                           datetaken:myDateTaken
                          }
                        }
                    );

                    if(!runtime){
                        await RunTime.create({
                            duid: myDevice.duid,
                            userid: myDevice.userid,
                            siteid: myDevice.siteid,
                            duration: ((totalSecondsElapsed/1)),
                            startingduration: 0,
                            datetaken: myDateTaken
                        });

                        await PowerTime.update(
                            {
                              startingduration: 0,
                              workingtimetaken: myTimeTaken,
                              workingdatetaken: myDateTaken
                            },
                            {
                             where:{
                                 id: mylastpower.id
                             }
                            }
                        );

                        return myDevice;

                    }else{
                        console.log(" starting run time from device data ");
                        console.log(mylastpower.startingduration);
                        await RunTime.update(
                              {duration:((mylastpower.startingduration/1) +(totalSecondsElapsed/1))},
                              {where:{duid:myDevice.duid,datetaken:myDateTaken}
                        });
                        return myDevice;
                    }
                }
                else{
                    var myrawdate = new Date();
                    var cHour = parseInt(myrawdate.getHours() + 1) >= 24 ? 0 : parseInt(myrawdate.getHours());
                    var cMinutes = parseInt(myrawdate.getMinutes()) >= 60 ? 0 : parseInt(myrawdate.getMinutes());
                    var cSeconds = parseInt(myrawdate.getSeconds()) >= 60 ? 0 : parseInt(myrawdate.getSeconds());
                    
                    var currentTime = new Date(`${myrawdate.getFullYear()+"-"+(myrawdate.getMonth()+1)+"-"+myrawdate.getDate()} ${cHour+':'+cMinutes+':'+cSeconds}`);
                    
                    
                    
                    if(parseInt(myrawdate.getHours()) >= 23 ){
                        currentTime.setDate(currentTime.getDate() + 1);
                    }
                    
                    if(currentTime.getHours() <= 0 ){
                        currentTime = new Date(`${myrawdate.getFullYear()+"-"+(myrawdate.getMonth()+1)+"-"+myrawdate.getDate()} ${(cHour+1)+':'+cMinutes+':'+cSeconds}`);
                    }
                    
                    
                    if(currentTime.getHours() > 0 && parseInt(myrawdate.getHours()) < 23){
                        currentTime = new Date(`${myrawdate.getFullYear()+"-"+(myrawdate.getMonth()+1)+"-"+myrawdate.getDate()} ${(cHour+1)+':'+cMinutes+':'+cSeconds}`);
                    }
                    
                    
                    
                    var myTimeTaken = (currentTime.getHours())+":"+currentTime.getMinutes()+":"+currentTime.getSeconds();
                    var myDateTaken = currentTime.getFullYear()+"-"+(currentTime.getMonth()+1)+"-"+currentTime.getDate();
                    
                    let myRuntime = await RunTime.findAll({
                        limit: 1,
                        where: {
                          duid: data.imei,
                          datetaken:myDateTaken
                        },
                        order: [ [ 'createdAt', 'DESC' ]]
                    });

                    if(myRuntime.length > 0){
                        var mycurrentRuntime = myRuntime[0];
                        console.log(" starting run time from  onn ");
                        console.log(0);

                        let myPowerTime = await PowerTime.create({
                            userid: myDevice.userid,
                            siteid: myDevice.siteid,
                            duid: myDevice.duid,
                            timetaken: myTimeTaken,
                            datetaken: myDateTaken,
                            workingtimetaken: myTimeTaken,
                            workingdatetaken: myDateTaken,
                            startingduration: mycurrentRuntime.duration,
                            status:1,
                            isactive: 1
                        });

                        return myDevice;
                    }
                    else{
                        let myPowerTime = await PowerTime.create({
                            userid: myDevice.userid,
                            siteid: myDevice.siteid,
                            duid: myDevice.duid,
                            timetaken: myTimeTaken,
                            datetaken: myDateTaken,
                            workingtimetaken: myTimeTaken,
                            workingdatetaken: myDateTaken,
                            startingduration: 0,
                            status:1,
                            isactive: 1
                        });

                        await RunTime.create({
                            duid: myDevice.duid,
                            userid: myDevice.userid,
                            siteid: myDevice.siteid,
                            duration: 0,
                            startingduration: 0,
                            datetaken: myDateTaken
                        });

                        return myDevice;
                    }
                    
                }
            
            
            }

             return myDevice;
        }
        else{
            throw new Error("Invalid device");
        }
    }
    catch(err){
        console.log(err);
        throw new Error(err);
    }
}


async function savePowerTime(data){
    try{
        console.log(data);
        var myDevice = await GenDevice.findOne({where:{duid: data.imei}});
        if(myDevice){
            var myrawdate = new Date();
            var cHour = parseInt(myrawdate.getHours() + 1) >= 24 ? 0 : parseInt(myrawdate.getHours());
            var cMinutes = parseInt(myrawdate.getMinutes()) >= 60 ? 0 : parseInt(myrawdate.getMinutes());
            var cSeconds = parseInt(myrawdate.getSeconds()) >= 60 ? 0 : parseInt(myrawdate.getSeconds());
            
            var mydt = new Date(`${myrawdate.getFullYear()+"-"+(myrawdate.getMonth()+1)+"-"+myrawdate.getDate()} ${cHour+':'+cMinutes+':'+cSeconds}`);
            
            var secondsElapse = (parseInt(data.timeelapsed))/1000;
            
            if(parseInt(myrawdate.getHours()) >= 23 ){
                mydt.setDate(mydt.getDate() + 1);
            }
            
            if(mydt.getHours() <= 0 ){
                mydt = new Date(`${myrawdate.getFullYear()+"-"+(myrawdate.getMonth()+1)+"-"+myrawdate.getDate()} ${(cHour+1)+':'+cMinutes+':'+cSeconds}`);
            }
            
            if(mydt.getHours() > 0 && parseInt(myrawdate.getHours()) < 23){
                mydt = new Date(`${myrawdate.getFullYear()+"-"+(myrawdate.getMonth()+1)+"-"+myrawdate.getDate()} ${(cHour+1)+':'+cMinutes+':'+cSeconds}`);
            }
            
            mydt.setSeconds( mydt.getSeconds() - secondsElapse);
            
            var myTimeTaken = (mydt.getHours())+":"+mydt.getMinutes()+":"+mydt.getSeconds();
            var myDateTaken = mydt.getFullYear()+"-"+(mydt.getMonth()+1)+"-"+mydt.getDate();
            
            var mysdt = new Date();
            var sTimeTaken = (mysdt.getHours())+":"+mysdt.getMinutes()+":"+mysdt.getSeconds();
            var sDateTaken = mysdt.getFullYear()+"-"+(mysdt.getMonth()+1)+"-"+mysdt.getDate();
            
            var mysdate = sDateTaken+" "+sTimeTaken;

            await GenDevice.update(
                {
                  status:data.deviceStatus,
                  lastupdated: mysdate,
                  gauge: (myDevice.tankheight/1) - (data.height/10)
                },
                {
                    where:{
                        duid:data.imei
                    }
                }
             );
             
             let myRunTime = await RunTime.findAll({
                limit: 1,
                where: {
                  duid: data.imei,
                  datetaken:myDateTaken
                },
                order: [ [ 'createdAt', 'DESC' ]]
             });

             if(myRunTime.length > 0){
                var myCurrentRunTime = myRunTime[0];
                console.log(" starting run time from  onn ");
                console.log(0);

                let myPowerTime = await PowerTime.create({
                     userid: myDevice.userid,
                     siteid: myDevice.siteid,
                     duid: myDevice.duid,
                     timetaken: myTimeTaken,
                     datetaken: myDateTaken,
                     workingtimetaken: myTimeTaken,
                     workingdatetaken: myDateTaken,
                     startingduration: mycurrentRuntime.duration,
                     status:1,
                     isactive: 1
                 });
                 return myDevice;
             }
             else{
                let myPowerTime = await PowerTime.create({
                     userid: myDevice.userid,
                     siteid: myDevice.siteid,
                     duid: myDevice.duid,
                     timetaken: myTimeTaken,
                     datetaken: myDateTaken,
                     workingtimetaken: myTimeTaken,
                     workingdatetaken: myDateTaken,
                     startingduration: 0,
                     status:1,
                     isactive: 1
                 });

                 await RunTime.create({
                    duid: myDevice.duid,
                    userid: myDevice.userid,
                    siteid: myDevice.siteid,
                    startingduration: 0,
                    duration: 0,
                    datetaken: myDateTaken
                 });
                 
                 return myDevice;
             }


        }
        else{
            throw new Error('Invalid device');
        }
    }
    catch(err){
        throw new Error(err);
    }
}




async function saveOffTime(data){
    try{
        let myDevice = await GenDevice.findOne({
            where:{
                duid: data.imei
            }
        });
    
        if(myDevice){
             await GenDevice.update(
                {
                    status:data.deviceStatus,
                },
                {
                    where:{
                        duid:myDevice.duid
                    }
                }
             );

             let myOnnPowerTime = await PowerTime.findAll({
                limit: 1,
                where: {
                  duid: data.imei,
                  status: 1,
                  isactive: 1
                },
                order: [ [ 'createdAt', 'DESC' ]]
             });

             if(myOnnPowerTime.length > 0){
                var mylastpower = myOnnPowerTime[0];
                var activePowerTime = new Date(`${mylastpower.workingdatetaken} ${mylastpower.workingtimetaken}`);
                
                
                var myrawdate = new Date();
                var cHour = parseInt(myrawdate.getHours() + 1) >= 24 ? 0 : parseInt(myrawdate.getHours());
                var cMinutes = parseInt(myrawdate.getMinutes()) >= 60 ? 0 : parseInt(myrawdate.getMinutes());
                var cSeconds = parseInt(myrawdate.getSeconds()) >= 60 ? 0 : parseInt(myrawdate.getSeconds());
                
                var currentTime = new Date(`${myrawdate.getFullYear()+"-"+(myrawdate.getMonth()+1)+"-"+myrawdate.getDate()} ${cHour+':'+cMinutes+':'+cSeconds}`);
                
                if(parseInt(myrawdate.getHours()) >= 23 ){
                    currentTime.setDate(currentTime.getDate() + 1);
                }
                
                if(currentTime.getHours() <= 0 ){
                    currentTime = new Date(`${myrawdate.getFullYear()+"-"+(myrawdate.getMonth()+1)+"-"+myrawdate.getDate()} ${(cHour+1)+':'+cMinutes+':'+cSeconds}`);
                }
                
                if(currentTime.getHours() > 0 && parseInt(myrawdate.getHours()) < 23){
                    currentTime = new Date(`${myrawdate.getFullYear()+"-"+(myrawdate.getMonth()+1)+"-"+myrawdate.getDate()} ${(cHour+1)+':'+cMinutes+':'+cSeconds}`);
                }
                
                var secondsElapse = (parseInt(data.timeelapsed))/1000;
                currentTime.setSeconds( currentTime.getSeconds() - secondsElapse);
    
                var myTimeTaken = (currentTime.getHours())+":"+currentTime.getMinutes()+":"+currentTime.getSeconds();
                var myDateTaken = currentTime.getFullYear()+"-"+(currentTime.getMonth()+1)+"-"+currentTime.getDate();
                 
                var totalSecondsElapsed = currentTime.getTime() - activePowerTime.getTime();
                
                await PowerTime.create({
                    userid: myDevice.userid,
                    siteid: myDevice.siteid,
                    duid: myDevice.duid,
                    timetaken: myTimeTaken,
                    datetaken: myDateTaken,
                    workingtimetaken: myTimeTaken,
                    workingdatetaken: myDateTaken,
                    status:0,
                    isactive: 0,
                });

                await PowerTime.update(
                    {
                       isactive: 0 
                    },
                    {
                        where:{
                            duid: data.imei
                        }
                    }
                );

                return myDevice;

             }
        }
        else{
            throw new Error('Invalid device');
        }
    }
    catch(err){
        throw new Error(err);
    }
}

module.exports = {
    saveDeviceData,
    savePowerTime,
    saveOffTime,
    saveGpsData
}
