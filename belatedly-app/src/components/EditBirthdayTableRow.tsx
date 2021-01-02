import React from 'react-dom';
import { useCallback, useState } from 'react';
import { useDispatch } from 'react-redux';
import {
  addBirthday,
  toggleEditingBirthday,
  updateBirthday,
} from '../redux/actions';
import { MONTHS } from '../dateConstants';
import { Birthday } from '../features/birthdays/Birthday';

interface EditBirthdayTableRowProps {
  birthday?: Birthday;
}

export function EditBirthdayTableRow({ birthday }: EditBirthdayTableRowProps) {
  const DEFAULT_DAY = 1;
  const DEFAULT_MONTH = 0;
  const DEFAULT_YEAR = 2000;

  const adding = birthday === undefined;

  const [name, setName] = useState<string>(birthday?.name ?? '');
  const [day, setDay] = useState<number>(
    birthday?.date.getDate() || DEFAULT_DAY,
  );
  const [month, setMonth] = useState<number>(
    birthday?.date.getMonth() || DEFAULT_MONTH,
  );
  const [year, setYear] = useState<number>(
    birthday?.date.getFullYear() || DEFAULT_YEAR,
  );

  const dispatch = useDispatch();
  const toggleEditingCallback = useCallback(
    () =>
      birthday?.id !== undefined &&
      dispatch(toggleEditingBirthday(birthday.id)),
    [dispatch, birthday],
  );
  const addBirthdayCallback = useCallback(
    (date: Date) => dispatch(addBirthday({ name, date })),
    [dispatch, name],
  );
  const updateBirthdayCallback = useCallback(
    (date: Date) =>
      birthday?.id !== undefined &&
      dispatch(updateBirthday(birthday.id, name, date)),
    [dispatch, birthday, name],
  );

  function validateAndSubmit() {
    const date = new Date(year, month, day);

    if (name && date) {
      if (adding) {
        addBirthdayCallback(date);
        clearForm();
      } else if (birthday !== undefined) {
        updateBirthdayCallback(date);
        clearForm();
      }
    }
  }

  function clearForm() {
    setName('');
    setMonth(DEFAULT_MONTH);
    setDay(DEFAULT_DAY);
    setYear(DEFAULT_YEAR);
  }

  return (
    <tr>
      <td></td>
      <td>
        <input
          type="text"
          name="name"
          placeholder="Alex Smith"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </td>
      <td>
        <input
          min="1"
          max="31"
          className="datePart"
          type="number"
          placeholder=""
          value={day}
          onChange={(e) => setDay(parseInt(e.target.value))}
        />
        <span className="dateSeparator">/</span>
        <select
          value={month}
          onChange={(e) => setMonth(parseInt(e.target.value))}>
          {MONTHS.map((curr, i) => (
            <option key={i} value={i}>
              {curr}
            </option>
          ))}
        </select>
        <span className="dateSeparator">/</span>
        <input
          min="1900"
          max={new Date().getFullYear()}
          className="datePart datePartYear"
          type="number"
          placeholder=""
          value={year}
          onChange={(e) => setYear(parseInt(e.target.value))}
        />
      </td>
      <td>
        <button type="submit" onClick={validateAndSubmit}>
          {adding ? 'Add' : 'Save'}
        </button>
        {adding ? (
          <button type="submit" onClick={clearForm}>
            Clear
          </button>
        ) : (
          <button type="submit" onClick={toggleEditingCallback}>
            Cancel
          </button>
        )}
      </td>
    </tr>
  );
}
