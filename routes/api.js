var express = require('express');
var router = express.Router();
var RegisterController = require('../controller/RegisterController');
var ApiController = require('../controller/ApiController');


/* GET users listing. */



router.post('/updateuser',RegisterController.updateUser);
router.get('/updateuser',RegisterController.updateUser);

router.post('/changepassword',RegisterController.changePassword);
router.get('/changepassword',RegisterController.changePassword);

router.post('/newdevice',ApiController.newDevice);
router.get('/newdevice',ApiController.newDevice);

router.post('/newsite',ApiController.newSite);
router.get('/newsite',ApiController.newSite);

router.post('/getsite',ApiController.getSite);
router.get('/getsite',ApiController.getSite);

router.post('/getdevice',ApiController.getDevice);
router.get('/getdevice',ApiController.getDevice);

router.post('/getgpsdevice',ApiController.getGpsDevice);
router.get('/getgpsdevice',ApiController.getGpsDevice);


router.post('/getalldevice',ApiController.getAllDevice);
router.get('/getalldevice',ApiController.getAllDevice);


router.get('/updatedevice',ApiController.updateDevice);
router.post('/updatdevice',ApiController.updateDevice);

router.get('/deletedevice',ApiController.deleteDevice);
router.post('/deletedevice',ApiController.deleteDevice);

router.get('/deviceruntime',ApiController.deviceRuntime);
router.post('/deviceruntime',ApiController.deviceRuntime);

router.get('/alldeviceruntime',ApiController.allDeviceRuntime);
router.post('/alldeviceruntime',ApiController.allDeviceRuntime);


router.get('/devicepowertime',ApiController.devicePowerTime);
router.post('/devicepowertime',ApiController.devicePowerTime);

router.get('/deviceofftime',ApiController.deviceOffTime);
router.post('/deviceofftime',ApiController.deviceOffTime);

router.get('/devicefconsumption',ApiController.deviceFConsumption);
router.post('/devicefconsumption',ApiController.deviceFConsumption);

router.get('/alldevicefconsumption',ApiController.allDeviceFConsumption);
router.post('/alldevicefconsumption',ApiController.allDeviceFConsumption);

router.get('/makesubscription',ApiController.makeSubscription);
router.post('/makesubscription',ApiController.makeSubscription);

router.get('/devicedowntime',ApiController.deviceDowntime);
router.post('/devicedowntime',ApiController.deviceDowntime);

router.get('/alldevicedowntime',ApiController.allDeviceDowntime);
router.post('/alldevicedowntime',ApiController.allDeviceDowntime);

router.get('/deviceuptime',ApiController.deviceUptime);
router.post('/deviceuptime',ApiController.deviceUptime);

router.get('/alldeviceuptime',ApiController.allDeviceUptime);
router.post('/alldeviceuptime',ApiController.allDeviceUptime);

router.post('/automate',ApiController.automate);
router.get('/automate',ApiController.automate);


router.post('/newsubuser',ApiController.newSubuser);
router.get('/newsubuser',ApiController.newSubuser);


router.post('/editsubuser',ApiController.editSubuser);
router.get('/editsubuser',ApiController.editSubuser);


router.post('/deletesubuser',ApiController.deleteSubuser);
router.get('/deletesubuser',ApiController.deleteSubuser);


router.post('/getsubuser',ApiController.getSubuser);
router.get('/getsubuser',ApiController.getSubuser);


router.post('/getsubusers',ApiController.getSubusers);
router.get('/getsubusers',ApiController.getSubusers);


router.post('/getdevicefuelgauges',ApiController.getDeviceFuelGauges);
router.get('/getdevicefuelgauges',ApiController.getDeviceFuelGauges);


router.post('/getallfuelgauges',ApiController.getAllFuelGauges);
router.get('/getallfuelgauges',ApiController.getAllFuelGauges);


router.post('/getofftime',ApiController.getOffTime);
router.get('/getofftime',ApiController.getOffTime);


router.post('/getinverterundervoltagereport',ApiController.getInverterUnderVoltageReport);
router.get('/getinverterundervoltagereport',ApiController.getInverterUnderVoltageReport);



router.post('/getallinverterundervoltagereport',ApiController.getAllInverterUnderVoltageReport);
router.get('/getallinverterundervoltagereport',ApiController.getAllInverterUnderVoltageReport);

router.post('/getalldevicesdailydata',ApiController.getAllDevicesDailyData);
router.get('/getalldevicesdailydata',ApiController.getAllDevicesDailyData);





module.exports = router;
