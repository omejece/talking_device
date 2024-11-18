
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

const InverterBatteryUndervoltageReport = require("../models").inverterbatteryundervoltagereport;
var uniqid = require('uniqid');
var bcrypt = require('bcrypt-nodejs');
var moment = require('moment');

class ApiController extends EventEmitter{
    
      
      static index(req,res,next){
          res.setHeader('Content-Type', 'application/json');
	      res.send(JSON.stringify({status:22,message:'Device already in use'}));
      }
      
      
	  static newDevice(req,res,next){
        let myReq;
        if(req.method == 'POST'){
          myReq = req.fields;
        }
        else if(req.method == 'GET'){
          myReq = req.query;
        }
      
      try{
        DeviceList.findOne({
        	where:{duid:myReq.duid}
        }).then(device=>{
            if(device){
               if(device.status == 0){
                  User.findOne({
                  	where:{apikey:myReq.apikey}
                  }).then(user=>{
                      if(user){

                      	if(myReq.devicetype == 1){
                             InverterDevice.findOne({
	                         	where:{duid:myReq.duid}
	                         }).then(device=>{
	                             if(device){
	                             	res.setHeader('Content-Type', 'application/json');
	                                res.send(JSON.stringify({status:22,message:'Device already in use'}));
	                             }else{
	                             	InverterDevice.create({
	                             		duid:myReq.duid,
	                             		siteid:myReq.siteid,
	                             		userid:user.id,
	                             		name:myReq.name,
	                             		voltage: 0,
	                             		control:1,
	                             		status:1
	                             	}).then(device=>{
	                             		DeviceList.update(
	                                      {status:1},
	                                      {where:{duid:device.duid}}
	                             	    ).then(()=>{

	                             		});
	                             		res.setHeader('Content-Type', 'application/json');
	                                    res.send(JSON.stringify({status:20,message:'Device successfully added'}));
	                             	})
	                             }
	                         });
                      	}
                      	else if(myReq.devicetype == 2){
                            PhcnDevice.findOne({
	                         	where:{duid:myReq.duid}
	                         }).then(device=>{
	                             if(device){
	                             	res.setHeader('Content-Type', 'application/json');
	                                res.send(JSON.stringify({status:22,message:'Device already in use'}));
	                             }else{
	                             	PhcnDevice.create({
	                             		duid:myReq.duid,
	                             		siteid:myReq.siteid,
	                             		userid:user.id,
	                             		name:myReq.name,
	                             		powerstatus: 0,
	                             		control:1,
	                             		status:1
	                             	}).then(device=>{
	                             		DeviceList.update(
	                                      {status:1},
	                                      {where:{duid:device.duid}}
	                             	    ).then(()=>{

	                             		});
	                             		res.setHeader('Content-Type', 'application/json');
	                                    res.send(JSON.stringify({status:20,message:'Device successfully added'}));
	                             	})
	                             }
	                         });
                      	}
                      	else if(myReq.devicetype == 3){
                            GenDevice.findOne({
	                         	where:{duid:myReq.duid}
	                         }).then(device=>{
	                             if(device){
	                             	res.setHeader('Content-Type', 'application/json');
	                                res.send(JSON.stringify({status:22,message:'Device already in use'}));
	                             }else{
	                             	GenDevice.create({
	                             		duid:myReq.duid,
	                             		siteid:myReq.siteid,
	                             		userid:user.id,
	                             		name:myReq.name,
	                             		gauge: 0,
	                             		flowrate: 0,
	                             		control:1,
	                             		status:1
	                             	}).then(device=>{
	                             		DeviceList.update(
	                                      {status:1},
	                                      {where:{duid:device.duid}}
	                             	    ).then(()=>{
                                           res.setHeader('Content-Type', 'application/json');
	                                       res.send(JSON.stringify({status:20,message:'Device successfully added'}));
	                             		});
	                             		
	                             	})
	                             }
	                         });
                      	}
                      	else{
                      		res.setHeader('Content-Type', 'application/json');
                            res.send(JSON.stringify({status:23,message:'Invalid device type'}));
                      	}

                      }else{
                      	res.setHeader('Content-Type', 'application/json');
                        res.send(JSON.stringify({status:22,message:'Invalid user'}));
                      }
                  });
               }else{
                	res.setHeader('Content-Type', 'application/json');
                    res.send(JSON.stringify({status:22,message:'Device already in use'}));
               }
            }else{
            	res.setHeader('Content-Type', 'application/json');
                res.send(JSON.stringify({status:22,message:'Invalid device'}));
            }
        });
        
        }
     catch(error){
     	    res.setHeader('Content-Type', 'application/json');
          res.send(JSON.stringify({status:25,message:'error'}));
     } 



}


static newSite(req,res,next){
      let myReq;
      if(req.method == 'POST'){
        myReq = req.fields;
      }
      else if(req.method == 'GET'){
        myReq = req.query;
      }
      try{
          User.findOne({
          	where:{apikey:myReq.apikey}
          }).then(user=>{
              if(user){
	             	Site.create({
	             		userid:user.id,
	             		name:myReq.name,
	             		description:myReq.description
	             	}).then(()=>{
	             		res.setHeader('Content-Type', 'application/json');
	                    res.send(JSON.stringify({status:20,message:'Site successfully added'}));
	             	});
              }else{
              	res.setHeader('Content-Type', 'application/json');
                res.send(JSON.stringify({status:22,message:'Invalid user'}));
              }
          });
      }
      catch(error){
          res.setHeader('Content-Type', 'application/json');
          res.send(JSON.stringify({status:25,message:'error'}));
      } 
        
}
 
 

static getSite(req,res,next){
        let myReq;
        if(req.method == 'POST'){
          myReq = req.fields;
        }
        else if(req.method == 'GET'){
          myReq = req.query;
        }
     
      try{
       User.findOne({
          	where:{apikey:myReq.apikey}
          }).then(user=>{
              if(user){
	             	Site.findAll({
	             		where:{userid:user.id}
	             	}).then(site=>{
	             		res.setHeader('Content-Type', 'application/json');
	                    res.send(JSON.stringify({status:20,message:site}));
	             	});
              }else{
              	res.setHeader('Content-Type', 'application/json');
                res.send(JSON.stringify({status:22,message:'Invalid user'}));
              }
          });
     }
     catch(error){
     	res.setHeader('Content-Type', 'application/json');
        res.send(JSON.stringify({status:25,message:'error'}));
     } 
}





static newSubuser(req,res,next){
      let myReq;
      if(req.method == 'POST'){
        myReq = req.fields;
      }
      else if(req.method == 'GET'){
        myReq = req.query;
      }
      try{
      	  var myapikey = uniqid();
          User.findOne({
          	where:{apikey:myReq.apikey}
          }).then(user=>{
              if(user){
	             SubUser.findOne({
	             	where:{email:myReq.email}
	             }).then(mysubuser=>{
	             	if(mysubuser){
                       res.setHeader('Content-Type', 'application/json');
                       res.send(JSON.stringify({status:29,message:'Subuser with this email already exist'}));
                       return;
	             	}
	             	else{
                       SubUser.create({
                          apikey: myapikey,
						  userid: user.id,
						  name: myReq.name,
						  email: myReq.email,
						  password:bcrypt.hashSync(myReq.password)
                       }).then(()=>{
                       	  res.setHeader('Content-Type', 'application/json');
                          res.send(JSON.stringify({status:20,message:'Subuser successfully created',apikey:myapikey}));
                       })
	             	}
	             })
              }else{
              	res.setHeader('Content-Type', 'application/json');
                res.send(JSON.stringify({status:22,message:'Invalid user'}));
              }
          });
      }
      catch(error){
          res.setHeader('Content-Type', 'application/json');
          res.send(JSON.stringify({status:25,message:'error'}));
      } 
        
}








static editSubuser(req,res,next){
      let myReq;
      if(req.method == 'POST'){
        myReq = req.fields;
      }
      else if(req.method == 'GET'){
        myReq = req.query;
      }
      try{
          User.findOne({
          	where:{apikey:myReq.apikey}
          }).then(user=>{
              if(user){
	             SubUser.findOne({
	             	where:{userid:user.id,id:myReq.subuserid}
	             }).then(mysubuser=>{
	             	if(mysubuser){
	             	   
	             	   SubUser.findOne({
                          where:{email:myReq.email}
	             	   }).then(mysub=>{
	             	   	  if(mysub){
	             	   	  	 if(mysub.id != myReq.subuserid){
                                res.setHeader('Content-Type', 'application/json');
                                res.send(JSON.stringify({status:29,message:'Subuser with this email already exist'}));
                                return;
                             }
	             	   	  }
                          SubUser.update(
                            {
							 name: myReq.name,
							 email: myReq.email,
							 password:bcrypt.hashSync(myReq.password)
	                        },
	                        {
                              where:{id:myReq.subuserid}
	                        }
	                      ).then(()=>{
	                       	 res.setHeader('Content-Type', 'application/json');
	                         res.send(JSON.stringify({status:20,message:'Subuser successfully created'}));
	                      })
	             	   })
	             	}
	             	else{
                       res.setHeader('Content-Type', 'application/json');
                       res.send(JSON.stringify({status:29,message:'Subuser with this email already exist'}));
	             	}
	             })
              }else{
              	res.setHeader('Content-Type', 'application/json');
                res.send(JSON.stringify({status:22,message:'Invalid user'}));
              }
          });
      }
      catch(error){
          res.setHeader('Content-Type', 'application/json');
          res.send(JSON.stringify({status:25,message:'error'}));
      } 
        
}







static deleteSubuser(req,res,next){
      let myReq;
      if(req.method == 'POST'){
        myReq = req.fields;
      }
      else if(req.method == 'GET'){
        myReq = req.query;
      }
      try{
          User.findOne({
          	where:{apikey:myReq.apikey}
          }).then(user=>{
              if(user){
	             SubUser.findOne({
	             	where:{userid:user.id,id:myReq.subuserid}
	             }).then(mysubuser=>{
	             	if(mysubuser){
	             	   
	             	   SubUser.destroy({
                          where:{id:myReq.subuserid}
	             	   }).then(mysub=>{
	             	   	  res.setHeader('Content-Type', 'application/json');
                          res.send(JSON.stringify({status:29,message:'Subuser successfully removed'}));
	             	   })
	             	}
	             	else{
                       res.setHeader('Content-Type', 'application/json');
                       res.send(JSON.stringify({status:29,message:'Subuser with this email already exist'}));
	             	}
	             })
              }else{
              	res.setHeader('Content-Type', 'application/json');
                res.send(JSON.stringify({status:22,message:'Invalid user'}));
              }
          });
      }
      catch(error){
          res.setHeader('Content-Type', 'application/json');
          res.send(JSON.stringify({status:25,message:'error'}));
      } 
        
}





static getSubuser(req,res,next){
      let myReq;
      if(req.method == 'POST'){
        myReq = req.fields;
      }
      else if(req.method == 'GET'){
        myReq = req.query;
      }
      try{
          User.findOne({
          	where:{apikey:myReq.apikey}
          }).then(user=>{
              if(user){
	             SubUser.findOne({
	             	where:{userid:user.id,id:myReq.subuserid}
	             }).then(mysubuser=>{
	             	if(mysubuser){
	             	   res.setHeader('Content-Type', 'application/json');
                       res.send(JSON.stringify({status:29,message:mysubuser}));
	             	}
	             	else{
                       res.setHeader('Content-Type', 'application/json');
                       res.send(JSON.stringify({status:29,message:'Invalid subuser'}));
	             	}
	             })
              }else{
              	res.setHeader('Content-Type', 'application/json');
                res.send(JSON.stringify({status:22,message:'Invalid user'}));
              }
          });
      }
      catch(error){
          res.setHeader('Content-Type', 'application/json');
          res.send(JSON.stringify({status:25,message:'error'}));
      } 
        
}




static getSubusers(req,res,next){
      let myReq;
      if(req.method == 'POST'){
        myReq = req.fields;
      }
      else if(req.method == 'GET'){
        myReq = req.query;
      }
      try{
          User.findOne({
          	where:{apikey:myReq.apikey}
          }).then(user=>{
              if(user){
	             SubUser.findAll({
	             	where:{userid:user.id,id:myReq.subuserid}
	             }).then(mysubuser=>{
	             	res.setHeader('Content-Type', 'application/json');
                    res.send(JSON.stringify({status:29,message:mysubuser}));
	             })
              }else{
              	res.setHeader('Content-Type', 'application/json');
                res.send(JSON.stringify({status:22,message:'Invalid user'}));
              }
          });
      }
      catch(error){
          res.setHeader('Content-Type', 'application/json');
          res.send(JSON.stringify({status:25,message:'error'}));
      } 
        
}






static getDevice(req,res,next){
        let myReq;
        if(req.method == 'POST'){
          myReq = req.fields;
        }
        else if(req.method == 'GET'){
          myReq = req.query;
        }
         
         try{
	       User.findOne({
	          	where:{apikey:myReq.apikey}
	          }).then(user=>{
	              if(user){
	              	if(myReq.devicetype == 1){
		             	InverterDevice.findOne({
		             		where:{userid:user.id,siteid:myReq.siteid,duid:myReq.duid}
		             	}).then(device=>{
		             		res.setHeader('Content-Type', 'application/json');
		                    res.send(JSON.stringify({status:20,result:device}));
		             	}).catch(err=>{
		             	    console.log(err);
		             	});
		            }
		            else if(myReq.devicetype == 2){
		             	PhcnDevice.findOne({
		             		where:{userid:user.id,siteid:myReq.siteid,duid:myReq.duid}
		             	}).then(device=>{
		             		res.setHeader('Content-Type', 'application/json');
		                    res.send(JSON.stringify({status:20,result:device}));
		             	}).catch(err=>{
		             	    console.log(err);
		             	});
		            }
		            else if(myReq.devicetype == 3){
		             	GenDevice.findOne({
		             		where:{userid:user.id,siteid:myReq.siteid,duid:myReq.duid},
		             		include:[{model:PhcnDevice,required:false,include:[{model:PhcnDeviceData,required:false}]}]
		             	}).then(device=>{
		             		res.setHeader('Content-Type', 'application/json');
		                    res.send(JSON.stringify({status:20,result:device}));
		             	}).catch(err=>{
		             	    console.log(err);
		             	});
		            }
		            else{
		            	res.setHeader('Content-Type', 'application/json');
	                    res.send(JSON.stringify({status:23,message:'Invalid device type'}));
		            }
	              }else{
	              	res.setHeader('Content-Type', 'application/json');
	                res.send(JSON.stringify({status:22,message:'Invalid user'}));
	              }
	          }); 
	        }
          catch(error){
         	    res.setHeader('Content-Type', 'application/json');
                res.send(JSON.stringify({status:25,message:'error'}));
         }  
	}
	
	
	
	
	
	
	
	
	
	
	static getDevice2(req,res,next){
        let myReq;
        if(req.method == 'POST'){
          myReq = req.fields;
        }
        else if(req.method == 'GET'){
          myReq = req.query;
        }
         
         try{
	       User.findOne({
	          	where:{apikey:myReq.apikey}
	          }).then(user=>{
	              if(user){
	              	if(myReq.devicetype == 1){
		             	InverterDevice.findOne({
		             		where:{userid:user.id,siteid:myReq.siteid,duid:myReq.duid}
		             	}).then(device=>{
		             		res.setHeader('Content-Type', 'application/json');
		                    res.send(JSON.stringify({status:20,result:device}));
		             	}).catch(err=>{
		             	    console.log(err);
		             	});
		            }
		            else if(myReq.devicetype == 2){
		             	PhcnDevice.findOne({
		             		where:{userid:user.id,siteid:myReq.siteid,duid:myReq.duid}
		             	}).then(device=>{
		             		res.setHeader('Content-Type', 'application/json');
		                    res.send(JSON.stringify({status:20,result:device}));
		             	}).catch(err=>{
		             	    console.log(err);
		             	});
		            }
		            else if(myReq.devicetype == 3){
		             	GenDevice.findOne({
		             		where:{userid:user.id,siteid:myReq.siteid,duid:myReq.duid},
		             		include:[{model:PhcnDevice,required:false,include:[{model:PhcnDeviceData,required:false}]}]
		             	}).then(device=>{
		             	    
		             	    PowerTime.findOne({
		             	      where:{
		             	          duid: device.duid,
		             	          datetaken: myReq.datetaken,
		             	          status: 0
		             	      }
		             	    }).then(myOffTimes=>{
		             	        
		             	        PowerTime.findOne({
    		             	      where:{
    		             	          duid: device.duid,
    		             	          datetaken: myReq.datetaken,
    		             	          status: 1
    		             	      }
    		             	    }).then(myOnnTimes=>{
    		             	        
    		             	        res.setHeader('Content-Type', 'application/json');
		                             res.send(JSON.stringify({
		                                 status:20,
		                                 result:{
		                                    device : device,
		                                    off_times: myOffTimes,
		                                    onn_times: myOnnTimes
		                                 } 
		                             }));
    		             	        
    		             	    }).catch(err=>{
    		             	       console.log(err);
    		             	    });
		             	        
		             	        
		             	    }).catch(err=>{
		             	       console.log(err);
		             	    });
		             		
		             	}).catch(err=>{
		             	    console.log(err);
		             	});
		            }
		            else{
		            	res.setHeader('Content-Type', 'application/json');
	                    res.send(JSON.stringify({status:23,message:'Invalid device type'}));
		            }
	              }else{
	              	res.setHeader('Content-Type', 'application/json');
	                res.send(JSON.stringify({status:22,message:'Invalid user'}));
	              }
	          }); 
	        }
          catch(error){
         	    res.setHeader('Content-Type', 'application/json');
                res.send(JSON.stringify({status:25,message:'error'}));
         }  
	}
	
	
	
	
	
	

	static getAllDevice(req,res,next){
            let myReq;
	        if(req.method == 'POST'){
	          myReq = req.fields;
	        }
	        else if(req.method == 'GET'){
	          myReq = req.query;
	        }
         
         try{
	       User.findOne({
	          	where:{apikey:myReq.apikey}
	          }).then(user=>{
	              if(user){

		             	if(myReq.devicetype == 1){
			             	InverterDevice.findAll({
			             		where:{userid:user.id,siteid:myReq.siteid}
			             	}).then(device=>{
			             		res.setHeader('Content-Type', 'application/json');
			                    res.send(JSON.stringify({status:20,result:device}));
			             	}).catch(err=>{
    		             	    console.log(err);
    		             	});
			            }
			            else if(myReq.devicetype == 2){
			             	PhcnDevice.findAll({
			             		where:{userid:user.id,siteid:myReq.siteid}
			             	}).then(device=>{
			             		res.setHeader('Content-Type', 'application/json');
			                    res.send(JSON.stringify({status:20,result:device}));
			             	}).catch(err=>{
    		             	    console.log(err);
    		             	});
			            }
			            else if(myReq.devicetype == 3){
			             	GenDevice.findAll({
			             		where:{userid:user.id,siteid:myReq.siteid},
			             		include:[{model:PhcnDevice,required:false,include:[{model:PhcnDeviceData,required:false}]}]
			             	}).then(device=>{
			             		res.setHeader('Content-Type', 'application/json');
			                    res.send(JSON.stringify({status:20,result:device}));
			             	}).catch(err=>{
    		             	    console.log(err);
    		             	});
			            }
			            else{
			            	res.setHeader('Content-Type', 'application/json');
		                    res.send(JSON.stringify({status:23,message:'Invalid device type'}));
			            }


	              }else{
	              	res.setHeader('Content-Type', 'application/json');
	                res.send(JSON.stringify({status:22,message:'Invalid user'}));
	              }
	          });
	       }
         catch(error){
         	    res.setHeader('Content-Type', 'application/json');
                res.send(JSON.stringify({status:25,message:'error'}));
         }    
	  }

	 static automate(req,res,next){
            let myReq;
	        if(req.method == 'POST'){
	          myReq = req.fields;
	        }
	        else if(req.method == 'GET'){
	          myReq = req.query;
	        }
	         
	         try{
		       User.findOne({
		          	where:{apikey:myReq.apikey}
		          }).then(user=>{
		              if(user){
                         
                           if(myReq.devicetype == 3){
				             	Device.findOne({
				             		where:{userid:user.id,duid:myReq.duid}
				             	}).then(device=>{
				             		if(device){
	                                   Device.update(
	                                      {control:myReq.control},
	                                      {where:{duid:myReq.duid}}
	                                   ).then(()=>{
	                                   	  res.setHeader('Content-Type', 'application/json');
				                          res.send(JSON.stringify({status:20,message:'Device automated successfully'}));
	                                   }).catch(err=>{
                		             	    console.log(err);
                		               });
				             		}else{
				             			res.setHeader('Content-Type', 'application/json');
				                        res.send(JSON.stringify({status:23,message:'Invalid device'}));
				             		}
				             		
				             	});
				            }
				            else if(myReq.devicetype == 3){
				             	Device.findOne({
				             		where:{userid:user.id,duid:myReq.duid}
				             	}).then(device=>{
				             		if(device){
	                                   Device.update(
	                                      {control:myReq.control},
	                                      {where:{duid:myReq.duid}}
	                                   ).then(()=>{
	                                   	  res.setHeader('Content-Type', 'application/json');
				                          res.send(JSON.stringify({status:20,message:'Device automated successfully'}));
	                                   }).catch(err=>{
                		             	    console.log(err);
                		               });;
				             		}else{
				             			res.setHeader('Content-Type', 'application/json');
				                        res.send(JSON.stringify({status:23,message:'Invalid device'}));
				             		}
				             		
				             	});
				            }
				            else if(myReq.devicetype == 3){
				             	GenDevice.findOne({
				             		where:{userid:user.id,duid:myReq.duid}
				             	}).then(device=>{
				             		if(device){
	                                   GenDevice.update(
	                                      {control:myReq.control},
	                                      {where:{duid:myReq.duid}}
	                                   ).then(()=>{
	                                   	  res.setHeader('Content-Type', 'application/json');
				                          res.send(JSON.stringify({status:20,message:'Device automated successfully'}));
	                                   }).catch(err=>{
                		             	    console.log(err);
                		               });
				             		}else{
				             			res.setHeader('Content-Type', 'application/json');
				                        res.send(JSON.stringify({status:23,message:'Invalid device'}));
				             		}
				             		
				             	});
				            }
				            else{
			            	    res.setHeader('Content-Type', 'application/json');
		                        res.send(JSON.stringify({status:23,message:'Invalid device type'}));
			                }

			             	

		              }else{
		              	res.setHeader('Content-Type', 'application/json');
		                res.send(JSON.stringify({status:22,message:'Invalid user'}));
		              }
		          }); 
		        }
	          catch(error){
	         	    res.setHeader('Content-Type', 'application/json');
	                res.send(JSON.stringify({status:25,message:'error'}));
	         }
	  }


	



	 static saveGenPowerTime(req,res,next){
            let myReq;
	        if(req.method == 'POST'){
	          myReq = req.fields;
	        }
	        else if(req.method == 'GET'){
	          myReq = req.query;
	        }
	        
	        var nowDate = new Date();
            var mydate = nowDate.getFullYear()+'-'+(nowDate.getMonth() + 1)+'-'+nowDate.getDate();
            var mytime = nowDate.getHours()+':'+nowDate.getMinutes()+':'+nowDate.getSeconds();
            try{
                GenDevice.findOne({
             		where:{duid:myReq.duid}
             	}).then(device=>{
             		if(device){
    
                       GenDevice.update(
                          {status:myReq.st},
                          {where:{duid:myReq.duid}}
                       ).then(()=>{
                           PowerTime.create({
                              userid: device.userid,
    						  siteid: device.siteid,
    						  duid: device.duid,
    					      timetaken: mytime,
    				     	  datetaken: mydate,
    				     	  status:1
                           }).then(()=>{
                              res.setHeader('Content-Type', 'application/json');
    		                  res.send(JSON.stringify(`#${device.control}#`));
                           })
    
                       });
             		}else{
             			res.setHeader('Content-Type', 'application/json');
                        res.send(JSON.stringify("#Invalid device#"));
             		}
             		
             	});
            }
            catch(err){
                res.setHeader('Content-Type', 'application/json');             
                res.send(JSON.stringify({status:25,message:'err'}));
            }
	        
	 }


	 static updateDevice(req,res,next){
        let myReq;
        if(req.method == 'POST'){
          myReq = req.fields;
        }
        else if(req.method == 'GET'){
          myReq = req.query;
        }
        
        res.setHeader('Content-Type', 'application/json');
        res.send(JSON.stringify({status:22,result:myReq}));
         
         try{
	       User.findOne({
	          	where:{apikey:myReq.apikey}
	          }).then(user=>{
	              if(user){
                        
		             	if(myReq.devicetype == 1){
			             	InverterDevice.findOne({
			             		where:{duid:myReq.duid}
			             	}).then(device=>{
			             	    if(device){
			             	        InverterDevice.update(
			             	            {
			             	               name: myReq.name 
			             	            },
			             	            {
			             	               where:{duid:myReq.duid}
			             	            }
			             	        ).then(()=>{
			             	            res.setHeader('Content-Type', 'application/json');
			                            res.send(JSON.stringify({status:20,result:'successfully updated'}));
			             	        })
			             	        
			             	    }
			             	    else{
			             	        res.setHeader('Content-Type', 'application/json');
			                        res.send(JSON.stringify({status:22,result:'Invalid device'}));
			             	    }
			             		
			             	}).catch(err=>{
                	              res.setHeader('Content-Type', 'application/json');
                                  res.send(JSON.stringify({status:25,message:'error'}));
                	        });
			            }
			            else if(myReq.devicetype == 2){
			             	PhcnDevice.findOne({
			             		where:{userid:user.id,duid:myReq.deviceuid}
			             	}).then(device=>{
			             	    if(device){
			             	        PhcnDevice.update(
			             	            {
			             	               vat: myReq.vat,
			             	               cost_per_kwh: myReq.cost_per_kwh
			             	            },
			             	            {
			             	               where:{
			             	                  duid:myReq.deviceuid 
			             	               }
			             	            }
			             	        ).then(myresp=>{
			             	            res.setHeader('Content-Type', 'application/json');
			                            res.send(JSON.stringify({status:20,result:{},message:'Successfully updated'}));
			             	        }).catch(err=>{
                        	              res.setHeader('Content-Type', 'application/json');
                                          res.send(JSON.stringify({status:25,message:'error'}));
                        	          });
			             	    }
			             	    else{
			             	        res.setHeader('Content-Type', 'application/json');
			                        res.send(JSON.stringify({status:21,result:{},message:'Invalid device'}));
			             	    }
			             		
			             	});
			            }
			            else if(myReq.devicetype == 3){
			             	GenDevice.findAll({
			             		where:{userid:user.id,siteid:myReq.siteid}
			             	}).then(device=>{
			             		res.setHeader('Content-Type', 'application/json');
			                    res.send(JSON.stringify({status:20,result:device}));
			             	}).catch(err=>{
                	              res.setHeader('Content-Type', 'application/json');
                                  res.send(JSON.stringify({status:25,message:'error'}));
                	          });
			            }
			            else{
			            	res.setHeader('Content-Type', 'application/json');
		                    res.send(JSON.stringify({status:23,message:'Invalid device type'}));
			            }


	              }else{
	              	res.setHeader('Content-Type', 'application/json');
	                res.send(JSON.stringify({status:22,message:'Invalid user'}));
	              }
	          }).catch(err=>{
	              res.setHeader('Content-Type', 'application/json');
                  res.send(JSON.stringify({status:25,message:'error'}));
	          });
	       }
         catch(error){
         	    res.setHeader('Content-Type', 'application/json');
                res.send(JSON.stringify({status:25,message:'error'}));
         }  
	        
	        
	 }



	 static deleteDevice(req,res,next){
            let myReq;
	        if(req.method == 'POST'){
	          myReq = req.fields;
	        }
	        else if(req.method == 'GET'){
	          myReq = req.query;
	        }
	 }


	 static deviceRuntime(req,res,next){
            let myReq;
	        if(req.method == 'POST'){
	          myReq = req.fields;
	        }
	        else if(req.method == 'GET'){
	          myReq = req.query;
	        }
            
            try{
                RunTime.findAll({
    	        	where:{
    	        		duid:myReq.duid,
    	        		siteid:myReq.siteid,
    	        		datetaken:{
        	               [Op.between]:[myReq.datefrom,myReq.dateto] 
        	            }
    	        	}
    	        }).then(runtime=>{
    	        	res.setHeader('Content-Type', 'application/json');
    		        res.send(JSON.stringify({status:20,result:runtime}));
    	        })
            }
            catch(err){
                res.setHeader('Content-Type', 'application/json');             
                res.send(JSON.stringify({status:25,message:'err'}));
            }
	        
	 }


	 static allDeviceRuntime(req,res,next){
            let myReq;
	        if(req.method == 'POST'){
	          myReq = req.fields;
	        }
	        else if(req.method == 'GET'){
	          myReq = req.query;
	        }
            
            try{
                RunTime.findAll({
    	        	where:{
    	        		siteid:myReq.siteid,
    	        		datetaken:{
        	               [Op.between]:[myReq.datefrom,myReq.dateto] 
        	            }
    	        	}
    	        }).then(runtime=>{
    	        	res.setHeader('Content-Type', 'application/json');
    		        res.send(JSON.stringify({status:20,result:runtime}));
    	        }) 
            }
            catch(err){
                res.setHeader('Content-Type', 'application/json');             
                res.send(JSON.stringify({status:25,message:'err'}));
            }
	        
	 }
	 
	 

    static deviceFConsumption(req,res,next){
            let myReq;
	        if(req.method == 'POST'){
	          myReq = req.fields;
	        }
	        else if(req.method == 'GET'){
	          myReq = req.query;
	        }

            try{
              FConsumption.findAll({
    	        	where:{
    	        		duid:myReq.duid,
    	        		siteid:myReq.siteid,
    	        		datetaken:{
    	               [Op.between]:[myReq.datefrom,myReq.dateto] 
    	            }
    	        	}
    	        }).then(fconsumption=>{
    	        	res.setHeader('Content-Type', 'application/json');
    		        res.send(JSON.stringify({status:20,result:fconsumption}));
    	        })  
            }
            catch(err){
                res.setHeader('Content-Type', 'application/json');             
                res.send(JSON.stringify({status:25,message:'err'}));
            }
	        
	 }
	 

	 static allDeviceFConsumption(req,res,next){
          let myReq;
	        if(req.method == 'POST'){
	          myReq = req.fields;
	        }
	        else if(req.method == 'GET'){
	          myReq = req.query;
	        }
            
            try{
                FConsumption.findAll({
      	        	where:{
      	        		siteid:myReq.siteid,
      	        		datetaken:{
      	               [Op.between]:[myReq.datefrom,myReq.dateto] 
      	            }
      	        	}
      	        }).then(fconsumption=>{
      	        	res.setHeader('Content-Type', 'application/json');
      		        res.send(JSON.stringify({status:20,result:fconsumption}));
      	        }) 
            }
            catch(err){
                res.setHeader('Content-Type', 'application/json');             
                res.send(JSON.stringify({status:25,message:'err'}));
            }
	        
	 }




   static getDeviceFuelGauges(req,res,next){
        let myReq;
        if(req.method == 'POST'){
          myReq = req.fields;
        }
        else if(req.method == 'GET'){
          myReq = req.query;
        }
     
      try{
          User.findOne({
            where:{apikey:myReq.apikey}
          }).then(user=>{
              if(user){
                FuelGauge.findAll({
                  where:{
                    duid:myReq.duid,
                    siteid:myReq.siteid,
                    datetaken:{
                       [Op.between]:[myReq.datefrom,myReq.dateto] 
                    }
                  }
                }).then(fuelgauge=>{
                  res.setHeader('Content-Type', 'application/json');
                  res.send(JSON.stringify({status:20,result:fuelgauge}));
                }) 
              }else{
                res.setHeader('Content-Type', 'application/json');
                res.send(JSON.stringify({status:22,message:'Invalid user'}));
              }
          });
     }
     catch(error){
      res.setHeader('Content-Type', 'application/json');
        res.send(JSON.stringify({status:25,message:'error'}));
     } 
   }




   static getAllFuelGauges(req,res,next){
        let myReq;
        if(req.method == 'POST'){
          myReq = req.fields;
        }
        else if(req.method == 'GET'){
          myReq = req.query;
        }
     
      try{
          User.findOne({
            where:{apikey:myReq.apikey}
          }).then(user=>{
              if(user){
                FuelGauge.findAll({
                  where:{
                    siteid:myReq.siteid,
                    datetaken:{
                       [Op.between]:[myReq.datefrom,myReq.dateto] 
                    }
                  }
                }).then(fuelgauge=>{
                  res.setHeader('Content-Type', 'application/json');
                  res.send(JSON.stringify({status:20,result:fuelgauge}));
                }) 
              }else{
                res.setHeader('Content-Type', 'application/json');
                res.send(JSON.stringify({status:22,message:'Invalid user'}));
              }
          });
     }
     catch(error){
      res.setHeader('Content-Type', 'application/json');
        res.send(JSON.stringify({status:25,message:'error'}));
     } 
   }


	 static makeSubscription(req,res,next){
            let myReq;
	        if(req.method == 'POST'){
	          myReq = req.fields;
	        }
	        else if(req.method == 'GET'){
	          myReq = req.query;
	        }
	        
	        
	        try{
                  User.findOne({
                    	where:{apikey:myReq.apikey}
                    }).then(user=>{
                       if(user){
                           Subscription.findAll(
                           	{startdate:myReq.startdate,enddate:myReq.enddate},
                           	{where:{userid:user.id}}
                           	).then(uptime=>{
        			        	res.setHeader('Content-Type', 'application/json');
        				        res.send(JSON.stringify({status:20,message:'Successfully subscribed'}));
        			        })
                       }
                       else{
        	            	  res.setHeader('Content-Type', 'application/json');
        				      res.send(JSON.stringify({status:22,message:'invalid user'}));
        			   }
                    })
            }
            catch(err){
                res.setHeader('Content-Type', 'application/json');             
                res.send(JSON.stringify({status:25,message:'err'}));
            }
            
            
	            
	 }


	 static deviceDowntime(req,res,next){
           let myReq;
	        if(req.method == 'POST'){
	          myReq = req.fields;
	        }
	        else if(req.method == 'GET'){
	          myReq = req.query;
	        }


	 }


	 static allDeviceDowntime(req,res,next){
           let myReq;
	        if(req.method == 'POST'){
	          myReq = req.fields;
	        }
	        else if(req.method == 'GET'){
	          myReq = req.query;
	        }
	 }


	 static deviceUptime(req,res,next){
           let myReq;
	        if(req.method == 'POST'){
	          myReq = req.fields;
	        }
	        else if(req.method == 'GET'){
	          myReq = req.query;
	        }
	        
	        try{
                 UpTime.findAll({
    	        	where:{
    	        		duid:myReq.duid,
    	        		siteid:myReq.siteid,
    	        		datetaken:{
        	               [Op.between]:[myReq.datefrom,myReq.dateto] 
        	            }
    	        	}
    	        }).then(uptime=>{
    	        	res.setHeader('Content-Type', 'application/json');
    		        res.send(JSON.stringify({status:20,result:uptime}));
    	        })
            }
            catch(err){
                res.setHeader('Content-Type', 'application/json');             
                res.send(JSON.stringify({status:25,message:'err'}));
            }

	        
	 }


	 static allDeviceUptime(req,res,next){
           let myReq;
	        if(req.method == 'POST'){
	          myReq = req.fields;
	        }
	        else if(req.method == 'GET'){
	          myReq = req.query;
	        }
            
            try{
                UpTime.findAll({
    	        	where:{
    	        		siteid:myReq.siteid,
    	        		datetaken:{
        	               [Op.between]:[myReq.datefrom,myReq.dateto] 
        	            }
    	        	}
    	        }).then(uptime=>{
    	        	res.setHeader('Content-Type', 'application/json');
    		        res.send(JSON.stringify({status:20,result:uptime}));
    	        }) 
            }
            catch(err){
                res.setHeader('Content-Type', 'application/json');             
                res.send(JSON.stringify({status:25,message:'err'}));
            }
	        
	 }


	 
     

    static devicePowerTime(req,res,next){
            let myReq;
	        if(req.method == 'POST'){
	          myReq = req.fields;
	        }
	        else if(req.method == 'GET'){
	          myReq = req.query;
	        }
	        
	        
	        try{
                   User.findOne({
        	           where:{apikey:myReq.apikey}
        	       }).then(user=>{
        	           if(user){
        	              PowerTime.findAll({
            	           where:{
            	               userid:user.id,
            	               duid:myReq.duid,
            	               status:1,
            	               datetaken:{
            	                  [Op.between]:[myReq.datefrom,myReq.dateto] 
            	               }
            	            }
            	          }).then(power=>{
            	              res.setHeader('Content-Type', 'application/json');
        		              res.send(JSON.stringify({status:20,result:power}));
            	          });
        	           }
        	           else{
        	              res.setHeader('Content-Type', 'application/json');
        		          res.send(JSON.stringify({status:22,message:'Not allowed'}));
        	           }
        	           
        	       }); 
            }
            catch(err){
                res.setHeader('Content-Type', 'application/json');             
                res.send(JSON.stringify({status:25,message:'err'}));
            }
	       
	       
	       
    }
    
    
    
    static deviceOffTime(req,res,next){
            let myReq;
	        if(req.method == 'POST'){
	          myReq = req.fields;
	        }
	        else if(req.method == 'GET'){
	          myReq = req.query;
	        }
	       
	        try{
                   User.findOne({
        	           where:{apikey:myReq.apikey}
        	       }).then(user=>{
        	           if(user){
        	              PowerTime.findAll({
            	           where:{
            	               userid:user.id,
            	               duid:myReq.duid,
            	               status:0,
            	               datetaken:{
            	                  [Op.between]:[myReq.datefrom,myReq.dateto] 
            	               }
            	            }
            	          }).then(power=>{
            	              res.setHeader('Content-Type', 'application/json');
        		              res.send(JSON.stringify({status:20,result:power}));
            	          });
        	           }
        	           else{
        	              res.setHeader('Content-Type', 'application/json');
        		          res.send(JSON.stringify({status:22,message:'Not allowed'}));
        	           }
        	           
        	       });
            }
            catch(err){
                res.setHeader('Content-Type', 'application/json');             
                res.send(JSON.stringify({status:25,message:'err'}));
            }
            
	       
	       
    }

    


    static saveTankLevel(duid,gauge){
		                            
	         
	  	     try{

                  return new Promise(function(resolve,reject){
                        GenDevice.findOne({
		             		where:{duid:duid}
		             	}).then(device=>{
		             		if(device){
		             		     if(device.sensortype == 1){
		             		         var intercept = 25.9587/1;
                                     var slope = 0.07370668/1;
                                     var realgauge = intercept + (slope * (gauge)/1);
                                     
                                     var finalValue = (((device.avar/1) * realgauge) - (device.cvar/1)) + parseFloat(device.clearance);// this is the adjusted value to accomodate irregular tanks
    		                         GenDevice.update(
    		                          {gauge:finalValue},
    		                          {where:{duid:duid}}
    		                         ).then(()=>{
    		                             GenDevice.update(
        		                          {gauge:finalValue},
        		                          {where:{id:device.gendeviceid}}
        		                         ).then(()=>{
        		                       	   resolve(1);
        		                         }); 
    		                         }); 
		             		     }
		             		     else{
		             		         
		             		         if((gauge > device.tankheight) || gauge <= 0){
		             		             
		             		         }
		             		         else{
		             		             GenDevice.update(
        		                          {gauge:parseFloat(gauge)},
        		                          {where:{duid:duid}}
        		                         ).then(()=>{
        		                       	    GenDevice.update(
            		                          {gauge:parseFloat(gauge)},
            		                          {where:{id:device.gendeviceid}}
            		                         ).then(()=>{
            		                       	   resolve(1);
            		                         }); 
        		                         }) 
		             		         }
		             		         
		             		         
		             		     }
                                 
		             		}else{
		             			reject(0);
		             		}
		             		
		             	});
                  });
	                
		      }
	          catch(error){
	         	    res.setHeader('Content-Type', 'application/json');
	                res.send(JSON.stringify({status:25,message:'error'}));
	          }
	  }







    static loginDevice(data){
    	return new Promise(function(resolve,reject){
            if(data.duid.toString().startsWith('23')){
                GenDevice.findOne({
                	where:{
                		duid: data.duid.toString()
                	}
                }).then(mydevice=>{
                	 if(mydevice){
                        resolve({status:20,device:mydevice});
                	 }
                	 else{
                        resolve({status:70,device:{}});
                	 }
                }).catch(err=>{
                     reject({status:71,device:err});
                });
                
            }
            else if(data.duid.toString().startsWith('24')){

            	 PhcnDevice.findOne({
                	where:{
                		duid: data.duid.toString()
                	}
                 }).then(mydevice=>{
                	 if(mydevice){
                        resolve({status:20,device:mydevice});
                	 }
                	 else{
                        resolve({status:70,device:{}});
                	 }
                 }).catch(err=>{
                     reject({status:71,device:err});
                 });

            }
            else if(data.duid.toString().startsWith('59')){
                
                 console.log("*********************************** ######################### inverter device ##################### ******************************************");

            	 InverterDevice.findOne({
                	where:{
                		duid: data.duid.toString()
                	}
                 }).then(mydevice=>{
                	 if(mydevice){
                        resolve({status:20,device:mydevice});
                	 }
                	 else{
                        resolve({status:70,device:{}});
                	 }
                 }).catch(err=>{
                     reject({status:71,device:err});
                 });

            }
    	});
    }
    
    
    
    
    static InverterLogin(data){
        return new Promise(function(resolve,reject){
            console.log("*********************************** ######################### inverter device ##################### ******************************************");

        	 InverterDevice.findOne({
            	where:{
            		duid: data.duid.toString()
            	}
             }).then(mydevice=>{
            	 if(mydevice){
                    resolve({status:20,device:mydevice});
            	 }
            	 else{
                    resolve({status:70,device:{}});
            	 }
             }).catch(err=>{
                 reject({status:71,device:err});
             });
    	});
    }


    static saveInverterBatteryData(data){
        return new Promise(function(resolve,reject){
            console.log("*********************************** ######################### inverter device ##################### ******************************************");

        	 InverterDevice.findOne({
            	where:{
            		duid: data.duid
            	}
             }).then(mydevice=>{
                 var v1 = (data.voltages[0]/1) >= 15 ? 14.96 : (data.voltages[0]/1);
                 var v2 = (data.voltages[1]/1) >= 15 ? 14.96 : (data.voltages[1]/1);
                 var v3 = (data.voltages[2]/1) >= 15 ? 14.96 : (data.voltages[2]/1);
                 var v4 = (data.voltages[3]/1) >= 15 ? 14.96 : (data.voltages[3]/1);
                 var v5 = (data.voltages[4]/1) >= 15 ? 14.96 : (data.voltages[4]/1);
                 var v6 = (data.voltages[5]/1) >= 15 ? 14.96 : (data.voltages[5]/1);
                 var v7 = (data.voltages[6]/1) >= 15 ? 14.96 : (data.voltages[6]/1);
                 var v8 = (data.voltages[7]/1) >= 15 ? 14.96 : (data.voltages[7]/1);
            	
            	 InverterDevice.update(
            	   {
            	        charging_current: data.current,
                        vbat1: v1,
                        vbat2: v2,
                        vbat3: v3,
                        vbat4: v4,
                        vbat5: v5,
                        vbat6: v6,
                        vbat7: v7,
                        vbat8: v8,
                        /*vbat9: data.voltages[0],
                        vbat10: data.voltages[0],
                        vbat11: data.voltages[0],
                        vbat12: data.voltages[0],
                        vbat13: data.voltages[0],
                        vbat14: data.voltages[0],
                        vbat15: data.voltages[0],
                        vbat16: data.voltages[0],*/
                        tbat1: Math.abs(data.socs[0]/1),
                        tbat2: Math.abs(data.socs[1]/1),
                        tbat3: Math.abs(data.socs[2]/1),
                        tbat4: Math.abs(data.socs[3]/1),
                        tbat5: Math.abs(data.socs[4]/1),
                        tbat6: Math.abs(data.socs[5]/1),
                        tbat7: Math.abs(data.socs[6]/1),
                        tbat8: Math.abs(data.socs[7]/1),
                        /*tbat9: data.temperatures[0],
                        tbat10: data.temperatures[0],
                        tbat11: data.temperatures[0],
                        tbat12: data.temperatures[0],
                        tbat13: data.temperatures[0],
                        tbat14: data.temperatures[0],
                        tbat15: data.temperatures[0],
                        tbat16: data.temperatures[0]*/
            	   },
            	   {
            	     where:{
            	       duid: data.duid 
            	     }    
            	   }
            	 ).then(myresp=>{
            	     resolve({status:20,device:mydevice});
            	 }).catch(err=>{
            	     console.log(err);
            	 })
            	 
            	 
             }).catch(err=>{
                 reject({status:71,device:err});
             });
    	});
    }


    static saveOnnTime(data){

    	return new Promise(function(resolve,reject){
            if(data.duid.startsWith('23')){
                GenDevice.findOne({
                	where:{
                		duid: data.duid
                	}
                }).then(mydevice=>{
                	 if(mydevice){
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
                           
                           GenDevice.update(
	                          {
	                            status:data.devicestatus,
	                            lastupdated: mysdate
	                          },
	                          {where:{duid:mydevice.duid}}
	                       ).then(()=>{
	                            
	                               RunTime.findAll({
	                                  limit: 1,
                                      where: {
                                        duid: data.duid,
                                        datetaken:myDateTaken
                                      },
                                      order: [ [ 'createdAt', 'DESC' ]]
	                               }).then(myruntime=>{
                                	if(myruntime.length){
                                	   var mycurrentRuntime = myruntime[0];
                                	   console.log(" starting run time from  onn ");
                                	   console.log(0);
                                	   
                                	   PowerTime.create({
        	                              userid: mydevice.userid,
        	    						  siteid: mydevice.siteid,
        	    						  duid: mydevice.duid,
        	    					      timetaken: myTimeTaken,
        	    				     	  datetaken: myDateTaken,
        	    				     	  workingtimetaken: myTimeTaken,
                                          workingdatetaken: myDateTaken,
        	    				     	  startingduration: mycurrentRuntime.duration,
        	    				     	  status:1,
        	    				     	  isactive: 1
        	                           }).then(mypowertime=>{
        	                               resolve({status:20,device:mydevice});
        	                           })
                                       
                                	}
                                	else{
                                	    PowerTime.create({
        	                              userid: mydevice.userid,
        	    						  siteid: mydevice.siteid,
        	    						  duid: mydevice.duid,
        	    					      timetaken: myTimeTaken,
        	    				     	  datetaken: myDateTaken,
        	    				     	  workingtimetaken: myTimeTaken,
                                          workingdatetaken: myDateTaken,
        	    				     	  startingduration: 0,
        	    				     	  status:1,
        	    				     	  isactive: 1
        	                           }).then(mypowertime=>{
        	                               RunTime.create({
                                                duid: mydevice.duid,
    										    userid: mydevice.userid,
    										    siteid: mydevice.siteid,
    										    startingduration: 0,
    										    duration: 0,
    										    datetaken: myDateTaken
                                           }).then(()=>{
                                           	   resolve({status:20,device:mydevice});
                                           })
        	                               
        	                           })
                                	    
                                	}
                                  })
	                           
	    
                          });
                	 }
                	 else{
                        resolve({status:70,device:{}});
                	 }
                }).catch(err=>{
                     reject({status:71,device:err});
                });
            }
            else if(data.deviceid.toString().startsWith('24')){

            	 PhcnDevice.findOne({
                	where:{
                		duid: data.duid.toString()
                	}
                 }).then(mydevice=>{
                	 if(mydevice){
                        resolve({status:20,device:mydevice});
                	 }
                	 else{
                        resolve({status:70,device:{}});
                	 }
                 }).catch(err=>{
                     reject({status:71,device:err});
                 });

            }
            else if(data.deviceid.toString().startsWith('25')){

            	 InverterDevice.findOne({
                	where:{
                		duid: data.duid.toString()
                	}
                 }).then(mydevice=>{
                	 if(mydevice){
                        resolve({status:20,device:mydevice});
                	 }
                	 else{
                        resolve({status:70,device:{}});
                	 }
                 }).catch(err=>{
                     reject({status:71,device:err});
                 });

            }
    	});
    }
    



    static saveOffTime(data){

    	return new Promise(function(resolve,reject){
            if(data.duid.toString().startsWith('23')){
                GenDevice.findOne({
                	where:{
                		duid: data.duid
                	}
                }).then(mydevice=>{
                	 if(mydevice){
                	     
                	           GenDevice.update(
                                  {status:data.devicestatus},
                                  {where:{duid:mydevice.duid}}
                               ).then(()=>{
                                   
                                   PowerTime.findAll({
                                      limit: 1,
                                      where: {
                                        duid: data.duid.toString(),
                                        status: 1,
                                        isactive: 1
                                      },
                                      order: [ [ 'createdAt', 'DESC' ]]
                                   }).then(myonnpowertime=>{
                                       if(myonnpowertime.length > 0){
                                           var mylastpower = myonnpowertime[0];
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
                                           
                                           PowerTime.create({
            	                              userid: mydevice.userid,
            	    						  siteid: mydevice.siteid,
            	    						  duid: mydevice.duid,
            	    					      timetaken: myTimeTaken,
            	    				     	  datetaken: myDateTaken,
            	    				     	  workingtimetaken: myTimeTaken,
                                              workingdatetaken: myDateTaken,
            	    				     	  status:0,
            	    				     	  isactive: 0,
            	                           }).then(()=>{
            	                               
            	                               PowerTime.update(
            	                                   {
            	                                      isactive: 0 
            	                                   },
            	                                   {
            	                                       where:{
            	                                           duid: data.duid.toString()
            	                                       }
            	                                   }
            	                               ).then(()=>{
            	                                   resolve({status:20,device:mydevice});
            	                               })
            	                               
            	                              
            	                           }).catch(err=>{
            	                               console.log(err);
            	                           })
            	                           
                                           
                                           
                                           
                                       }
                                   }).catch(err=>{
                                       console.log(err);
                                   })
                                   
                                   
            
                              });
                	    
                	 }
                	 else{
                        resolve({status:70,device:{}});
                	 }
                }).catch(err=>{
                     reject({status:71,device:err});
                });
            }
            else if(data.deviceid.toString().startsWith('24')){

            	 PhcnDevice.findOne({
                	where:{
                		duid: data.duid.toString()
                	}
                 }).then(mydevice=>{
                	 if(mydevice){
                        resolve({status:20,device:mydevice});
                	 }
                	 else{
                        resolve({status:70,device:{}});
                	 }
                 }).catch(err=>{
                     reject({status:71,device:err});
                 });

            }
            else if(data.deviceid.toString().startsWith('25')){

            	 InverterDevice.findOne({
                	where:{
                		duid: data.duid.toString()
                	}
                 }).then(mydevice=>{
                	 if(mydevice){
                        resolve({status:20,device:mydevice});
                	 }
                	 else{
                        resolve({status:70,device:{}});
                	 }
                 }).catch(err=>{
                     reject({status:71,device:err});
                 });

            }
    	});
    }
    






    static saveDeviceData(data){
        console.log("saving device data");
    	return new Promise(function(resolve,reject){
            if(data.duid.toString().startsWith('23')){
                GenDevice.findOne({
                	where:{
                		duid: data.duid
                	}
                }).then(mydevice=>{
                	 if(mydevice){
                	       var mysdt = new Date();
                	       var sTimeTaken = (mysdt.getHours())+":"+mysdt.getMinutes()+":"+mysdt.getSeconds();
                           var sDateTaken = mysdt.getFullYear()+"-"+(mysdt.getMonth()+1)+"-"+mysdt.getDate();
                           
                           var mysdate = sDateTaken+" "+sTimeTaken;
                           
                           GenDevice.update(
	                          {
	                          	status: data.devicestatus,
	                          	lastupdated: mysdate
	                          },
	                          {where:{duid:mydevice.duid}}
	                       ).then(()=>{
	                               
	                               if(data.devicestatus == '1'){
	                                    
	                                       PowerTime.findAll({
            	                              limit: 1,
                                              where: {
                                                duid: data.duid,
                                                status: 1,
                                                isactive: 1
                                              },
                                              order: [ [ 'createdAt', 'DESC' ]]
            	                           }).then(myonnpowertime=>{
            	                               if(myonnpowertime.length > 0){
            	                                   var mylastpower = myonnpowertime[0];
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
                        	                       
                        	                       
            	                                   
            	                                   RunTime.findOne(
                	                                  {
                	                                    where:{
                	                                     duid:mydevice.duid,
                	                                     datetaken:myDateTaken
                	                                    }
                	                                  }
                	                               ).then(runtime=>{
                                                	if(!runtime){
                                                       RunTime.create({
                                                            duid: mydevice.duid,
                										    userid: mydevice.userid,
                										    siteid: mydevice.siteid,
                										    duration: ((totalSecondsElapsed/1)),
                										    startingduration: 0,
                										    datetaken: myDateTaken
                                                       }).then(()=>{
                                                          PowerTime.update(
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
                                                          ).then(()=>{
                                                              resolve({status:20,device:mydevice});
                                                          })
                                                       })
                                                	}
                                                	else{
                                                	   console.log(" starting run time from device data ");
                                        	           console.log(mylastpower.startingduration);
                                                       RunTime.update(
                                                       	  {duration:((mylastpower.startingduration/1) +(totalSecondsElapsed/1))},
                                                       	  {where:{duid:mydevice.duid,datetaken:myDateTaken}}
                                                       	).then(()=>{
                                                       	  resolve({status:20,device:mydevice});
                                                       })
                                                	}
                                                  })
            	                                   
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
                        	                       
            	                                   RunTime.findAll({
                	                                  limit: 1,
                                                      where: {
                                                        duid: data.duid,
                                                        datetaken:myDateTaken
                                                      },
                                                      order: [ [ 'createdAt', 'DESC' ]]
                	                               }).then(myruntime=>{
                                                    	if(myruntime.length > 0){
                                                    	   var mycurrentRuntime = myruntime[0];
                                                    	   console.log(" starting run time from  onn ");
                                                    	   console.log(0);
                                                    	   
                                                    	   PowerTime.create({
                            	                              userid: mydevice.userid,
                            	    						  siteid: mydevice.siteid,
                            	    						  duid: mydevice.duid,
                            	    					      timetaken: myTimeTaken,
                            	    				     	  datetaken: myDateTaken,
                            	    				     	  workingtimetaken: myTimeTaken,
                                                              workingdatetaken: myDateTaken,
                            	    				     	  startingduration: mycurrentRuntime.duration,
                            	    				     	  status:1,
                            	    				     	  isactive: 1
                            	                           }).then(mypowertime=>{
                            	                               resolve({status:20,device:mydevice});
                            	                           })
                                                           
                                                    	}
                                                    	else{
                                                    	   PowerTime.create({
                            	                              userid: mydevice.userid,
                            	    						  siteid: mydevice.siteid,
                            	    						  duid: mydevice.duid,
                            	    					      timetaken: myTimeTaken,
                            	    				     	  datetaken: myDateTaken,
                            	    				     	  workingtimetaken: myTimeTaken,
                                                              workingdatetaken: myDateTaken,
                            	    				     	  startingduration: 0,
                            	    				     	  status:1,
                            	    				     	  isactive: 1
                            	                           }).then(mypowertime=>{
                            	                               RunTime.create({
                                                                    duid: mydevice.duid,
                        										    userid: mydevice.userid,
                        										    siteid: mydevice.siteid,
                        										    duration: 0,
                        										    startingduration: 0,
                        										    datetaken: myDateTaken
                                                               }).then(()=>{
                                                                  resolve({status:20,device:mydevice});
                                                               })
                            	                               
                            	                           })
                                                    	}
                	                               })
            	                                   
            	                               }
            	                           })
	                                   
	                                   
	                               }
                                 
                                   
	    
                          });
                	 }
                	 else{
                        resolve({status:70,device:{}});
                	 }
                }).catch(err=>{
                     reject({status:71,device:err});
                });
            }
            else if(data.deviceid.toString().startsWith('24')){

            	 PhcnDevice.findOne({
                	where:{
                		duid: data.duid.toString()
                	}
                 }).then(mydevice=>{
                	 if(mydevice){
                        resolve({status:20,device:mydevice});
                	 }
                	 else{
                        resolve({status:70,device:{}});
                	 }
                 }).catch(err=>{
                     reject({status:71,device:err});
                 });

            }
            else if(data.deviceid.toString().startsWith('25')){

            	 InverterDevice.findOne({
                	where:{
                		duid: data.duid.toString()
                	}
                 }).then(mydevice=>{
                	 if(mydevice){
                        resolve({status:20,device:mydevice});
                	 }
                	 else{
                        resolve({status:70,device:{}});
                	 }
                 }).catch(err=>{
                     reject({status:71,device:err});
                 });

            }
    	});
    }
    



    static saveTankStatus(data){

          return new Promise(function(resolve,reject){
                GenDevice.findOne({
                  where:{
                    duid: data.duid.toString()
                  }
                }).then(mydevice=>{
                   if(mydevice){
                         if(mydevice.sensortype == 1){
                             var intercept = 25.9587/1;
                             var slope = 0.07370668/1;
                             var realgauge = intercept + (slope * (data.gauge)/1);
                             var adjusted = ((1.36121270304068 * realgauge) -17.4675091483413);
                             
                             var finalValue = (((mydevice.avar/1) * adjusted) - (mydevice.cvar/1)) + parseFloat(mydevice.clearance);// this is the adjusted value to accomodate irregular tanks
                             
                             console.log("##########################################################################################");
                             
                             console.log(finalValue);
                             console.log("##########################################################################################");
                             GenDevice.update(
                                {
                                  gauge: finalValue,
                                  voltage: data.voltage
                                },
                                {
                                  where:{
                                    duid:mydevice.duid
                                  }
                                }
                             ).then(()=>{
                                resolve({status:20,device:mydevice});
                             });
                         }
                         else{
                             var realgauge = parseFloat(data.gauge);
                             if((realgauge > parseFloat(mydevice.tankheight)) ||  realgauge <= 0){
                                 
                             }
                             else{
                                 GenDevice.update(
                                    {
                                      gauge: realgauge,
                                      voltage: data.voltage
                                    },
                                    {
                                      where:{
                                        duid:mydevice.duid
                                      }
                                    }
                                 ).then(()=>{
                                    resolve({status:20,device:mydevice});
                                 });
                             }
                         }
                         
                   }
                   else{
                        resolve({status:70,device:{}});
                   }
                }).catch(err=>{
                     reject({status:71,device:err});
                });
          });
    }




    static saveTankGauge(data){

          return new Promise(function(resolve,reject){
                GenDevice.findOne({
                  where:{
                    duid: data.duid.toString()
                  }
                }).then(mydevice=>{
                   if(mydevice){
                       if(mydevice.sensortype == 1){
                             var intercept = 25.9587/1;
                             var slope = 0.07370668/1;
                             var realgauge = intercept + (slope * (data.gauge)/1);
                             
                             var adjusted = ((1.36121270304068 * realgauge) -17.4675091483413);
                             
                             var finalValue = (((mydevice.avar/1) * adjusted) - (mydevice.cvar/1)) + parseFloat(mydevice.clearance);// this is the adjusted value to accomodate irregular tanks
                             
                             
                             console.log("##########################################################################################");
                             
                             console.log(finalValue);
                             console.log("##########################################################################################");
                             GenDevice.update(
                                {
                                  status: data.status,
                                  gauge: finalValue,
                                  voltage: data.voltage
                                },
                                {
                                  where:{
                                    duid:mydevice.duid
                                  }
                                }
                             ).then(()=>{
                                 console.log(data.duid.toString());
                                 FuelGauge.create({
                                    duid: data.duid.toString(),
                                    userid: mydevice.userid,
                                    siteid: mydevice.siteid,
                                    gauge: finalValue,
                                    datetaken: data.datetaken,
                                    timetaken: data.timetaken
                                 }).then(mygauge=>{
                                     GenDevice.update(
    		                          {gauge:parseFloat(finalValue)},
    		                          {where:{id:mydevice.gendeviceid}}
    		                         ).then(()=>{
    		                       	   console.log(mygauge," my devices data gauge");
                                        resolve({status:20,device:mydevice});
    		                         });
                                    
                                    
                                 });
                             });
                       }
                       else{
                           
                           if((parseFloat(data.gauge) > parseFloat(mydevice.tankheight)) || parseFloat(data.gauge) <= 0){
                               console.log("correct tank height   kdkddkdkdkdkdkdddd");
                           }
                           else{
                               
                               var adjustedGauge = (data.gauge/1) + parseFloat(mydevice.clearance);
                               GenDevice.update(
                                  {
                                    status: data.status,
                                    gauge: finalValue,
                                    voltage: data.voltage
                                  },
                                  {
                                    where:{
                                      duid:mydevice.duid
                                    }
                                  }
                               ).then(()=>{
                                   console.log(data.duid.toString());
                                   FuelGauge.create({
                                      duid: data.duid.toString(),
                                      userid: mydevice.userid,
                                      siteid: mydevice.siteid,
                                      gauge: adjustedGauge,
                                      datetaken: data.datetaken,
                                      timetaken: data.timetaken
                                   }).then(mygauge=>{
                                       
                                         GenDevice.update(
        		                          {gauge:parseFloat(adjustedGauge)},
        		                          {where:{id:mydevice.gendeviceid}}
        		                         ).then(()=>{
        		                       	   console.log(mygauge," my devices data gauge");
                                            resolve({status:20,device:mydevice});
        		                         });
                                      
                                   });
                               });
                                   
                           }

                           
                           
                       }
                   }
                   else{
                        resolve({status:70,device:{}});
                   }
                }).catch(err=>{
                     reject({status:71,device:err});
                });
          });
    }






    static saveDeviceFuelCon(data){

    	return new Promise(function(resolve,reject){
            if(data.duid.toString().startsWith('23')){
                GenDevice.findOne({
                	where:{
                		duid: data.duid.toString()
                	}
                }).then(mydevice=>{
                	 if(mydevice){
                	 	   var mygauge = data.gauge == 0 ? mydevice.gauge : data.gauge;
                           GenDevice.update(
	                          {
	                          	voltage: data.voltage,
	                          	gauge: mygauge 
	                          },
	                          {where:{duid:mydevice.duid}}
	                       ).then(()=>{
	                           
                                 var nowDate = new Date();
                                 var mydate = nowDate.getFullYear()+'-'+(nowDate.getMonth() + 1)+'-'+nowDate.getDate();
                                 var fuelconsumed = 0;

                                 if(mydevice.gauge > data.gauge){
                                     fuelconsumed = mydevice.gauge - data.gauge;
                                 }
                                 else if(data.gauge > mydevice.gauge){
                                     fuelconsumed = data.gauge - mydevice.gauge;
                                 }
                                 else{
                                 	fuelconsumed = 0;
                                 }

                                 FConsumption.findOne(
                                    {where:{duid:mydevice.duid,datetaken:mydate}}
                                  ).then(fconsumption=>{
                                  	 if(!fconsumption){
                                  	     
                                  	     
                                        FConsumption.create({
                                            duid: mydevice.duid,
					                        userid: mydevice.userid,
					                        siteid: mydevice.siteid,
					                        consumption: fuelconsumed,
					                        datetaken: mydate
                                        }).then(()=>{
                                            resolve({status:20,device:mydevice});
                                        })
                                        
                                        
                                  	 }
                                  	 else{
                                  	 	var myconsumption = (Number(fconsumption.consumption)/1) + (Number(fuelconsumed)/1);
                                  	 	FConsumption.update(
                                  	 	    {consumption:myconsumption},
                                  	 		{where:{duid:mydevice.duid,datetaken:mydate}}
                                  	 	).then(()=>{
                                           resolve({status:20,device:mydevice});
                                  	 	})
                                  	 	
                                  	 }
                                  })


	    
                          });
                	 }
                	 else{
                        resolve({status:70,device:{}});
                	 }
                }).catch(err=>{
                     reject({status:71,device:err});
                });
            }
            else if(data.deviceid.toString().startsWith('24')){

            	 PhcnDevice.findOne({
                	where:{
                		duid: data.duid.toString()
                	}
                 }).then(mydevice=>{
                	 if(mydevice){
                        resolve({status:20,device:mydevice});
                	 }
                	 else{
                        resolve({status:70,device:{}});
                	 }
                 }).catch(err=>{
                     reject({status:71,device:err});
                 });

            }
            else if(data.deviceid.toString().startsWith('25')){

            	 InverterDevice.findOne({
                	where:{
                		duid: data.duid.toString()
                	}
                 }).then(mydevice=>{
                	 if(mydevice){
                        resolve({status:20,device:mydevice});
                	 }
                	 else{
                        resolve({status:70,device:{}});
                	 }
                 }).catch(err=>{
                     reject({status:71,device:err});
                 });

            }
    	});
    }

    
    
    
    static updateGauge2(){
        var myrawdate = new Date();
        var cHour = parseInt(myrawdate.getHours() + 1) >= 24 ? 0 : parseInt(myrawdate.getHours());
        var cMinutes = parseInt(myrawdate.getMinutes()) >= 60 ? 0 : parseInt(myrawdate.getMinutes());
        var cSeconds = parseInt(myrawdate.getSeconds()) >= 60 ? 0 : parseInt(myrawdate.getSeconds());
        
        if(cHour == 22 && cMinutes >= 30){
            
            GenDevice.findAll({
                where:{
                    duid: {
                      [Op.like]: '235%'
                    }
                }
            }).then(myresp=>{
                 if(myresp.length > 1){
                     
                     for(var i = 0;i<myresp.length;++i){
                        var foundDevice = myresp[i];
                        
                        GenDevice.findOne(
                            {
                              gauge2: foundDevice.gauge
                            },
                            {
                              where:{
                                  id: foundDevice.id
                              }  
                            }
                        ).then(()=>{
                            GenDevice.update(
                              {
                                gauge2:foundDevice.gauge  
                              },
                              {
                                 where:{
                                     id: foundDevice.gendeviceid
                                 } 
                              }
                            ).then(()=>{
                                
                            }) 
                        })
                        
                     }
                     
                 }
                
            }).then(()=>{
                //resolve({status:20,device:{}});
            })
            
        }
        
    }
    
    
    
    
    static checkActiveGenDevices(data){

          return new Promise(function(resolve,reject){
                
                GenDevice.findAll({
                    where:{
                        duid: {
                          [Op.like]: '23%'
                        }
                    }
                }).then(myresp=>{
                    for(var i = 0;i<myresp.length;++i){
                        var foundDevice = myresp[i];
                        
                        if(foundDevice.status == 1 && foundDevice.is_linked == 0){
                            
                            var d2 = new Date ();
                            var d1 = new Date (foundDevice.lastupdated);
                            
                            var minutesElapsed = (d2.getTime() - d1.getTime())/60000;
                            console.log(d2);
                            console.log(d1);
                            
                            
                            
                            if(minutesElapsed >= 15){
                                
                               PowerTime.update(
                                   {
                                      isactive: 0 
                                   },
                                   {
                                       where:{
                                           duid: foundDevice.duid
                                       }
                                   }
                               ).then(()=>{
                                   
                               })
                                  
                               GenDevice.update(
                                  {
                                      status:0,
                                      frequency: 0,
                                      voltagea: 0,
                                      voltageb: 0,
                                      voltagec: 0,
                                      currenta: 0,
                                      currentb: 0,
                                      currentc: 0,
                                      powerfactora: 0,
                                      powerfactorb: 0,
                                      powerfactorc: 0,
                                      activepower: 0,
                                      reactivepower: 0
                                  },
                                  {where:{duid:foundDevice.duid}}
                               ).then(()=>{
                                   
                        	       console.log("8888888888888888888888888888888888888888888888888888888888888888888888 checking off 2 888888888888888888888888888888888888888888888888888888888888888888888");
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
        	                       
        	                       
        	                       console.log("8888888888888888888888888888888888888888888888888888888888888888888888 checking off 3 888888888888888888888888888888888888888888888888888888888888888888888");
                        	       
            	                   currentTime.setSeconds( currentTime.getSeconds() - 900);
            	       
                            	   var myTimeTaken = (currentTime.getHours())+":"+currentTime.getMinutes()+":"+currentTime.getSeconds();
                            	   var myDateTaken = currentTime.getFullYear()+"-"+(currentTime.getMonth()+1)+"-"+currentTime.getDate();
                            	   
                            	   console.log("8888888888888888888888888888888888888888888888888888888888888888888888 checking off 4 888888888888888888888888888888888888888888888888888888888888888888888");
                                   
                                   PowerTime.create({
    	                              userid: foundDevice.userid,
    	    						  siteid: foundDevice.siteid,
    	    						  duid: foundDevice.duid,
    	    					      timetaken: myTimeTaken,
    	    				     	  datetaken: myDateTaken,
    	    				     	  workingtimetaken: myTimeTaken,
                                      workingdatetaken: myDateTaken,
    	    				     	  status:0,
    	    				     	  isactive: 0,
    	                           }).then(()=>{
    	                               
    	                               console.log("8888888888888888888888888888888888888888888888888888888888888888888888 checking off 5 888888888888888888888888888888888888888888888888888888888888888888888");
    	                              
    	                           }).catch(err=>{
    	                               console.log(err);
    	                           })
                                   
                                   
            
                              });
                            }
                        }
                        
                    }
                }).then(()=>{
                    resolve({status:20,device:{}});
                })
                
                
                 
          });
    }

	
	
	static getOffTime(req,res,next){
            let myReq;
	        if(req.method == 'POST'){
	          myReq = req.fields;
	        }
	        else if(req.method == 'GET'){
	          myReq = req.query;
	        }
	        
	        
	        try{
                    User.findOne({
                    	where:{apikey:myReq.apikey}
                    }).then(user=>{
                       if(user){
                           
                            Genofftime.findAll(
                               {
                                   where:{
                                       duid: myReq.duid,
                                       datetaken:{
                    	                 [Op.between]:[myReq.datefrom,myReq.dateto] 
                    	               },
                    	               userid: user.id
                                   }
                               }
                           	).then(offtime=>{
        			        	res.setHeader('Content-Type', 'application/json');
        				        res.send(JSON.stringify({status:20,message:offtime}));
        			        })
                       }
                       else{
        	            	  res.setHeader('Content-Type', 'application/json');
        				      res.send(JSON.stringify({status:22,message:'invalid user'}));
        			   }
                    })
            }
            catch(err){
                res.setHeader('Content-Type', 'application/json');             
                res.send(JSON.stringify({status:25,message:'err'}));
            }
            
            
	            
	 }
	 
	 
	 
	 
	 static saveUnderVoltageReport(data){
        return new Promise((resolve,reject)=>{
             InverterDevice.findOne({
                where:{
                    duid:data.duid
                }
             }).then(myInverterDevice=>{
                 if(myInverterDevice){
                     var currentTime = new Date();
                     var myTimeTaken = (currentTime.getHours())+":"+currentTime.getMinutes()+":"+currentTime.getSeconds();
                     var myDateTaken = currentTime.getFullYear()+"-"+(currentTime.getMonth()+1)+"-"+currentTime.getDate();
                     InverterBatteryUndervoltageReport.create({
                        siteid: myInverterDevice.siteid,
                        userid: myInverterDevice.userid,
                        duid: myInverterDevice.duid,
                        voltage1: data.voltage1,
                        voltage2: data.voltage2,
                        voltage3: data.voltage3,
                        voltage4: data.voltage4,
                        voltage5: data.voltage5,
                        voltage6: data.voltage6,
                        voltage7: data.voltage7,
                        voltage8: data.voltage8,
                        datetaken: myDateTaken,
                        timetaken: myTimeTaken,
                     }).then(myReport=>{
                         resolve("successfully saved");
                     }).catch(err=>{
                         console.log(err);
                         reject(err);
                     });
                     
                 }
                 else{
                     reject("Invalid device");
                 }
             }).catch(err=>{
                 console.log(err);
                 reject(err);
             });
        });
    }
    
    
    
    static getInverterUnderVoltageReport(req,res,next){
        
        let myReq;
	    if(req.method == 'POST'){
	        myReq = req.fields;
	    }
	    else if(req.method == 'GET'){
	       myReq = req.query;
	    }
	    
	    
	    try{
                User.findOne({
                	where:{apikey:myReq.apikey}
                }).then(user=>{
                   if(user){
                       
                         InverterDevice.findOne({
                            where:{
                                duid:myReq.duid,
                                userid: user.id
                            },
                            include:[{model:Site,required:true}]
                         }).then(myInverterDevice=>{
                             if(myInverterDevice){
                                 InverterBatteryUndervoltageReport.findAll({
                                     where:{
                                         duid:myReq.duid,
                                         datetaken:{
                                             [Op.between]:[myReq.datefrom,myReq.dateto]
                                         }
                                     }
                                 }).then(myReport=>{
                                      res.setHeader('Content-Type', 'application/json');
    				                  res.send(JSON.stringify({status:20,message:myReport}));
                                 }).catch(err=>{
                                     console.log(err);
                                     res.setHeader('Content-Type', 'application/json');
    				                 res.send(JSON.stringify({status:22,message:'error'}));
                                 });
                                 
                             }
                             else{
                                 res.setHeader('Content-Type', 'application/json');
    				             res.send(JSON.stringify({status:22,message:'invalid device'}));
                             }
                         }).catch(err=>{
                             console.log(err);
                             res.setHeader('Content-Type', 'application/json');
    				         res.send(JSON.stringify({status:22,message:'error'}));
                         });
                        
                   }
                   else{
    	            	  res.setHeader('Content-Type', 'application/json');
    				      res.send(JSON.stringify({status:22,message:'invalid user'}));
    			   }
                })
        }
        catch(err){
            res.setHeader('Content-Type', 'application/json');             
            res.send(JSON.stringify({status:25,message:'err'}));
        }
        
    }
    
    
    
    
    
    static getAllInverterUnderVoltageReport(req,res,next){
        
        let myReq;
	    if(req.method == 'POST'){
	        myReq = req.fields;
	    }
	    else if(req.method == 'GET'){
	       myReq = req.query;
	    }
	    
	    
	    try{
                User.findOne({
                	where:{apikey:myReq.apikey}
                }).then(user=>{
                   if(user){
                       
                        InverterBatteryUndervoltageReport.findAll({
                             where:{
                                 userid:user.id,
                                 siteid:myReq.siteid,
                                 datetaken:{
                                     [Op.between]:[myReq.datefrom,myReq.dateto]
                                 }
                             },
                             include:[{model:Site,required:true}]
                         }).then(myReport=>{
                              res.setHeader('Content-Type', 'application/json');
			                  res.send(JSON.stringify({status:20,message:myReport}));
                         }).catch(err=>{
                             console.log(err);
                             res.setHeader('Content-Type', 'application/json');
			                 res.send(JSON.stringify({status:22,message:'error'}));
                         });
                        
                   }
                   else{
    	            	  res.setHeader('Content-Type', 'application/json');
    				      res.send(JSON.stringify({status:22,message:'invalid user'}));
    			   }
                })
        }
        catch(err){
            res.setHeader('Content-Type', 'application/json');             
            res.send(JSON.stringify({status:25,message:'err'}));
        }
        
    }







    static checkBatterySoc(data){
        return new Promise((resolve,reject)=>{
              if(data.voltages[0] < 12.05 || data.voltages[1] < 12.05 || data.voltages[2] < 12.05 || data.voltages[3] < 12.05 || data.voltages[4] < 12.05 || data.voltages[5] < 12.05 || data.voltages[6] < 12.05 || data.voltages[7] < 12.05 ){
                    
                    InverterDevice.findOne({
                        where:{
                            duid: data.duid
                        }
                    }).then(myInverter=>{
                        
                        var currentTime = new Date();
                        var myTimeTaken = (currentTime.getHours())+":"+currentTime.getMinutes()+":"+currentTime.getSeconds();
                        var myDateTaken = currentTime.getFullYear()+"-"+(currentTime.getMonth()+1)+"-"+currentTime.getDate();
                        console.log("saving battery soc");
                        InverterBatteryUndervoltageReport.create({
                            siteid: myInverter.siteid,
                            userid: myInverter.userid,
                            duid: myInverter.duid,
                            voltage1: data.voltages[0],
                            voltage2: data.voltages[1],
                            voltage3: data.voltages[2],
                            voltage4: data.voltages[3],
                            voltage5: data.voltages[4],
                            voltage6: data.voltages[5],
                            voltage7: data.voltages[6],
                            voltage8: data.voltages[7],
                            datetaken: myDateTaken,
                            timetaken: myTimeTaken
                        }).then(myReport=>{
                            resolve(myReport);
                        }).catch(err=>{
                            console.log(err);
                            reject(err);
                        });
                        
                    }).catch(err=>{
                        console.log(err);
                        reject(err);
                    });
                  
              }
        })
    }




   
    static getAllDevicesDailyData(req,res,next){
        
        let myReq;
	    if(req.method == 'POST'){
	        myReq = req.fields;
	    }
	    else if(req.method == 'GET'){
	       myReq = req.query;
	    }
	    
	    
	    try{
                User.findOne({
                	where:{apikey:myReq.apikey}
                }).then(user=>{
                   if(user){
                        RunTime.findAll({
                            where:{
                              userid: user.id,
                              siteid: myReq.siteid,
                              datetaken:{
                                 [Op.between]:[myReq.datefrom,myReq.dateto]
                              }
                            },
                            attributes: [
                                'datetaken',
                                [Sequelize.fn('sum', Sequelize.col('duration')), 'duration']
                            ],
                            raw: true,
                            group: ['datetaken']
                        }).then(myGen=>{
                            
                            PhcnDeviceData.findAll({
                                where:{
                                  userid: user.id,
                                  siteid: myReq.siteid,
                                  device_type: 2,
                                  datetaken:{
                                     [Op.between]:[myReq.datefrom,myReq.dateto]
                                  }
                                },
                                attributes: [
                                    'datetaken',
                                    [Sequelize.fn('sum', Sequelize.col('uptime')), 'uptime'],[Sequelize.fn('sum', Sequelize.col('cost')), 'cost'],[Sequelize.fn('sum', Sequelize.col('activeenergy')), 'consumption']
                                ],
                                raw: true,
                                group: ['datetaken']
                            }).then(myPhcn=>{
                                
                                    FConsumption.findAll({
                                        where:{
                                          userid: user.id,
                                          siteid: myReq.siteid,
                                          datetaken:{
                                             [Op.between]:[myReq.datefrom,myReq.dateto]
                                          }
                                        },
                                        attributes: [
                                            'datetaken',
                                            [Sequelize.fn('sum', Sequelize.col('consumption')), 'fuelconsumption']
                                        ],
                                        raw: true,
                                        group: ['datetaken']
                                    }).then(myconsumption=>{
                                        
                                          InverterUptime.findAll({
                                                where:{
                                                  userid: user.id,
                                                  siteid: myReq.siteid,
                                                  datetaken:{
                                                     [Op.between]:[myReq.datefrom,myReq.dateto]
                                                  }
                                                },
                                                attributes: [
                                                    'datetaken',
                                                    [Sequelize.fn('sum', Sequelize.col('duration')), 'inverterduration']
                                                ],
                                                raw: true,
                                                group: ['datetaken']
                                            }).then(myinverterduration=>{
                                                
                                                 res.setHeader('Content-Type', 'application/json');             
                                                 res.send(JSON.stringify({status:20,message:{
                                                    userid: user.id,
                                                    siteid: myReq.siteid,
                                                    datetaken: myReq.date,
                                                    gendata: myGen,
                                                    phcndata: myPhcn,
                                                    fuelconsumption:myconsumption,
                                                    inverterBackUpTime:myinverterduration
                                                 }}));
                                                 
                                            }).catch(err=>{
                                                console.log(err);
                                                res.setHeader('Content-Type', 'application/json');             
                                                res.send(JSON.stringify({status:25,message:'err'}));
                                            });
                                         
                                    }).catch(err=>{
                                        console.log(err);
                                        res.setHeader('Content-Type', 'application/json');             
                                        res.send(JSON.stringify({status:25,message:'err'}));
                                    });
                                    
                                    
                                    
                                 
                            }).catch(err=>{
                                console.log(err);
                                res.setHeader('Content-Type', 'application/json');             
                                res.send(JSON.stringify({status:25,message:'err'}));
                            });
                            
                        }).catch(err=>{
                            console.log(err);
                            res.setHeader('Content-Type', 'application/json');             
                            res.send(JSON.stringify({status:25,message:'err'}));
                        });
                        
                        
                   }
                   else{
    	            	  res.setHeader('Content-Type', 'application/json');
    				      res.send(JSON.stringify({status:22,message:'invalid user'}));
    			   }
                })
        }
        catch(err){
            res.setHeader('Content-Type', 'application/json');             
            res.send(JSON.stringify({status:25,message:'err'}));
        }
        
    }
   
   
    static getGpsDevice(req,res,next){
        let myReq;
        if(req.method == 'POST'){
          myReq = req.fields;
        }
        else if(req.method == 'GET'){
          myReq = req.query;
        }
         
         try{
	       User.findOne({
	          	where:{apikey:myReq.apikey}
	          }).then(user=>{
	              if(user){
					GenDevice.findOne({
						where:{userid:user.id,siteid:myReq.siteid,duid:myReq.duid}
					}).then(device=>{
						res.setHeader('Content-Type', 'application/json');
					   res.send(JSON.stringify({status:20,result:device}));
					}).catch(err=>{
						console.log(err);
					});
	              }else{
	              	res.setHeader('Content-Type', 'application/json');
	                res.send(JSON.stringify({status:22,message:'Invalid user'}));
	              }
	          }); 
	        }
          catch(error){
         	    res.setHeader('Content-Type', 'application/json');
                res.send(JSON.stringify({status:25,message:'error'}));
         }  
	}










	 
}


module.exports = ApiController;