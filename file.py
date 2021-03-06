# import the necessary packages
from imutils.video import VideoStream
import argparse
import datetime
import imutils
import time
import cv2
import sys
import os
import signal
import subprocess
# construct the argument parser and parse the arguments
ap = argparse.ArgumentParser()
ap.add_argument("-v", "--video", help="path to the video file")
# ap.add_argument("-a", "--min-area", type=int, default=700, help="minimum area size")
args = vars(ap.parse_args())
# if the video argument is None, then we are reading from webcam
vs = cv2.VideoCapture(args['video'])
# initialize the first frame in the video stream
count = 0
temp = count
firstFrame = None
# loop over the frames of the video
try:
	while True:
		# grab the current frame and initialize the occupied/unoccupied
		# text
		# p = None
		try:
			frame = vs.read()
			frame = frame if args['video'] is None else frame[1]
			text = "Unoccupied"
			# if the frame could not be grabbed, then we have reached the end
			# of the video
			if frame is None:
				break
			# resize the frame, convert it to grayscale, and blur it
			frame = imutils.resize(frame, width=700)
			gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
			gray = cv2.GaussianBlur(gray, (21, 21), 0)
			# if the first frame is None, initialize it
			if firstFrame is None:
				firstFrame = gray
				continue
		    	# compute the absolute difference between the current frame and
			# first frame
			
			frameDelta = cv2.absdiff(firstFrame, gray)
			thresh = cv2.threshold(frameDelta, 25, 255, cv2.THRESH_BINARY)[1]
			# dilate the thresholded image to fill in holes, then find contours
			# on thresholded image
			thresh = cv2.dilate(thresh, None, iterations=2)
			cnts = cv2.findContours(thresh.copy(), cv2.RETR_EXTERNAL,
				cv2.CHAIN_APPROX_SIMPLE)
			cnts = imutils.grab_contours(cnts)
			# loop over the contours
			for c in cnts:
				# if the contour is too small, ignore it
				if cv2.contourArea(c) < 700:
					continue
				# compute the bounding box for the contour, draw it on the frame,
				# and update the text
				(x, y, w, h) = cv2.boundingRect(c)
				cv2.rectangle(frame, (x, y), (x + w, y + h), (0, 255, 0), 2)
				text = "Occupied"
				if text == "Occupied" and count == temp:
					count = count +1
					# unixtime = int(time.mktime(datetime.datetime.utcnow().timetuple()))*1000
					unixtime = int(round(time.time()*1000))
					# if sys.argv[3] == "1":
					# 	cmd = 'ffmpeg -i '+ str(args['video']) + ' -c:a aac -vcodec copy ' + 'abc.mp4'
					# 	print('abc.mp4')
					# 	sys.stdout.flush()
					# 	pro = subprocess.Popen(cmd, stdout=subprocess.PIPE, shell=True)
					# 	poll = pro.poll()
			# draw the text and timestamp on the frame
			if count != temp and text == 'Unoccupied':
				# if sys.argv[3] == "1":
				# 	os.killpg(os.getpgid(pro.pid), signal.SIGINT)
				timestamp1 = int(round(time.time()*1000))
				print(timestamp1)
				sys.stdout.flush()
				temp = count
			cv2.putText(frame, "Room Status: {}".format(text), (10, 20),
				cv2.FONT_HERSHEY_SIMPLEX, 0.5, (0, 0, 255), 2)
			cv2.putText(frame, datetime.datetime.now().strftime("%A %d %B %Y %I:%M:%S%p"),
				(10, frame.shape[0] - 10), cv2.FONT_HERSHEY_SIMPLEX, 0.35, (0, 0, 255), 1)

			# show the frame and record if the user presses a key
			cv2.imshow("Security Feed", frame)
			cv2.imshow("Thresh", thresh)
			cv2.imshow("Frame Delta", frameDelta)
			
			key = cv2.waitKey(1) & 0xFF
			# if the `q` key is pressed, break from the lop
			if key == ord("q"):
				break
		except KeyboardInterrupt:
			# if sys.argv[3] == "1":
			# 	os.killpg(os.getpgid(pro.pid), signal.SIGINT)
			vs.stop()
			cv2.destroyAllWindows()
	# if sys.argv[3] == "1":
	# 	if poll == None:
	# 		os.killpg(os.getpgid(pro.pid), signal.SIGINT)
	# cleanup the camera and close any open windows
	vs.stop() if sys.argv[1] is None else vs.release()
	cv2.destroyAllWindows()
except KeyboardInterrupt:
	# if sys.argv[3] == "1":
	# 	os.killpg(os.getpgid(pro.pid), signal.SIGINT)
	vs.stop()
	cv2.destroyAllWindows()
