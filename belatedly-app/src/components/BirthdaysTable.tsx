import React from 'react-dom';
import { useCallback, useState } from 'react';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { EditBirthdayTableRow } from './EditBirthdayTableRow';
import { BirthdayTableRow } from './BirthdayTableRow';
import {
  allBirthdaysToggled,
  deleteCheckedBirthdaysRequested,
  selectBirthdays,
  selectShowDeleteButton,
} from '../features/birthdays/birthdaysSlice';

export function BirthdaysTable() {
  const [deleteAllDisabled, setDeleteAllDisabled] = useState<boolean>(false);

  const dispatch = useDispatch();
  const birthdays = useSelector(selectBirthdays, shallowEqual);
  const showDeleteButton = useSelector(selectShowDeleteButton);
  const allBirthdaysToggledCallback = useCallback(
    () => dispatch(allBirthdaysToggled()),
    [dispatch],
  );
  const deleteCheckedBirthdaysCallback = useCallback(
    () => dispatch(deleteCheckedBirthdaysRequested()),
    [dispatch],
  );

  const onDeleteAllClicked = async () => {
    setDeleteAllDisabled(true);
    await deleteCheckedBirthdaysCallback();
    setDeleteAllDisabled(false);
  };

  return (
    <div className="birthdays-table">
      <table>
        <thead>
          <tr>
            <th>
              <input type="checkbox" onClick={allBirthdaysToggledCallback} />
            </th>
            <th>Name</th>
            <th>Birthday</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <EditBirthdayTableRow />
          {birthdays.map((birthday) => (
            <BirthdayTableRow key={birthday.id} id={birthday.id} />
          ))}
        </tbody>
      </table>
      {showDeleteButton && (
        <button
          className="delete-button"
          disabled={deleteAllDisabled}
          type="submit"
          onClick={onDeleteAllClicked}>
          Delete All
        </button>
      )}
    </div>
  );
}
