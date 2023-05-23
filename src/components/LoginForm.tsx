'use client';

import { FormEvent, useState } from 'react';

const LoginForm = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  async function handleLogin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const res = await fetch('http://localhost:3000/api/login', {
      method: 'POST',
      headers: { 'Content-type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });

    const result = await res.json();
    console.log(result);
  }

  return (
    <form
      className='relative flex w-1/2 flex-col items-center justify-evenly gap-8 rounded-2xl border border-solid border-red-100  px-20 py-12 text-xl shadow-md dark:border-slate-900 dark:shadow-slate-900'
      onSubmit={handleLogin}
    >
      <h1 className='text-4xl font-bold'>Sign In</h1>
      <fieldset className='group relative flex w-full flex-col'>
        <label
          htmlFor='username'
          className={`pointer-events-none absolute left-4 top-2 border-zinc-800 bg-zinc-200 px-2 group-focus-within:-translate-x-1 group-focus-within:-translate-y-5 group-focus-within:text-base dark:bg-inherit dark:text-white dark:group-focus-within:bg-black
          ${username && '-translate-x-1 -translate-y-5 text-base'}`}
        >
          Username
        </label>
        <input
          name='username'
          id='username'
          type='text'
          required
          value={username}
          onChange={event => setUsername(event.target.value)}
          className='rounded-md border border-solid border-zinc-800 bg-zinc-200 px-4 py-2 focus:outline-zinc-800 dark:bg-inherit'
        />
      </fieldset>
      <fieldset className='group relative flex w-full flex-col'>
        <label
          htmlFor='password'
          className={`pointer-events-none absolute left-4 top-2 border-zinc-800 bg-zinc-200 px-2 group-focus-within:-translate-x-1 group-focus-within:-translate-y-5 group-focus-within:text-base dark:bg-inherit dark:text-white dark:group-focus-within:bg-black
          ${password && '-translate-x-1 -translate-y-5 text-base'}`}
        >
          Password
        </label>
        <input
          name='password'
          id='password'
          type='password'
          required
          value={password}
          onChange={event => setPassword(event.target.value)}
          className='rounded-md border border-solid border-zinc-800 bg-zinc-200 px-4 py-2 focus:outline-zinc-800 dark:bg-inherit'
        />
      </fieldset>
      <div className='w-full'>
        <button className='mb-2 w-full rounded-lg border-2 border-gray-300 px-4 py-2 font-bold dark:border-neutral-800'>
          Sign In
        </button>
      </div>
    </form>
  );
};

export default LoginForm;
