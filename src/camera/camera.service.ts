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
require('dotenv').config()

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
      backupMode:cam.backupMode,
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
      backupMode:cam.backupMode,
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
    try {
      const params1 = {
        Bucket: 'clientapp',
        Key: `${userID}/${result._id}/`, 
        ACL:'public-read'
    };

    s3.putObject(params1, function(err, data) {
        if (err) { 
            console.log('Error putting object on S3: ', err); 
        } else { 
            console.log('Placed object on S3: ', data); 
        }  
    });
    } catch (error) {
      return false
    }
    return result;
  }

  async updateOne(id: string, username: string, name: string, password: string, ip: string, port: number, rtspUrl: string, backupMode: boolean) {
    try {
      const result = await this.cameraModel.updateOne({ _id: id }, { name, username, password, ip, port, rtspUrl,backupMode })
      return true
    } catch (error) {
      return false
    }
  }

  async deleteOne(_id: string) {
    try {
      const result = await this.cameraModel.deleteOne({ _id: _id })
      return true
    } catch (error) {
      return false
    }
  }

  async recordFullStream(url: string) {
    const command = `ffmpeg -i ${url} -c:a aac -vcodec copy src/video/test.mp4`
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
  async recordDetection(_id:string,url: string, userID: string): Promise<any> {
    console.log('....', process.env.ASSETS_PATH)
    const child = spawn('python', ["src/python-scripts/motion-detect.py", url,process.env.ASSETS_PATH,"0"],);
    console.log('pid', child.pid)
    // this.taskService.addTask(child);

    let dataToSend = []
    let timeStart = '', timeEnd = ''

    child.stdout.on('data', (data) => {
      const output = data.toString().trim()
      console.log('stdout', output);
      dataToSend.push(output)


      if (dataToSend.length === 2) {
        timeStart = dataToSend[0]
        timeEnd = dataToSend[1]
        dataToSend = []
        console.log("time: ", timeStart,timeEnd)

      }
      console.log('cam motion:', timeStart, timeEnd)

      if (timeStart !== '' && timeEnd !== '') {
         this.camMotionService.addOne(userID,url,null,timeStart,timeEnd,null)
           
          timeStart = '', timeEnd = ''
        }
    }
    );

  }


  async motionDetection(_id:string, userID: string): Promise<any> {
    console.log('....', process.env.ASSETS_PATH)

    try {
      const {rtspUrl}= await this.cameraModel.findById({_id})
      console.log(rtspUrl,_id)
      const child = spawn('python', ["src/python-scripts/motion-detect.py",rtspUrl,process.env.ASSETS_PATH,"1"],);
      console.log('pid', child.pid)
      // this.taskService.addTask(child);
  
      let dataToSend = []
      let filePath = '', timeStart = '', timeEnd = ''
  
      child.stdout.on('data', (data) => {
        const output = data.toString().trim()
        console.log('stdout', output);
        console.log("data.toString().split('.').pop()", output.split('.').pop())
  
        if (output.split('.').pop() === `mp4`) {
          filePath = output
          console.log("files: ", filePath)
  
        }
        else {
          dataToSend.push(output)
          console.log("data to send: ", dataToSend)
        }
  
        if (dataToSend.length === 2) {
          timeStart = dataToSend[0]
          timeEnd = dataToSend[1]
          dataToSend = []
          console.log("time: ", timeStart,timeEnd)
  
        }
        console.log('cam motion:', filePath, timeStart, timeEnd)
  
        if (filePath !== '' && timeStart !== '' && timeEnd !== '') {
          const cdnUrl = `https://clientapp.sgp1.digitaloceanspaces.com/${userID}/${_id}/${filePath}`
          console.log(userID,_id,cdnUrl)
           //this.camMotionService.addOne(userID,url,filePath,timeStart,timeEnd,cdnUrl)
             fs.readFile(`${process.env.ASSETS_PATH}/${filePath}`, function (err, data) {
              if (err) { 
                  console.log('fs error', err);
              } else {
                  const params = {
                      Bucket: 'clientapp', 
                      Key:`${userID}/${_id}/${filePath}`, 
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
            });
            filePath = '', timeStart = '', timeEnd = ''
          }
      }
      );
      return true
    } catch (error) {
      false
    }
  
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

  fs.readFile(`${process.env.ASSETS_PATH}/1590913964000.mp4`, function (err, data) {
    if (err) { 
        console.log('fs error', err);
    } else {
        const params = {
            Bucket: 'clientapp', 
            Key:`5e9471d6cbeb62504f03bc0b/5ed3e22848d6943ed70ec47f/1590913964000.mp4`, 
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
  });

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
    const {rtspUrl}= await this.cameraModel.findById({_id})
    const result = await this.camMotionService.getMotionByUser(userID,rtspUrl)
    console.log(result)
    return result
  //   const params = {
  //     Bucket: "clientapp",
  //     Prefix: `${userID}/${_id}`
  // };
  // const result=[]
  // const s3Response = await s3.listObjects(params).promise();
  // s3Response['Contents'].forEach(function(obj) {
  //             if(obj['Key'].split('.').pop()==='mp4') {
  //               console.log(obj['Key']);
  //               const item={
  //                 index:result.length+1,
  //                 name: 'https://clientapp.sgp1.digitaloceanspaces.com/'+obj['Key']
  //               }
  //               result.push(item)
  //             }
  //              console.log("res",result)
               
  //           })
  //       return result

  }
   async testHandleTask() {
    try {
      const child = spawn('python', ["src/python-scripts/motion-detect.py", "rtsp://freja.hiof.no:1935/rtplive/definst/hessdalen03.stream",process.env.ASSETS_PATH,"0"],);
      console.log(await this.taskService.addTask('5ed471308a7ad50c437e9768',child.pid,'rtsp:123','0',true)) 
      child.stdout.on('data', (data) => {
        console.log(data)
        this.taskService.killTask(child.pid)
      })
      return true
    } catch (error) {
      return false
    }
   
  }
}
