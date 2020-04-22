import { Injectable, Inject, forwardRef } from '@nestjs/common';
import { CameraService } from 'src/camera/camera.service';

@Injectable()
export class CameraMotionService {
    private  camMotions=[]
    constructor(
      @Inject(forwardRef(() => CameraService))
      private readonly cameraService:CameraService,
    
       ) { }


}
