import React, { useEffect, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { spinner } from './QuizSpinner';
import useWatch from '../../helper/useWatch';
import CheatingAlert from '../CheatingAlert/CheatingAlert';
import './quizContainer.css';
import Question from '../Question/Question';
import useFetch from '../../helper/useFetch';

export default function QuizContainer() {
  const { data, loading, error } = useFetch(
    'https://opentdb.com/api.php?amount=10&category=18'
  );
  // const [{ data, loading, error }, setState] = useState({
  //   data: null,
  //   loading: true,
  //   error: false,
  // });
  const [fetchedQuestions, setFetchedQuestions] = useState([]);
  const [questionComponents, setQuestionComponents] = useState([]);
  const [index, setIndex] = useState(0);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [score, setScore] = useState(Array.from({ length: 10 }).fill(false)); // true -> correct, false -> incorrect
  const [{ watching, variant, detail, cheating }, setWatch, setCheatingCount] =
    useWatch(true);
  console.log('data.results', data && data.results);

  useEffect(() => {
    if (cheating) {
      console.warn('YOU BEEN FOUND CHEATING!!!');
      // <CheatingAlert variant="warning" detail="Found opening a new tab"/>
    }
  }, [cheating]);

  useEffect(() => {
    console.log({ data, loading, error });
    if (!loading) {
      if (data === null || data.response_code !== 0 || error) {
        console.log('Something went wrong');
        if (error) {
          console.log(error);
          alert('Somthing went weong, please try again later');
        }
      } else {
        console.log('setting FetchedQuestions state', data.results);
      }
    }

    console.log('going to set fetched questionState', !loading && !error);

    setFetchedQuestions(q => (!loading && !error ? data.results : q));
  }, [data, error, loading]);

  useEffect(() => {
    const max = fetchedQuestions.length;
    console.log('Question Detail:', fetchedQuestions);
    const q =
      fetchedQuestions.length > 0 &&
      fetchedQuestions.map(questionDetail => (
        <Question
          key={uuidv4()}
          index={index}
          onPreviousClicked={() => setIndex(i => (i >= 1 ? i - 1 : i))}
          onNextClicked={() => setIndex(i => (i !== max - 1 ? i + 1 : max - 1))}
          total={max}
          setCorrectAnswers={setCorrectAnswers}
          correctAnswers={correctAnswers}
          score={score}
          setScore={setScore}
          {...questionDetail}
        />
      ));

    console.log(
      'in setting component as state, length',
      fetchedQuestions.length > 0
    );

    setQuestionComponents(q);
    console.log('question components', q);
  }, [correctAnswers, fetchedQuestions, index, score]);

  console.log('Correct Answers:', correctAnswers);
  return (
    <>
      {cheating ? (
        <CheatingAlert
          variant={variant}
          detail={detail}
          setWatch={setWatch}
          setCheatingCount={setCheatingCount}
        />
      ) : loading || fetchedQuestions.length === 1 ? (
        spinner
      ) : (
        questionComponents[index]
      )}
    </>
  );
}
