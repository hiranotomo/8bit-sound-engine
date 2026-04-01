import { t } from '../i18n'

export function showError(container: HTMLElement, message: string, onRetry?: () => void) {
  const el = document.createElement('div')
  el.className = 'error-panel'
  el.innerHTML = `
    <p class="error-message">${message}</p>
    ${onRetry ? `<button class="game-btn btn-battle error-retry">${t('retry')}</button>` : ''}
  `
  if (onRetry) {
    el.querySelector('.error-retry')?.addEventListener('click', onRetry)
  }
  container.appendChild(el)
}
