import { NewBirthday } from '../models/NewBirthday';
import {
  BirthdayActionTypes,
  TOGGLE_ALL_CHECKED,
  DELETE_CHECKED_BIRTHDAYS,
  ADD_BIRTHDAY,
  UPDATE_BIRTHDAY,
  DELETE_BIRTHDAY,
  TOGGLE_EDITING_BIRTHDAY,
  TOGGLE_BIRTHDAY_CHECKED,
} from './actionTypes';

export function toggleAllChecked(): BirthdayActionTypes {
  return {
    type: TOGGLE_ALL_CHECKED,
  };
}

export function deleteCheckedBirthdays(): BirthdayActionTypes {
  return {
    type: DELETE_CHECKED_BIRTHDAYS,
  };
}

export function addBirthday(birthday: NewBirthday): BirthdayActionTypes {
  return {
    type: ADD_BIRTHDAY,
    payload: birthday,
  };
}

export function updateBirthday(
  id: number,
  name: string,
  date: Date,
): BirthdayActionTypes {
  return {
    type: UPDATE_BIRTHDAY,
    payload: {
      id,
      name,
      date,
      checked: false,
      editing: false,
    },
  };
}

export function deleteBirthday(id: number): BirthdayActionTypes {
  return {
    type: DELETE_BIRTHDAY,
    payload: id,
  };
}

export function toggleEditingBirthday(id: number): BirthdayActionTypes {
  return {
    type: TOGGLE_EDITING_BIRTHDAY,
    payload: id,
  };
}

export function toggleBirthdayChecked(id: number): BirthdayActionTypes {
  return {
    type: TOGGLE_BIRTHDAY_CHECKED,
    payload: id,
  };
}
