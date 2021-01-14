import {
  createEntityAdapter,
  createSlice,
  PayloadAction,
  Update,
} from '@reduxjs/toolkit';
import { Birthday } from './Birthday';
import { AppThunk, RootState } from '../../store';
import { nanoid } from 'nanoid';
import {
  addEvent,
  createCalendar,
  deleteEvent,
  getCalendars,
  getEventsByCalendarId,
  getTaskLists,
  updateEvent,
} from '../../services/graph';
import { getProfileTokenPopup } from '../../services/auth';
import { httpRequestFailed, selectTimezone } from '../app/appSlice';
import { Event } from '@microsoft/microsoft-graph-types';

const BIRTHDAYS_CALENDAR_NAME = 'Birthdays';

const birthdaysAdapter = createEntityAdapter<Birthday>();

export type DraftBirthday = Pick<Birthday, 'id' | 'name' | 'date' | 'checked'>;

const initialState = birthdaysAdapter.getInitialState({
  allChecked: false,
  allBirthdaysToUploadChecked: false,
  birthdayCalendarId: '',
  birthdaysToUpload: [] as DraftBirthday[],
});

const birthdaysSlice = createSlice({
  name: 'birthdays',
  initialState: initialState,
  reducers: {
    birthdayAdded: {
      reducer: birthdaysAdapter.addOne,
      prepare: (name: string, date: string, externalId: string) => {
        return {
          payload: {
            id: nanoid(),
            name,
            date,
            editing: false,
            checked: false,
            externalId: externalId,
          },
        };
      },
    },
    birthdaysAdded: birthdaysAdapter.addMany,
    birthdayDeleted: birthdaysAdapter.removeOne,
    birthdayUpdated: (state, action: PayloadAction<Update<Birthday>>) => {
      const { id, changes } = action.payload;
      birthdaysAdapter.updateOne(state, {
        id,
        changes: { ...changes, editing: false, checked: false },
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
        birthday!.checked = !state.allChecked;
      });
      state.allChecked = !state.allChecked;
    },
    birthdayEditingToggled: (state, action: PayloadAction<string>) => {
      const birthday = state.entities[action.payload];
      if (birthday) {
        birthday.editing = !birthday.editing;
      }
    },
    birthdayToggled: (state, action: PayloadAction<string>) => {
      const birthday = state.entities[action.payload];
      if (birthday) {
        birthday.checked = !birthday.checked;
      }
    },
    birthdayCalendarIdSet: (state, action: PayloadAction<string>) => {
      state.birthdayCalendarId = action.payload;
    },
    birthdaysToUploadAdded: (state, action: PayloadAction<DraftBirthday[]>) => {
      const duplicatesRemoved = action.payload.filter(
        (birthday, index, arr) =>
          // Check the list of birthdays to import
          arr.findIndex((other) => other.name === birthday.name) === index &&
          // And check the existing birthdays
          Object.values(state.entities).findIndex(
            (existing) => existing?.name === birthday.name,
          ) < 0,
      );
      state.birthdaysToUpload.push(...duplicatesRemoved);
    },
    birthdayToUploadRemoved: (state, action: PayloadAction<string>) => {
      state.birthdaysToUpload = state.birthdaysToUpload.filter(
        (birthday) => birthday.id !== action.payload,
      );
    },
    birthdayToUploadToggled: (state, action: PayloadAction<string>) => {
      const birthday = state.birthdaysToUpload.filter(
        (birthday) => birthday.id === action.payload,
      );
      if (birthday.length > 0) {
        birthday[0].checked = !birthday[0].checked;
      }
    },
    allBirthdaysToUploadToggled: (state) => {
      Object.values(state.birthdaysToUpload).forEach((birthday) => {
        birthday.checked = !state.allBirthdaysToUploadChecked;
      });
      state.allBirthdaysToUploadChecked = !state.allBirthdaysToUploadChecked;
    },
  },
});

export const {
  birthdayAdded,
  birthdaysAdded,
  birthdayDeleted,
  birthdayUpdated,
  checkedBirthdaysDeleted,
  allBirthdaysToggled,
  birthdayEditingToggled,
  birthdayToggled,
  birthdayCalendarIdSet,
  birthdaysToUploadAdded,
  birthdayToUploadRemoved,
  birthdayToUploadToggled,
  allBirthdaysToUploadToggled,
} = birthdaysSlice.actions;

export default birthdaysSlice.reducer;

// Thunks

export const fetchBirthdayListId = (): AppThunk => async (dispatch) => {
  try {
    const token = await getProfileTokenPopup();
    const lists = await getTaskLists(token);
    const listIds = lists
      .filter((list) => list.displayName === BIRTHDAYS_CALENDAR_NAME)
      .map((list) => list.id);

    if (listIds.length > 0 && listIds[0]) {
      dispatch(birthdayCalendarIdSet(listIds[0]));
    }
  } catch (err) {
    dispatch(httpRequestFailed(err.toString()));
  }
};

export const fetchBirthdayCalendarId = (): AppThunk => async (dispatch) => {
  try {
    const token = await getProfileTokenPopup();
    const calendars = await getCalendars(token);
    const calendarIds = calendars
      .filter((calendar) => calendar.name === BIRTHDAYS_CALENDAR_NAME)
      .map((calendar) => calendar.id);

    if (calendarIds.length > 0 && calendarIds[0]) {
      dispatch(birthdayCalendarIdSet(calendarIds[0]));
    }
  } catch (err) {
    dispatch(httpRequestFailed(err.toString()));
  }
};

export const fetchBirthdays = (): AppThunk => async (dispatch, getState) => {
  try {
    const token = await getProfileTokenPopup();
    const calendarId = selectBirthdayCalendarId(getState());
    const timezone = selectTimezone(getState());

    if (calendarId) {
      await getEventsByCalendarId(
        token,
        calendarId,
        timezone,
        (event: Event) => {
          const { id, subject, start } = event;
          if (id && subject && start?.dateTime) {
            dispatch(birthdayAdded(subject, start.dateTime, id));
          }
          return true;
        },
      );
    }
  } catch (err) {
    dispatch(httpRequestFailed(err.toString()));
  }
};

const reduceEventsToBirthdays = (
  birthdays: Birthday[],
  event: Event,
): Birthday[] => {
  const { subject, start } = event;
  if (subject && start?.dateTime) {
    birthdays.push({
      id: nanoid(),
      name: subject,
      date: start.dateTime,
      checked: false,
      editing: false,
      externalId: event.id,
    });
  }

  return birthdays;
};

export const addBirthdayRequested = (
  name: string,
  birthDate: string,
): AppThunk => async (dispatch, getState) => {
  try {
    const token = await getProfileTokenPopup();
    let calendarId = selectBirthdayCalendarId(getState());
    const timezone = selectTimezone(getState());

    if (!calendarId) {
      const response = await createCalendar(token, {
        name: BIRTHDAYS_CALENDAR_NAME,
      });
      if (!response.id) {
        throw new Error('Error creating Birthdays calendar');
      }
      calendarId = response.id;
      dispatch(birthdayCalendarIdSet(calendarId));
    }

    const event = createNewEventPayload(name, timezone, new Date(birthDate));
    const response = await addEvent(token, calendarId, event);
    if (response.id) {
      dispatch(birthdayAdded(name, birthDate, response.id));
    }
  } catch (err) {
    dispatch(httpRequestFailed(err.toString()));
  }
};

export const updateBirthdayRequested = (
  id: string,
  name: string,
  birthDate: string,
): AppThunk => async (dispatch, getState) => {
  try {
    const token = await getProfileTokenPopup();
    const calendarId = selectBirthdayCalendarId(getState());
    const eventId = selectBirthdayById(getState(), id)?.externalId;
    const timeZone = selectTimezone(getState());

    if (calendarId && eventId) {
      const event = createUpdateEventPayload(
        name,
        timeZone,
        new Date(birthDate),
      );
      await updateEvent(token, calendarId, eventId, event);
      dispatch(birthdayUpdated({ id, changes: { name, date: birthDate } }));
    }
  } catch (err) {
    dispatch(httpRequestFailed(err.toString()));
  }
};

export const deleteBirthdayRequested = (id: string): AppThunk => async (
  dispatch,
  getState,
) => {
  try {
    const token = await getProfileTokenPopup();
    const calendarId = selectBirthdayCalendarId(getState());
    const externalId = selectBirthdayById(getState(), id)?.externalId;

    if (calendarId && externalId) {
      await deleteEvent(token, calendarId, externalId);
      dispatch(birthdayDeleted(id));
    }
  } catch (err) {
    dispatch(httpRequestFailed(err.toString()));
  }
};

export const deleteCheckedBirthdaysRequested = (): AppThunk => async (
  dispatch,
  getState,
) => {
  try {
    const token = await getProfileTokenPopup();
    const calendarId = selectBirthdayCalendarId(getState());
    const birthdays = selectBirthdays(getState());

    if (calendarId && birthdays.length) {
      const checkedIds = birthdays.reduce((ids, birthday) => {
        const { checked, externalId, id } = birthday;
        if (id && externalId && checked) {
          ids.push({ id, externalId });
        }
        return ids;
      }, [] as { id: string; externalId: string }[]);

      for (const { id, externalId } of checkedIds) {
        await deleteEvent(token, calendarId, externalId);
        dispatch(birthdayDeleted(id));
      }
    }
  } catch (err) {
    dispatch(httpRequestFailed(err.toString()));
  }
};

export const importBirthdaysRequested = (
  birthdaysToImport: DraftBirthday[],
): AppThunk => async (dispatch, getState) => {
  const existing = selectBirthdays(getState());
  birthdaysToImport.forEach(async (birthday) => {
    const { id, name, date } = birthday;
    const isUnique =
      existing.filter((birthday) => name === birthday.name).length === 0;
    if (isUnique) {
      await dispatch(addBirthdayRequested(name, date));
      dispatch(birthdayToUploadRemoved(id));
    }
  });
};

const createNewEventPayload = (
  name: string,
  timeZone: string,
  birthDate: Date,
): Event => {
  return {
    ...createUpdateEventPayload(name, timeZone, birthDate),
    isAllDay: true,
    body: { contentType: 'text', content: 'Created in Belatedly app.' },
    showAs: 'free',
  };
};

const createUpdateEventPayload = (
  name: string,
  timeZone: string,
  birthDate: Date,
): Event => {
  const endDate = new Date(birthDate);
  endDate.setDate(endDate.getDate() + 1);

  return {
    subject: name,
    start: { dateTime: formatDateForGraph(birthDate), timeZone },
    end: { dateTime: formatDateForGraph(endDate), timeZone },
    recurrence: {
      pattern: {
        dayOfMonth: birthDate.getUTCDate(),
        month: birthDate.getUTCMonth() + 1, // getMonth() is zero-based
        interval: 1,
        type: 'absoluteYearly',
      },
      range: {
        startDate: formatDateForGraph(birthDate, false),
        type: 'noEnd',
        recurrenceTimeZone: timeZone,
      },
    },
    reminderMinutesBeforeStart: 60 * 24 * 7, // Remind one week before
  };
};

export const formatDateForGraph = (
  date: Date,
  includeTimePart: boolean = true,
) => {
  const [yearPart] = date.toISOString().split('T');
  return includeTimePart ? yearPart + 'T00:00:00.0000000' : yearPart;
};

// Selectors

export const {
  selectAll: selectBirthdays,
  selectById: selectBirthdayById,
} = birthdaysAdapter.getSelectors((state: RootState) => state.birthdays);

export const selectBirthdayCalendarId = (state: RootState) =>
  state.birthdays.birthdayCalendarId;

export const selectShowDeleteButton = (state: RootState) =>
  Object.values(state.birthdays.entities).reduce(
    (prev, curr) => prev + (curr?.checked ? 1 : 0),
    0,
  ) > 0;
