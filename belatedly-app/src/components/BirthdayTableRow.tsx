import React from 'react-dom';
import { Birthday } from '../features/birthdays/Birthday';
import { EditBirthdayTableRow } from './EditBirthdayTableRow';
import { ViewBirthdayTableRow } from './ViewBirthdayTableRow';

interface BirthdayTableRowProps {
  birthday: Birthday;
}

export function BirthdayTableRow({ birthday }: BirthdayTableRowProps) {
  return birthday.editing ? (
    <EditBirthdayTableRow birthday={birthday} />
  ) : (
    <ViewBirthdayTableRow birthday={birthday} />
  );
}
