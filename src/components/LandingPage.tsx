import { useState, useEffect } from 'react'
import { v4 as uuidv4 } from 'uuid'
import React from 'react'
import '../styles/styles.scss'
import QuestionAndAnswer from './QuestionAndAnswer.tsx'
// import  TEST  from './TEST.tsx'

const API_URL = 'https://opentdb.com/api.php'

function LandingPage() {
  const [count, setCount] = useState(0)
  const [options, setOptions] = useState({})
  const [categoryData, setCategoryData] = useState([])
  const [questionsAndAnswers, setQuestionsAndAnswers] = useState([])
  const [currentScore, setCurrentScore] = useState(0)
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [gameOver, setGameOver] = useState(false)
  const [amountOption, setAmountOption] = useState(10)
  const [categoryOption, setCategoryOption] = useState("any")


  useEffect(() => {
    if (questionsAndAnswers.length > 0 && currentQuestion >= questionsAndAnswers.length) {
      setGameOver(true)
    }
  }, [currentQuestion]);

  const [userSelectOptions, setuserSelectOptions] = useState({
    amount: 10,
    category: "any",
    difficulty: "medium",
  })

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
    const urlParams = buildURlParams()
    // console.log(urlParams)

    // fetch(buildURlParams())
    fetch('https://opentdb.com/api.php?amount=3')
      .then(response => response.json())
      .then(data => {
        // console.log(data)
        setQuestionsAndAnswers(data.results)
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
    setAmountOption(event.target.value)
  }
  function handleCategoryChange(event) {
    setCategoryData(event.target.value)
  }

  function resetGame() {
    setQuestionsAndAnswers([])
    setCurrentScore(0)
    setCurrentQuestion(0)
    setGameOver(false)
  }

  return (
    <div>
      {!gameOver ? <div><h1>Trivia Time!</h1>
        <div>
          <label>How many questions
            <select value={amountOption} onChange={handleAmountChange}>
              {questionCountOptions.map(count => <option value={count} key={uuidv4()}> {count}</option>)}
            </select>
          </label>
        </div>
        <div>
          <label>Categories
            <select value={categoryOption} onChange={handleCategoryChange}>
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
            <QuestionAndAnswer key={uuidv4()} questionItem={questionsAndAnswers[currentQuestion]} currentScore={currentScore} currentQuestion={currentQuestion} setCurrentQuestion={setCurrentQuestion} setCurrentScore={setCurrentScore} setGameOver={setGameOver} />
            : ""}
        </div> </div> : ""}

      {gameOver ? <div><div>Game Over</div><div>Your score is {currentScore} out of {questionsAndAnswers.length}</div></div> : ""}

    </div>
  )
}

export default LandingPage
