/* eslint-disable */
// This file was generated by [tauri-specta](https://github.com/oscartbeaumont/tauri-specta). Do not edit this file manually.

declare global {
    interface Window {
        __TAURI_INVOKE__<T>(cmd: string, args?: Record<string, unknown>): Promise<T>;
    }
}

// Function avoids 'window not defined' in SSR
const invoke = () => window.__TAURI_INVOKE__;

/**
 * 定义一个包装器函数来处理异步调用
 */
export function wrapGetSessionList(start: number, end: number) {
    return invoke()<Session[]>("wrap_get_session_list", { start,end })
}

export function wrapNewSession(data: Session) {
    return invoke()<Session>("wrap_new_session", { data })
}

export function wrapDeleteSession(id: string) {
    return invoke()<Session>("wrap_delete_session", { id })
}

export function wrapUpdateSession(data: Session) {
    return invoke()<Session>("wrap_update_session", { data })
}

export function wrapGetSessionDataById(id: string) {
    return invoke()<SessionData[]>("wrap_get_session_data_by_id", { id })
}

export function wrapSaveSessionData(sessionId: string, data: SessionData) {
    return invoke()<SessionData>("wrap_save_session_data", { sessionId,data })
}

export function wrapUpdateSessionData(data: SessionData) {
    return invoke()<SessionData>("wrap_update_session_data", { data })
}

export function wrapGetAppConfig() {
    return invoke()<Settings>("wrap_get_app_config")
}

export function wrapUpdateAppConfig(config: Settings) {
    return invoke()<null>("wrap_update_app_config", { config })
}

export function wrapGetSettings(key: string) {
    return invoke()<Settings | null>("wrap_get_settings", { key })
}

export function wrapSetSettings(key: string, value: string) {
    return invoke()<null>("wrap_set_settings", { key,value })
}

/**
 * 定义一个包装器函数来处理异步调用
 */
export function wrapGetPromptList(start: number, end: number) {
    return invoke()<Prompt[]>("wrap_get_prompt_list", { start,end })
}

export function wrapUpdatePrompt(data: Prompt) {
    return invoke()<Prompt>("wrap_update_prompt", { data })
}

export function wrapNewPrompt() {
    return invoke()<Prompt>("wrap_new_prompt")
}

export function wrapDeletePrompt(id: number) {
    return invoke()<Prompt>("wrap_delete_prompt", { id })
}

export type Settings = { id: number; key: string; value: string; created_at: string; updated_at: string }
export type SessionData = { id: number; session_id: string; role: string; message: string; message_type: string; created_at: string; updated_at: string }
export type Prompt = { id: number; title: string; desc: string; system: string; favorite: boolean; actived: boolean; with_context: boolean; with_context_size: number; max_tokens: number; top_p: string; temperature: string; opts: string; prehandle_script: string; labels: string; created_at: string; updated_at: string }
export type Session = { id: string; title: string; prompt_id: number; with_context: boolean; with_context_size: number; session_model: string; created_at: string; updated_at: string }
