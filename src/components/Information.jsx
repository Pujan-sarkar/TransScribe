import React from "react";

export default function Information() {
  return (
    <div>
      <main className="flex-1 p-4 flex flex-col gap-3 text-center sm:gap-4 justify-center pb-20 w-72 sm:w-96  max-w-full mx-auto ">
        <h1 className="font-semibold text-4xl sm:text-5xl">
          Your<span className="text-blue-400 bold">Files</span>
        </h1>
      </main>
    </div>
  );
}
