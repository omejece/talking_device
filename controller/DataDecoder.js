class DataDecoder {
    static decodeTime(mydata) {
       var timearray = mydata.toString().split('.');
       if (timearray.length > 0) {
          timearray = timearray[0];
       } else {
          timearray = mydata;
       }
       var timearray = mydata.match(/../g);
       var hour      = timearray[0];
       var minute    = timearray[1];
       var seconds   = timearray[2];
       return hour+':'+minute+':'+seconds;
    }
 
    static decodeVoltage(mydata) {
       var voltages = mydata.toString().split(',');
       var ad1      = parseInt('0x'+voltages[0]);
       var ad2      = parseInt('0x'+voltages[1]);
       var voltage1 = (parseFloat(ad1.toString(10)) * 6)/1024;
       var voltage2 = (parseFloat(ad2.toString(10)) * 6)/1024;
       return {voltage1:voltage1,voltage2:voltage2};
    }
 
    static decodeLatLon(mydata,direction) {
       var latlngarray = mydata.toString().split('.');
       let wholenumber = 0;
       let decimal = 0;
       if (latlngarray.length > 0) {
          wholenumber = latlngarray[0];
          decimal = latlngarray[1];
       } else {
       wholenumber = mydata;
       }
       
       var minute     = parseInt(wholenumber)%100;
       var degree     = parseFloat(Math.floor(wholenumber/100));
       var min        = parseFloat((minute+'.'+decimal));
       var latlng     = degree + (min/60);
       var multiplier = 1;
       if(direction == 'S' || direction == 'W'){
          multiplier = -1;
       }
       return parseFloat(latlng) * multiplier;
    }
 
    static decodeDate(mydata) {
       var datearray = mydata.toString().match(/../g);
       return '20'+datearray[2]+'-'+datearray[1]+'-'+datearray[0];
    }
 }
 
 module.exports = DataDecoder;