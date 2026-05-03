function triggerBlobDownload(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}

/**
 * On devices with Web Share API support (e.g. iOS), opens the native share sheet
 * so the user can save to the gallery or share anywhere. Falls back to a direct
 * download anchor on desktop and unsupported browsers.
 */
export async function shareOrDownloadBlob(blob: Blob, filename: string): Promise<void> {
  const file = new File([blob], filename, { type: blob.type })
  if (navigator.canShare?.({ files: [file] })) {
    try {
      await navigator.share({ files: [file] })
      return
    } catch (err) {
      // AbortError = user dismissed the sheet — not an error worth falling back from
      if ((err as Error).name === 'AbortError') {
        return
      }
    }
  }
  triggerBlobDownload(blob, filename)
}
