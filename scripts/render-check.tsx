/** SSR-санити: рендерит ключевые страницы в строку, ловит runtime-ошибки компонентов.
 *  Запуск: npx tsx scripts/render-check.tsx */
import React from 'react'
import { renderToString } from 'react-dom/server'
import { StaticRouter } from 'react-router'
import App from '../src/App'

void React

const routes = ['/', '/search?q=Honor%20Magic%207%20Pro', '/search?q=%D0%9E%D1%81%D1%82%D0%B5%D0%BA%D0%BB%D0%B8%D1%82%D1%8C%20%D0%B1%D0%B0%D0%BB%D0%BA%D0%BE%D0%BD', '/points', '/smart-link/demo']

let ok = 0
for (const r of routes) {
  try {
    const html = renderToString(
      <StaticRouter location={r}>
        <App />
      </StaticRouter>
    )
    if (html.length < 500) throw new Error('слишком короткий вывод: ' + html.length)
    ok++
    console.log(`OK  ${r}  (${html.length} симв.)`)
  } catch (e) {
    console.error(`FAIL ${r}:`, e)
    process.exit(1)
  }
}
console.log(`\nОтрендерилось ${ok}/${routes.length} маршрутов ✓`)
