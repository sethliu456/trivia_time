import { useState, useEffect } from 'react'
import { v4 as uuidv4 } from 'uuid'
import React from 'react'
import '../styles/styles.scss'

const API_URL = 'https://opentdb.com/api.php'

function LandingPage() {
  const [count, setCount] = useState(0)
  const [options, setOptions] = useState({})
  const [categoryData, setCategoryData] = useState([])
  const [questionsAndAnswers, setQuestionsAndAnswers] = useState([])

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

  const [amountOption, setAmountOption] = useState(10)
  const [categoryOption, setCategoryOption] = useState("any")

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
        console.log(data.trivia_categories)
      })
      .catch(error => {
        // Handle errors
        console.error(error);
      });
  }

  function fetchQuestions() {
    fetch(buildURlParams())
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


  // function handleQuestionCountChange(event) => {
  //   setuserSelectOptions({... userSelectOptions, amount: event.target.value})
  // }
  // function handleCategoryChange(event) => {
  //   setuserSelectOptions({... userSelectOptions, amount: event.target.value})
  // }

  function handleAmountChange(event) {
    setAmountOption(event.target.value)
  }
  function handleCategoryChange(event) {
    setCategoryData(event.target.value)
  }

  return (
    <div>
      <h1>Trivia Time!</h1>
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
      {/* <button onClick={() => setCount(count + 1)}>Click me</button> */}
    </div>
  )
}

export default LandingPage
