import MainContent from "./MainContent";

function Home() {
    const content = <h1>Home</h1>
    return (
        <div>
            <MainContent content={content}/>
        </div>
    );
}

export default Home;