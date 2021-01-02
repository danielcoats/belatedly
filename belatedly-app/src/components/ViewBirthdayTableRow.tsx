import React from 'react-dom';
import { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import {
  deleteBirthday,
  toggleBirthdayChecked,
  toggleEditingBirthday,
} from '../redux/actions';
import { Birthday } from '../features/birthdays/Birthday';

interface ViewBirthdayTableRowProps {
  birthday: Birthday;
}

export function ViewBirthdayTableRow({ birthday }: ViewBirthdayTableRowProps) {
  function getNextBirthday(date: Date) {
    const now = new Date(Date.now());
    const month = date.getMonth();
    const day = date.getDate();
    const isThisYear =
      month > now.getMonth() ||
      (month === now.getMonth() && day >= now.getDate());

    return new Date(now.getFullYear() + (isThisYear ? 0 : 1), month, day);
  }

  function daysUntil(date: Date) {
    const now = new Date(Date.now());
    const nowTruncated = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
    );
    return Math.floor(
      (date.getTime() - nowTruncated.getTime()) / (1000 * 3600 * 24),
    );
  }

  const nextBirthday = getNextBirthday(birthday.date);

  const dispatch = useDispatch();
  const toggleEditingCallback = useCallback(
    () => dispatch(toggleEditingBirthday(birthday.id)),
    [dispatch, birthday],
  );
  const deleteBirthdayCallback = useCallback(
    () => birthday?.id !== undefined && dispatch(deleteBirthday(birthday.id)),
    [dispatch, birthday],
  );
  const toggleCheckedCallback = useCallback(
    () =>
      birthday?.id !== undefined &&
      dispatch(toggleBirthdayChecked(birthday.id)),
    [dispatch, birthday],
  );

  function getDaysUntilString(nextBirthday: Date) {
    const days = daysUntil(nextBirthday);
    return days === 0 ? 'today' : `${days} days`;
  }

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
        {birthday.date.toLocaleDateString()} ({getDaysUntilString(nextBirthday)}
        )
      </td>
      <td>
        <button type="submit" onClick={toggleEditingCallback}>
          Edit
        </button>
        <button type="submit" onClick={deleteBirthdayCallback}>
          Delete
        </button>
      </td>
    </tr>
  );
}
