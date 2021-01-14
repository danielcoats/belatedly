import React from 'react-dom';
import { useCallback, useState } from 'react';
import { useDispatch } from 'react-redux';

import { Birthday } from '../features/birthdays/Birthday';
import {
  birthdayEditingToggled,
  birthdayToggled,
  deleteBirthdayRequested,
} from '../features/birthdays/birthdaysSlice';
import { daysUntil, getNextBirthdayByDate } from '../utils/dateUtils';

interface ViewBirthdayTableRowProps {
  birthday: Birthday;
}

export function ViewBirthdayTableRow({ birthday }: ViewBirthdayTableRowProps) {
  const [deleteDisabled, setDeleteDisabled] = useState<boolean>(false);

  const nextBirthday = getNextBirthdayByDate(new Date(birthday.date));

  const date = nextBirthday.toLocaleString('default', {
    day: 'numeric',
    month: 'long',
  });

  const dispatch = useDispatch();
  const toggleEditingCallback = useCallback(
    () => dispatch(birthdayEditingToggled(birthday.id)),
    [dispatch, birthday],
  );
  const deleteBirthdayCallback = useCallback(
    () => birthday && dispatch(deleteBirthdayRequested(birthday.id)),
    [dispatch, birthday],
  );
  const toggleCheckedCallback = useCallback(
    () => birthday && dispatch(birthdayToggled(birthday.id)),
    [dispatch, birthday],
  );

  const getDaysUntilString = (nextBirthday: Date) => {
    const days = daysUntil(nextBirthday);
    return days === 0 ? 'today' : `${days} ${days === 1 ? `day` : 'days'}`;
  };

  const onDeleteClicked = async () => {
    setDeleteDisabled(true);
    await deleteBirthdayCallback();
  };

  return (
    <tr>
      <td>
        <input
          type="checkbox"
          checked={birthday.checked}
          onChange={toggleCheckedCallback}
        />
      </td>
      <td>{birthday.name}</td>
      <td>
        {date} ({getDaysUntilString(nextBirthday)})
      </td>
      <td>
        <button type="submit" onClick={toggleEditingCallback}>
          Edit
        </button>
        <button
          type="submit"
          disabled={deleteDisabled}
          onClick={onDeleteClicked}>
          Delete
        </button>
      </td>
    </tr>
  );
}
