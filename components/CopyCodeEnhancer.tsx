'use client'

import { useEffect } from 'react'

export default function CopyCodeEnhancer() {
  useEffect(() => {
    const pres = Array.from(document.querySelectorAll<HTMLPreElement>('.prose-blog pre'))
    pres.forEach(pre => {
      if (pre.dataset.copyInit) return
      pre.dataset.copyInit = '1'

      const btn = document.createElement('button')
      btn.className    = 'copy-code-btn'
      btn.textContent  = 'Copy'
      btn.ariaLabel    = 'Copy code to clipboard'

      btn.addEventListener('click', () => {
        const code = pre.querySelector('code')
        if (!code) return
        navigator.clipboard.writeText(code.innerText).then(() => {
          btn.textContent = 'Copied!'
          btn.classList.add('copied')
          setTimeout(() => {
            btn.textContent = 'Copy'
            btn.classList.remove('copied')
          }, 2000)
        })
      })

      pre.appendChild(btn)
    })
  }, [])

  return null
}
