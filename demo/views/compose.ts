export function composeView(container: HTMLElement) {
  const wrapper = document.createElement('div')
  wrapper.className = 'view-compose'

  wrapper.innerHTML = `
    <div class="view-header">
      <h2 class="view-title">&#9998; COMPOSE</h2>
    </div>
    <div class="wood-panel compose-placeholder">
      <div class="panel-content" style="text-align: center; padding: 3rem 1rem;">
        <p class="compose-icon" style="font-size: 2rem; margin-bottom: 1rem;">&#9835;</p>
        <p class="help-text" style="font-size: 0.7rem; line-height: 1.8;">
          Coming in Phase 3<br/>
          AI-powered composition from text prompts
        </p>
      </div>
    </div>
  `

  container.appendChild(wrapper)
}
