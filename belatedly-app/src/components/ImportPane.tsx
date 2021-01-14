import React from 'react-dom';
import { useRef, useState, RefObject, useCallback } from 'react';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import {
  allBirthdaysToUploadToggled,
  birthdaysToUploadAdded,
  birthdayToUploadToggled,
  DraftBirthday,
  importBirthdaysRequested,
} from '../features/birthdays/birthdaysSlice';
import { RootState } from '../store';
import './ImportPane.css';
import { getNextBirthdayByDate } from '../utils/dateUtils';
import { nanoid } from 'nanoid';

const selectImportButtonDisabled = (state: RootState) =>
  Object.values(state.birthdays.birthdaysToUpload).reduce(
    (prev, curr) => prev + (curr?.checked ? 1 : 0),
    0,
  ) <= 0;

const selectBirthdaysToImport = (state: RootState) =>
  state.birthdays.birthdaysToUpload.filter((birthday) => birthday.checked);

interface ImportPaneProps {
  onImportPaneCloseClicked: () => void;
}

export const ImportPane = ({
  onImportPaneCloseClicked: onImportPaneClose,
}: ImportPaneProps) => {
  const dispatch = useDispatch();
  const fileInputEl: RefObject<HTMLInputElement> = useRef(null);
  const [disabled, setDisabled] = useState<boolean>(false);
  const selectBirthdaysToUpload = useSelector(
    (state: RootState) => state.birthdays.birthdaysToUpload,
  );
  const birthdaysToImport = useSelector(selectBirthdaysToImport, shallowEqual);
  const allBirthdaysToUploadChecked = useSelector(
    (state: RootState) => state.birthdays.allBirthdaysToUploadChecked,
  );
  const importButtonDisabled = useSelector(selectImportButtonDisabled);
  const birthdaysImportedCallback = useCallback(
    () => dispatch(importBirthdaysRequested(birthdaysToImport)),
    [dispatch, birthdaysToImport],
  );

  const validateAndSubmit = async () => {
    setDisabled(true);
    if (fileInputEl?.current?.files?.length) {
      const file = fileInputEl.current.files[0];
      var r = new FileReader();
      r.onload = function (e) {
        var contents = e.target?.result as string;
        console.log(
          `File Uploaded! name: ${file.name} content: ${contents} type: ${file.type} size: ${file.size} bytes `,
        );
        if (contents) {
          var cells = contents.split('\n').map((row) => {
            return row.split(',');
          });
          console.log(cells);
          const uploadRows = cells.slice(0, 100);
          const uploadBirthdays = uploadRows.map(
            (row): DraftBirthday => {
              return {
                id: nanoid(),
                name: row[0],
                date: new Date(row[1]).toISOString(),
                checked: false,
              };
            },
          );
          dispatch(birthdaysToUploadAdded(uploadBirthdays));
        }
      };
      r.readAsText(file);
    }
    setDisabled(false);
  };

  const formatBirthday = (date: string) => {
    const nextBirthday = getNextBirthdayByDate(new Date(date));
    return nextBirthday.toLocaleString('default', {
      day: 'numeric',
      month: 'long',
    });
  };

  return (
    <div className="import-pane">
      <input ref={fileInputEl} type="file" />
      <button disabled={disabled} type="submit" onClick={validateAndSubmit}>
        Upload
      </button>
      {selectBirthdaysToUpload.length > 0 && (
        <table>
          <thead>
            <tr>
              <th>
                <input
                  type="checkbox"
                  checked={allBirthdaysToUploadChecked}
                  onChange={() => dispatch(allBirthdaysToUploadToggled())}
                />
              </th>
              <th>Name</th>
              <th>Birthday</th>
            </tr>
          </thead>
          <tbody>
            {selectBirthdaysToUpload.map((birthday) => (
              <tr key={birthday.id}>
                <td>
                  <input
                    type="checkbox"
                    checked={birthday.checked}
                    onChange={() =>
                      dispatch(birthdayToUploadToggled(birthday.id))
                    }
                  />
                </td>
                <td>{birthday.name}</td>
                <td>{formatBirthday(birthday.date)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      <button
        disabled={importButtonDisabled}
        className="import-button"
        onClick={birthdaysImportedCallback}>
        Import
      </button>
      <button className="close-button" onClick={onImportPaneClose}>
        Close
      </button>
    </div>
  );
};
