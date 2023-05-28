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
    <div className="game-container">
      {!gameOver ? <div><h1>Trivia Time!</h1>
        {gameMenu ? <div>
          <div>
            Get ready to test your knowledge and prove your smarts with Trivia Time! Show off your chops as you tackle mind-boggling questions from various categories. Choose the correct answers, earn points, and aim for the top score. Can you become the ultimate Trivia Time champion? Let the challenge begin!
          </div>
          <div className="option-container">
            <div className="option-single">
              <label>Category
              </label>
              <select value={userSelectOptions.category} onChange={handleCategoryChange}>
                {categoryData.map(category => <option value={category.id} key={uuidv4()}> {category.name}</option>)}
              </select>
            </div>
            <div className="option-single">
              <label>Difficulty
              </label>
              <select value={userSelectOptions.difficulty} onChange={handleDifficultyChange}>
                {settingOptions.difficulty.map(difficulty => <option value={difficulty} key={uuidv4()}> {difficulty}</option>)}
              </select>
            </div>
            <div className="option-single">
              <label>Question Count
              </label>
              <select value={userSelectOptions.amount} onChange={handleQuestionCountChange}>
                {questionCountOptions.map(count => <option value={count} key={uuidv4()}> {count}</option>)}
              </select>
            </div>
          </div>
          <button onClick={fetchQuestions}>START!</button>
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
