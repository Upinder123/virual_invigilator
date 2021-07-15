import React, { FormEvent, useState } from 'react';
import jwt from 'jsonwebtoken';
import {
  Button,
  Col,
  Container,
  Dropdown,
  Form,
  FormControl,
  Row,
} from 'react-bootstrap';
import { useHistory } from 'react-router-dom';
import axios from 'axios';
import { validateEmail } from '../../../../helper/validateEmail';
import { useForm } from '../../../../helper/useForm';
import IAlert from '../../IAlert';
import SelectRoles from './SelectRoles';
import unAuthuserToLoginpage from '../../../../helper/unAuthuserToLoginpage';
import './index.css';
import OptimisedSpinner from '../../../../component/OptimizedSpinner';
import prettyDate from '../../../../helper/prettyDate';

interface Props {
  addTo?: 'batch' | null;
}

const NewUser = ({ addTo }: Props) => {
  const [formData, setFormData, setData] = useForm({
    email: '',
    password: '',
    name: '',
  });
  const [error, setError] = useState('');
  const [selected, setSelected] = useState<any[]>([]);
  const [success, setSuccess] = useState('');

  const [{ userSearchDone, batchSearchDone }, setSearchDone] = useState({
    userSearchDone: false,
    batchSearchDone: false,
  });
  const [{ selectedUser, selectedBatch }, setSelectedDocs] = useState({
    selectedUser: { name: '', email: '' },
    selectedBatch: { name: '', start: '' },
  });
  const [{ userString, batchString }, setSearchString] = useState({
    userString: '',
    batchString: '',
  });

  const [
    {
      loading: { batchDataLoading, userDataLoading },
      error: addUserToBatchError,
      data: { userData, batchData },
    },
    setResponse,
  ] = useState({
    data: { userData: null, batchData: null },
    loading: { userDataLoading: false, batchDataLoading: false },
    error: false,
  });
  const history = useHistory();

  const getDataFromAPI = (str: string, doc: 'batch' | 'user') => {
    setResponse(r => ({
      ...r,
      data: str === '' ? { userData: null, batchData: null } : r.data,
    }));

    if (userDataLoading || batchDataLoading) return;

    if (str && !(userDataLoading || batchDataLoading)) {
      const TOKEN_KEY = process.env.REACT_APP_TOKEN_KEY;
      if (!TOKEN_KEY) {
        console.error('no token key found, check /client/.env');
        setError('Something went wrong, please try again later!');
        return;
      }

      const token = localStorage.getItem(TOKEN_KEY);
      // console.log(token);
      if (!token) {
        console.log('user not authenticated!');
        unAuthuserToLoginpage(history, '/admin/batch/user/new');
      }

      setResponse(r => ({
        ...r,
        data: { batchData: null, userData: null },
        loading:
          doc === 'batch'
            ? { batchDataLoading: true, userDataLoading: false }
            : { userDataLoading: true, batchDataLoading: false },
        error: false,
      }));

      axios(`http://localhost:5000/v1/api/search/${doc}/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        data: {
          searchString: str,
          roles: ['student', 'teacher'],
        },
      })
        .then(response => {
          setResponse(r => ({
            ...r,
            data:
              doc === 'batch'
                ? {
                    batchData: response.data,
                    userData: null,
                  }
                : {
                    userData: response.data,
                    batchData: null,
                  },
            loading:
              doc === 'batch'
                ? { batchDataLoading: false, userDataLoading: false }
                : { userDataLoading: false, batchDataLoading: false },
            error: false,
          }));
        })
        .catch(error => {
          console.log(error);
          if (axios.isCancel(error)) return;

          setResponse(r => ({
            ...r,
            data: { batchData: null, userData: null },
            loading: { userDataLoading: false, batchDataLoading: false },
            error,
          }));
          // setSearchString('');
        });
    }
  };

  const handleSearchedDropdownClick = (
    e: any,
    id: string,
    doc: 'batch' | 'user'
  ) => {
    console.log('clicked', id);
    const t: any[] = (doc === 'user' ? userData : batchData) || [];
    const u = t.find(user => user._id === id);
    console.log(u);

    setSelectedDocs(d => ({
      ...d,
      selectedBatch: doc === 'batch' ? u : d.selectedBatch,
      selectedUser: doc === 'user' ? u : d.selectedUser,
    }));
    setData({ ...formData, email: u.email });
    setSearchDone(sD => ({
      ...sD,
      userSearchDone: doc === 'user',
      batchSearchDone: doc === 'batch',
    }));
  };

  const getSelectedDropdownList = (doc: 'batch' | 'user') => {
    const t: any = doc === 'user' ? userData : batchData;
    if (!userString && !batchString) {
      return '';
    }

    if (t && t.length > 0) {
      return t.map((val: any) => (
        <Dropdown.Item
          key={val._id}
          onClick={e => handleSearchedDropdownClick(e, val._id, doc)}
          className="dropdown-item btn btn-primary"
        >
          <span className="user-name">{val.name}</span>{' '}
          <span className="user-email">
            {doc === 'user' ? val.email : `From ${prettyDate(val.start)}`}
          </span>
        </Dropdown.Item>
      ));
    }
    return '';
  };

  const handleLogin = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');

    console.log('form submit');

    /* Below to Add User validation */
    if (addTo) return;

    setError(!validateEmail(formData.email) ? 'Email entered is invalid' : '');

    setError(!selected.length ? 'Roles are mandatory!' : '');
    if (!selected.length) return;

    axios
      .post('http://localhost:5000/v1/api/user/signUp', {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        roles: selected.map(s => s.value),
      })
      .then(r => {
        const response = r.data;
        console.log(response);

        if ('error' in response) setError(response.error.message);
        else {
          const SECRET_KEY = process.env.REACT_APP_SECRET_KEY;
          console.log(response.token);
          console.log(SECRET_KEY);

          setError(prevE =>
            !SECRET_KEY
              ? 'Something went wrong!!.. Please try again later!'
              : prevE
          );
          if (!SECRET_KEY) return;

          jwt.verify(response.token, SECRET_KEY, (err: any, decoded: any) => {
            if (err) {
              console.log(err);
              setError('Something went wrong!!.. Please try again later');
            } else {
              console.log(decoded);
              // localStorage.setItem(
              //   `${process.env.REACT_APP_TOKEN_KEY}`,
              //   response.token
              // );
            }
            setSuccess(s => (!err ? 'Successfully created user' : s));
            setData({ email: '', password: '', name: '' });
            setSelected([]);
          });
        }
      })
      .catch(e => {
        console.log(e.response);
        setError(
          e.response.status === 500
            ? 'Something went wrong, please try again'
            : e.response.status === 404
            ? 'A/c not found.. please contact your administrator'
            : e.response.data.error.message
        );
      });
  };

  return (
    <>
      <h1 className="d-flex justify-content-center mt-3 mb-4">
        {addTo === 'batch' ? 'Add User to Batch' : 'New User Form'}
      </h1>
      <Container className="add-new-to-batch">
        <Row className="justify-content-center">
          <Col xs={10} md={5} lg={5}>
            <IAlert
              msg={error}
              showAlert={!!error}
              close={() => setError('')}
            />

            <IAlert
              msg={success}
              showAlert={!!success}
              close={() => setSuccess('')}
              variant="success"
            />

            <Form className="" onSubmit={handleLogin}>
              <Form.Group controlId="formBasicSearch">
                {addTo === 'batch' ? (
                  <>
                    <Form.Label>User&apos;s Name</Form.Label>
                    <FormControl
                      type="text"
                      placeholder="Search via Name or Email"
                      className="mr-sm-2"
                      value={
                        !userSearchDone
                          ? userString
                          : `${selectedUser.name} ${selectedUser.email}`
                      }
                      onChange={e => {
                        setResponse(r => ({
                          ...r,
                          data: { ...r.data, userData: null },
                        }));
                        setSearchString(s => ({
                          ...s,
                          userString: e.target.value,
                        }));
                        getDataFromAPI(e.target.value, 'user');
                      }}
                      autoComplete="new-password"
                      autoSave="off"
                      readOnly={userSearchDone}
                      onClick={() => {
                        setSearchString(s => ({
                          ...s,
                          userString: userSearchDone ? '' : s.userString,
                        }));
                        setSearchDone(s => ({ ...s, userSearchDone: false }));
                      }}
                      style={{ cursor: userSearchDone ? 'pointer' : 'text' }}
                    />

                    <Dropdown className={userString ? 'sj-dropdown' : ''}>
                      {userDataLoading ? (
                        <Dropdown.Item as="button">
                          <OptimisedSpinner />
                        </Dropdown.Item>
                      ) : (
                        !userSearchDone && getSelectedDropdownList('user')
                      )}
                    </Dropdown>

                    <Form.Label>Batch&apos;s Name</Form.Label>
                    <FormControl
                      type="text"
                      placeholder="Search Batch Name"
                      className="mr-sm-2"
                      value={
                        !batchSearchDone
                          ? batchString
                          : `${selectedBatch.name} ${prettyDate(
                              selectedBatch.start
                            )}`
                      }
                      onChange={e => {
                        setSearchString(s => ({
                          ...s,
                          batchString: e.target.value,
                        }));
                        getDataFromAPI(e.target.value, 'batch');
                      }}
                      autoComplete="new-password"
                      autoSave="off"
                      readOnly={batchSearchDone}
                      onClick={() => {
                        setResponse(r => ({
                          ...r,
                          data: { ...r.data, batchData: null },
                        }));
                        setSearchString(s => ({
                          ...s,
                          batchString: batchSearchDone ? '' : s.batchString,
                        }));
                        setSearchDone(s => ({ ...s, batchSearchDone: false }));
                      }}
                      style={{ cursor: batchSearchDone ? 'pointer' : 'text' }}
                    />
                    <Dropdown className={batchString ? 'sj-dropdown' : ''}>
                      {batchDataLoading ? (
                        <Dropdown.Item as="button">
                          <OptimisedSpinner />
                        </Dropdown.Item>
                      ) : (
                        !batchSearchDone && getSelectedDropdownList('batch')
                      )}
                    </Dropdown>
                  </>
                ) : null}
              </Form.Group>

              {!addTo && (
                <>
                  <Form.Label>Name</Form.Label>
                  <Form.Control
                    type="name"
                    placeholder="Enter name"
                    name="name"
                    value={formData.name}
                    onChange={e => {
                      setError('');
                      setFormData(e);
                    }}
                    autoFocus
                    required
                  />
                  <Form.Group controlId="formBasicEmail">
                    <Form.Label>Email</Form.Label>
                    <Form.Control
                      type="email"
                      placeholder="Enter email"
                      name="email"
                      value={formData.email}
                      onChange={e => {
                        setError('');
                        setFormData(e);
                      }}
                      required
                    />
                  </Form.Group>

                  <Form.Group controlId="formBasicRoles">
                    <Form.Label>Roles</Form.Label>
                    <SelectRoles
                      selected={selected}
                      setSelected={setSelected}
                      setError={setError}
                    />
                  </Form.Group>

                  <Form.Group controlId="formBasicPassword">
                    <Form.Label>Password</Form.Label>
                    <Form.Control
                      type="password"
                      placeholder="Password"
                      name="password"
                      onChange={e => {
                        setError('');
                        setFormData(e);
                      }}
                      value={formData.password}
                      required
                    />
                  </Form.Group>
                </>
              )}

              <Button variant="primary" type="submit" className="mt-1">
                Submit
              </Button>
            </Form>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default NewUser;
