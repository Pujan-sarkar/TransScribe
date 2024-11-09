import { useState } from "react";
import HomePage from "./components/HomePage";
import Header from "./components/Header";

function App() {
  const [count, setCount] = useState(0);

  return (
    <div className="flex flex-col p-4 max-w-[1000px] mx-auto w-full">
      <section className="min-h-screen flex flex-col">
        <Header />
        <HomePage />
      </section>
      <h1 className="text-green-500">Hello World</h1>
      <footer></footer>
    </div>
  );
}

export default App;
