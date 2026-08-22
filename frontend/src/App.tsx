import ErrorComponent from './error'
import { IndexPage } from '.'
import { AddPage } from './add'
import { EditPage } from './edit'
import { getRoute, validateRoute } from './router'
import './css/general.css'

function Header({ route }: { route: string }) {
  return (
  <header>
      <a className="branding" href="/">ProgressTracker</a>
      <nav className="navigation-bar">
        <a className={`nav-link ${ route === '' ? 'active' : '' }`} href="/">
              Home
          </a>
          <a className={`nav-link ${ route === 'add' ? 'active' : '' }`} href="#/add">
              Add
          </a>
      </nav>
  </header>
  )
}

export function LoadingComponent() {
  return (
    <p className="loading-component">Loading...</p>
  )
}

function App() {
  const { segments, params } = getRoute()
  const [route] = segments
  const is_valid_route = validateRoute(route);
  if (!is_valid_route) {
    return (
      <>
        <Header route={ "" } />
        <main className="content">
          <ErrorComponent error={`Route ${window.location.href} does not exist.`} code={404} />
        </main>
      </>
    )
  }
  return (
    <>
      <Header route={ route } />
      <main className="content">
        { route === "" && <IndexPage /> }
        { route === "add" && <AddPage /> }
        {route === "edit" && <EditPage id={segments[1] ? segments[1] : "" } /> }
      </main>
    </>
  )
}

export default App
