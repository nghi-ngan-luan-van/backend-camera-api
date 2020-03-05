import { Injectable } from '@nestjs/common';
import * as uuid from "uuid";
import {exec} from "child_process"
export type Camera = any;


@Injectable()
export class CameraService {
    private readonly cameras: Camera[];

    constructor() {
      this.cameras = [
        {
          _id: uuid.v4(),
          name: "cam1",
          user:"nghi.nguyen",
          url:"rtsp://freja.hiof.no:1935/rtplive/definst/hessdalen03.stream"
        },
        {
          _id: uuid.v4(),
          name: "cam2",
          user:"tony",
          url:"rtsp://170.93.143.139/rtplive/470011e600ef003a004ee33696235daa"
        },
      ];
    }
  
    async findOne(name: string): Promise<Camera | undefined> {
      return this.cameras.find(camera => camera.name === name);
    }
  
    async findOneByID(id: string): Promise<Camera | undefined> {
      return this.cameras.find(camera => camera._id === id);
    }
    
    async findOneByURL(url: string): Promise<Camera | undefined> {
        return this.cameras.find(camera => camera.url === url);
      }
      
    async findCamerasByUser(username:string)  {
        return this.cameras.filter(camera => camera.user===username)
    }
    
    async findAll() {
      return this.cameras;
    }

    async addOne(camera: Camera): Promise<Camera> {
      camera._id =uuid.v4()
      return this.cameras.push(camera);
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
      const command=`ffmpeg -rtsp_transport tcp -i ${url} -vf select='gte(scene\,0.005)',metadata=print -an -f null -`
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
    }

}
