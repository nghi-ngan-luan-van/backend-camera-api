/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable @typescript-eslint/camelcase */
import { Injectable, Inject, forwardRef } from '@nestjs/common';
import { v4 as uuidv4 } from "uuid";
import { exec, spawn, spawnSync, execSync } from "child_process"
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { Camera } from './camera.model';
import { UserService } from '../user/user.service';
import { TaskService } from '../task/task.service';
import { CameraMotionService } from '../camera-motion/camera-motion.service';
import { s3 } from '../.aws/auth'
import * as fs from 'fs'
import { async } from 'rxjs/internal/scheduler/async';
import { CameraRecordService } from 'src/camera-record/camera-record.service';
import { threadId } from 'worker_threads';
import { Cron } from '@nestjs/schedule';
const fetch = require('node-fetch')

const chokidar = require('chokidar');
require('dotenv').config()
@Injectable()
export class CameraService {
  private readonly cameras: Camera[];

  constructor(@InjectModel('Camera') private readonly cameraModel: Model<Camera>,
    @Inject(forwardRef(() => TaskService))
    private readonly userService: UserService,
    private readonly taskService: TaskService,
    private readonly camMotionService: CameraMotionService,
    private readonly camRecordService: CameraRecordService,
    

  ) { }

  @Cron('0 */1 * * * *')
  async handleCron() {
    const requestOption = {
      method: "GET",
      redirect: 'follow'
    }
    const cameraModel = this.cameraModel

    fetch('http://localhost:3000/camera/allcam', requestOption).then(response => response.text()).then(result => {
      console.log(result)
      console.log(typeof(result))
      result= JSON.parse(result)
      result.map(async (value, index) => {
        try {
          console.log(value)
          const {_id,name,rtspUrl,ip,port,thumbnail,username,password,backupMode} = value
          const child = spawn('python', ["src/python-scripts/test-connection.py", rtspUrl, process.env.ASSETS_PATH,]);
          console.log('pid', child.pid)


          child.stdout.on('data', async (data) => {
            const output = data.toString().trim()
            console.log('stdout', output);
            if (output === '0') {
              console.log('false')
            }
            if (output.split('.').pop() === `jpg`) {
              setTimeout(() => {
                fs.readFile(`${process.env.ASSETS_PATH}/${output}`, function (err, data) {
                  if (err) {
                    console.log('fs error', err);
                  } else {
                    const params = {
                      Bucket: 'clientapp',
                      Key: `${rtspUrl}/${output}`,
                      Body: data,
                      ACL: 'public-read',
                      ContentType: 'image/jpeg',
                    };

                    s3.putObject(params,async function (err, data) {
                      if (err) {
                        console.log('Error putting object on S3: ', err);
                      } else {
                        console.log('Placed object on S3: ', data);
                        const cdnUrl = `https://clientapp.sgp1.digitaloceanspaces.com/${rtspUrl}/${output}`
                        console.log(typeof(_id))
                        // const file = await this.findById(_id)
                        // console.log('file',file)
                        const result = await cameraModel.updateOne({ _id: _id }, { thumbnail:cdnUrl })
                      
                        setTimeout(() => {
                          fs.unlinkSync(`${process.env.ASSETS_PATH}/${output}`)
                        }, 2000);
                      }

                    });
                  }
                });
              }, 2000);
            }
          })
        } catch (error) {
          console.log(`error with ${value.rtspUrl}`)
        }
      })
    })
  }

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
      backupMode: cam.backupMode,
      user: cam.user
    }));
  }
  // @Cron('45 * * * * *')
  // async getCamerasByUser(userID: string) {

  //   const cameras = await this.cameraModel.find({ user: userID }).exec();
  //   return cameras.map(cam => ({
  //     _id: cam._id,
  //     name: cam.name,
  //     ip: cam.ip,
  //     port: cam.port,
  //     rtspUrl: cam.rtspUrl,
  //     thumbnail: cam.thumbnail,
  //     username: cam.username,
  //     password: cam.password,
  //     backupMode: cam.backupMode,
  //     user: userID
  //   }));
  // }
  async getCamerasByUser(userID: string) {

    const cameras = await this.cameraModel.find({ user: userID }).exec();
    return cameras.map(cam => ({
      _id: cam._id,
      name: cam.name,
      ip: cam.ip,
      port: cam.port,
      rtspUrl: cam.rtspUrl,
      thumbnail: cam.thumbnail,
      username: cam.username,
      password: cam.password,
      backupMode: cam.backupMode,
      user: userID
    }));
  }

  async addOne(userID: string, username: string, name: string, password: string, ip: string, port: number, rtspUrl: string, thumbnail: string) {
    console.log(userID)
    const newCamera = new this.cameraModel({
      username,
      name,
      password,
      ip,
      port,
      rtspUrl,
      thumbnail,
      user: userID
    })

    const result = await newCamera.save();
    try {
      const params1 = {
        Bucket: 'clientapp',
        Key: `${userID}/${result._id}/`,
        ACL: 'public-read'
      };

      s3.putObject(params1, function (err, data) {
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
      const result = await this.cameraModel.updateOne({ _id: id }, { name, username, password, ip, port, rtspUrl, backupMode })
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
  async recordStreamPerTime(camID: string, url: string, userID: string, time: number) {
    const arr = []
    let count = 0
    if (count === 0) {
      try {
        await execSync(`mkdir -p -v ${process.env.ASSETS_PATH}/${camID}/record`);

      } catch (error) {

      }
    }
    console.log('a')

    setTimeout(async () => {
      const watcher = chokidar.watch(`${process.env.ASSETS_PATH}/${camID}/record`, {
        ignored: /^\./, persistent: true, awaitWriteFinish: true,
      });
      const nowTime = Date.now()
      const ffmpeg = spawn('ffmpeg', ['-i', url, '-c:v', 'copy', '-map', '0', '-f', 'segment', '-segment_time', `${time}`, '-segment_format', 'mp4', `${process.env.ASSETS_PATH}/${camID}/record/${nowTime.toString()}_%03d.mp4`])
      // eslint-disable-next-line @typescript-eslint/no-empty-function

      ffmpeg.stdout.on('data', (data) => {

      })
      ffmpeg.on('exit', async (code) => {
        console.log('code', code)
        const recordModeTask = await this.taskService.findTask("0", userID, camID)
        const recordedTask = await this.taskService.findTask("3", userID, camID)

        if (recordModeTask && recordedTask) {
          await this.taskService.killTask(recordModeTask.pID)
          await this.taskService.killTask(recordedTask.pID)
          console.log('done')

        }
        try {
          setTimeout(() => {
            //execSync(`cd ${process.env.ASSETS_PATH}`)

            console.log(`${process.env.ASSETS_PATH}/${camID}/record`)
            const files = fs.readdirSync(`${process.env.ASSETS_PATH}/${camID}/record`)
            console.log("files", files)
            if (files.length !== 0) {
              const d = new Date()
              const month = d.getMonth() + 1
              const now = d.getDate() + '_' + month + '_' + d.getFullYear()
              fs.readFile(`${process.env.ASSETS_PATH}/${camID}/record/${files[0]}`, function (err, data) {

                if (err) {
                  console.log('fs error', err);
                } else {
                  const params = {
                    Bucket: 'clientapp',
                    Key: `${camID}/${now}/${files[0]}`,
                    Body: data,
                    ContentType: 'video/mp4',
                    ACL: 'public-read'
                  };

                  s3.putObject(params, async function (err, data) {
                    if (err) {
                      console.log('Error putting object on S3: ', err);
                    } else {
                      const cdnUrl = `https://clientapp.sgp1.digitaloceanspaces.com/${camID}/${now}/${files[0]}`
                      const timeStart = nowTime + count * time * 1000
                      let duration;
                      exec(`ffprobe -v error -show_entries format=duration -of default=noprint_wrappers=1:nokey=1 ${cdnUrl}`, async (error, stdout, stderr) => {
                        duration = stdout
                        console.log('stdout', stdout)
                        const timeEnd = timeStart + 1000 * Math.round(parseInt(duration) + 1);
                        console.log(Math.round(parseInt(duration) + 1))
                        await camRecordServ.addOne(userID, camID, timeStart.toString(), timeEnd.toString(), cdnUrl)
                        console.log('Placed object on S3: ', data);
                        fs.unlinkSync(`${process.env.ASSETS_PATH}/${camID}/record/${files[0]}`)
                        execSync(`rmdir ${process.env.ASSETS_PATH}/${camID}/record`)

                      })
                    }
                  });
                }
              })
            }

          }, 5000);
        } catch (error) {

        }


      })

      await this.taskService.addTask(camID, ffmpeg.pid, userID, "3", true);

      const camRecordServ = this.camRecordService
      watcher
        .on('add', async function (path) {
          const n = arr.length
          const d = new Date()
          const month = d.getMonth() + 1
          const now = d.getDate() + '_' + month + '_' + d.getFullYear()
          console.log(n)
          console.log(now.toString())

          if (n !== 0) {
            console.log(arr[n - 1])
            const filename = arr[n - 1].split(`/`).pop()
            console.log(filename)

            fs.readFile(`${arr[n - 1]}`, function (err, data) {

              if (err) {
                console.log('fs error', err);
              } else {
                const params = {
                  Bucket: 'clientapp',
                  Key: `${camID}/${now}/${filename}`,
                  Body: data,
                  ContentType: 'video/mp4',
                  ACL: 'public-read'
                };


                s3.putObject(params, async function (err, data) {
                  if (err) {
                    console.log('Error putting object on S3: ', err);
                  } else {
                    console.log('Placed object on S3: ', data);
                    const cdnUrl = `https://clientapp.sgp1.digitaloceanspaces.com/${camID}/${now}/${filename}`
                    const timeStart = nowTime + count * time * 1000;
                    const timeEnd = timeStart + time * 1000;
                    await camRecordServ.addOne(userID, camID, timeStart.toString(), timeEnd.toString(), cdnUrl)
                    count++;
                    fs.unlinkSync(`${arr[n - 1]}`)
                  }
                });
              }
            })
          }
          arr.push(path)


        })
    }, 2000);

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
  async recordDetection(_id: string, userID: string): Promise<any> {
    console.log('....', process.env.ASSETS_PATH)
    try {

      const { rtspUrl } = await this.cameraModel.findById({ _id })
      const detectTask = await this.taskService.findTask("1", userID, _id)
      if (detectTask) {
        await this.taskService.killTask(detectTask.pID)
      }
      const recordModeTask = await this.taskService.findTaskWithoutUser("0", _id)
      if (recordModeTask) {
        return true
      }
      const child = spawn('python', ["src/python-scripts/motion-detect.py", rtspUrl, process.env.ASSETS_PATH, "0"]);
      this.recordStreamPerTime(_id, rtspUrl, userID, 10)
      console.log('pid', child.pid)
      this.taskService.addTask(_id, child.pid, userID, "0", true);

      let dataToSend = []
      let timeStart = '', timeEnd = ''

      child.stdout.on('data', async (data) => {
        const output = data.toString().trim()
        console.log('stdout', output);
        dataToSend.push(output)


        if (dataToSend.length === 2) {
          timeStart = dataToSend[0]
          timeEnd = dataToSend[1]
          dataToSend = []
          console.log("time: ", timeStart, timeEnd)

        }
        console.log('cam motion:', timeStart, timeEnd)

        if (timeStart !== '' && timeEnd !== '') {
          await this.camMotionService.addOne(userID, rtspUrl, null, timeStart, timeEnd, null)
          timeStart = '', timeEnd = ''
        }
      }
      );

      return true

    } catch (error) {
      return false
    }


  }


  async motionDetection(_id: string, userID: string): Promise<any> {
    console.log('....', process.env.ASSETS_PATH)

    try {
      const { rtspUrl } = await this.cameraModel.findById({ _id })
      console.log(rtspUrl, _id)
      let count = 0
      if (count === 0) {
        try {
          await execSync(`mkdir -p -v ${process.env.ASSETS_PATH}/${_id}/detect`);

        } catch (error) {

        }
      }
      const motionDetectTask = await this.taskService.findTaskWithoutUser("1", _id)
      const recordTask = await this.taskService.findTask("0", userID, _id)
      const autorecordTask = await this.taskService.findTask("3", userID, _id)

      if (recordTask) {
        await this.taskService.killTask(recordTask.pID)
      }
      if (autorecordTask) {
        await this.taskService.killTask(autorecordTask.pID)
      }
      if (motionDetectTask) {
        return true
      }
      const child = spawn('python', ["src/python-scripts/motion-detect.py", rtspUrl, `${process.env.ASSETS_PATH}/${_id}/detect`, "1"]);
      console.log('pid', child.pid)
      this.taskService.addTask(_id, child.pid, userID, "1", true);
      let dataToSend = []
      let filePath = '', timeStart = '', timeEnd = ''

      child.stdout.on('data', async (data) => {
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
          console.log("time: ", timeStart, timeEnd)

        }
        console.log('cam motion:', filePath, timeStart, timeEnd)

        if (filePath !== '' && timeStart !== '' && timeEnd !== '') {
          const cdnUrl = `https://clientapp.sgp1.digitaloceanspaces.com/${_id}/${filePath}`
          console.log(userID, _id, cdnUrl)
          await this.camMotionService.addOne(userID, rtspUrl, filePath, timeStart, timeEnd, cdnUrl)
          const filePathTemp = filePath
          filePath = '', timeStart = '', timeEnd = ''
          this.uploadVideo(userID, _id, filePathTemp)

        }
      }
      );

      child.on('exit', async (code) => {
        console.log('code', code)
        const motionModeTask = await this.taskService.findTask("1", userID, _id)

        if (motionModeTask) {
          await this.taskService.killTask(motionModeTask.pID)
          console.log('done')

        }
      })
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
  getFileSizInByte(filename) {
    const stats = fs.statSync(filename)
    return stats["size"]
  }
  async uploadVideo(userID: string, cameraID: string, filePath: string) {
    fs.readFile(`${process.env.ASSETS_PATH}/${cameraID}/detect/${filePath}`, function (err, data) {
      if (err) {
        console.log('fs error', err);
      } else {
        const params = {
          Bucket: 'clientapp',
          Key: `${cameraID}/${filePath}`,
          Body: data,
          ContentType: 'video/mp4',
          ACL: 'public-read'
        };

        s3.putObject(params, function (err, data) {
          if (err) {
            console.log('Error putting object on S3: ', err);
          } else {
            console.log('Placed object on S3: ', data);
            fs.unlinkSync(`${process.env.ASSETS_PATH}/${cameraID}/detect/${filePath}`)
          }
        });
      }
    });
  }

  testput() {

    this.recordStreamPerTime('5ed3e22848d6943ed70ec47f', 'rtsp://192.168.1.104:7777/h264_ulaw.sdp', '5e9471d6cbeb62504f03bc0b', 10)
    return true
  }

  async listVideoByUSer(userID: string, _id: string): Promise<any> {
    const { rtspUrl } = await this.cameraModel.findById({ _id })
    const result = await this.camMotionService.getMotionByUser(userID, rtspUrl)
    console.log(result)
    return result
  }
  async recordedVideoByUser(userID: string, _id: string): Promise<any> {
    const result = await this.camRecordService.getMotionByUser(userID, _id)
    console.log(result)
    return result
  }
  async testHandleTask() {
    try {
      const child = spawn('python', ["src/python-scripts/motion-detect.py", "rtsp://freja.hiof.no:1935/rtplive/definst/hessdalen03.stream", process.env.ASSETS_PATH, "0"]);
      console.log(await this.taskService.addTask('5ed471308a7ad50c437e9768', child.pid, 'rtsp:123', '0', true))
      child.stdout.on('data', (data) => {
        console.log(data)
        this.taskService.killTask(child.pid)
      })
      return true
    } catch (error) {
      return false
    }
  }
  async testConnection(rtspUrl: string, userID: string): Promise<any> {
    return new Promise(function (resolve, reject) {
      const child = spawn('python', ["src/python-scripts/test-connection.py", rtspUrl, process.env.ASSETS_PATH,]);
      console.log('pid', child.pid)
      // this.taskService.addTask(_id,child.pid,userID,"1",true);


      child.stdout.on('data', async (data) => {
        const output = data.toString().trim()
        console.log('stdout', output);
        if (output === '0') {
          resolve(false)
        }
        if (output.split('.').pop() === `jpg`) {
          setTimeout(() => {
            fs.readFile(`${process.env.ASSETS_PATH}/${output}`, function (err, data) {
              if (err) {
                console.log('fs error', err);
              } else {
                const params = {
                  Bucket: 'clientapp',
                  Key: `${rtspUrl}/${output}`,
                  Body: data,
                  ACL: 'public-read',
                  ContentType: 'image/jpeg',
                };

                s3.putObject(params, function (err, data) {
                  if (err) {
                    console.log('Error putting object on S3: ', err);
                  } else {
                    console.log('Placed object on S3: ', data);
                    setTimeout(() => {
                      fs.unlinkSync(`${process.env.ASSETS_PATH}/${output}`)
                    }, 2000);
                    resolve(`https://clientapp.sgp1.digitaloceanspaces.com/${rtspUrl}/${output}`)
                  }
                });
              }
            });
          }, 3000);
        }
      })
    })

  }
}
