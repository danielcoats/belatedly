import {
  createEntityAdapter,
  createSlice,
  EntityState,
  PayloadAction,
} from '@reduxjs/toolkit';
import { Birthday } from './Birthday';
import { RootState } from '../../redux/store';

const birthdaysAdapter = createEntityAdapter<Birthday>();

const initialState = birthdaysAdapter.getInitialState({ allChecked: false });
const initialStateWithDummyData = birthdaysAdapter.upsertMany(initialState, [
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
]);

const birthdaysSlice = createSlice({
  name: 'birthdays',
  initialState: initialStateWithDummyData,
  reducers: {
    birthdayAdded: birthdaysAdapter.addOne,
    birthdayDeleted: birthdaysAdapter.removeOne,
    birthdayUpdated: birthdaysAdapter.updateOne,
    allBirthdaysChecked: (state, action: PayloadAction<boolean>) => {
      Object.values(state.entities).forEach((birthday) => {
        if (birthday) {
          birthday.checked = action.payload;
        }
      });
    },
    checkedBirthdaysDeleted: (state) => {
      const checkedIds = Object.values(state.entities)
        .filter((birthday) => birthday!.checked)
        .map((birthday) => birthday!.id);
      birthdaysAdapter.removeMany(state, checkedIds);
    },
    allBirthdaysToggled: (state) => {
      Object.values(state.entities).forEach((birthday) => {
        birthday!.checked = state.allChecked;
      });
      state.allChecked = !state.allChecked;
    },
    birthdayEditingToggled: (state, action: PayloadAction<number>) => {
      const birthday = state.entities[action.payload];
      if (birthday) {
        birthday.editing = !birthday.editing;
      }
    },
    birthdayToggled: (state, action: PayloadAction<number>) => {
      const birthday = state.entities[action.payload];
      if (birthday) {
        birthday.checked = !birthday.checked;
      }
    },
  },
});

export const {
  birthdayAdded,
  birthdayDeleted,
  birthdayUpdated,
  allBirthdaysChecked,
  checkedBirthdaysDeleted,
  allBirthdaysToggled,
  birthdayEditingToggled,
  birthdayToggled,
} = birthdaysSlice.actions;

export default birthdaysSlice.reducer;

// Thunks

// Selectors

export const {
  selectAll: selectBirthdays,
  selectById: selectBirthdayById,
} = birthdaysAdapter.getSelectors((state: RootState) => state.birthdays);

export const selectShowDeleteButton = (state: EntityState<Birthday>) =>
  Object.values(state.entities).reduce(
    (prev, curr) => prev + (curr?.checked ? 1 : 0),
    0,
  ) > 0;
