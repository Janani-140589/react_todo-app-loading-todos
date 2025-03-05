/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useState } from 'react';
// import { UserWarning } from './UserWarning';
import { getTodos } from './api/todos';
import { Todo } from './types/Todo';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>();
  const [filteredTodos, setFilteredTodos] = useState<Todo[]>();
  const [todo] = useState('');
  const [loadError, setLoadError] = useState('');

  const [titleError] = useState('');
  const [actionError] = useState('');
  const [filter, setFilter] = useState('All');

 

  useEffect(() => {
    // setLoading(true);
    getTodos()
      .then(resolve => {
        setTodos(resolve);
        setFilteredTodos(resolve);
      })
      .catch(() => setLoadError('Unable to Load Todos'))
      .finally(() => {
        // setLoading(false);
      });

    const errorTimerId = setTimeout(() => {
      setLoadError('');
    }, 3000);

    return () => clearTimeout(errorTimerId);
  }, []);

  const isAllTodoCompleted = todos?.every(t => t.completed === true);

  const getFilteredTodos = (filterParam: string): void => {
    const todoList: Todo[] = todos || [];

    if (filterParam === 'Active') {
      setFilteredTodos(todoList.filter(t => t.completed === false));
    } else if (filterParam === 'Completed') {
      setFilteredTodos(todoList.filter(t => t.completed === true));
    } else {
      setFilteredTodos([...todoList]);
    }
  };

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          {/* this button should have `active` class only if all todos are completed */}
          <button
            type="button"
            className={
              isAllTodoCompleted
                ? 'todoapp__toggle-all active'
                : 'todoapp__toggle-all'
            }
            data-cy="ToggleAllButton"
          />

          {/* Add a todo on form submit */}
          <form>
            <input
              data-cy="NewTodoField"
              type="text"
              className="todoapp__new-todo"
              placeholder="What needs to be done?"
              value={todo}
            />
          </form>
        </header>

        <section className="todoapp__main" data-cy="TodoList">
          {filteredTodos?.map(t => (
            <div
              data-cy="Todo"
              key={t.id}
              className={t.completed ? 'todo completed' : 'todo'}
            >
              <label className="todo__status-label">
                <input
                  data-cy="TodoStatus"
                  type="checkbox"
                  className="todo__status"
                  checked={t.completed}
                />
              </label>

              <span data-cy="TodoTitle" className="todo__title">
                {t.title}
              </span>

              {/* Remove button appears only on hover */}
              <button
                type="button"
                className="todo__remove"
                data-cy="TodoDelete"
              >
                ×
              </button>

              {/* overlay will cover the todo while it is being deleted or updated */}

              <div data-cy="TodoLoader" className="modal overlay">
                <div className="modal-background has-background-white-ter" />
                <div className="loader" />
              </div>
            </div>
          ))}
        </section>

        {/* Hide the footer if there are no todos */}
        {(todos?.length || 0) > 0 && (
          <footer className="todoapp__footer" data-cy="Footer">
            <span className="todo-count" data-cy="TodosCounter">
              {todos?.filter(t => t.completed === false).length} items left
            </span>

            {/* Active link should have the 'selected' class */}
            <nav className="filter" data-cy="Filter">
              <a
                href="#/"
                className={`filter__link ${filter === 'All' ? 'selected' : ''}`}
                data-cy="FilterLinkAll"
                onClick={event => {
                  getFilteredTodos(event.currentTarget.textContent as string);
                  setFilter(event.currentTarget.textContent as string);
                }}
              >
                All
              </a>

              <a
                href="#/active"
                className={`filter__link ${filter === 'Active' ? 'selected' : ''}`}
                data-cy="FilterLinkActive"
                onClick={event => {
                  getFilteredTodos(event.currentTarget.textContent as string);
                  setFilter(event.currentTarget.textContent as string);
                }}
              >
                Active
              </a>

              <a
                href="#/completed"
                className={`filter__link ${filter === 'Completed' ? 'selected' : ''}`}
                data-cy="FilterLinkCompleted"
                onClick={event => {
                  getFilteredTodos(event.currentTarget.textContent as string);
                  setFilter(event.currentTarget.textContent as string);
                }}
              >
                Completed
              </a>
            </nav>

            {/* this button should be disabled if there are no completed todos */}
            <button
              type="button"
              className="todoapp__clear-completed"
              data-cy="ClearCompletedButton"
              disabled={todos?.every(t => t.completed === false)}
            >
              Clear completed
            </button>
          </footer>
        )}
      </div>

      {/* DON'T use conditional rendering to hide the notification */}
      {/* Add the 'hidden' class to hide the message smoothly */}
      <div
        data-cy="ErrorNotification"
        className={`notification is-danger is-light has-text-weight-normal ${loadError || titleError || actionError ? ' ' : 'hidden'}`}
      >
        <button data-cy="HideErrorButton" type="button" className="delete" />
        {/* show only one message at a time */}
        {loadError && 'Unable to load todos'}
        <br />
        {titleError && 'Title should not be empty'}
        <br />
        {actionError === 'Add' ? 'Unable to add a todo' : ''}
        <br />
        {actionError === 'delete' ? 'Unable to delete a todo' : ''}
        <br />
        {actionError === 'update' ? 'Unable to update a todo' : ''}
      </div>
    </div>
  );
};
