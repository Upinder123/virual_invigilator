import React from 'react';
import { Link, withRouter } from 'react-router-dom';
import AnimatedDonut from '../AnimatedDonut/AnimatedDonut';
import './results.css';

const Result = ({ history }) => {
  return (
    <div className='result-container container'>
      <div className='results-page-heading-container'>
        <h1 className='results-page-heading'>Results page!!!</h1>
        <div className='marks'>
          {/* <h2>{history.location.state.numberOfCorrectAnswers} /10</h2> */}
          <h2>Your Score</h2>
          <AnimatedDonut
            radius={40}
            stroke={4}
            progress={70}
            final={
              history.location.state
                ? history.location.state.numberOfCorrectAnswers * 10
                : 0
            }
          />
        </div>
        <br />
        <Link className='btn go-to-btn' to='/'>
          Go to Home
        </Link>
      </div>
    </div>
  );
};

export default withRouter(Result);
