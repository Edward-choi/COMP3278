from flask import Flask, render_template, Response, jsonify
import cv2
import os
import sys
import numpy as np
from PIL import Image
import pickle
from flask_cors import CORS
import urllib
import mysql.connector
import pyttsx3
from datetime import datetime

local_path = 'src/FaceRecognition'
app = Flask(__name__, template_folder=local_path)
CORS(app)
faceCascade = cv2.CascadeClassifier(local_path + '/haarcascade/haarcascade_frontalface_default.xml')

def capture_by_frames(user_name):
    global video_capture
    global registration
    global cnt
    global start
    registration = False
    start = False
    video_capture = cv2.VideoCapture(0)
    NUM_IMGS = 100
    if not os.path.exists(local_path + '/data/{}'.format(user_name)):
        os.mkdir(local_path + '/data/{}'.format(user_name))

    cnt = 1
    font = cv2.FONT_HERSHEY_SIMPLEX
    bottomLeftCornerOfText = (400, 50)
    fontScale = 1
    fontColor = (255, 255, 255)
    lineType = 2

    # Open camera
    while cnt <= NUM_IMGS:
        # Capture frame-by-frame
        ret, frame = video_capture.read()
        start = True
        gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)


        faces = faceCascade.detectMultiScale(
            gray,
            scaleFactor=1.2,
            minNeighbors=5,
            minSize=(30, 30),
            flags=cv2.CASCADE_SCALE_IMAGE,
        )

        # Draw a rectangle around the faces
        
        for (x, y, w, h) in faces:
            cv2.rectangle(frame, (x, y), (x + w, y + h), (0, 255, 0), 2)

#        msg = "Saving Your Face Data [{}/{}]".format(cnt, NUM_IMGS)
#        cv2.putText(frame, msg,
#                    bottomLeftCornerOfText,
#                    font,
#                    fontScale,
#                    fontColor,
#                    lineType)
        

        # Display the resulting frame
#        cv2.imshow('Video', frame)
        # Store the captured images in `data/Jack`
        cv2.imwrite((local_path + '/data/{}/{}{:03d}.jpg').format(user_name, user_name, cnt), frame)
        cnt += 1
        ret, buffer = cv2.imencode('.jpg', frame)
        frame = buffer.tobytes()
        yield (b'--frame\r\n'
            b'Content-Type: image/jpeg\r\n\r\n' + frame + b'\r\n')

        key = cv2.waitKey(50)
    if video_capture.isOpened():
        video_capture.release()
    registration = True
    
    train()
#    while True:
#        success, frame = camera.read()  # read the camera frame
#        detector = cv2.CascadeClassifier(
#            local_path + '/haarcascade/haarcascade_frontalface_default.xml')
#        faces = detector.detectMultiScale(frame, 1.5, 3)
#        # Draw the rectangle around each face
#        for (x, y, w, h) in faces:
#            cv2.rectangle(frame, (x, y), (x+w, y+h), (0, 255, 0), 3)
#
#
#        ret, buffer = cv2.imencode('.jpg', frame)
#        frame = buffer.tobytes()
#        yield (b'--frame\r\n'
#            b'Content-Type: image/jpeg\r\n\r\n' + frame + b'\r\n')

@app.route('/registered')
def registered():
    try:
        response = jsonify({
            'state': registration,
            'count': cnt,
            'start': start
        })
    except:
        response = jsonify({
            'state': False,
            'count': 0,
            'start': False
        })
    response.headers.add("Access-Control-Allow-Origin", "*")
    return response
    
@app.route('/verified')
def verified():
    try:
        response = jsonify({
            'state': verified,
            'name': current_name,
            'start': verificationStart
        })
    except:
        response = jsonify({
            'state': False,
            'name': '',
            'start': False
        })
    response.headers.add("Access-Control-Allow-Origin", "*")
    return response


@app.route('/video_capture/<name>')
def video_capture(name):
    return Response(capture_by_frames(name), mimetype='multipart/x-mixed-replace; boundary=frame')
    
@app.route('/login_verification')
def login_verification():
    return Response(login(), mimetype='multipart/x-mixed-replace; boundary=frame')

def train():

    BASE_DIR = os.path.dirname(os.path.abspath(__file__))
    image_dir = os.path.join(BASE_DIR, "data")

    # Create OpenCV LBPH recognizer for training
    recognizer = cv2.face.LBPHFaceRecognizer_create()

    current_id = 0
    label_ids = {}
    y_label = []
    x_train = []

    # Traverse all face images in `data` folder
    for root, dirs, files in os.walk(image_dir):
        for file in files:
            if file.endswith("png") or file.endswith("jpg"):
                path = os.path.join(root, file)
                label = os.path.basename(root).replace("", "").upper()  # name
                print(label, path)

                if label in label_ids:
                    pass
                else:
                    label_ids[label] = current_id
                    current_id += 1
                id_ = label_ids[label]
                print(label_ids)

                pil_image = Image.open(path).convert("L")
                image_array = np.array(pil_image, "uint8")
                print(image_array)
                # Using multiscle detection
                faces = faceCascade.detectMultiScale(image_array, scaleFactor=1.2, minNeighbors=5)

                for (x, y, w, h) in faces:
                    roi = image_array[y:y+h, x:x+w]
                    x_train.append(roi)
                    y_label.append(id_)

    # labels.pickle store the dict of labels.
    # {name: id}
    # id starts from 0
    with open(local_path + '/labels.pickle', "wb") as f:
        pickle.dump(label_ids, f)

    # Train the recognizer and save the trained model.
    recognizer.train(x_train, np.array(y_label))
    recognizer.save(local_path + '/train.yml')
    
def login():
    # 1 Create database connection
    myconn = mysql.connector.connect(host="localhost", user="root", passwd="jamesmysql", database="facerecognition")
    date = datetime.utcnow()
    now = datetime.now()
    weekday = datetime.today().weekday() #used in class_time
    weekOfTheYear = datetime.today().isocalendar().week #used in information
    current_time = now.strftime("%H:%M:%S")
    currentTimeDelta = datetime.now().hour*3600 + datetime.now().minute*60 + datetime.now().second
    cursor = myconn.cursor(buffered = True)

    classWithinHour = None
    classWithinHourInfo = None
    timetable = None
    
    global verified
    verified = False
    global current_name
    current_name = ''
    global verificationStart
    verificationStart = False


    #2 Load recognize and read label from model
    recognizer = cv2.face.LBPHFaceRecognizer_create()
    recognizer.read(local_path + '/train.yml')

    labels = {"person_name": 1}
    with open(local_path + '/labels.pickle', "rb") as f:
        labels = pickle.load(f)
        labels = {v: k for k, v in labels.items()}
    print(labels)
    # create text to speech
    engine = pyttsx3.init()
    rate = engine.getProperty("rate")
    engine.setProperty("rate", 175)

    # Define camera and detect face
    cap = cv2.VideoCapture(0)

    # 3 Open the camera and start face recognition
    while True and cap.isOpened():
        ret, frame = cap.read()
        gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
        faces = faceCascade.detectMultiScale(gray, scaleFactor=1.2, minNeighbors=5)
        verificationStart = True
        
        for (x, y, w, h) in faces:
            print(x, w, y, h)
            roi_gray = gray[y:y + h, x:x + w]
            roi_color = frame[y:y + h, x:x + w]
            # predict the id and confidence for faces
            id_, conf = recognizer.predict(roi_gray)

            # If the face is recognized
            if conf >= 20:
                # print(id_)
                # print(labels[id_])
                font = cv2.QT_FONT_NORMAL
                id = 0
                id += 1
                name = labels[id_]
                current_name = name
                color = (255, 0, 0)
                stroke = 2
#                cv2.putText(frame, name, (x, y), font, 1, color, stroke, cv2.LINE_AA)
#                cv2.rectangle(frame, (x, y), (x + w, y + h), (255, 0, 0), (2))

                # Find the student's information in the database.
                select = "SELECT users.userID, name, year, major FROM users JOIN students ON students.userID = users.userID WHERE name='%s'" % (name)
                name = cursor.execute(select)
                result = cursor.fetchall()
                # print(result)
                data = "error"

                for x in result:
                    data = x

                # If the student's information is not found in the database
                if data == "error":
                    print("The student", current_name, "is NOT FOUND in the database.")

                # If the student's information is found in the database
                else:
                    #update login history
                    loginHistUpdate =  "INSERT INTO login_hist(UserID, login_time, logout_time) VALUES(%s, now(), now())" % (result[0][0])
                    cursor.execute(loginHistUpdate)
                    myconn.commit()

                    # Find class within one hour.
                    select = "SELECT classID FROM students_take_classes where userID = %s" % result[0][0]
                    getStudentTakesClassesID = cursor.execute(select)
                    StudentTakesClassesID = cursor.fetchall()
                    print(StudentTakesClassesID)
                    select = "SELECT * FROM class_time WHERE day_of_week = %s" % weekday
                    getClassTime = cursor.execute(select)
                    classTime = cursor.fetchall()
                    print(classTime)
                    for i in range(len(StudentTakesClassesID)):    
                        if (len(classTime) > 0):
                            for j in range (len(classTime)):
                                if (StudentTakesClassesID[i][0] == classTime[j][0] and classTime[j][2].total_seconds() - currentTimeDelta <= 3600 and classTime[j][2].total_seconds() - currentTimeDelta >= 0): 
                                    classWithinHour = classTime[j] #Get the class within 1 hour.
                                    # Get info of the class within hour.
                                    select = "SELECT * FROM information WHERE classID = %s AND week = %s" % (classWithinHour[0], weekOfTheYear)
                                    getClassWithinHourInfo = cursor.execute(select)
                                    classWithinHourInfo = cursor.fetchall()
                                    #print(classWithinHour)
                                    #print(classWithinHourInfo)
                    
                    #Get timetable order by weekday and class start time.
                    tempWHERE = "classID = "
                    for i in range(len(StudentTakesClassesID)):
                        temp = StudentTakesClassesID[i][0]
                        tempWHERE = tempWHERE + str(temp)
                        if (i < len(StudentTakesClassesID) - 1):
                            tempWHERE = tempWHERE + " OR classID = "
                    select = "SELECT * FROM class_time WHERE %s" % tempWHERE
                    getTimetable = cursor.execute(select)
                    timetable = cursor.fetchall()
                    timetable = sorted(timetable, key = lambda x: (x[1], x[2]))
                    #print(timetable)

                    # Update the data in database
                    update =  "UPDATE Student SET login_date=%s WHERE name=%s"
                    val = (date, current_name)
                    cursor.execute(update, val)
                    update = "UPDATE Student SET login_time=%s WHERE name=%s"
                    val = (current_time, current_name)
                    cursor.execute(update, val)
                    myconn.commit()
                   
                    hello = ("Hello ", current_name, "You did attendance today")
                    print(hello)
                    engine.say(hello)
                    # engine.runAndWait()
                verified = True
                if cap.isOpened():
                    cap.release()
            # If the face is unrecognized
            else:
                color = (255, 0, 0)
                stroke = 2
                font = cv2.QT_FONT_NORMAL
                cv2.putText(frame, "UNKNOWN", (x, y), font, 1, color, stroke, cv2.LINE_AA)
                cv2.rectangle(frame, (x, y), (x + w, y + h), (255, 0, 0), (2))
                hello = ("Your face is not recognized")
                print(hello)
                engine.say(hello)
                # engine.runAndWait()
#        cv2.imwrite(local_path + '/data/temp/000.jpg', frame)
        k = cv2.waitKey(20) & 0xff
        if k == ord('q'):
            break
        ret, buffer = cv2.imencode('.jpg', frame)
        frame = buffer.tobytes()
        yield (b'--frame\r\n'
            b'Content-Type: image/jpeg\r\n\r\n' + frame + b'\r\n')
            
    cap.release()
    cv2.destroyAllWindows()

if __name__ == '__main__':
    app.secret_key = os.urandom(24)
    app.run(debug=True, use_reloader=False, port=8000)

