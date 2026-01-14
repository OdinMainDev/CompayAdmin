export default function AuthPage() {
  return (
    <main>
      <h1>Sign in</h1>
      <form onSubmit={(event) => event.preventDefault()}>
        <label htmlFor="email">Email</label>
        <input id="email" name="email" type="email" autoComplete="email" />
        <label htmlFor="password">Password</label>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
        />
        <button type="submit">Sign in</button>
      </form>
    </main>
  )
}
