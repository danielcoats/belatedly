import React from 'react-dom';
import { useCallback } from 'react';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { deleteCheckedBirthdays, toggleAllChecked } from '../redux/actions';
import { EditBirthdayTableRow } from './EditBirthdayTableRow';
import { BirthdayTableRow } from './BirthdayTableRow';
import {
  birthdaysSelector,
  showDeleteButtonSelector,
} from '../redux/selectors';

export function BirthdaysTable() {
  const dispatch = useDispatch();
  const birthdays = useSelector(birthdaysSelector, shallowEqual);
  const showDeleteButton = useSelector(showDeleteButtonSelector);
  const toggleAllCheckedCallback = useCallback(
    () => dispatch(toggleAllChecked()),
    [dispatch],
  );
  const deleteCheckedBirthdaysCallback = useCallback(
    () => dispatch(deleteCheckedBirthdays()),
    [dispatch],
  );

  return (
    <>
      <table className="birthdays-table">
        <thead>
          <tr>
            <th>
              <input type="checkbox" onClick={toggleAllCheckedCallback} />
            </th>
            <th>Name</th>
            <th>Birthday</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {birthdays.map((birthday) => (
            <BirthdayTableRow key={birthday.id} birthday={birthday} />
          ))}
          <EditBirthdayTableRow />
        </tbody>
      </table>
      {showDeleteButton && (
        <button type="submit" onClick={deleteCheckedBirthdaysCallback}>
          Delete
        </button>
      )}
    </>
  );
}
