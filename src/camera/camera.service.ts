import { Injectable } from '@nestjs/common';
import * as uuid from "uuid";
import {exec,spawn} from "child_process"
import {InjectModel} from'@nestjs/mongoose'
import {Model} from 'mongoose'
import { Camera } from './camera.model';
import { UserService } from '..//user/user.service';


@Injectable()
export class CameraService {
    private readonly cameras: Camera[];

    constructor(@InjectModel('Camera') private readonly cameraModel:Model<Camera>,
    private readonly userService: UserService) { }

  
    async findCameraByID(id: string): Promise<Camera> {
      const camera=await this.cameraModel.findById(id).exec();
       return camera
   }
   async findCameraByName(name: string): Promise<Camera> {
     const camera=await this.cameraModel.findOne({name:name}).exec()
      return camera
  }
   async getCameras() {
     const cameras = await this.cameraModel.find().exec();
     return cameras.map(cam => ({
       _id: cam._id,
       name: cam.name,
       ip: cam.ip,
       port: cam.port,
       rtspUrl:cam.rtspUrl,
       username:cam.username,
       password:cam.password,
       user:this.userService.findUserByID(cam.user)
     }));
   }
 
    async addOne(username:string,name:string,password:string,ip:string,port:number,rtspUrl:string) {
      const user=this.userService.findUserByEmail('nghinguyen.170498@gmail.com')
      const newCamera= new this.cameraModel({
        username,
        name,
        password,
        ip,
        port,
        rtspUrl,
        user: (await user)._id
      })
      const result= await newCamera.save();
      return result;
    }

    async updateOne(id:string, username:string,name:string,password:string,ip:string,port:number,rtspUrl:string) {
      const user= await this.cameraModel.updateOne({_id:id},{name,username,password,ip,port,rtspUrl})
      return user
    }   
  
    async deleteOne(id:string) { 
        const result= await this.cameraModel.deleteOne({_id:id})
        return result
    }  

    async recordFullStream(url: string) {
      const command=`ffmpeg -i ${url} -acodec copy -vcodec copy D:/test.mp4`
      exec(command,(error,stdout,stderr) =>{
        if (error) {
          console.log('error',error)
          return false
        }
        if (stderr) {
          console.log('stderr',stderr)
          return false
        }

        console.log('stdout',stdout)
        return true
      })
    }
    async recordStreamPerTime(url: string,time:number) {
      const command=`ffmpeg -i ${url} -c copy -map 0 -f segment -segment_time ${time} -segment_format mp4 "D:/demo%03d.mp4"`
      exec(command,(error,stdout,stderr) =>{
        if (error) {
          console.log('error',error)
          return false
        }
        if (stderr) {
          console.log('stderr',stderr)
          return false
        }
        console.log('stdout',stdout)
        return true
      })
    }

    async turnMotionDetect(url:string) :Promise<any> {
      const command=`ffmpeg -rtsp_transport tcp -i "${url}" -vf select='gte(scene\\,0.05)',metadata=print -an -f null -`
      console.log("cmd", command)
      await exec(command,(error,stdout,stderr) =>{
        if (error) {
           console.log('error',error)
          return false
        }
        
        if (stderr) {
           console.log('stderr',stderr)
          return stderr
        }
         console.log('stdout',stdout)
        return stdout

      })

      //  const child = exec(command);
      // let data = [];
      //     for await (const chunk of child.stdout) {
      //     console.log('stdout chunk: '+chunk);
      //     data.push(Date.parse(chunk))
      //     }
      //     console.log("data",data)
    }

    async motionDection(url:string) :Promise<any> {
    //     const spawn = require("child_process").spawn;
    //     const pythonProcess = spawn('python',["../../motion-detect.py"]);
        

    //     pythonProcess.stdout.on('data', (data) => {
    //       // Do something with the data returned from python script
    //     console.log('data', data)
    //   });

    //   pythonProcess.stderr.on('err', (data) => {
    //     // Do something with the data returned from python script
    //   console.log('err', data)
    // });

    const command=`python motion-detect.py --video ${url}`
    const child = exec(command);
    let data = [];
          for await (const chunk of child.stdout) {
          console.log('stdout chunk: '+chunk);
          data.push(Date.parse(chunk))
          }
    console.log("data",data)
      // await exec(command,(error,stdout,stderr)  =>  {
      //   if (error) {
      //      console.log('error',error)
      //     return false
      //   }
        
      //   if (stderr) {
      //      console.log('stderr',stderr)
      //     return stderr
      //   }
     
      //    console.log('stdout',stdout)
      //    console.log("date.parse ",Date.parse(stdout), 'date,now',Date.now() )
      //   return stdout

      // })

    }

    async scanNetwork() :Promise<any> {

      const onvif = require('node-onvif')
      const Stream = require('node-rtsp-stream');

      let camera = [];
      let devices = []
      let streams =[]
      onvif.startProbe().then((device_info_list) => {
        console.log(device_info_list.length + ' devices were found.');
        // Show the device name and the URL of the end point.

        const arr = [];  
        device_info_list.forEach((info,x) => {
          if(x <= 5){

                //console.log('- ' + info.urn);
          //console.log('  - ' + info.name);
          //console.log('  - ' + info.xaddrs[0]);
          arr.push(info.xaddrs[0])
        
          }
        

        });
        //console.log(arr)
          camera = arr;
          arr.forEach((onCam,i)=>{
            
                  let device = new onvif.OnvifDevice({
                      xaddr: onCam,
                      user : 'admin',
                      pass : 'admin'
                  }); 
                  devices.push(device)
                  // Initialize the OnvifDevice object
                  device.init().then(() => {
                      // Get the UDP stream URL
                      let url = device.getUdpStreamUrl();
          
                      const stream = new Stream({
                          name: 'name',
                          streamUrl: url,
                          wsPort: 9000 + i
                      })
                      streams.push(stream)
                      console.log("URL :"+url);
                  }).catch((error) => {
                      console.error(error);
                  });
          })             
      }).catch((error) => {
        console.error(error);
      });
      console.log('cam', camera , 'streams' , streams , 'devs', devices)
        return { camera, streams , devices }

      }

}
