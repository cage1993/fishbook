use serde::{Deserialize, Serialize};
use std::collections::HashSet;
use std::str::FromStr;
use std::sync::Mutex;
use tauri::{AppHandle, Emitter, Manager};
use tauri_plugin_global_shortcut::{GlobalShortcutExt, Shortcut, ShortcutEvent, ShortcutState};

#[derive(Clone, Copy, Deserialize, PartialEq)]
#[serde(rename_all = "lowercase")]
enum MiniReaderAction {
    Toggle,
    Previous,
    Next,
}

#[derive(Deserialize)]
pub struct ShortcutBinding {
    action: MiniReaderAction,
    shortcut: String,
}

struct RegisteredShortcut {
    action: MiniReaderAction,
    shortcut: Shortcut,
}

#[derive(Default)]
struct MiniReaderState {
    registered: Vec<RegisteredShortcut>,
}

static SHORTCUT_UPDATE_LOCK: Mutex<()> = Mutex::new(());

#[derive(Serialize)]
pub struct ShortcutFailure {
    shortcut: String,
    message: String,
}

fn default_bindings() -> Vec<ShortcutBinding> {
    [
        (MiniReaderAction::Toggle, "alt+v"),
        (MiniReaderAction::Toggle, "alt+shift+v"),
        (MiniReaderAction::Previous, "alt+z"),
        (MiniReaderAction::Next, "alt+c"),
    ]
    .into_iter()
    .map(|(action, shortcut)| ShortcutBinding {
        action,
        shortcut: shortcut.to_string(),
    })
    .collect()
}

fn prepare_bindings(
    bindings: Vec<ShortcutBinding>,
) -> (Vec<(MiniReaderAction, Shortcut)>, Vec<ShortcutFailure>) {
    let mut seen = HashSet::new();
    let mut prepared = Vec::new();
    let mut failures = Vec::new();
    for binding in bindings {
        match Shortcut::from_str(&binding.shortcut) {
            Ok(shortcut) if seen.insert(shortcut) => prepared.push((binding.action, shortcut)),
            Ok(_) => failures.push(ShortcutFailure {
                shortcut: binding.shortcut,
                message: "Shortcut is assigned more than once".to_string(),
            }),
            Err(error) => failures.push(ShortcutFailure {
                shortcut: binding.shortcut,
                message: error.to_string(),
            }),
        }
    }
    (prepared, failures)
}

fn register_bindings(app: &AppHandle, bindings: Vec<ShortcutBinding>) -> Vec<ShortcutFailure> {
    let _update_guard = SHORTCUT_UPDATE_LOCK.lock().unwrap();
    let (prepared, mut failures) = prepare_bindings(bindings);
    let manager = app.global_shortcut();
    let previous = {
        let state = app.state::<Mutex<MiniReaderState>>();
        let mut state = state.lock().unwrap();
        state.registered.drain(..).collect::<Vec<_>>()
    };
    for binding in previous {
        let _ = manager.unregister(binding.shortcut);
    }
    let mut registered = Vec::new();
    for (action, shortcut) in prepared {
        match manager.register(shortcut) {
            Ok(()) => registered.push(RegisteredShortcut { action, shortcut }),
            Err(error) => {
                log::warn!("failed to register mini reader shortcut {shortcut}: {error}");
                failures.push(ShortcutFailure {
                    shortcut: shortcut.to_string(),
                    message: error.to_string(),
                });
            }
        }
    }
    app.state::<Mutex<MiniReaderState>>()
        .lock()
        .unwrap()
        .registered = registered;
    failures
}

pub fn init(app: &AppHandle) -> tauri::Result<()> {
    app.manage(Mutex::<MiniReaderState>::default());
    app.plugin(
        tauri_plugin_global_shortcut::Builder::new()
            .with_handler(handle_shortcut)
            .build(),
    )?;
    register_bindings(app, default_bindings());
    Ok(())
}

pub fn handle_shortcut(app: &AppHandle, shortcut: &Shortcut, event: ShortcutEvent) {
    if event.state != ShortcutState::Pressed {
        return;
    }
    let action = app
        .state::<Mutex<MiniReaderState>>()
        .lock()
        .unwrap()
        .registered
        .iter()
        .find(|binding| binding.shortcut == *shortcut)
        .map(|binding| binding.action);
    let Some(action) = action else {
        return;
    };
    let Some(window) = app.get_webview_window("reader-mini") else {
        return;
    };
    match action {
        MiniReaderAction::Toggle => {
            if window.is_visible().unwrap_or(false) {
                let _ = window.hide();
            } else {
                let _ = window.show();
                let _ = window.set_focus();
            }
        }
        MiniReaderAction::Previous | MiniReaderAction::Next
            if window.is_visible().unwrap_or(false) =>
        {
            let action = if action == MiniReaderAction::Previous {
                "previous"
            } else {
                "next"
            };
            let _ = window.emit("mini-reader-page-turn", action);
        }
        _ => {}
    }
}

#[tauri::command]
pub async fn configure_mini_reader_shortcuts(
    app: AppHandle,
    bindings: Vec<ShortcutBinding>,
) -> Result<Vec<ShortcutFailure>, String> {
    tauri::async_runtime::spawn_blocking(move || register_bindings(&app, bindings))
        .await
        .map_err(|error| error.to_string())
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn default_shortcuts_keep_the_alternative_boss_key() {
        let (bindings, failures) = prepare_bindings(default_bindings());
        assert!(failures.is_empty());
        assert_eq!(bindings.len(), 4);
        assert!(bindings.iter().any(|(action, shortcut)| {
            *action == MiniReaderAction::Toggle
                && *shortcut == Shortcut::from_str("alt+shift+v").unwrap()
        }));
    }

    #[test]
    fn duplicate_shortcuts_do_not_replace_an_existing_action() {
        let (bindings, failures) = prepare_bindings(vec![
            ShortcutBinding {
                action: MiniReaderAction::Toggle,
                shortcut: "alt+v".to_string(),
            },
            ShortcutBinding {
                action: MiniReaderAction::Next,
                shortcut: "alt+v".to_string(),
            },
        ]);
        assert_eq!(bindings.len(), 1);
        assert_eq!(failures.len(), 1);
    }

    #[test]
    fn an_invalid_shortcut_does_not_reject_valid_bindings() {
        let (bindings, failures) = prepare_bindings(vec![
            ShortcutBinding {
                action: MiniReaderAction::Toggle,
                shortcut: "not-a-key".to_string(),
            },
            ShortcutBinding {
                action: MiniReaderAction::Next,
                shortcut: "alt+c".to_string(),
            },
        ]);
        assert_eq!(bindings.len(), 1);
        assert_eq!(failures.len(), 1);
    }
}
