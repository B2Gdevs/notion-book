export function copyTextToClipboard(text: string) {
    // Create a temporary textarea element
    const textarea = document.createElement('textarea');
    textarea.value = text;
    document.body.appendChild(textarea);

    // Select the text and copy it
    textarea.select();

    // this is deprecated, we should use navigator.clipboard.writeText(text) instead
    // document.execCommand('copy');
    navigator.clipboard.writeText(text);

    // Remove the textarea
    document.body.removeChild(textarea);
}