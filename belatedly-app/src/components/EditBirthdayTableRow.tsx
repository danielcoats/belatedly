import React from 'react-dom';
import { useCallback, useState } from 'react';
import { useDispatch } from 'react-redux';

import { getNextBirthday, MONTHS } from '../utils/dateUtils';
import { Birthday } from '../features/birthdays/Birthday';
import {
  addBirthdayRequested,
  birthdayEditingToggled,
  updateBirthdayRequested,
} from '../features/birthdays/birthdaysSlice';

interface EditBirthdayTableRowProps {
  birthday?: Birthday;
}

export function EditBirthdayTableRow({ birthday }: EditBirthdayTableRowProps) {
  const DEFAULT_DAY = '1';
  const DEFAULT_MONTH = 0;

  const adding = birthday === undefined;

  const [formDisabled, setFormDisabled] = useState<boolean>(false);
  const [name, setName] = useState<string>(birthday?.name ?? '');
  const [day, setDay] = useState<string>(
    birthday ? new Date(birthday.date).getDate().toString() : DEFAULT_DAY,
  );
  const [month, setMonth] = useState<number>(
    birthday ? new Date(birthday.date).getMonth() : DEFAULT_MONTH,
  );

  const dispatch = useDispatch();
  const birthdayEditingToggledCallback = useCallback(
    () =>
      birthday?.id !== undefined &&
      dispatch(birthdayEditingToggled(birthday.id)),
    [dispatch, birthday],
  );
  const birthdayAddedCallback = useCallback(
    (date: Date) => dispatch(addBirthdayRequested(name, date.toISOString())),
    [dispatch, name],
  );
  const birthdayUpdatedCallback = useCallback(
    (id: string, date: Date) =>
      dispatch(updateBirthdayRequested(id, name, date.toISOString())),
    [dispatch, name],
  );

  async function validateAndSubmit() {
    const nextOccurrence = getNextBirthday(parseInt(day), month);

    if (name && nextOccurrence) {
      setFormDisabled(true);
      if (adding) {
        await birthdayAddedCallback(nextOccurrence);
        clearForm();
      } else if (birthday !== undefined) {
        await birthdayUpdatedCallback(birthday.id, nextOccurrence);
      }
      clearForm();
      setFormDisabled(false);
    }
  }

  function clearForm() {
    setName('');
    setMonth(DEFAULT_MONTH);
    setDay(DEFAULT_DAY);
  }

  return (
    <tr>
      <td>
        <input type="checkbox" disabled />
      </td>
      <td>
        <input
          type="text"
          name="name"
          placeholder="Alex Smith"
          value={name}
          onChange={(e) => setName(e.target.value)}
          disabled={formDisabled}
        />
      </td>
      <td>
        <input
          min="1"
          max="31"
          className="datePart"
          type="number"
          value={day}
          onChange={(e) => setDay(e.target.value)}
          disabled={formDisabled}
        />
        <span className="dateSeparator">/</span>
        <select
          value={month}
          onChange={(e) => setMonth(parseInt(e.target.value))}
          disabled={formDisabled}>
          {MONTHS.map((curr, i) => (
            <option key={i} value={i}>
              {curr}
            </option>
          ))}
        </select>
      </td>
      <td>
        <button
          disabled={formDisabled}
          type="submit"
          onClick={validateAndSubmit}>
          {adding ? 'Add' : 'Save'}
        </button>
        {adding ? (
          <button disabled={formDisabled} type="submit" onClick={clearForm}>
            Clear
          </button>
        ) : (
          <button
            disabled={formDisabled}
            type="submit"
            onClick={birthdayEditingToggledCallback}>
            Cancel
          </button>
        )}
      </td>
    </tr>
  );
}
