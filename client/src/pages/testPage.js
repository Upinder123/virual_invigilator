import React, { useEffect, useState } from "react";
import { Button, Col, Container, Jumbotron, Row } from "react-bootstrap";
import Spinnerloading from "../component/Spinnerloading";
import Countdown from "../component/test/countdown";
import "../component/test/testPage.css";
import htmlDecode from "../helper/decodeHtml";
import { useHistory } from "react-router-dom";

function TestPage() {
  const history = useHistory();
  const [questions, setQuestions] = useState([]);
  const [loading, setloading] = useState(true);
  const [currentquestion, setCurrentQuestion] = useState(0);
  const [result, setResult] = useState(0);
  const [optionsList, setOptionsList] = useState([]);
  const [answerTrack, setAnswerTrack] = useState({});

  console.log("Your Result", result);
  useEffect(() => {
    fetch("https://opentdb.com/api.php?amount=10&category=18")
      .then(r => r.json())
      .then(q => {
        setQuestions(q.results);
        setloading(false);
      });
  }, []);

  useEffect(() => {
    if (questions.length > 0) {
      console.log(
        "Incorrect Answer: ",
        questions[currentquestion].incorrect_answers
      );
    }
  }, [questions, currentquestion]);

  useEffect(() => {
    setOptionsList(
      questions.length > 0
        ? [
            questions[currentquestion].correct_answer,
            ...questions[currentquestion].incorrect_answers,
          ].sort(() => 0.5 - Math.random())
        : []
    );
  }, [currentquestion, questions]);

  const checkResult = e => {
    console.log("E", e.target.value);
    setResult(result => (e.target.value === questions[currentquestion].correct_answer ? result + 1 : result))
  }

  useEffect(() => {
    const list = {};
    optionsList.forEach((option, index) => {
      list[index] = false;
    });
    setAnswerTrack(list);
  }, [optionsList]);

  return (
    // eslint-disable-next-line react/jsx-filename-extension
    <div
      style={{
        margin: "1em",
        textAlign: "justify",
      }}
    >
      <Container>
        <Row>
          <Col lg="9">
            <Jumbotron className="Jumbo">
              {loading ? (
                <Spinnerloading />
              ) : (
                <div>
                  <h6>
                    {!loading && <div>{questions[currentquestion].type}</div>}
                  </h6>
                  <h4>
                    {!loading && (
                      <div>
                        {htmlDecode(questions[currentquestion].question)}
                      </div>
                    )}
                  </h4>
                  <div>
                    {!loading &&
                      optionsList.map((op, index) => (
                        <div key={op}>
                          <label htmlFor={op}>
                            <input id={op} value={op} type="radio" name="answer" onClick={checkResult} />
                            {htmlDecode(op)}
                          </label>
                        </div>
                      ))}
                  </div>
                  {/* onClick={() => setResult(result + 1) */}
                </div>
              )}
              <br />
            </Jumbotron>
          </Col>
          <Col lg="3">
            <Row>
              <Countdown />
            </Row>
            <Row>
              <Button
                className="finish-btn"
                onClick={() => history.push("/result")}
              >
                Finish Attempt..
              </Button>
            </Row>
          </Col>
        </Row>
        <Row>
          <Col lg="9">
            <Button
              className="previous-btn"
              disabled={currentquestion < 1}
              onClick={() =>
                currentquestion >= 0 && setCurrentQuestion(c => c - 1)}
            >
              Previous
            </Button>
            <Button
              className="next-btn"
              disabled={currentquestion > questions.length - 2}
              onClick={() =>
                currentquestion <= questions.length - 2 &&
                setCurrentQuestion(c => c + 1)}
            >
              Next
            </Button>
          </Col>
        </Row>
      </Container>
    </div>
  );
}
export default TestPage;
