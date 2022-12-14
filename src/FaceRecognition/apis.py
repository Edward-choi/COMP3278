import json
from flask import Flask, render_template, Response, request, jsonify, make_response
import re
import cv2
import os
import numpy as np
from PIL import Image
import pickle
from flask_cors import CORS, cross_origin
import mysql.connector
import pyttsx3
from datetime import datetime, timedelta
from flask_mail import Mail, Message
from flask_jwt_extended import create_access_token, get_jwt, get_jwt_identity, \
    unset_jwt_cookies, jwt_required, JWTManager
import mysql.connector.pooling

dir = 'src/FaceRecognition'
template = '../templates'
app = Flask(__name__)
cors = CORS(app, supports_credentials=True,
            resources={r'/*': {'origins': '*'}})
app.config['CORS_HEADERS'] = 'Content-Type'

app.config["JWT_SECRET_KEY"] = "super-secret"
mail_settings = {
    "MAIL_SERVER": 'smtp.gmail.com',
    "MAIL_PORT": 465,
    "MAIL_USE_TLS": False,
    "MAIL_USE_SSL": True,
    "MAIL_USERNAME": 'edward68710166@gmail.com',
    "MAIL_PASSWORD": 'xmqsfgtbfxhgnkmc'
}
app.config.update(mail_settings)
mail = Mail(app)


jwt = JWTManager(app)
faceCascade = cv2.CascadeClassifier(
    dir + '/haarcascade/haarcascade_frontalface_default.xml')

local_path = os.path.expanduser('~')
sqluser = {'/Users/edwardchoi': 'root',
           "/Users/hiumanchau": "root",
           '/Users/a85256': "root",
           r"C:\Users\James Chan": "root"}
sqlpwd = {'/Users/edwardchoi': 'root',
          "/Users/hiumanchau": "chin124328",
          '/Users/a85256': "Yanchiho2001@",
          r"C:\Users\James Chan": "jamesmysql"}
sqlport = {'/Users/edwardchoi': '8889',
           '/Users/hiumanchau': '3306',
           '/Users/a85256': '3306',
           r"C:\Users\James Chan": '3306'}

config = {
    "host": "localhost",
    "user": sqluser[local_path],
    "passwd": sqlpwd[local_path],
    "database": "facerecognition",
    "port": sqlport[local_path],
    "connect_timeout": 6000
}
date = datetime.utcnow()
now = datetime.now()
weekday = datetime.today().weekday()  # used in class_time
weekOfTheYear = datetime.today().isocalendar().week  # used in information
current_time = now.strftime("%H:%M:%S")
currentTimeDelta = datetime.now().hour*3600 + datetime.now().minute * \
    60 + datetime.now().second

# Moved mysql connector in each function
print("local path", local_path)

# Create a connector pool for multi-threads
myconn_pool = mysql.connector.pooling.MySQLConnectionPool(
    pool_name="pool", pool_reset_session=True, **config)


class JSONResponse(Response):
    default_mimetype = 'application/json'

    @classmethod
    def force_type(cls, response, environ=None):
        if isinstance(response, dict):
            response = jsonify(response)
        return super(JSONResponse, cls).force_type(response, environ)


app.response_class = JSONResponse


def find_user_id():
    myconn = mysql.connector.connect(**config)
    cursor = myconn.cursor(buffered=True, dictionary=True)
    cursor.execute("SELECT max(user_id) as user_id FROM Users")
    myconn.commit()
    result = cursor.fetchone()
    if myconn.is_connected():
        cursor.close()
        myconn.close()
    return result.get('user_id')


def capture_by_frames(user_name):
    global video_capture
    global registration
    global trained
    global cnt
    global start
    registration = False
    start = False
    trained = False
    video_capture = cv2.VideoCapture(0)
    NUM_IMGS = 100
    user_id = find_user_id()
    if not os.path.exists(dir + '/data/{}'.format(str(user_id) + " " + user_name)):
        os.mkdir(dir + '/data/{}'.format(str(user_id) + " " + user_name))

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
        cv2.imwrite((dir + '/data/{}/{}{:03d}.jpg').format(str(user_id) +
                    " " + user_name, user_name, cnt), frame)
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
    trained = True
    return True


@app.route('/registration/<email>', strict_slashes=False)
@cross_origin(supports_credentials=True)
def checkEmail(email):
    myconn = mysql.connector.connect(**config)
    cursor = myconn.cursor(buffered=True, dictionary=True)
    cursor.execute(f"SELECT email FROM Users WHERE email = '{email}'")
    myconn.commit()
    result = cursor.fetchone()
    if myconn.is_connected():
        cursor.close()
        myconn.close()
    return jsonify({"msg": result != None})


@app.route('/registration', methods=["POST", "GET"], strict_slashes=False)
@cross_origin(origin='localhost', headers=['Content-Type', 'Authorization'])
def registration():
    if request.method == 'POST':
        val = request.get_json()
        firstName = val["firstName"]
        lastName = val["lastName"]
        email = val["email"]
        password = val["password"]
        major = val["major"]
        year = int(val["year"])
        createAccount(firstName, lastName, email, password)
        createStudent(major, year)
        return jsonify(result=True)
    return jsonify(result=False)

# create user route -- based on the inputted first name, last name, email and password
# user_id will be automatically generated by MySQL


def createAccount(firstName, lastName, email, password):
    myconn = mysql.connector.connect(**config)
    cursor = myconn.cursor(buffered=True, dictionary=True)
    createUser = f"INSERT INTO Users(first_name, last_name, email, password) VALUES('{firstName}','{lastName}', '{email}', '{password}')"
    cursor.execute(createUser)
    myconn.commit()
    if myconn.is_connected():
        cursor.close()
        myconn.close()

# Update (16/11): Assume students enrolled all courses in our DB already
# -> update StudentsTakesClasses automatically after create a student account


def createStudent(major, year):
    myconn = mysql.connector.connect(**config)
    cursor = myconn.cursor(buffered=True, dictionary=True)
    cursor.execute("SELECT max(user_id) as user_id FROM Users")
    myconn.commit()
    result = cursor.fetchone()
    student_id = result.get('user_id')
    cursor.execute(f"ALTER TABLE Students AUTO_INCREMENT = {student_id}")
    createStudent = "INSERT INTO STUDENTS(year, major) VALUES(%d, '%s')" % (
        year, major)
    cursor.execute(createStudent)
    myconn.commit()
    updateEnrollment = f"INSERT INTO Students_Take_Classes(user_id, class_id, year) SELECT {student_id} as user_id, class_id, academic_year FROM Classes"
    cursor.execute(updateEnrollment)
    myconn.commit()
    if myconn.is_connected():
        cursor.close()
        myconn.close()


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
            'user_id': user_id,
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


@app.route('/data_trained')
def data_trained():
    try:
        response = jsonify({
            'trained': trained,
        })
    except:
        response = jsonify({
            'trained': False,
        })

    response.headers.add("Access-Control-Allow-Origin", "*")
    return response


@app.route('/video_capture/<name>')
@cross_origin(origin='localhost', headers=['Content-Type', 'Authorization'])
def video_capture(name):
    return Response(capture_by_frames(name), mimetype='multipart/x-mixed-replace; boundary=frame')


@app.route('/login_verification')
@cross_origin(origin='localhost', headers=['Content-Type', 'Authorization'])
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
                faces = faceCascade.detectMultiScale(
                    image_array, scaleFactor=1.2, minNeighbors=5)

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
    return True


def facialLogin():

    global verified
    verified = False
    global current_name
    current_name = ''
    global verificationStart
    verificationStart = False
    global user_id
    user_id = -1

    # 2 Load recognize and read label from model
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
        faces = faceCascade.detectMultiScale(
            gray, scaleFactor=1.2, minNeighbors=5)
        verificationStart = True

        for (x, y, w, h) in faces:
            print(x, w, y, h)
            roi_gray = gray[y:y + h, x:x + w]
            roi_color = frame[y:y + h, x:x + w]
            # predict the id and confidence for faces
            id_, conf = recognizer.predict(roi_gray)

            # If the face is recognized
            if conf >= 60:
                # print(id_)
                # print(labels[id_])
                font = cv2.QT_FONT_NORMAL
                id = 0
                id += 1
                name = labels[id_]
                num_list = [int(s) for s in re.findall(r'\b\d+\b', name)]
                user_id = num_list[0]
                new_string = ''.join(filter(lambda x: not x.isdigit(), name))
                first_name = new_string.strip()
                current_name = first_name
                color = (255, 0, 0)
                stroke = 2
#                cv2.putText(frame, name, (x, y), font, 1, color, stroke, cv2.LINE_AA)
#                cv2.rectangle(frame, (x, y), (x + w, y + h), (255, 0, 0), (2))

                # Find the student's information in the database.
                studentInfo = getStudentInfo(user_id)
                # print(result)
                data = "error"

                for x in studentInfo:
                    data = x

                # If the student's information is not found in the database
                if data == "error":
                    print("The student", current_name,
                          "is NOT FOUND in the database.")

                # If the student's information is found in the database
                else:
                    # update login history
                    loginHistUpdate(user_id)

                    hello = ("Hello ", current_name,
                             "You did attendance today")
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
                cv2.putText(frame, "UNKNOWN", (x, y), font,
                            1, color, stroke, cv2.LINE_AA)
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


@app.route('/login/<uid>')
@app.route('/login', methods=["POST", "GET"], strict_slashes=False)
@cross_origin(methods=['POST', 'GET'], supports_credentials=True, headers=['Content-Type', 'Authorization'], origin='*')
def createToken(uid=None):
    if request.method == "POST":
        myconn = mysql.connector.connect(**config)
        cursor = myconn.cursor(buffered=True, dictionary=True)
        val = request.get_json()
        email = val["email"]
        password = val["password"]
        searchUser = f"SELECT user_id, first_name, last_name, email, password FROM users WHERE email = '{email}' AND password = '{password}'"
        cursor.execute(searchUser)
        myconn.commit()
        result = cursor.fetchone()
        if myconn.is_connected():
            cursor.close()
            myconn.close()
        if (result == None):
            return {"msg": "Wrong email or password"}, 401
        else:
            access_token = create_access_token(
                identity=email, expires_delta=timedelta(days=1))

            uid = result.get('user_id')
            loginHistUpdate(uid)
            print(uid)
            response = jsonify({"access_token": access_token, "user": result})

            return response
    elif uid is not None and int(uid) > 0:
        myconn = mysql.connector.connect(**config)
        cursor = myconn.cursor(buffered=True, dictionary=True)
        student = getStudentInfo(int(uid))
        loginHistUpdate(int(uid))
        access_token = create_access_token(
            identity=student.get("email"), expires_delta=timedelta(days=1))
        response = jsonify({"access_token": access_token, "user": student})
        return response


# Logout route with user_id - this should
# 1. unset the JWT token; 2. update loginHist


@app.route("/logout", methods=["POST"])
def logout():
    response = make_response({"msg": "logout successful"})
    unset_jwt_cookies(response)
    uid = request.get_json()["user_id"]
    logoutHistUpdate(uid)
    return response


def getStudentInfo(uid=None):
    myconn = mysql.connector.connect(**config)
    cursor = myconn.cursor(buffered=True, dictionary=True)
    select = "SELECT students.user_id, first_name, last_name, year, major, email, password FROM users JOIN students ON students.user_id = users.user_id WHERE students.user_id=%s" % (
        uid)
    cursor.execute(select)
    result = cursor.fetchone()
    print(result)
    if myconn.is_connected():
        cursor.close()
        myconn.close()
    return result
    # output JSON object format: {user_id:<INT> , name: <String>, ...}


@app.route("/personal_info/<uid>")
def getPersonalInfo(uid):
    result = getStudentInfo(uid)
    return jsonify(result)


@app.route("/edit_profile", methods=["POST"])
@cross_origin(methods=['POST'], supports_credentials=True, headers=['Content-Type', 'Authorization'], origin='*')
def updateProfile():
    if (request.method == "POST"):
        val = request.get_json()
        uid = val["user_id"]
        if (uid is None):
            return {"msg": "invalid user id"}, 401
        old = getStudentInfo(uid)
        firstName = val["firstName"] if val["firstName"] is not None else old.get(
            "first_name")
        lastName = val["lastName"] if val["lastName"] is not None else old.get(
            "last_name")
        email = val["email"] if val["email"] is not None else old.get("email")
        password = val["password"] if val["password"] is not None else old.get(
            "password")
        major = val["major"] if val["major"] is not None else old.get("major")
        year = int(val["year"]) if val["year"] is not None else old.get("year")
        try:
            update = f"UPDATE Users, Students SET first_name='{firstName}', last_name='{lastName}', email='{email}', password='{password}', major='{major}', year={year} WHERE Users.user_id = {uid} AND Students.user_id={uid}"
            myconn = mysql.connector.connect(**config)
            cursor = myconn.cursor(buffered=True, dictionary=True)
            cursor.execute(update)
            myconn.commit()
            if myconn.is_connected():
                cursor.close()
                myconn.close()
            return {"user": {"user_id": uid, "first_name": firstName, "last_name": lastName, "email": email, "password": password}}
        except:
            return {"msg": "update fail"}, 401

# Given that our SQL only stores one login history per user (user_id as PK)
# This insert the login_time to login_hist if user hasn't logged before;
# otherwise update the history


def loginHistUpdate(uid):
    myconn = mysql.connector.connect(**config)
    cursor = myconn.cursor(buffered=True, dictionary=True)
    loginHistUpdate = f"INSERT INTO login_hist(user_id, login_time) VALUES('{uid}', now()) ON DUPLICATE KEY UPDATE login_time=now()"
    cursor.execute(loginHistUpdate)
    myconn.commit()
    if myconn.is_connected():
        cursor.close()
        myconn.close()


def logoutHistUpdate(uid):
    myconn = mysql.connector.connect(**config)
    cursor = myconn.cursor(buffered=True, dictionary=True)
    logoutHistUpdate = "UPDATE login_hist SET logout_time = now() WHERE user_id = '%s'" % (uid)
    cursor.execute(logoutHistUpdate)
    myconn.commit()
    if myconn.is_connected():
        cursor.close()
        myconn.close()

# Get all enrolled courses with given user_id


@app.route("/courses", methods=["GET"])
def getClasses():
    myconn = mysql.connector.connect(**config)
    cursor = myconn.cursor(buffered=True, dictionary=True)
    uid = request.args.get('user_id')

    searchClasses = f"SELECT Classes.class_id, T.first_name, T.last_name, course_code, course_name, academic_year, description FROM Classes JOIN Students_Take_Classes ON user_id = {uid}, ( select first_name, last_name, teacher_id from Users JOIN teachers on user_id = teacher_id) T WHERE T.teacher_id = Classes.teacher_id GROUP BY Classes.class_id"
    cursor.execute(searchClasses)
    myconn.commit()
    enrollments = cursor.fetchall()

    res = []
    for row in enrollments:
        name = f"Dr. {row.get('last_name')}, {row.get('first_name')}"
        if "last_name" in row:
            del row["last_name"]
        if "first_name" in row:
            del row["first_name"]
        row["lecturer"] = name
        res.append(row)
    if myconn.is_connected():
        cursor.close()
        myconn.close()
    return jsonify(res)

# Get all current courses with given user_id


@app.route("/current_courses", methods=["GET"], strict_slashes=False)
def getCurrentClasses():
    myconn = mysql.connector.connect(**config)
    cursor = myconn.cursor(buffered=True, dictionary=True)
    uid = request.args.get('user_id')

    searchClasses = f"SELECT Classes.class_id, T.first_name, T.last_name, course_code, course_name, academic_year, description FROM Classes JOIN Students_Take_Classes ON user_id = {uid}, ( select first_name, last_name, teacher_id from Users JOIN teachers on user_id = teacher_id) T WHERE T.teacher_id = Classes.teacher_id AND academic_year = YEAR(now()) GROUP BY Classes.class_id"
    cursor.execute(searchClasses)
    myconn.commit()
    enrollments = cursor.fetchall()

    res = []
    for row in enrollments:
        name = f"Dr. {row.get('last_name')}, {row.get('first_name')}"
        if "last_name" in row:
            del row["last_name"]
        if "first_name" in row:
            del row["first_name"]
        row["lecturer"] = name
        res.append(row)
    if myconn.is_connected():
        cursor.close()
        myconn.close()
    return jsonify(res)

# Get all courses with given user_id and filtering query
# search is the search text entered by the user
# filter is a string that contains a constraint for sql filtering
# order is a string that contains the attribute and the order sequence


@app.route("/filter_courses", methods=["GET"])
def getFilteredClasses():
    uid = request.args.get("user_id")
    search = request.args.get("search")
    filter = request.args.get("filter")
    order = request.args.get("order")

    search = f"'%{search}%'"

    nullSafety = "T.last_name is NULL OR description is NULL"
    conditions = f"(T.first_name LIKE {search} OR T.last_name LIKE {search} OR course_code LIKE {search} OR course_name LIKE {search} OR CAST(academic_year as CHAR(50)) LIKE {search} OR {nullSafety})"
    if (filter is not None and len(filter) > 0):
        conditions += f'AND {filter}'
    if (order is None):
        order = ""
    else:
        order = f"ORDER BY {order}"
    filterClasses = f"SELECT Classes.class_id as class_id, T.first_name, T.last_name, course_code, course_name, academic_year, description FROM Classes JOIN Students_Take_Classes ON user_id = {uid}, ( select first_name, last_name, teacher_id from Users JOIN Teachers on user_id = teacher_id) T WHERE T.teacher_id = Classes.teacher_id AND {conditions} GROUP BY Classes.class_id {order} "
    myconn = mysql.connector.connect(**config)
    cursor = myconn.cursor(buffered=True, dictionary=True)
    cursor.execute(filterClasses)
    myconn.commit()
    courses = cursor.fetchall()
    res = []
    for row in courses:
        name = f"Dr. {row.get('last_name')}, {row.get('first_name')}"
        if "last_name" in row:
            del row["last_name"]
        if "first_name" in row:
            del row["first_name"]
        row["lecturer"] = name
        res.append(row)
    if myconn.is_connected():
        cursor.close()
        myconn.close()
    return jsonify(res)

# teacher_ids should be a string that "teacher1_id, teacher2_id, ...."


def getTeacherInfo(teacher_ids):
    myconn = mysql.connector.connect(**config)
    cursor = myconn.cursor(buffered=True, dictionary=True)
    searchTeachers = f"SELECT first_name, last_name, email, faculty, department FROM Users JOIN Teachers ON user_id = teacher_id WHERE teacher_id IN ({teacher_ids})"
    cursor.execute(searchTeachers)
    myconn.commit()
    result = cursor.fetchall()
    if myconn.is_connected():
        cursor.close()
        myconn.close()
    teachers = []
    for row in result:
        name = f"Dr. {row.get('last_name')}, {row.get('first_name')}"
        if "last_name" in row:
            del row["last_name"]
        if "first_name" in row:
            del row["first_name"]
        row["name"] = name
        teachers.append(row)
    return teachers


@app.route("/course/<id>")
def getCourse(id):
    if (id is not None):
        myconn = mysql.connector.connect(**config)
        cursor = myconn.cursor(buffered=True, dictionary=True)
        searchCourse = f"SELECT * FROM Classes WHERE class_id = {id}"
        cursor.execute(searchCourse)
        myconn.commit()
        result = cursor.fetchone()
        if myconn.is_connected():
            cursor.close()
            myconn.close()
        teacher_id = result.get("teacher_id")
        teacher = getTeacherInfo(teacher_id)[0]
        if "teacher_id" in result:
            del result["teacher_id"]
        result["lecturer"] = teacher
        return jsonify(result)
    else:
        return {"msg": "undefined course id"}, 401


@app.route("/course_info/<id>")
def getInformation(id):
    myconn = mysql.connector.connect(**config)
    cursor = myconn.cursor(buffered=True, dictionary=True)
    searchInformation = f"SELECT course_number, venue FROM Information WHERE class_id = {id} AND date <= (now())"
    cursor.execute(searchInformation)
    myconn.commit()
    result = cursor.fetchall()
    if myconn.is_connected():
        cursor.close()
        myconn.close()
    return result


@app.route("/course_message", methods=["GET"])
def getMessages():
    id = request.args.get("id")
    search = request.args.get("search")
    order = request.args.get("order")
    search = f"'%{search}%'"
    conditions = f"WHERE (send_at LIKE {search} OR subject LIkE {search}) OR content LIKE {search} OR T.first_name LIKE {search} OR T.last_name LIKE {search}"
    orderBy = "ASC" if int(order) > 0 else "DESC"
    searchMsgs = f"SELECT send_at, subject, content, T.first_name, T.last_name FROM TeacherMessage TM JOIN Information I ON I.class_id={id} AND TM.class_id = I.class_id AND TM.course_number = I.course_number JOIN (SELECT first_name, last_name, teacher_id FROM Users JOIN Teachers ON user_id = teacher_id)T ON T.teacher_id = from_id {conditions} GROUP BY TM.course_number, message_id ORDER BY send_at {orderBy}"
    myconn = mysql.connector.connect(**config)
    cursor = myconn.cursor(buffered=True, dictionary=True)
    cursor.execute(searchMsgs)
    myconn.commit()
    result = cursor.fetchall()

    for row in result:
        name = f"Dr. {row.get('last_name')}, {row.get('first_name')}"
        if "last_name" in row:
            del row["last_name"]
        if "first_name" in row:
            del row["first_name"]
        row["from"] = name
    if myconn.is_connected():
        cursor.close()
        myconn.close()
    return jsonify(result)


@app.route("/course_materials", methods=["GET"])
def getMaterialsAndZooms():
    id = request.args.get("id")
    search = request.args.get("search")
    order = request.args.get("order")
    conditions = ""
    print(len(search))
    if (len(search) > 0):
        search = f"'%{search}%'"
        nullSafety = "(file_link is not NULL OR file_name is not NULL OR link is not NULL OR meeting_id is not NULL OR passcode is not NULL)"
        conditions = f" AND (file_link LIKE {search} OR file_name LIKE {search} OR link LIKE {search} OR meeting_id LIKE {search} OR passcode LIKE {search} OR {nullSafety}) "
    orderBy = "ASC" if int(order) > 0 else "DESC"
    searchMaterialsAndZooms = f"SELECT I.course_number, date, ANY_VALUE(file_link) as file_link, ANY_VALUE(file_name) as file_name, ANY_VALUE(link) as link, ANY_VALUE(meeting_id) as meeting_id, ANY_VALUE(passcode) as passcode FROM Information I LEFT JOIN CourseMaterial CM ON CM.class_id = {id} AND CM.class_id = I.class_id AND CM.course_number = I.course_number LEFT JOIN ZoomLink ZM ON ZM.class_id = {id} AND ZM.course_number = I.course_number AND ZM.class_id = I.class_id WHERE date <= (now()) AND I.class_id={id} {conditions} ORDER BY I.course_number {orderBy}, date {orderBy}"
    myconn = mysql.connector.connect(**config)
    cursor = myconn.cursor(buffered=True, dictionary=True)
    cursor.execute(searchMaterialsAndZooms)
    myconn.commit()
    result = cursor.fetchall()
    if myconn.is_connected():
        cursor.close()
        myconn.close()
    res = []
    for row in result:
        update = False
        courseNo = row.get("course_number")
        materials = []
        if (row.get("file_link") is not None):
            material = {"link": row.get(
                "file_link"), "file_name": row.get("file_name")}
            materials.append(material)
        zoom = {"link": row.get("link"), "meeting_id": row.get(
            "meeting_id"), "passCode": row.get("passcode")}
        obj = {"course_number": courseNo, "date": row.get(
            "date"), "materials": materials, "zoom": zoom}

        for x in res:
            if x.get("course_number") == courseNo:
                x.update({"materials": x.get("materials").append(material)})
                update = True
                break

        if update == False:
            res.append(obj)
    return jsonify(res)


@app.route("/upcoming_course/<id>")
def findClassWithinHour(id):
    if id is not None:
        date = 'curdate()'
        classInfos = searchClassInfo(uid=id, lastDate=date, oneHourWithin=True)

        if (len(classInfos) > 0):
            return jsonify(classInfos[0])
        else:
            return jsonify({"msg": "no upcoming course"}), 200
    else:
        return jsonify({"msg": "invalid user_id"}), 401


def getTimetable():
    studentInfo = getStudentInfo()
    select = "SELECT class_id FROM students_take_classes where user_id = %s" % studentInfo.get(
        "user_id")
    myconn = mysql.connector.connect(**config)
    cursor = myconn.cursor(buffered=True, dictionary=True)
    cursor.execute(select)
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
    timetable = sorted(timetable, key=lambda x: (x[1], x[2]))
    if myconn.is_connected():
        cursor.close()
        myconn.close()
    return timetable


@app.route("/timetable/<id>")
def getTimetable(id):
    select = '''SELECT * FROM students S, Classes C, 
    students_take_classes T, Information I, Class_Time CT 
    WHERE S.user_id = T.user_id AND T.class_id = I.class_id AND T.class_id = C.class_id 
    AND T.class_id = CT.class_id AND WEEKDAY(I.date) = CT.day_of_week AND S.user_id = ''' + id
    myconn = mysql.connector.connect(**config)
    cursor = myconn.cursor(buffered=True, dictionary=True)
    cursor.execute(select)
    StudentTakesClassesID = cursor.fetchall()
    data = []
    for i in range(len(StudentTakesClassesID)):
        data.append(
            {
                'course_code': StudentTakesClassesID[i].get("course_code"),
                'venue': StudentTakesClassesID[i].get("venue"),
                'date':  StudentTakesClassesID[i].get("date"),
                'start_time': StudentTakesClassesID[i].get("start_time"),
                'end_time': StudentTakesClassesID[i].get("end_time"),
            }
        )
    results = json.dumps({"data": data}, default=str)
    return results


@app.route("/this_week_courses", methods=["GET"])
def getThisWeekCourse():
    uid = request.args.get("user_id")
    # Search enrolled and currently attending classes from SQL
    if (uid is not None):
        upcomingMon = "curdate()+INTERVAL 1 - weekday(curdate())DAY"
        upcomingFri = "curdate() + INTERVAL 4 - weekday(curdate()) DAY"
        classInfos = searchClassInfo(
            uid=uid, lastDate=upcomingFri, firstDate=upcomingMon)
        return jsonify(classInfos)
    else:
        return {"msg": "invalid user_id"}, 401

# This function for local function searching only
# Don't put a route on it


def searchClassInfo(uid=None, class_ids=None, firstDate='curdate()', lastDate=None, oneHourWithin=False):
    ids = class_ids
    setTimeZoom = "set time_zone = '+08:00'"
    myconn = mysql.connector.connect(**config)
    cursor = myconn.cursor(buffered=True, dictionary=True)
    cursor.execute(setTimeZoom)
    myconn.commit()
    searchClasses = f"SELECT Classes.class_id, T.first_name, T.last_name, course_code, course_name, academic_year, description FROM Classes JOIN Students_Take_Classes ON user_id = {uid}, ( select first_name, last_name, teacher_id from Users JOIN teachers on user_id = teacher_id) T WHERE T.teacher_id = Classes.teacher_id AND academic_year = YEAR(now()) GROUP BY Classes.class_id"

    cursor.execute(searchClasses)
    myconn.commit()
    currentClasses = cursor.fetchall()

    if ids is None or len(ids) <= 0:
        if (len(currentClasses) > 0):
            ids = ", ".join(str(course.get("class_id"))
                            for course in currentClasses)
    if ids is not None and len(ids) > 0 and date is not None:

        timeRange = " AND (TIME_TO_SEC(start_time) - TIME_TO_SEC(TIME(LOCALTIME()))) <= 3600 AND (TIME_TO_SEC(start_time) - TIME_TO_SEC(TIME(LOCALTIME())))>=0" if oneHourWithin else ""
        # Search class_id, start and end time, date, venue, course_number, messages,
        # materials, and zoom for each lecture in Class_Time, Information Tables,
        # TeacherMessage, CourseMaterial and ZoomLink
        searchClassAllInfo = f"SELECT I.class_id, DATE_FORMAT(start_time, '%H:%i') as start_time, DATE_FORMAT(end_time,'%H:%i') as end_time, date, I.course_number, venue, message_id, send_at, subject, content, from_id, file_link, file_name, link, meeting_id, passcode FROM Information I JOIN Class_TIME CT ON I.class_id IN ({ids}) AND I.class_id = CT.class_id AND date BETWEEN {firstDate} AND {lastDate} AND WEEKDAY(date) = day_of_week {timeRange} LEFT JOIN TeacherMessage TM ON TM.class_id = I.class_id AND TM.course_number = I.course_number LEFT JOIN CourseMaterial CM ON CM.class_id = I.class_id AND CM.course_number = I.course_number LEFT JOIN ZoomLink ZL ON ZL.class_id = I.class_id AND ZL.course_number = I.course_number ORDER BY date, start_time,I.course_number"
        cursor.execute(searchClassAllInfo)
        myconn.commit()
        classAllInfo = cursor.fetchall()
        classInfos = []
        if myconn.is_connected():
            cursor.close()
            myconn.close()
        # Rephrase dict to json
        for row in classAllInfo:
            class_id = row.get("class_id")
            course_number = row.get("course_number")
            course = next((x for x in currentClasses if x.get(
                "class_id") == class_id), None)
            if (course is not None):
                update = False
                message = None
                material = None
                zoom = None
                if (row.get("send_at") is not None and row.get("from_id") is not None):
                    fromTeacher = getTeacherInfo(row.get("from_id"))[0]
                    message = {
                        "subject": row.get("subject"),
                        "from": fromTeacher.get("name"),
                        "send_at": row.get("send_at"),
                        "content": row.get("content"),
                    }
                if (row.get("file_link") is not None):
                    material = {
                        "link": row.get("file_link"),
                        "file_name": row.get("file_name")
                    }
                if (row.get("link")):
                    zoom = {
                        "link": row.get("link"),
                        "meeting_id": row.get("meeting_id"),
                        "passcode": row.get("passcode")
                    }
                for x in classInfos:
                    if (x.get("class_id") == class_id and x.get("course_number") == course_number):
                        if (material is not None):
                            x.update({"materials": x.get("materials").append(
                                material)})
                        if (message is not None):
                            x.update(
                                {"messages": x.get("messages").append(message)})
                        update = True
                if (update == False):
                    courseInfo = {
                        "class_id": class_id,
                        "course_code": course.get("course_code"),
                        "course_name": course.get("course_name"),
                        "academic_year": course.get("academic_year"),
                        "description": course.get("description"),
                        "lecturer": f"Dr. {course.get('last_name')}, {course.get('first_name')}",
                        "course_number": course_number,
                        "date": row.get("date"),
                        "startAt": row.get("start_time"),
                        "endAt": row.get("end_time"),
                        "venue": row.get("venue"),
                        "messages": [message] if message is not None and message.get("send_at") is not None else [],
                        "materials": [material] if material is not None and material.get("link") is not None else [],
                        "zoom": zoom
                    }
                    classInfos.append(courseInfo)
        return classInfos
    else:
        return []


@app.route("/send_email/<uid>/<cid>/<cno>")
def sendEmail(uid, cid, cno):
    try:
        myconn = mysql.connector.connect(**config)
        cursor = myconn.cursor(buffered=True, dictionary=True)

        class_select = f'''SELECT C.course_code, C.course_name, C.description, I.venue, CT.start_time, CT.end_time 
        FROM Classes C, Information I, Class_Time CT 
        WHERE I.course_number = {cno} AND C.class_id = CT.class_id AND C.class_id = I.class_id 
        AND C.class_id = {cid}'''
        cursor.execute(class_select)
        courseInfo = cursor.fetchone()
        print(courseInfo)

        user_select = '''SELECT first_name, email FROM Users WHERE user_id = ''' + uid
        cursor.execute(user_select)
        userInfo = cursor.fetchone()

        message_select = '''SELECT first_name, send_at, subject, content FROM Users, TeacherMessage WHERE user_id = from_id AND class_id = ''' + cid
        cursor.execute(message_select)
        messageInfo = cursor.fetchall()

        zoom_select = '''SELECT link, meeting_id, passcode FROM ZoomLink WHERE class_id = ''' + cid
        cursor.execute(zoom_select)
        zoomInfo = cursor.fetchone()

        material_select = '''SELECT file_link, file_name FROM CourseMaterial WHERE class_id = ''' + cid
        cursor.execute(material_select)
        materialInfo = cursor.fetchall()

        results = {
            "course_data": courseInfo,
            "user_data": userInfo,
            "message_data": messageInfo,
            "zoom_data": zoomInfo,
            "material_data": materialInfo,
        }
        print(results)

        materials = []
        messages = []
        for i in range(len(results['material_data'])):
            materials.append(results['material_data'][i]['file_link'])

        for i in range(len(results['message_data'])):
            messages.append({
                'from': results['message_data'][i]['first_name'],
                'time': results['message_data'][i]['send_at'],
                'subject': results['message_data'][i]['subject'],
                'content': results['message_data'][i]['content'],
            })
        # return results
        course = {
            'code': courseInfo.get('course_code'),
            'class_time': str(results['course_data']['start_time']) + ' - ' + str(results['course_data']['end_time']),
            'title': results['course_data']['course_code'] + '--' + results['course_data']['course_name'],
            'description': results['course_data']['description'],
            'address': results['course_data']['venue'],
            'zoom_link': results['zoom_data']['link'],
            'meeting_ID': results['zoom_data']['meeting_id'],
            'materials': materials,
            'messages': messages
        }
        print('email:', results['user_data']['email'])
        with app.app_context():
            msg = Message(subject="Course information",
                          sender=app.config.get("MAIL_USERNAME"),
                          # replace with your email for testing
                          recipients=[userInfo.get('email')],
                          body="testing",
                          html=render_template('email.html', course=course),
                          )
            mail.send(msg)
            return {"msg": "Send Successfully -- check your email box!"}
    except Exception as e:
        print(e)
        return {"msg": "Fail to send mail"}


if __name__ == '__main__':
    app.secret_key = os.urandom(24)
    app.run(debug=True, use_reloader=False, port=8000)
