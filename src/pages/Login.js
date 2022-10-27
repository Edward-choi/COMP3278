import MainContent from "./MainContent";

function Login() {
    const content = <h1>Login</h1>
    return (
        <div>
            <MainContent content={content}/>
        </div>
    );
}

export default Login;