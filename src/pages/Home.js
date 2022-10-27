import Layout from "./Layout";

function Home() {
    const content = <h1>Home</h1>
    return (
        <div>
            <Layout content={content}/>
        </div>
    );
}

export default Home;