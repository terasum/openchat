import { invoke } from '@tauri-apps/api/tauri'

export async function lookupWord(word: string) {
  try {
    const definition = await invoke('lookup_word', { word })
    return definition;
  } catch (error) {
    console.error('Error looking up word:', error)
    return 'Error looking up word:' + error
  }
}
