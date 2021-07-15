import React, { useEffect } from 'react';
import { Button, Jumbotron } from 'react-bootstrap';
import { useHistory } from 'react-router-dom';
import './Jumbotron.css';

function Jumbo() {

  const history = useHistory();
  
  // useEffect(() => {
  //   console.log('jumbo rendered!');

  //   return () => {
  //     /* this runs on cleanup () */
  //     console.log('jumbo gone!');
  //   };
  // }, []);

  return (
    <div className='jumbo_div'>
      <Jumbotron className='Jumbo'>
        <h1>Hello, User</h1>
        <p>
          Welcome to our testing website. Here you can give test.
          <br />
          And can also check your status report.
        </p>
        <p>Please read rules and regulation before attempting test.</p>
        <ol>
          <li>Do not open a new tab during whole test.</li>
          <li>Do not minimize the window.</li>
          <li>
            Stay on the content of page, do not open any menus or developer
            tools or what-so-ever.
          </li>
          <li>Do not resize the window.</li>
        </ol>
        <p>
          <Button className='button' onClick={() => history.push("/testPage")}>Attempt Test</Button>
        </p>
      </Jumbotron>
    </div>
  );
}

export default Jumbo;
