// @ts-nocheck
import { useState, useEffect, useRef } from 'react'
import { v4 as uuidv4 } from 'uuid'
import React from 'react'
import '../styles/styles.scss'
import QuestionAndAnswer from './QuestionAndAnswer.tsx'

const API_URL = 'https://opentdb.com/api.php'

function LandingPage() {
  const [categoryData, setCategoryData] = useState([])
  const [questionsAndAnswers, setQuestionsAndAnswers] = useState([])
  const currentScore = useRef(0)
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [gameOver, setGameOver] = useState(false)
  const [gameMenu, setGameMenu] = useState(true)

  const [userSelectOptions, setUserSelectOptions] = useState({
    amount: 5,
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
  for (let i = settingOptions.questionCount.min; i <= settingOptions.questionCount.max; i++) {
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

    // fetch('https://opentdb.com/api.php?amount=3')
    fetch(fullURL)
      .then(response => response.json())
      .then(data => {
        setQuestionsAndAnswers(data.results)
        console.log(data.results)
        setGameMenu(false)
      })
      .catch(error => {
        // Handle errors
        console.error(error);
      });
  }

  function buildURlParams() {
    return API_URL + '?' + new URLSearchParams(userSelectOptions).toString();
  }


  function handleQuestionCountChange(event) {
    setUserSelectOptions({ ...userSelectOptions, amount: event.target.value })
  }
  function handleCategoryChange(event) {
    setUserSelectOptions({ ...userSelectOptions, category: event.target.value })
  }
  function handleDifficultyChange(event) {
    setUserSelectOptions({ ...userSelectOptions, difficulty: event.target.value })
  }

  function resetGame() {
    setQuestionsAndAnswers([])
    currentScore.current = 0
    setCurrentQuestion(0)
    setGameOver(false)
    setGameMenu(true)
  }

  return (
    <div>
      {!gameOver ? <div><h1>Trivia Time!</h1>
        {gameMenu ? <div>
          <div>
            <label>How many questions
              <select value={userSelectOptions.amount} onChange={handleQuestionCountChange}>
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
          <div>
            <label>Difficulty
              <select value={userSelectOptions.difficulty} onChange={handleDifficultyChange}>
                {settingOptions.difficulty.map(difficulty => <option value={difficulty} key={uuidv4()}> {difficulty}</option>)}
              </select>
            </label>
          </div>
          <button onClick={fetchQuestions}>Get questions</button>
        </div>
        : ""}

        <div>
          {questionsAndAnswers.length > 1 && currentQuestion < questionsAndAnswers.length ?
            <QuestionAndAnswer key={uuidv4()} questionItem={questionsAndAnswers[currentQuestion]} currentScore={currentScore} currentQuestion={currentQuestion} setCurrentQuestion={setCurrentQuestion} setGameOver={setGameOver} />
            : ""}
        </div> </div> : ""}

      {gameOver ? <div><div>Game Over</div><div>Your score is {currentScore.current} out of {questionsAndAnswers.length}</div> <div onClick={resetGame} className="next-button">Play again</div></div> : ""}

    </div>
  )
}

export default LandingPage
