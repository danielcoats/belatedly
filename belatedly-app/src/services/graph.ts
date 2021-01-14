import {
  Client,
  PageCollection,
  PageIterator,
  PageIteratorCallback,
} from '@microsoft/microsoft-graph-client';
import {
  Calendar,
  TodoTask,
  TodoTaskList,
  User,
  Event,
  MailboxSettings,
} from '@microsoft/microsoft-graph-types';

const getAuthenticatedClient = (accessToken: string): Client => {
  return Client.init({
    authProvider: (callback) => {
      callback(null, accessToken);
    },
  });
};

export async function getUserDetails(accessToken: string): Promise<User> {
  const client = getAuthenticatedClient(accessToken);
  return await client.api('/me').select('displayName,userPrincipalName').get();
}

export async function getTaskLists(
  accessToken: string,
): Promise<TodoTaskList[]> {
  const client = getAuthenticatedClient(accessToken);
  const response = await client.api('/me/todo/lists').get();
  return response.value;
}

export async function getTasksByListId(
  accessToken: string,
  listId: string,
): Promise<TodoTask[]> {
  const client = getAuthenticatedClient(accessToken);
  const response = await client.api(`/me/todo/lists/${listId}/tasks`).get();
  return response.value;
}

export async function addTask(
  accessToken: string,
  listId: string,
  task: TodoTask,
): Promise<TodoTask> {
  const client = getAuthenticatedClient(accessToken);
  return await client.api(`/me/todo/lists/${listId}/tasks`).post(task);
}

export async function deleteTask(
  accessToken: string,
  listId: string,
  taskId: string,
): Promise<void> {
  const client = getAuthenticatedClient(accessToken);
  await client.api(`/me/todo/lists/${listId}/tasks/${taskId}`).delete();
}

export async function updateTask(
  accessToken: string,
  listId: string,
  taskId: string,
  task: TodoTask,
) {
  const client = getAuthenticatedClient(accessToken);
  const response = await client
    .api(`/me/todo/lists/${listId}/tasks/${taskId}`)
    .update(task);
  console.log(response);
}

export async function getMailboxSettings(
  accessToken: string,
): Promise<MailboxSettings> {
  const client = getAuthenticatedClient(accessToken);
  return await client.api('/me/mailboxSettings').get();
}

export async function getCalendars(accessToken: string): Promise<Calendar[]> {
  const client = getAuthenticatedClient(accessToken);
  const response = await client.api('/me/calendars').get();
  return response.value;
}

export async function createCalendar(
  accessToken: string,
  calendar: Calendar,
): Promise<Calendar> {
  const client = getAuthenticatedClient(accessToken);
  return await client.api(`/me/calendars`).create(calendar);
}

export async function getEventsByCalendarId(
  accessToken: string,
  calendarId: string,
  timezone: string,
  pagingCallback: PageIteratorCallback,
): Promise<void> {
  const client = getAuthenticatedClient(accessToken);
  const response: PageCollection = await client
    .api(`/me/calendars/${calendarId}/events`)
    .header('prefer', `outlook.timezone="${timezone}"`)
    .get();
  let pageIterator = new PageIterator(client, response, pagingCallback);
  await pageIterator.iterate();
}

export async function addEvent(
  accessToken: string,
  calendarId: string,
  event: Event,
): Promise<Event> {
  const client = getAuthenticatedClient(accessToken);
  return await client.api(`/me/calendars/${calendarId}/events`).post(event);
}

export async function deleteEvent(
  accessToken: string,
  calendarId: string,
  eventId: string,
): Promise<void> {
  const client = getAuthenticatedClient(accessToken);
  await client.api(`/me/calendars/${calendarId}/events/${eventId}`).delete();
}

export async function updateEvent(
  accessToken: string,
  calendarId: string,
  eventId: string,
  event: Event,
) {
  const client = getAuthenticatedClient(accessToken);
  const response = await client
    .api(`/me/calendars/${calendarId}/events/${eventId}`)
    .update(event);
  console.log(response);
}
