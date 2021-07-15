import React, { useState } from 'react';

type FormControlElement =
  | HTMLInputElement
  | HTMLSelectElement
  | HTMLTextAreaElement;

export const useForm: (
  initialValues: any
) => [
  any,
  (e: React.ChangeEvent<FormControlElement>) => void,
  React.Dispatch<any>
] = (initialValues: any) => {
  const [data, setData] = useState(initialValues);

  return [
    data,
    (e: React.ChangeEvent<FormControlElement>) =>
      setData({ ...data, [e.target.name]: e.target.value }),
    setData,
  ];
};

// const handleChange = e => setData({ ...data, [e.target.name]: e.target.value })

/* const [
  { firstName, lastName, email, password },
  handleChange,
  setData,
] = useForm({
  firstName: '',
  lastName: '',
  email: '',
  password: '',
});

const x = 1;

{
  firstName: '',
  lastName: '',
  email: '',
  password: '',
  // [x*4]: 5
}

<input value={firstName} onChange={e => handleChange(e)} name="firstName" />
<input value={lastName} onChange={handleChange} name="lastName" />
<input value={} onChange={} name="" />

 */
