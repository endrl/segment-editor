export function useTauri() {

  /**
   * Hide Tauri splashscreen
   */
  const hide_splashscreen = async () => {
    if ('__TAURI__' in window) {
      const { invoke } = await import('@tauri-apps/api/core')
      invoke('close_splashscreen')
    }
  }

  return { hide_splashscreen }
}



