# Getting Started with COMP3278 Project

1. run `conda create -n face python=3.x` on terminal; where x is last digit of your python version if you haven't created conda
2. run `conda activate face`  on terminal
3. run `pip install -r src/FaceRecognition/requirements.txt` on terminal
4. run `source <path to FaceRecognition/facerecognition.sql>`  if you don't have tables on sql
5. run `export EMAIL_USER=[your email address]` on terminal
6. run `export EMAIL_PASSWORD=[your email password]` on terminal
If 5 - 6 are blocked by the browser because of "low-security". please follow the instructions on
'https://github.com/twtrubiks/Flask-Mail-example'
7. run `export FLASK_APP=src.FaceRecognition.apis.py` on terminal
8. run `flask run` for back-end on terminal;
9. run `source <path to demo-data/course-generator.sql>` if you don't have any data in sql.
10. run `set global max_allowed_packet=67108864` in your sql; we might need this to send more information from server to front-end
11. open another terminal for font-end
12. run `npm install` or `yarn` on terminal
13. run `npm start` or `yarn start` on terminal
14. DONE, enjoy testing on front-end and back-end

UPDATE (16/11): PLEASE DON'T USE CHROME FOR EXECUTION

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the file_names include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you're on your own.

You don't have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn't feel obligated to use this feature. However we understand that this tool wouldn't be useful if you couldn't customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)
