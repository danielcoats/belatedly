import React from 'react-dom';
import './App.css';
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';
import { useState } from 'react';

interface Birthday {
  id: number;
  name: string;
  date: Date;
  editing?: boolean;
  checked?: boolean;
}

function Birthdays() {
  const [checked, setChecked] = useState<boolean>(false);
  const [birthdays, setBirthdays] = useState<Birthday[]>([
    {
      id: 0,
      name: 'Daniel Coats',
      date: new Date(1996, 7, 2),
    },
    {
      id: 1,
      name: 'Marina HV',
      date: new Date(1994, 11, 19),
    },
  ]);

  function addOrUpdateBirthday(name: string, date: Date, id?: number) {
    if (id === undefined) {
      addBirthday(name, date);
    } else {
      updateBirthday(id, name, date);
    }
  }

  function addBirthday(name: string, date: Date) {
    const birthday: Birthday = {
      id:
        birthdays.reduce(
          (prev, curr) => Math.max(prev, curr.id),
          Number.MIN_VALUE,
        ) + 1,
      name,
      date,
    };

    setBirthdays([...birthdays, birthday]);
  }

  function updateBirthday(id: number, name: string, date: Date) {
    setBirthdays(
      birthdays.map((birthday) =>
        birthday.id === id
          ? {
              ...birthday,
              name,
              date,
              editing: false,
            }
          : birthday,
      ),
    );
  }

  function deleteBirthday(id: number) {
    setBirthdays(birthdays.filter((birthday) => birthday.id !== id));
  }

  function toggleEditing(id: number) {
    setBirthdays(
      birthdays.map((birthday) =>
        birthday.id === id
          ? {
              ...birthday,
              editing: !birthday.editing,
            }
          : birthday,
      ),
    );
  }

  function toggleAllChecked() {
    setChecked(!checked);
    setBirthdays(
      birthdays.map((birthday) => {
        return {
          ...birthday,
          checked: !checked,
        };
      }),
    );
  }

  function toggleChecked(id: number) {
    setBirthdays(
      birthdays.map((birthday) =>
        birthday.id === id
          ? {
              ...birthday,
              checked: !birthday.checked,
            }
          : birthday,
      ),
    );
  }

  function showDeleteButton() {
    return (
      birthdays.reduce((prev, curr) => prev + (curr.checked ? 1 : 0), 0) > 0
    );
  }

  function deleteChecked() {
    setBirthdays(birthdays.filter((birthday) => !birthday.checked));
  }

  return (
    <>
      <table className="birthdays-table">
        <thead>
          <tr>
            <th>
              <input type="checkbox" onClick={toggleAllChecked} />
            </th>
            <th>Name</th>
            <th>Birthday</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {birthdays.map((birthday) => (
            <BirthdayTableRow
              key={birthday.id}
              birthday={birthday}
              addOrUpdateBirthday={addOrUpdateBirthday}
              deleteBirthday={() => deleteBirthday(birthday.id)}
              toggleEditing={() => toggleEditing(birthday.id)}
              toggleChecked={() => toggleChecked(birthday.id)}
            />
          ))}
          <EditBirthdayTableRow addOrUpdateBirthday={addOrUpdateBirthday} />
        </tbody>
      </table>
      {showDeleteButton() && (
        <button type="submit" onClick={deleteChecked}>
          Delete
        </button>
      )}
    </>
  );
}

interface BirthdayTableRowProps {
  birthday: Birthday;
  addOrUpdateBirthday: (name: string, date: Date, id?: number) => void;
  deleteBirthday: () => void;
  toggleEditing: () => void;
  toggleChecked: () => void;
}

function BirthdayTableRow({
  birthday,
  addOrUpdateBirthday,
  deleteBirthday,
  toggleEditing,
  toggleChecked,
}: BirthdayTableRowProps) {
  return birthday.editing ? (
    <EditBirthdayTableRow
      birthday={birthday}
      addOrUpdateBirthday={addOrUpdateBirthday}
      toggleEditing={toggleEditing}
    />
  ) : (
    <ViewBirthdayTableRow
      birthday={birthday}
      toggleEditing={toggleEditing}
      toggleChecked={toggleChecked}
      deleteBirthday={deleteBirthday}
    />
  );
}

interface ViewBirthdayTableRowProps {
  birthday: Birthday;
  toggleEditing: () => void;
  toggleChecked: () => void;
  deleteBirthday: () => void;
}

function ViewBirthdayTableRow({
  birthday,
  toggleEditing,
  toggleChecked,
  deleteBirthday,
}: ViewBirthdayTableRowProps) {
  function getNextBirthday(date: Date) {
    const now = new Date(Date.now());
    const month = date.getMonth();
    const day = date.getDate();
    const isThisYear =
      month > now.getMonth() ||
      (month === now.getMonth() && day >= now.getDate());

    return new Date(now.getFullYear() + (isThisYear ? 0 : 1), month, day);
  }

  function daysUntil(date: Date) {
    const now = new Date(Date.now());
    return Math.floor((date.getTime() - now.getTime()) / (1000 * 3600 * 24));
  }

  const nextBirthday = getNextBirthday(birthday.date);

  return (
    <tr>
      <td>
        <input
          type="checkbox"
          checked={birthday.checked}
          onChange={toggleChecked}
        />
      </td>
      <td>{birthday.name}</td>
      <td>
        {birthday.date.toLocaleDateString()} ({daysUntil(nextBirthday)} days)
      </td>
      <td>
        <button type="submit" onClick={() => toggleEditing()}>
          Edit
        </button>
        <button type="submit" onClick={() => deleteBirthday()}>
          Delete
        </button>
      </td>
    </tr>
  );
}

interface EditBirthdayTableRowProps {
  birthday?: Birthday;
  toggleEditing?: () => void;
  addOrUpdateBirthday: (name: string, date: Date, id?: number) => void;
}

function EditBirthdayTableRow({
  birthday,
  toggleEditing,
  addOrUpdateBirthday: addBirthday,
}: EditBirthdayTableRowProps) {
  const DEFAULT_DAY = 1;
  const DEFAULT_YEAR = 2000;
  const DEFAULT_MONTH = 0;

  const editing = birthday === undefined;

  const [name, setName] = useState<string | undefined>(birthday?.name);

  const [day, setDay] = useState<number>(
    birthday?.date.getDate() || DEFAULT_DAY,
  );

  const [month, setMonth] = useState<number>(
    birthday?.date.getMonth() || DEFAULT_MONTH,
  );

  const [year, setYear] = useState<number>(
    birthday?.date.getFullYear() || DEFAULT_YEAR,
  );

  const MONTHS = Array.from({ length: 12 }, (e, i) => {
    return new Date(0, i + 1, 0).toLocaleDateString('en', {
      month: 'short',
    });
  });

  function validateAndSubmit() {
    const date = new Date(year, month, day);

    if (name && date) {
      addBirthday(name, date, birthday?.id);
      clearForm();
    }
  }

  function clearForm() {
    setName('');
    setMonth(DEFAULT_MONTH);
    setDay(DEFAULT_DAY);
    setYear(DEFAULT_YEAR);
  }

  return (
    <tr>
      <td></td>
      <td>
        <input
          type="text"
          name="name"
          placeholder="Alex Smith"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </td>
      <td>
        <input
          min="1"
          max="31"
          className="datePart"
          type="number"
          placeholder=""
          value={day}
          onChange={(e) => setDay(parseInt(e.target.value))}
        />
        <span className="dateSeparator">/</span>
        <select
          value={month}
          onChange={(e) => setMonth(parseInt(e.target.value))}>
          {MONTHS.map((curr, i) => (
            <option key={i} value={i}>
              {curr}
            </option>
          ))}
        </select>
        <span className="dateSeparator">/</span>
        <input
          min="1900"
          max={new Date().getFullYear()}
          className="datePart datePartYear"
          type="number"
          placeholder=""
          value={year}
          onChange={(e) => setYear(parseInt(e.target.value))}
        />
      </td>
      <td>
        <button type="submit" onClick={() => validateAndSubmit()}>
          {editing ? 'Add' : 'Save'}
        </button>
        {editing ? (
          <button type="submit" onClick={clearForm}>
            Clear
          </button>
        ) : (
          <button type="submit" onClick={toggleEditing}>
            Cancel
          </button>
        )}
      </td>
    </tr>
  );
}

function App() {
  return (
    <Router>
      <div className="app">
        <header className="app-header">
          <h1>
            <Link to="/">Belatedly</Link>
          </h1>
          <nav className="main-nav">
            <ul>
              <li>
                <Link to="/about">About</Link>
              </li>
              <li>
                <a href="#">Sign in</a>
              </li>
            </ul>
          </nav>
        </header>
        <Switch>
          <Route exact path="/">
            <Home />
          </Route>
          <Route path="/about">
            <About />
          </Route>
        </Switch>
      </div>
    </Router>
  );
}

function Home() {
  return (
    <main>
      <Birthdays />
    </main>
  );
}

function About() {
  return (
    <main>
      <h1>About</h1>
      <p>
        Belatedly is a simple app that helps you remember important dates such
        as birthdays and anniversaries.
      </p>
    </main>
  );
}

export default App;
