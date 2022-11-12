from flask import Flask, render_template, Response, request, jsonify, make_response
import cv2
import os
import numpy as np
from PIL import Image
import pickle
from flask_cors import CORS, cross_origin
import mysql.connector
import pyttsx3
from datetime import datetime, timedelta
from flask_jwt_extended import create_access_token,get_jwt,get_jwt_identity, \
                               unset_jwt_cookies, jwt_required, JWTManager

dir = 'src/FaceRecognition'
app = Flask(__name__, template_folder=dir)
app.config['CORS_HEADERS'] = 'Content-Type'
cors = CORS(app, supports_credentials=True)
app.config["JWT_SECRET_KEY"] = "super-secret"
jwt = JWTManager(app)
faceCascade = cv2.CascadeClassifier(dir + '/haarcascade/haarcascade_frontalface_default.xml')

local_path = os.path.expanduser('~')
sqluser  = {'/Users/edwardchoi': 'root',"/Users/hiumanchau":"root"}
sqlpwd  = {'/Users/edwardchoi': 'root', "/Users/hiumanchau":"chin124328"}
sqlport  = {'/Users/edwardchoi': '8889','/Users/hiumanchau': '3306'}

# 1 Create database connection
print("local path",local_path)
myconn = mysql.connector.connect(host="localhost", user=sqluser[local_path], passwd=sqlpwd[local_path], database="facerecognition", port=sqlport[local_path])
date = datetime.utcnow()
now = datetime.now()
weekday = datetime.today().weekday() #used in class_time
weekOfTheYear = datetime.today().isocalendar().week #used in information
current_time = now.strftime("%H:%M:%S")
currentTimeDelta = datetime.now().hour*3600 + datetime.now().minute*60 + datetime.now().second
cursor = myconn.cursor(buffered = True , dictionary=True)

class JSONResponse(Response):
     default_mimetype = 'application/json'

     @classmethod
     def force_type(cls,response,environ=None):
         if isinstance(response,dict):
             response = jsonify(response)
         return super(JSONResponse,cls).force_type(response,environ)

app.response_class = JSONResponse

def capture_by_frames(user_name):
    global video_capture
    global registration
    global cnt
    global start
    registration = False
    start = False
    video_capture = cv2.VideoCapture(0)
    NUM_IMGS = 100
    if not os.path.exists(dir + '/data/{}'.format(user_name)):
        os.mkdir(dir + '/data/{}'.format(user_name))

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
        cv2.imwrite((dir + '/data/{}/{}{:03d}.jpg').format(user_name, user_name, cnt), frame)
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


@app.route('/registration/<email>')
def checkEmail(email):
    cursor.execute(f"SELECT email FROM Users WHERE email = '{email}'")
    myconn.commit()
    result = cursor.fetchone()
    return jsonify(result = result != None)
    

@app.route('/registration', methods = ["POST", "GET"], strict_slashes=False)
def registration():
    if request.method == 'POST':
        val = request.get_json()
        name = val["name"]
        email = val["email"]
        password = val["password"]
        major = val["major"]
        year = val["year"]
        createAccount(name, email, password)
        createStudent(major, year)
        return jsonify(result=True)
    return jsonify(result=False)

def createAccount(name, email,password):
    createUser = "INSERT INTO Users(name, email, password) VALUES('%s', '%s', '%s')" % (name, email, password)
    cursor.execute(createUser)
    

def createStudent(major, year):
    cursor.execute("SELECT max(user_id) as user_id FROM Users")
    myconn.commit()
    result = cursor.fetchone()
    student_id = result.get('user_id')
    createStudent = "INSERT INTO STUDENTS(user_id, year, major) VALUES(%d, %d, '%s')" % (student_id, year, major)
    cursor.execute(createStudent)
    myconn.commit()

@app.route('/facial_registered')
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
    return Response(facialLogin(), mimetype='multipart/x-mixed-replace; boundary=frame')

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
    with open(dir + '/labels.pickle', "wb") as f:
        pickle.dump(label_ids, f)

    # Train the recognizer and save the trained model.
    recognizer.train(x_train, np.array(y_label))
    recognizer.save(dir + '/train.yml')

def facialLogin():
    
    global verified
    verified = False
    global current_name
    current_name = ''
    global verificationStart
    verificationStart = False


    #2 Load recognize and read label from model
    recognizer = cv2.face.LBPHFaceRecognizer_create()
    recognizer.read(dir + '/train.yml')

    labels = {"person_name": 1}
    with open(dir + '/labels.pickle', "rb") as f:
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
                studentInfo = getStudentInfo()
                # print(result)
                data = "error"

                for x in studentInfo:
                    data = x

                # If the student's information is not found in the database
                if data == "error":
                    print("The student", current_name, "is NOT FOUND in the database.")

                # If the student's information is found in the database
                else:
                    #update login history
                    loginHistUpdate()

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
#        cv2.imwrite(dir + '/data/temp/000.jpg', frame)
        k = cv2.waitKey(20) & 0xff
        if k == ord('q'):
            break
        ret, buffer = cv2.imencode('.jpg', frame)
        frame = buffer.tobytes()
        yield (b'--frame\r\n'
            b'Content-Type: image/jpeg\r\n\r\n' + frame + b'\r\n')

# Login route with email - this will create JWT token,
# send user's detail to front-end storage, and update loginHist
@app.route('/login', methods = ["POST", "GET"], strict_slashes=False)
@cross_origin(methods=['POST'], supports_credentials=True, headers=['Content-Type', 'Authorization'], origin='http://127.0.0.1:5000')
def createToken():
    if request.method == "POST":
        val = request.get_json()
        email = val["email"]
        password = val["password"]
        searchUser = f"SELECT user_id, name, email, password FROM users WHERE email = '{email}' AND password = '{password}'"
        cursor.execute(searchUser)
        myconn.commit()
        result = cursor.fetchone()
        if(result == None):
            return {"msg":"Wrong email or password"}, 401
        else:
            access_token = create_access_token(identity=email, expires_delta=timedelta(days=1))
            resp = make_response( {"access_token":access_token, "user":result})
            user_id = result.get('user_id')
            loginHistUpdate(user_id)
            return resp

# Logout route with user_id - this should 
# 1. unset the JWT token; 2. update loginHist
@app.route("/logout", methods=["POST"])
def logout():
    response = make_response({"msg": "logout successful"})
    unset_jwt_cookies(response)
    user_id = request.get_json()["user_id"]
    logoutHistUpdate(user_id)
    return response

def getStudentInfo(user_id):
    select = "SELECT students.user_id, name, year, major, email FROM users JOIN students ON students.user_id = users.user_id WHERE students.user_id='%s'" % (user_id)
    cursor.execute(select)
    result = cursor.fetchone()
    return result
    #output JSON object format: {user_id:<INT> , name: <String>, ...}

# Given that our SQL only stores one login history per user (user_id as PK)
# This insert the login_time to login_hist if user hasn't logged before;
# otherwise update the history
def loginHistUpdate(user_id):
    loginHistUpdate =  f"INSERT INTO login_hist(user_id, login_time) VALUES('{user_id}', now()) ON DUPLICATE KEY UPDATE login_time=now()"
    cursor.execute(loginHistUpdate)
    myconn.commit()

def logoutHistUpdate(user_id):
    logoutHistUpdate = "UPDATE login_hist SET logout_time = now() WHERE user_id = '%s'" % (user_id)
    cursor.execute(logoutHistUpdate)
    myconn.commit()

def findClassWithinHour():
    studentInfo = getStudentInfo()
    select = "SELECT class_id FROM students_take_classes where user_id = %s" % studentInfo[0][0]
    getStudentTakesClassesID = cursor.execute(select)
    StudentTakesClassesID = cursor.fetchall()
    select = "SELECT * FROM class_time WHERE day_of_week = %s" % weekday
    getClassTime = cursor.execute(select)
    classTime = cursor.fetchall()
    print(classTime)
    for i in range(len(StudentTakesClassesID)):
        if (len(classTime) > 0):
            for j in range (len(classTime)):
                if (StudentTakesClassesID[i][0] == classTime[j][0] and classTime[j][2].total_seconds() - currentTimeDelta <= 3600 and classTime[j][2].total_seconds() - currentTimeDelta >= 0):
                    #Get the class within 1 hour.
                    classWithinHour = classTime[j] 
                    # Get info of the class within hour.
                    select = "SELECT * FROM information WHERE class_id = %s AND week = %s" % (classWithinHour[0], weekOfTheYear)
                    getClassWithinHourInfo = cursor.execute(select)
                    classWithinHourInfo = cursor.fetchall()
                    return classWithinHourInfo 
                    #classWithinHourInfo[n][0] to get value of nth column


def getTimetable():
    studentInfo = getStudentInfo()
    select = "SELECT class_id FROM students_take_classes where user_id = %s" % studentInfo[0][0]
    getStudentTakesClassesID = cursor.execute(select)
    StudentTakesClassesID = cursor.fetchall()
    tempWHERE = "class_id = "
    for i in range(len(StudentTakesClassesID)):
        temp = StudentTakesClassesID[i][0]
        tempWHERE = tempWHERE + str(temp)
        if (i < len(StudentTakesClassesID) - 1):
            tempWHERE = tempWHERE + " OR class_id = "
    select = "SELECT * FROM class_time WHERE %s" % tempWHERE
    getTimetable = cursor.execute(select)
    timetable = cursor.fetchall()
    timetable = sorted(timetable, key = lambda x: (x[1], x[2]))
    return timetable


    cap.release()
    cv2.destroyAllWindows()

if __name__ == '__main__':
    app.secret_key = os.urandom(24)
    app.run(debug=True, use_reloader=False, port=8000)
