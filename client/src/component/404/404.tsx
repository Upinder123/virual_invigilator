import React from 'react';
import { Link } from 'react-router-dom';
import './_404.css';

function NotFound() {
  return (
    <>
      <div className="_404-container mx-auto">
        <div className="content">
          <h1>Oops.. looks like you are here by mistake</h1>
          <Link
            to={window.location.pathname.startsWith('/admin') ? '/admin' : '/'}
            className="go-to-home-page"
          >
            Go to home Page
          </Link>
        </div>
      </div>
    </>
  );
}

export default NotFound;
