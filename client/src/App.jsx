import React, { useEffect } from 'react';
import './App.css';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
// import {browser} from 'react-router'
import Navbar from './component/Navbar/index';
import Home from './pages';
import About from './pages/about';
import Services from './pages/services';
import Contact from './pages/contact';
import SignUp from './pages/signup';
import graph from './pages/progress';
import SignIn from './pages/signin';
import Dashboard from './pages/dashboard';
import QuizContainer from './component/QuizContainer/QuizContainer';
import Result from './component/Result/Result';
import AdminNavbar from './admin/components/AdminNavbar';
import Main from './admin/components/Main';
import NotFound from './component/404/404';
import { Login } from './admin/components/Login';
import AuthRoute from './component/AuthRoute';
import BatchPanel from './admin/components/Batch';
import AdminDashboard from './admin/components/Dashboard';
import NewUser from './admin/components/Forms/NewUser';
import NewBatch from './admin/components/Forms/NewBatch';
import NewExam from './admin/components/Forms/NewExam';
import NewSubject from './admin/components/Forms/NewSubject';
import UserPanel from './admin/components/User';
import ExamPanel from './admin/components/Exam';
import SubjectPanel from './admin/components/Subject';
import './admin/components/components.css';

function App() {
  useEffect(() => {
    const currentpath = window.location.pathname;
    const clientClassName = 'client-route';
    if (!currentpath.startsWith('/admin'))
      document.body.classList.add(clientClassName);
    else {
      const bodyHavingClientClassname = document.querySelector(
        `body.${clientClassName}`
      );

      if (bodyHavingClientClassname)
        bodyHavingClientClassname.classList.remove(clientClassName);
    }
  }, []);

  return (
    <div className="App">
      <Router>
        {window.location.pathname.startsWith('/admin') ? (
          <AdminNavbar />
        ) : (
          <Navbar />
        )}
        <Switch>
          <Route exact path="/" component={Home} />
          <Route exact path="/about" component={About} />
          <Route exact path="/services" component={Services} />
          <Route exact path="/contact-us" component={Contact} />
          <Route exact path="/progress" component={graph} />
          <Route exact path="/sign-up" component={SignUp} />
          <Route exact path="/sign-in" component={SignIn} />
          <Route exact path="/dashboard" component={Dashboard} />
          <Route exact path="/result" component={Result} />
          <Route exact path="/testPage" component={QuizContainer} />
          <Route exact path="/admin" component={Main} />
          <Route exact path="/admin/login" component={Login} />

          <AuthRoute exact path="/admin/dashboard" component={AdminDashboard} />

          <AuthRoute exact path="/admin/user" component={UserPanel} />
          <AuthRoute exact path="/admin/exam" component={ExamPanel} />
          <AuthRoute exact path="/admin/batch" component={BatchPanel} />
          <AuthRoute exact path="/admin/subject" component={SubjectPanel} />

          <AuthRoute exact path="/admin/exam/new" component={NewExam} />
          <AuthRoute exact path="/admin/user/new" component={NewUser} />
          <AuthRoute exact path="/admin/batch/new" component={NewBatch} />
          <AuthRoute exact path="/admin/subject/new" component={NewSubject} />

          <AuthRoute
            exact
            path="/admin/batch/user/new"
            component={() => <NewUser addTo="batch" />}
          />

          <Route component={NotFound} />
        </Switch>
      </Router>
    </div>
  );
}

export default App;
