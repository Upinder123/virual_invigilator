import React, { useEffect, useState } from 'react';
import MultiSelect from 'react-multi-select-component';

const SelectRoles = ({
  selected,
  setSelected,
  setError,
}: {
  selected: any[];
  setSelected: React.Dispatch<React.SetStateAction<any[]>>;
  setError: React.Dispatch<React.SetStateAction<string>>;
}) => {
  const [disabled, setDisabled] = useState({ teacher: false, student: false });

  const options = [
    {
      label: 'Student 👩‍🎓',
      value: 'student',
      disabled: disabled.student,
    },
    { label: 'Teacher 👩‍🏫', value: 'teacher', disabled: disabled.teacher },
    { label: 'Admin 🔒', value: 'admin' },
  ];

  useEffect(() => {
    setDisabled(s =>
      selected.find((i: any) => i.value === 'student')
        ? { teacher: true, student: false }
        : { ...s, teacher: false }
    );
    setDisabled(s =>
      selected.find((i: any) => i.value === 'teacher')
        ? { teacher: false, student: true }
        : { ...s, student: false }
    );
  }, [selected]);

  // console.log(selected);

  return (
    <MultiSelect
      options={options}
      value={selected}
      onChange={(e: any) => {
        setSelected(e);
        setError('');
      }}
      labelledBy="Select Roles"
      hasSelectAll={false}
    />
  );
};

export default SelectRoles;
