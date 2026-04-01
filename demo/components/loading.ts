const LOADING_CLASS = 'loading-spinner'

export function showLoading(container: HTMLElement) {
  const spinner = document.createElement('div')
  spinner.className = LOADING_CLASS
  spinner.innerHTML = '<span class="spinner-note">&#9835;</span><span class="spinner-text">Loading...</span>'
  container.appendChild(spinner)
}

export function hideLoading(container: HTMLElement) {
  const spinner = container.querySelector(`.${LOADING_CLASS}`)
  if (spinner) spinner.remove()
}
