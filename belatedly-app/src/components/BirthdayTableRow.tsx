import React from 'react-dom';
import { useSelector } from 'react-redux';
import { selectBirthdayById } from '../features/birthdays/birthdaysSlice';
import { RootState } from '../store';
import { EditBirthdayTableRow } from './EditBirthdayTableRow';
import { ViewBirthdayTableRow } from './ViewBirthdayTableRow';

interface BirthdayTableRowProps {
  id: string;
}

export function BirthdayTableRow({ id }: BirthdayTableRowProps) {
  const birthday = useSelector((state: RootState) =>
    selectBirthdayById(state, id),
  );

  if (!birthday) {
    return <tr>Loading...</tr>;
  }

  return birthday.editing ? (
    <EditBirthdayTableRow birthday={birthday} />
  ) : (
    <ViewBirthdayTableRow birthday={birthday} />
  );
}
