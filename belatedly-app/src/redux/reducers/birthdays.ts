import { Birthday } from '../../features/birthdays/Birthday';
import {
  BirthdayActionTypes,
  TOGGLE_ALL_CHECKED,
  DELETE_CHECKED_BIRTHDAYS,
  ADD_BIRTHDAY,
  TOGGLE_EDITING_BIRTHDAY,
  TOGGLE_BIRTHDAY_CHECKED,
  UPDATE_BIRTHDAY,
  DELETE_BIRTHDAY,
} from '../actionTypes';

export interface BirthdaysState {
  allChecked: boolean;
  birthdays: Birthday[];
}
const initialState: BirthdaysState = {
  allChecked: false,
  birthdays: [
    {
      id: 0,
      name: 'Daniel Coats',
      date: new Date(1996, 7, 2),
      checked: false,
      editing: false,
    },
    {
      id: 1,
      name: 'Marina HV',
      date: new Date(1994, 11, 19),
      checked: false,
      editing: false,
    },
  ],
};

export function birthdaysReducer(
  state = initialState,
  action: BirthdayActionTypes,
): BirthdaysState {
  switch (action.type) {
    case TOGGLE_ALL_CHECKED: {
      const birthdays = state.birthdays.map((birthday) => ({
        ...birthday,
        checked: !state.allChecked,
      }));
      return {
        ...state,
        birthdays,
        allChecked: !state.allChecked,
      };
    }
    case DELETE_CHECKED_BIRTHDAYS: {
      const birthdays = state.birthdays.filter((birthday) => !birthday.checked);
      return {
        ...state,
        birthdays,
      };
    }
    case ADD_BIRTHDAY: {
      const newBirthday: Birthday = {
        ...action.payload,
        id:
          state.birthdays.reduce(
            (prev, curr) => Math.max(prev, curr.id),
            Number.MIN_VALUE,
          ) + 1,
        checked: false,
        editing: false,
      };
      return {
        ...state,
        birthdays: [...state.birthdays, newBirthday],
      };
    }
    case TOGGLE_EDITING_BIRTHDAY: {
      const birthdays = state.birthdays.map((birthday) =>
        birthday.id === action.payload
          ? {
              ...birthday,
              editing: !birthday.editing,
            }
          : birthday,
      );
      return {
        ...state,
        birthdays,
      };
    }
    case TOGGLE_BIRTHDAY_CHECKED: {
      const birthdays = state.birthdays.map((birthday) =>
        birthday.id === action.payload
          ? {
              ...birthday,
              checked: !birthday.checked,
            }
          : birthday,
      );
      return {
        ...state,
        birthdays,
      };
    }
    case UPDATE_BIRTHDAY: {
      const birthdays = state.birthdays.map((birthday) =>
        birthday.id === action.payload.id
          ? {
              ...birthday,
              ...action.payload,
            }
          : birthday,
      );
      return {
        ...state,
        birthdays,
      };
    }
    case DELETE_BIRTHDAY: {
      const birthdays = state.birthdays.filter(
        (birthday) => birthday.id !== action.payload,
      );
      return {
        ...state,
        birthdays,
      };
    }
    default:
      return state;
  }
}
