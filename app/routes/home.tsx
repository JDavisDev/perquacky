import type { Route } from "./+types/home";
import { Welcome } from "../welcome/welcome";
import { useState } from "react";
import Timer from "~/Timer";
import { debug } from "util";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "New React Router App" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

export default function Home() {
  const [word, setWord] = useState('');
  const [submittedWords, setSubmittedWords] = useState([]);
  const [threeLetterWordCount, setThreeLetterWordCount] = useState(0);
  const [fourLetterWordCount, setFourLetterWordCount] = useState(0);
  const [fiveLetterWordCount, setFiveLetterWordCount] = useState(0);
  const [sixLetterWordCount, setSixLetterWordCount] = useState(0);
  const [sevenLetterWordCount, setSevenLetterWordCount] = useState(0);

  const [draggedLetter, setDraggedLetter] = useState(null);
  const [score, setScore] = useState(0);

  const handleDragStart = (letter, index) => {
    setDraggedLetter({ letter, index });
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  function onDrop(index, targetIndex) {

  }

  const handleDrop = (targetIndex) => {
    if (draggedLetter && draggedLetter.index !== targetIndex) {
      onDrop(draggedLetter.index, targetIndex);
    }
    setDraggedLetter(null);
  };

  let dict = '';
  if (debug) {

  }
  fetch('https://jdavisdev.github.io/perquacky/masterWordList.txt')
  .then(response => response.text())
  .then((data) => {
   dict = data;
  })

  function clearWord() {
    setWord('');
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
    submittedWords.forEach((word) => {
      switch (word.length) {
        case 3: setThreeLetterWordCount((prevCount) => prevCount + 1);
        case 4: setFourLetterWordCount((prevCount) => prevCount + 1);
        case 5: setFiveLetterWordCount((prevCount) => prevCount + 1);
        case 6: setSixLetterWordCount((prevCount) => prevCount + 1);
        case 7: setSevenLetterWordCount((prevCount) => prevCount + 1);
        case 8: tempScore += 500;
        case 9: tempScore += 1000;
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
    // Send the word to the backend
    // add it to word history and store locally for scoring
    if (word.length > 2 && dict.includes(word) && !submittedWords.includes(word)) {
      setSubmittedWords([...submittedWords, word]);
      clearWord();
      calculateStats();
    } else {
      // show error or highlight the input field
      // setSubmittedWords([...submittedWords, 'Invalid word']);
    }
  }

  function onLetterClick(letter, index) {
    const clickedLetter = word[index];
    if (clickedLetter === letter) {
      setWord((prevWord) => prevWord.slice(0, index) + prevWord.slice(index + 1));
    }
  }

  return (
    <>
      <LettersGrid setWord = { setWord }/>
      <WordInputField word={word} onLetterClick={onLetterClick} clearWord={clearWord} submitWord={submitWord} handleDragOver={handleDragOver} handleDragStart={handleDragOver} handleDrop={handleDrop}/>
      <WordHistory wordHistory={submittedWords} />
      <Timer />
      <Score score={score} threeLetterWordCount={threeLetterWordCount} />
    </>
  )
}


function LettersGrid(props) {
    const [letter, setLetter] = useState(['A', 'R', 'S', 'E', 'T', 'L', 'I', 'N', 'K']);
    // Function to shuffle the array
  const shuffleArray = (arr: any[]) => {
    return arr
      .map((item) => ({ item, sort: Math.random() }))
      .sort((a, b) => a.sort - b.sort)
      .map(({ item }) => item);
  };

  const handleLetterClick =  (letter: string) => {
    props.setWord((prevWord) => prevWord + letter);
}

  const handleShuffleClick = () => {
    const shuffledArray = shuffleArray(letter);
    setLetter(shuffledArray);
  };

    return (
      <>
      <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" onClick={handleShuffleClick}>
        Shuffle
        </button>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "20px" }}>
      {letter.map((item, index) => (
        <button key={index} style={{ padding: "30px", fontSize: "32px", backgroundColor: "white", color: "black", border: "1px solid black" }} onClick={() => handleLetterClick(item)}>
          {item}
        </button>
      ))}
    </div>
      </>
    );
  };


function WordInputField({ word, onLetterClick, clearWord, submitWord, handleDragStart, handleDragOver, handleDrop }) {
  return (
    <>
    <div className="scrabble-word">
      {word.split('').map((letter, index) => (
        <div
          key={index}
          className="scrabble-tile"
          draggable
          onClick={() => onLetterClick(letter, index)}
          onDragStart={() => handleDragStart(letter, index)}
          onDragOver={handleDragOver}
          onDrop={() => handleDrop(index)}
        >
          {letter.toUpperCase()}
        </div>
      ))}
    </div>
    <input className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" type="reset" value="X" alt="Clear the search form" onClick={clearWord}></input>
    <input className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" type="submit" value="Submit" onClick={submitWord}></input>
    </>
  );
}

function WordHistory({ wordHistory}) {
  return (
    <div>
      {wordHistory.map((word) => (
        <p>{word}</p>
      ))}
    </div>
  );
}

function Score({score, threeLetterWordCount}) {
  return (
    <div>
      <p>Score: {score}</p>
      <p style={{color: threeLetterWordCount >= 3 ? 'green' : 'gray'}}>3 letter words</p>
      <p style={{color: false ? 'green' : 'gray'}}>4 letter words</p>
      <p style={{color: false ? 'green' : 'gray'}}>5 letter words</p>
      <p style={{color: false ? 'green' : 'gray'}}>6 letter words</p>
      <p style={{color: false ? 'green' : 'gray'}}>7 letter words</p>
      <p style={{color: false ? 'green' : 'gray'}}>8 letter words</p>
    </div>
  );
}

function Stats() {
 // show 3 letter word progress
 // 4 letter word progress
 // total score?

}
