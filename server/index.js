import { jsx, jsxs, Fragment } from "react/jsx-runtime";
import { PassThrough } from "node:stream";
import { createReadableStreamFromReadable } from "@react-router/node";
import { ServerRouter, useParams, useLoaderData, useActionData, useMatches, useRouteError, Meta, Links, ScrollRestoration, Scripts, Outlet, isRouteErrorResponse } from "react-router";
import { isbot } from "isbot";
import { renderToPipeableStream } from "react-dom/server";
import { createElement, useRef, useState, useEffect } from "react";
const streamTimeout = 5e3;
function handleRequest(request, responseStatusCode, responseHeaders, routerContext, loadContext) {
  return new Promise((resolve, reject) => {
    let shellRendered = false;
    let userAgent = request.headers.get("user-agent");
    let readyOption = userAgent && isbot(userAgent) || routerContext.isSpaMode ? "onAllReady" : "onShellReady";
    const { pipe, abort } = renderToPipeableStream(
      /* @__PURE__ */ jsx(ServerRouter, { context: routerContext, url: request.url }),
      {
        [readyOption]() {
          shellRendered = true;
          const body = new PassThrough();
          const stream = createReadableStreamFromReadable(body);
          responseHeaders.set("Content-Type", "text/html");
          resolve(
            new Response(stream, {
              headers: responseHeaders,
              status: responseStatusCode
            })
          );
          pipe(body);
        },
        onShellError(error) {
          reject(error);
        },
        onError(error) {
          responseStatusCode = 500;
          if (shellRendered) {
            console.error(error);
          }
        }
      }
    );
    setTimeout(abort, streamTimeout + 1e3);
  });
}
const entryServer = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: handleRequest,
  streamTimeout
}, Symbol.toStringTag, { value: "Module" }));
function withComponentProps(Component) {
  return function Wrapped() {
    const props = {
      params: useParams(),
      loaderData: useLoaderData(),
      actionData: useActionData(),
      matches: useMatches()
    };
    return createElement(Component, props);
  };
}
function withErrorBoundaryProps(ErrorBoundary3) {
  return function Wrapped() {
    const props = {
      params: useParams(),
      loaderData: useLoaderData(),
      actionData: useActionData(),
      error: useRouteError()
    };
    return createElement(ErrorBoundary3, props);
  };
}
const stylesheet = "/perquacky/assets/app-CXkT_hJO.css";
const links = () => [{
  rel: "preconnect",
  href: "https://fonts.googleapis.com"
}, {
  rel: "preconnect",
  href: "https://fonts.gstatic.com",
  crossOrigin: "anonymous"
}, {
  rel: "stylesheet",
  href: "https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap"
}, {
  rel: "stylesheet",
  href: stylesheet
}];
function Layout({
  children
}) {
  return /* @__PURE__ */ jsxs("html", {
    lang: "en",
    children: [/* @__PURE__ */ jsxs("head", {
      children: [/* @__PURE__ */ jsx("meta", {
        charSet: "utf-8"
      }), /* @__PURE__ */ jsx("meta", {
        name: "viewport",
        content: "width=device-width, initial-scale=1"
      }), /* @__PURE__ */ jsx(Meta, {}), /* @__PURE__ */ jsx(Links, {})]
    }), /* @__PURE__ */ jsxs("body", {
      children: [children, /* @__PURE__ */ jsx(ScrollRestoration, {}), /* @__PURE__ */ jsx(Scripts, {})]
    })]
  });
}
const root = withComponentProps(function App() {
  return /* @__PURE__ */ jsx(Outlet, {});
});
const ErrorBoundary = withErrorBoundaryProps(function ErrorBoundary2({
  error
}) {
  let message = "Oops!";
  let details = "An unexpected error occurred.";
  let stack;
  if (isRouteErrorResponse(error)) {
    message = error.status === 404 ? "404" : "Error";
    details = error.status === 404 ? "The requested page could not be found." : error.statusText || details;
  }
  return /* @__PURE__ */ jsxs("main", {
    className: "pt-16 p-4 container mx-auto",
    children: [/* @__PURE__ */ jsx("h1", {
      children: message
    }), /* @__PURE__ */ jsx("p", {
      children: details
    }), stack]
  });
});
const route0 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  ErrorBoundary,
  Layout,
  default: root,
  links
}, Symbol.toStringTag, { value: "Module" }));
function Timer() {
  const Ref = useRef(null);
  const [timer, setTimer] = useState("00:00:00");
  const getTimeRemaining = (e) => {
    const total = Date.parse(e) - Date.parse(/* @__PURE__ */ new Date());
    const seconds = Math.floor(total / 1e3 % 60);
    const minutes = Math.floor(total / 1e3 / 60 % 60);
    const hours = Math.floor(total / 1e3 / 60 / 60 % 24);
    return {
      total,
      hours,
      minutes,
      seconds
    };
  };
  const startTimer = (e) => {
    let { total, hours, minutes, seconds } = getTimeRemaining(e);
    if (total >= 0) {
      setTimer(
        (hours > 9 ? hours : "0" + hours) + ":" + (minutes > 9 ? minutes : "0" + minutes) + ":" + (seconds > 9 ? seconds : "0" + seconds)
      );
    }
  };
  const clearTimer = (e) => {
    setTimer("00:00:60");
    if (Ref.current) clearInterval(Ref.current);
    const id = setInterval(() => {
      startTimer(e);
    }, 1e3);
    Ref.current = id;
  };
  const getDeadTime = () => {
    let deadline = /* @__PURE__ */ new Date();
    deadline.setSeconds(deadline.getSeconds() + 60);
    return deadline;
  };
  useEffect(() => {
    clearTimer(getDeadTime());
  }, []);
  const onClickReset = () => {
    clearTimer(getDeadTime());
  };
  return /* @__PURE__ */ jsxs("div", { style: { textAlign: "center", margin: "auto" }, children: [
    /* @__PURE__ */ jsx("h3", { children: "Time" }),
    /* @__PURE__ */ jsx("h2", { children: timer }),
    /* @__PURE__ */ jsx("button", { onClick: onClickReset, children: "Reset" })
  ] });
}
function meta({}) {
  return [{
    title: "New React Router App"
  }, {
    name: "description",
    content: "Welcome to React Router!"
  }];
}
const home = withComponentProps(function Home() {
  const [word, setWord] = useState("");
  const [submittedWords, setSubmittedWords] = useState([]);
  const [threeLetterWordCount, setThreeLetterWordCount] = useState(0);
  const [fourLetterWordCount, setFourLetterWordCount] = useState(0);
  const [fiveLetterWordCount, setFiveLetterWordCount] = useState(0);
  const [sixLetterWordCount, setSixLetterWordCount] = useState(0);
  const [sevenLetterWordCount, setSevenLetterWordCount] = useState(0);
  const [draggedLetter, setDraggedLetter] = useState(null);
  const [score, setScore] = useState(0);
  const handleDragOver = (e) => {
    e.preventDefault();
  };
  function onDrop(index, targetIndex) {
  }
  const handleDrop = (targetIndex) => {
    if (draggedLetter && draggedLetter.index !== targetIndex) {
      onDrop(draggedLetter.index);
    }
    setDraggedLetter(null);
  };
  let dict = "";
  fetch("https://jdavisdev.github.io/perquacky/masterWordList.txt").then((response) => response.text()).then((data) => {
    dict = data;
  });
  function clearWord() {
    setWord("");
  }
  function clearStats() {
    setThreeLetterWordCount(0);
    setFourLetterWordCount(0);
    setFiveLetterWordCount(0);
    setSixLetterWordCount(0);
    setSevenLetterWordCount(0);
    setScore(0);
  }
  function calculateStats() {
    clearStats();
    let tempScore = 0;
    submittedWords.forEach((word2) => {
      switch (word2.length) {
        case 3:
          setThreeLetterWordCount((prevCount) => prevCount + 1);
        case 4:
          setFourLetterWordCount((prevCount) => prevCount + 1);
        case 5:
          setFiveLetterWordCount((prevCount) => prevCount + 1);
        case 6:
          setSixLetterWordCount((prevCount) => prevCount + 1);
        case 7:
          setSevenLetterWordCount((prevCount) => prevCount + 1);
        case 8:
          tempScore += 500;
        case 9:
          tempScore += 1e3;
      }
    });
    if (threeLetterWordCount === 3) {
      tempScore += 100;
    }
    if (fourLetterWordCount === 3) {
      tempScore += 200;
    }
    if (fiveLetterWordCount === 3) {
      tempScore += 300;
    }
    if (sixLetterWordCount === 3) {
      tempScore += 400;
    }
    if (sevenLetterWordCount === 3) {
      tempScore += 500;
    }
    setScore(tempScore);
  }
  function submitWord() {
    if (word.length > 2 && dict.includes(word) && !submittedWords.includes(word)) {
      setSubmittedWords([...submittedWords, word]);
      clearWord();
      calculateStats();
    }
  }
  function onLetterClick(letter, index) {
    const clickedLetter = word[index];
    if (clickedLetter === letter) {
      setWord((prevWord) => prevWord.slice(0, index) + prevWord.slice(index + 1));
    }
  }
  return /* @__PURE__ */ jsxs(Fragment, {
    children: [/* @__PURE__ */ jsx(LettersGrid, {
      setWord
    }), /* @__PURE__ */ jsx(WordInputField, {
      word,
      onLetterClick,
      clearWord,
      submitWord,
      handleDragOver,
      handleDragStart: handleDragOver,
      handleDrop
    }), /* @__PURE__ */ jsx(WordHistory, {
      wordHistory: submittedWords
    }), /* @__PURE__ */ jsx(Timer, {}), /* @__PURE__ */ jsx(Score, {
      score,
      threeLetterWordCount
    })]
  });
});
function LettersGrid(props) {
  const [letter, setLetter] = useState(["A", "R", "S", "E", "T", "L", "I", "N", "K"]);
  const shuffleArray = (arr) => {
    return arr.map((item) => ({
      item,
      sort: Math.random()
    })).sort((a, b) => a.sort - b.sort).map(({
      item
    }) => item);
  };
  const handleLetterClick = (letter2) => {
    props.setWord((prevWord) => prevWord + letter2);
  };
  const handleShuffleClick = () => {
    const shuffledArray = shuffleArray(letter);
    setLetter(shuffledArray);
  };
  return /* @__PURE__ */ jsxs(Fragment, {
    children: [/* @__PURE__ */ jsx("button", {
      className: "bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded",
      onClick: handleShuffleClick,
      children: "Shuffle"
    }), /* @__PURE__ */ jsx("div", {
      style: {
        display: "grid",
        gridTemplateColumns: "repeat(3, 1fr)",
        gap: "20px"
      },
      children: letter.map((item, index) => /* @__PURE__ */ jsx("button", {
        style: {
          padding: "30px",
          fontSize: "32px",
          backgroundColor: "white",
          color: "black",
          border: "1px solid black"
        },
        onClick: () => handleLetterClick(item),
        children: item
      }, index))
    })]
  });
}
function WordInputField({
  word,
  onLetterClick,
  clearWord,
  submitWord,
  handleDragStart,
  handleDragOver,
  handleDrop
}) {
  return /* @__PURE__ */ jsxs(Fragment, {
    children: [/* @__PURE__ */ jsx("div", {
      className: "scrabble-word",
      children: word.split("").map((letter, index) => /* @__PURE__ */ jsx("div", {
        className: "scrabble-tile",
        draggable: true,
        onClick: () => onLetterClick(letter, index),
        onDragStart: () => handleDragStart(letter, index),
        onDragOver: handleDragOver,
        onDrop: () => handleDrop(index),
        children: letter.toUpperCase()
      }, index))
    }), /* @__PURE__ */ jsx("input", {
      className: "bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded",
      type: "reset",
      value: "X",
      alt: "Clear the search form",
      onClick: clearWord
    }), /* @__PURE__ */ jsx("input", {
      className: "bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded",
      type: "submit",
      value: "Submit",
      onClick: submitWord
    })]
  });
}
function WordHistory({
  wordHistory
}) {
  return /* @__PURE__ */ jsx("div", {
    children: wordHistory.map((word) => /* @__PURE__ */ jsx("p", {
      children: word
    }))
  });
}
function Score({
  score,
  threeLetterWordCount
}) {
  return /* @__PURE__ */ jsxs("div", {
    children: [/* @__PURE__ */ jsxs("p", {
      children: ["Score: ", score]
    }), /* @__PURE__ */ jsx("p", {
      style: {
        color: threeLetterWordCount >= 3 ? "green" : "gray"
      },
      children: "3 letter words"
    }), /* @__PURE__ */ jsx("p", {
      style: {
        color: "gray"
      },
      children: "4 letter words"
    }), /* @__PURE__ */ jsx("p", {
      style: {
        color: "gray"
      },
      children: "5 letter words"
    }), /* @__PURE__ */ jsx("p", {
      style: {
        color: "gray"
      },
      children: "6 letter words"
    }), /* @__PURE__ */ jsx("p", {
      style: {
        color: "gray"
      },
      children: "7 letter words"
    }), /* @__PURE__ */ jsx("p", {
      style: {
        color: "gray"
      },
      children: "8 letter words"
    })]
  });
}
const route1 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: home,
  meta
}, Symbol.toStringTag, { value: "Module" }));
const serverManifest = { "entry": { "module": "/perquacky/assets/entry.client-u-M4TmH-.js", "imports": ["/perquacky/assets/chunk-K6AXKMTT-DycbfBQN.js"], "css": [] }, "routes": { "root": { "id": "root", "parentId": void 0, "path": "", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": true, "module": "/perquacky/assets/root-BKoel0_s.js", "imports": ["/perquacky/assets/chunk-K6AXKMTT-DycbfBQN.js", "/perquacky/assets/with-props-BJdOiEPt.js"], "css": [] }, "routes/home": { "id": "routes/home", "parentId": "root", "path": void 0, "index": true, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/perquacky/assets/home-DElvQg-8.js", "imports": ["/perquacky/assets/with-props-BJdOiEPt.js", "/perquacky/assets/chunk-K6AXKMTT-DycbfBQN.js"], "css": [] } }, "url": "/perquacky/assets/manifest-1c21b0ee.js", "version": "1c21b0ee" };
const assetsBuildDirectory = "build\\client";
const basename = "/";
const future = { "unstable_optimizeDeps": false };
const isSpaMode = false;
const publicPath = "/perquacky/";
const entry = { module: entryServer };
const routes = {
  "root": {
    id: "root",
    parentId: void 0,
    path: "",
    index: void 0,
    caseSensitive: void 0,
    module: route0
  },
  "routes/home": {
    id: "routes/home",
    parentId: "root",
    path: void 0,
    index: true,
    caseSensitive: void 0,
    module: route1
  }
};
export {
  serverManifest as assets,
  assetsBuildDirectory,
  basename,
  entry,
  future,
  isSpaMode,
  publicPath,
  routes
};
