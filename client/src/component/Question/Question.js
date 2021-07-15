import React, { useEffect, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Form } from 'react-bootstrap';
import htmlDecode from '../../helper/decodeHtml';
import './question.css';
import { Link, Redirect, useHistory, withRouter } from 'react-router-dom';

// { question, correct_answer, incorrect_answers, index }
const Question = ({
  question,
  correct_answer,
  incorrect_answers,
  index,
  total,
  onNextClicked,
  onPreviousClicked,
  correctAnswers,
  setCorrectAnswers,
  score,
  setScore,
}) => {
  const [optionsList, setOptionsList] = useState([]);
  const [answerTrack, setAnswerTrack] = useState({});
  const [currentChoice, setCurrentChoice] = useState('');
  const [navigateToResultspage, setNavigateToResultspage] = useState(false);

  const history = useHistory();

  useEffect(() => {
    setOptionsList(
      [correct_answer, ...incorrect_answers].sort(() => 0.5 - Math.random())
    );
    // console.log(index);
    // console.log(history);
  }, [correct_answer, incorrect_answers]);

  // Maintains State for each Question Component
  useEffect(() => {
    const list = {};
    optionsList.forEach((option, index) => {
      list[index] = false;
    });
    setAnswerTrack(list);
  }, [optionsList]);

  useEffect(() => {
    if (answerTrack) console.log('answerTrack', answerTrack);
  }, [answerTrack]);

  /*
   * This function the current value of option to opposite of what it was earlier
   * and the remaining to false
   * {0: false, 1: false, 2: false, 3: false} -> {0: false, 1: true, 2: false, 3: false} if '1th` index is clicked
   */
  //  ["&#039;For&#039; loops", "&#039;If&#039; Statements", "&#039;Do-while&#039; loops", "&#039;While&#039; loops"]
  const updateChecked = e => {
    // console.log(e.target.parentElement.innerText);
    const cc = e.target.parentElement.innerText;
    console.log(cc);
    setCurrentChoice(cc);
    // console.log(currentChoice);
    // if (currentChoice === correct_answer) setCorrectAnswers(p => p + 1);
    setAnswerTrack(oldTrack => {
      console.log('Previous State:', oldTrack);
      const newTrack = { ...oldTrack };
      Object.keys(newTrack).forEach(t => {
        const index = parseInt(t, 10);
        // console.log(`first part: ${fp}, type: ${typeof fp}`);
        // console.log(`second part: ${sp}, type: ${typeof sp}`);
        if (htmlDecode(optionsList[index]) === cc)
          newTrack[index] = !oldTrack[index];
        else newTrack[t] = false;
      });
      console.log('New Track', newTrack);
      return newTrack;
    });
  };

  const onNext = e => {
    /* If current is the right one and score index is false (it has not been answered correct before) */
    if (currentChoice === correct_answer && !score[index]) {
      setScore(s =>
        s
          .slice(0, index)
          .concat(true)
          .concat(s.slice(index + 1, 11))
      );
      setCorrectAnswers(p => p + 1);
      console.log(score);
    } else if (currentChoice !== correct_answer && score[index]) {
      /* If cuurent answer is incorrect and score index is true (i.e., it has been answered correctly before)
       * But now is incorrectly answered
       */
      setCorrectAnswers(p => p - 1);
    }

    console.log(
      'Current Choice:',
      currentChoice,
      ', Correct Answer:',
      correct_answer
    );
    // index !== 9 && onNextClicked();
    onNextClicked();

    // if (index === score.length - 1) {
    //   return <Redirect to={{
    //     pathname: '/result',
    //     state: {numberOfCorrectAnswers: correct_answer}
    //   }} />
    // }

    // if (index === 9) {
    //   history.goBack();
    //   history.push('result');
    // } else {
    //   onNextClicked();
    // }
  };

  console.log('index', index);

  return (
    <>
      <div className="question-container">
        {
          <p>
            Q{index + 1}/{total}. {htmlDecode(question)}
          </p>
        }
        {optionsList.length > 0 &&
          optionsList.map((option, option_index) => (
            <Form.Check
              type="radio"
              aria-label={`option ${option_index + 1}`}
              label={htmlDecode(option)}
              checked={answerTrack[option_index]}
              onChange={updateChecked}
              className="pb-3"
              key={uuidv4()}
              id={uuidv4()}
            />
          ))}
        <div className="pg-nav">
          <button
            onClick={() => {
              onPreviousClicked();
              setNavigateToResultspage(false);
            }}
            className="float-left"
          >
            &lt; Previous
          </button>

          <button
            onClick={e => {
              navigateToResultspage &&
                history.push('/result', {
                  numberOfCorrectAnswers: correctAnswers,
                });
              onNext(e);
              setNavigateToResultspage(r => (index >= 9 ? true : r));
            }}
            className="float-right"
          >
            {index >= 10 ? (
              <Redirect
                to={{
                  pathname: '/result',
                  state: { numberOfCorrectAnswers: correctAnswers },
                }}
              />
            ) : index === 9 ? (
              'Finish'
            ) : (
              'Next'
            )}{' '}
            &gt;
          </button>
        </div>
      </div>
    </>
  );
};

export default Question;
