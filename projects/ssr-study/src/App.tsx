import {Link} from "react-router-dom";
import Spa from "./router/Spa.tsx";

// find all page
const pages = import.meta.glob('./pages/**/*.tsx', { eager: true })
console.log(pages)

const routes = Object.keys(pages).map((path) => {
  const name = path.match(/\.\/pages(.*)\/index\.tsx/)![1]
  return {
    name,
    path: name === 'home' ? '/' : name,
    component: (pages[path] as any).default as React.ComponentType,
  }
});
console.log(routes)

function App() {

  return (
      <>
        <div>
          this is app
        </div>
        <h1>Vite + React + ssr</h1>
        {/* ul列表，点击发生路由跳转 */}
        <ul>
          {routes.map(({ name, path }) => {
            return (
              <li key={path}>
                <Link to={path}>{name}</Link>
              </li>
            );
          })}
        </ul>
        <Spa />
      </>
  )
}

export default App
