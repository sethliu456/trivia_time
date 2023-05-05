import { useState, useEffect, useRef } from 'react'
import { v4 as uuidv4 } from 'uuid'
import React from 'react'
import '../styles/styles.scss'
import QuestionAndAnswer from './QuestionAndAnswer.tsx'

const API_URL = 'https://opentdb.com/api.php'

function LandingPage() {
  // const [count, setCount] = useState(0)
  // const [options, setOptions] = useState({})
  const [categoryData, setCategoryData] = useState([])
  const [questionsAndAnswers, setQuestionsAndAnswers] = useState([])
  // const [currentScore, setCurrentScore] = useState(0)
  const currentScore = useRef(0)
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [gameOver, setGameOver] = useState(false)
  const [amountOption, setAmountOption] = useState(10)
  const [categoryOption, setCategoryOption] = useState("any")

  const [userSelectOptions, setUserSelectOptions] = useState({
    amount: 2,
    category: "any",
    difficulty: "medium",
  })


  useEffect(() => {
    if (questionsAndAnswers.length > 0 && currentQuestion >= questionsAndAnswers.length) {
      setGameOver(true)
    }
  }, [currentQuestion]);

  const settingOptions = {
    questionCount: {
      min: 1,
      max: 10
    }
    ,
    category: {
      min: 1,
      max: 10
    },
    difficulty: ["easy", "medium", "hard"],
  }

  const questionCountOptions = []
  for (let i = settingOptions.questionCount.min; i < settingOptions.questionCount.max; i++) {
    questionCountOptions.push(i)
  }


  const categoriesURL = 'https://opentdb.com/api_category.php'

  useEffect(() => {
    fetchCategoryData();
  }, []);

  function fetchCategoryData() {
    fetch(categoriesURL)
      .then(response => response.json())
      .then(data => {
        setCategoryData(data.trivia_categories)
        // console.log(data.trivia_categories)
      })
      .catch(error => {
        // Handle errors
        console.error(error);
      });
  }

  function fetchQuestions() {
    const fullURL = buildURlParams()
    console.log(fullURL)

    // fetch(buildURlParams())
    fetch('https://opentdb.com/api.php?amount=3')
      .then(response => response.json())
      .then(data => {
        setQuestionsAndAnswers(data.results)
        console.log(data.results)
      })
      .catch(error => {
        // Handle errors
        console.error(error);
      });
  }

  function buildURlParams() {
    return API_URL + '?' + new URLSearchParams(userSelectOptions).toString();
  }


  function handleAmountChange(event) {
    // setAmountOption(event.target.value)
    setUserSelectOptions({... userSelectOptions, amount: event.target.value})
  }
  function handleCategoryChange(event) {
    // setCategoryData(event.target.value)
    setUserSelectOptions({... userSelectOptions, category: event.target.value})
  }

  function resetGame() {
    setQuestionsAndAnswers([])
    currentScore.current = 0
    setCurrentQuestion(0)
    setGameOver(false)
  }

  return (
    <div>
      {!gameOver ? <div><h1>Trivia Time!</h1>
        <div>
          <label>How many questions
            <select value={userSelectOptions.amount} onChange={handleAmountChange}>
              {questionCountOptions.map(count => <option value={count} key={uuidv4()}> {count}</option>)}
            </select>
          </label>
        </div>
        <div>
          <label>Categories
            <select value={userSelectOptions.category} onChange={handleCategoryChange}>
              {categoryData.map(category => <option value={category.id} key={uuidv4()}> {category.name}</option>)}
            </select>
          </label>
        </div>
        <button onClick={fetchQuestions}>Get questions</button>

        <div>
          {/* {questionsAndAnswers.length > 1 ? questionsAndAnswers.map(item => {
          return <QuestionAndAnswer key={uuidv4()} questionItem={item} currentScore={currentScore} currentQuestion={currentQuestion} setCurrentQuestion={setCurrentQuestion} setCurrentScore={setCurrentScore}/>
        }) : ""} */}
          {questionsAndAnswers.length > 1 && currentQuestion < questionsAndAnswers.length?
            <QuestionAndAnswer key={uuidv4()} questionItem={questionsAndAnswers[currentQuestion]} currentScore={currentScore} currentQuestion={currentQuestion} setCurrentQuestion={setCurrentQuestion}  setGameOver={setGameOver} />
            : ""}
        </div> </div> : ""}

      {gameOver ? <div><div>Game Over</div><div>Your score is {currentScore.current} out of {questionsAndAnswers.length}</div> <div onClick={resetGame}>Play again</div></div> : ""}

    </div>
  )
}

export default LandingPage
