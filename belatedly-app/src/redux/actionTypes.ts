import { NewBirthday } from '../models/NewBirthday';
import { Birthday } from '../features/birthdays/Birthday';

export const TOGGLE_ALL_CHECKED = 'TOGGLE_ALL_CHECKED';
interface ToggleAllCheckedAction {
  type: typeof TOGGLE_ALL_CHECKED;
}

export const ADD_BIRTHDAY = 'ADD_BIRTHDAY';
interface AddBirthdayAction {
  type: typeof ADD_BIRTHDAY;
  payload: NewBirthday;
}

export const UPDATE_BIRTHDAY = 'UPDATE_BIRTHDAY';
interface UpdateBirthdayAction {
  type: typeof UPDATE_BIRTHDAY;
  payload: Birthday;
}

export const DELETE_BIRTHDAY = 'DELETE_BIRTHDAY';
interface DeleteBirthdayAction {
  type: typeof DELETE_BIRTHDAY;
  payload: number;
}

export const TOGGLE_EDITING_BIRTHDAY = 'TOGGLE_EDITING_BIRTHDAY';
interface ToggleEditingBirthdayAction {
  type: typeof TOGGLE_EDITING_BIRTHDAY;
  payload: number;
}

export const TOGGLE_BIRTHDAY_CHECKED = 'TOGGLE_BIRTHDAY_CHECKED';
interface ToggleBirthdayCheckedAction {
  type: typeof TOGGLE_BIRTHDAY_CHECKED;
  payload: number;
}

export const DELETE_CHECKED_BIRTHDAYS = 'DELETE_CHECKED_BIRTHDAYS';
interface DeleteCheckedBirthdaysAction {
  type: typeof DELETE_CHECKED_BIRTHDAYS;
}

export type BirthdayActionTypes =
  | ToggleAllCheckedAction
  | DeleteCheckedBirthdaysAction
  | AddBirthdayAction
  | UpdateBirthdayAction
  | DeleteBirthdayAction
  | ToggleBirthdayCheckedAction
  | ToggleEditingBirthdayAction;
