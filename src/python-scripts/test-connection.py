from imutils.video import VideoStream
import datetime
import imutils
import time
import cv2
import sys
import os
import signal
import subprocess
import time


# construct the argument parser and parse the arguments
# ap = argparse.ArgumentParser()
# ap.add_argument("-v", "--video", help="path to the video file")
# # ap.add_argument("-a", "--min-area", type=int, default=700, help="minimum area size")
# args = vars(ap.parse_args())
# if the video argument is None, then we are reading from webcam
vs = cv2.VideoCapture(sys.argv[1])
# initialize the first frame in the video stream
try:
    frame = vs.read()
    if frame == (False,None):
        print('0')
        sys.stdout.flush()
    else:
        unixtime = int(round(time.time()*1000))
        cmd = 'ffmpeg -y -i '+ str(sys.argv[1]) + ' -vframes 1 '+ str(sys.argv[2])+ '/img_'+str(unixtime)+'.jpg'
        pro = subprocess.Popen(cmd, stdout=subprocess.PIPE, shell=True, preexec_fn=os.setsid) 
        poll = pro.poll()
        pro.wait()
        print('img_'+str(unixtime)+'.jpg')
        sys.stdout.flush()
    if poll != None:
        vs.stop()
except KeyboardInterrupt:
    if poll == None:
        os.killpg(os.getpgid(pro.pid), signal.SIGINT)
    vs.stop()
    