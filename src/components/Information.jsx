import React, { useState } from "react";
import Transcription from "./Transcription";
import Translation from "./Translation";

export default function Information(props) {
  const { output } = props;
  const [tab, setTab] = useState("transcription");
  const [translate, setTranslate] = useState("null");
  const [toLanguage, setToLanguage] = useState("null");
  const [translating, setTranslating] = useState("null");
  console.log(output);

  function handleCopy() {
    navigator.clipboard.writeText();
  }

  function handleDownload() {
    const element = document.createElement("a");
    const file = new Blob([], { type: "text/plain" });
    element.href = URL.createObjectURL(file);
    element.download(`Transcribe_${new Date().toDateString()}.txt`);
    document.body.appendChild(element);
    element.click();
  }

  function klk (){

  }

  const textElement = tab === 'transcription' ? output.map((val) => val.text): ''

  return (
    <div>
      <main className="flex-1 p-4 flex flex-col gap-3 text-center sm:gap-4 justify-center pb-20 max-w-prose w-full mx-auto ">
        <h1 className="font-semibold text-4xl sm:text-5xl md:text-6xl whitespace-nowrap">
          Your <span className="text-blue-400 bold">Transcription</span>
        </h1>

        <div className="grid grid-cols-2 mx-auto bg-white rounded-full overflow-hidden items-center">
          <button
            onClick={() => setTab("transcription")}
            className={
              "px-4 duration-200 py-1  " +
              (tab === "transcription"
                ? "bg-blue-400 text-white"
                : "text-blue-400 hover:text-blue-600")
            }
          >
            Transcription
          </button>
          <button
            onClick={() => setTab("translation")}
            className={
              "px-4 duration-200 py-1 font-medium " +
              (tab === "translation"
                ? "bg-blue-400 text-white"
                : "text-blue-400 hover:text-blue-600")
            }
          >
            Translation
          </button>
        </div>
        <div className="my-8 flex flex-col">
          {tab === "transcription" ? (
            <Transcription {...props}  textElement ={ textElement }/>
          ) : (
            <Translation {...props} toLanguage={toLanguage} 
            translating = {translating} Translation = {translation} setTranslating={setTranslating} setToLanguage={setToLanguage}/>
          )}
        </div>

        <div className="flex items-center gap-4 mx-auto">
          <button
            title="copy"
            className="bg-white hover:text-blue-500 duration-200 text-blue-300 px-2 aspect-square grid place-items-center rounded"
          >
            <i class="fa-solid fa-copy"></i>
          </button>
          <button
            title="download"
            className="bg-white hover:text-blue-500 duration-200 text-blue-300 px-2 aspect-square grid place-items-center rounded"
          >
            <i class="fa-solid fa-download"></i>
          </button>
        </div>
      </main>
    </div>
  );
}
