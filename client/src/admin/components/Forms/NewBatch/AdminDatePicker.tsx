import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { addDays } from '../../../../helper/addDays';
import './admin-date-picker.css';

interface Props {
  daysForMinDate: number;
  daysForMaxDate: number;
  date: Date | null | undefined;
  setDate: React.Dispatch<React.SetStateAction<Date | null | undefined>>;
  name?: string;
  required?: boolean;
}

const AdminDatePicker = ({
  daysForMinDate,
  daysForMaxDate,
  date,
  setDate,
  name,
  required,
}: Props) => (
  <DatePicker
    selected={date}
    onChange={(date: any) => setDate(date)}
    minDate={addDays(daysForMinDate)}
    maxDate={addDays(daysForMaxDate)}
    placeholderText={`Select a date after ${daysForMinDate} days ago`}
    name={name}
    required={required || false}
  />
);

export default AdminDatePicker;
