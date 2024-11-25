export function useTauri() {

  /**
   * Hide Tauri splashscreen
   */
  const show_main_window = async () => {
    if (window.isTauri) {
      const { invoke } = await import('@tauri-apps/api/core')
      invoke('show_main_window')
    }
  }

  return { show_main_window }
}



