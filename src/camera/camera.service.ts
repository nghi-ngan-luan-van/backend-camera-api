/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable @typescript-eslint/camelcase */
import { Injectable, Inject, forwardRef } from '@nestjs/common';
import { v4 as uuidv4 } from "uuid";
import { exec, spawn } from "child_process"
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { Camera } from './camera.model';
import { UserService } from '../user/user.service';
import { TaskService } from '../task/task.service';
import { CameraMotionService } from '../camera-motion/camera-motion.service';
import {s3} from '../.aws/auth'
import * as fs from 'fs'

@Injectable()
export class CameraService {
  private readonly cameras: Camera[];

  constructor(@InjectModel('Camera') private readonly cameraModel: Model<Camera>,
    @Inject(forwardRef(() => TaskService))
    private readonly userService: UserService,
    private readonly taskService: TaskService,
    private readonly camMotionService: CameraMotionService,
  ) { }


  async findCameraByID(id: string): Promise<Camera> {
    const camera = await this.cameraModel.findById(id).exec();
    return camera
  }
  async findCameraByName(name: string): Promise<Camera> {
    const camera = await this.cameraModel.findOne({ name: name }).exec()
    return camera
  }
  async getCameras() {
    const cameras = await this.cameraModel.find().exec();
    return cameras.map(cam => ({
      _id: cam._id,
      name: cam.name,
      ip: cam.ip,
      port: cam.port,
      rtspUrl: cam.rtspUrl,
      username: cam.username,
      password: cam.password,
      user: cam.user
    }));
  }

  async getCamerasByUser(userID: string) {
    const cameras = await this.cameraModel.find({ user: userID }).exec();
    return cameras.map(cam => ({
      _id: cam._id,
      name: cam.name,
      ip: cam.ip,
      port: cam.port,
      rtspUrl: cam.rtspUrl,
      username: cam.username,
      password: cam.password,
      user: userID
    }));
  }

  async addOne(userID: string, username: string, name: string, password: string, ip: string, port: number, rtspUrl: string) {
    console.log(userID)
    const newCamera = new this.cameraModel({
      username,
      name,
      password,
      ip,
      port,
      rtspUrl,
      user: userID
    })
    const result = await newCamera.save();
    return result;
  }

  async updateOne(id: string, username: string, name: string, password: string, ip: string, port: number, rtspUrl: string) {
    const user = await this.cameraModel.updateOne({ _id: id }, { name, username, password, ip, port, rtspUrl })
    return user
  }

  async deleteOne(id: string) {
    const result = await this.cameraModel.deleteOne({ _id: id })
    return result
  }

  async recordFullStream(url: string) {
    const command = `ffmpeg -i ${url} -acodec copy -vcodec copy-c:a aac -vcodec copy src/video/test.mp4`
    exec(command, (error, stdout, stderr) => {
      if (error) {
        console.log('error', error)
        return false
      }
      if (stderr) {
        console.log('stderr', stderr)
        return false
      }

      console.log('stdout', stdout)
      return true
    })
  }
  async recordStreamPerTime(url: string, time: number) {
    const command = `ffmpeg -i ${url} -c copy -map 0 -f segment -segment_time ${time} -segment_format mp4 "D:/demo%03d.mp4"`
    exec(command, (error, stdout, stderr) => {
      if (error) {
        console.log('error', error)
        return false
      }
      if (stderr) {
        console.log('stderr', stderr)
        return false
      }
      console.log('stdout', stdout)
      return true
    })
  }

  async turnMotionDetect(url: string): Promise<any> {
    const command = `ffmpeg -rtsp_transport tcp -i "${url}" -vf select='gte(scene\\,0.05)',metadata=print -an -f null -`
    console.log("cmd", command)
    await exec(command, (error, stdout, stderr) => {
      if (error) {
        console.log('error', error)
        return false
      }

      if (stderr) {
        console.log('stderr', stderr)
        return stderr
      }
      console.log('stdout', stdout)
      return stdout

    })
  }
 

  async motionDection(url: string, userID: string): Promise<any> {
    const randomText = uuidv4()
    console.log('....', randomText)
    const child = spawn('python', ["src/python-scripts/motion-detect.py", url, randomText]);
    console.log('pid', child.pid)
    this.taskService.addTask(child);
    console.log(this.taskService.getTasks())

    let dataToSend = []
    let filePath = '', timeStart = '', timeEnd = ''

    child.stdout.on('data', (data) => {
      const output = data.toString().trim()
      console.log('stdout', output);
      console.log("data.toString().split('.').pop()", output.split('.').pop())

      if (output.split('.').pop() === `mp4`) {
        console.log("files: ", output)
        filePath = output
      }
      else {
        dataToSend.push(output)
        console.log("data to send: ", dataToSend)
      }

      if (dataToSend.length === 2) {
        timeStart = dataToSend[0]
        timeEnd = dataToSend[1]
        dataToSend = []
      }

      console.log('cam motion:', filePath, timeStart, timeEnd)
      if (filePath !== '' && timeStart !== '' && timeEnd !== '') {
        // this.camMotionService.addOne(userID,url,filePath,timeStart,timeEnd)
        // fs.readFile(`src/video/${userID}/${_id}/${filePath}`, function (err, data) {
        //   if (err) { 
        //       console.log('fs error', err);
        //   } else {
        //       var params = {
        //           Bucket: 'clientapp', 
        //           Key: filePath, 
        //           Body: data,
        //           ContentType: 'video/mp4',
        //       };
      
        //       s3.putObject(params, function(err, data) {
        //           if (err) { 
        //               console.log('Error putting object on S3: ', err); 
        //           } else { 
        //               console.log('Placed object on S3: ', data); 
        //           }  
        //       });
        //   }
        // });

        filePath = '', timeStart = '', timeEnd = ''
      }
    });

  }

  async scanNetwork(): Promise<any> {

    const onvif = require('node-onvif')
    const Stream = require('node-rtsp-stream');

    let camera = [];
    const devices = []
    const streams = []
    onvif.startProbe().then((device_info_list) => {
      console.log(device_info_list.length + ' devices were found.');
      // Show the device name and the URL of the end point.
      console.log(device_info_list);
      const arr = [];
      device_info_list.forEach((info, x) => {
        if (x <= 5) {

          console.log('- ' + info.urn);
          console.log('  - ' + info.name);
          console.log('  - ' + info.xaddrs[0]);
          arr.push(info.xaddrs[0])

        }


      });
      //console.log(arr)
      camera = arr;
      arr.forEach((onCam, i) => {

        const device = new onvif.OnvifDevice({
          xaddr: onCam,
          user: 'admin',
          pass: 'admin'
        });
        devices.push(device)

        device.init().then(() => {
          // Get the UDP stream URL
          const url = device.getUdpStreamUrl();

          const stream = new Stream({
            name: 'name',
            streamUrl: url,
            wsPort: 9000 + i
          })
          streams.push(stream)
          console.log("URL :" + url);
        }).catch((error) => {
          console.error(error);
        });

      })
    }).catch((error) => {
      console.error(error);
    });
    console.log('cam', camera, 'streams', streams, 'devs', devices)
    return { camera, streams, devices }

  }
 testput() {
  fs.readFile('src/video/4.mp4', function (err, data) {
    if (err) { 
        console.log('fs error', err);
    } else {
        const params = {
            Bucket: 'clientapp',
            Key: 'nghi/4.mp4', 
            Body: data,
            ContentType: 'video/mp4',
            ACL:'public-read'
        };

        s3.putObject(params, function(err, data) {
            if (err) { 
                console.log('Error putting object on S3: ', err); 
            } else { 
                console.log('Placed object on S3: ', data); 
            }  
        });

    }
  })
      const params = {
        Bucket: "clientapp",
        Prefix: 'nghi/'
    };

    s3.listObjects(params, function(err, data) {
        if (err) console.log(err, err.stack);
        else {
            data['Contents'].forEach(function(obj) {
                console.log(obj['Key']);
            })
        };
    });
  return true
  }

  async listVideoByUSer(userID:string,_id:string): Promise<any> {
    const params = {
      Bucket: "clientapp",
      Prefix: `${userID}/${_id}`
  };
  //  s3.listObjects(params, function(err, data) {
  //     if (err) console.log(err, err.stack);
  //     else {
  //         data['Contents'].forEach(function(obj) {
  //           if(obj['Key'].split('.').pop()==='mp4') {
  //             console.log(obj['Key']);
  //             const item={
  //               index:result.length+1,
  //               name:obj['Key']
  //             }
  //             result.push(item)
  //           }
  //            console.log("res",result)
  //            return result.map(obj =>({
  //             index:obj.index,
  //             name:obj.name
  //           }))
  //         })
  //     };
      

  // });
  const result=[]
  const s3Response = await s3.listObjects(params).promise();
  s3Response['Contents'].forEach(function(obj) {
              if(obj['Key'].split('.').pop()==='mp4') {
                console.log(obj['Key']);
                const item={
                  index:result.length+1,
                  name: 'https://clientapp.sgp1.digitaloceanspaces.com/'+obj['Key']
                }
                result.push(item)
              }
               console.log("res",result)
               
            })
        return result
  }

}
