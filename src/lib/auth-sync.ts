let pending = typeof window !== 'undefined' && window.parent !== window

export function isAuthSyncPending() {
  return pending
}

export function markAuthSyncDone() {
  pending = false
}
