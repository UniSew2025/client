import {useEffect} from "react";

export default function UniSewConsole(){

    useEffect(() => {
        const disableDevToolsShortcuts = (e) => {
            if (
                e.key === 'F12' ||
                (e.ctrlKey && e.shiftKey && e.key === 'I') || // Ctrl+Shift+I
                (e.ctrlKey && e.shiftKey && e.key === 'J') || // Ctrl+Shift+J
                (e.ctrlKey && e.shiftKey && e.key === 'C') || // Ctrl+Shift+C
                (e.metaKey && e.altKey && e.key === 'I') // Cmd+Option+I for Mac
            ) {
                e.preventDefault();
            }
        };

        const handleBlockInspect = (e) => {
            e.preventDefault()
        }

        window.addEventListener('contextmenu', handleBlockInspect);
        window.addEventListener('keydown', disableDevToolsShortcuts);

        return function cleanup() {
            window.removeEventListener('contextmenu', handleBlockInspect);
            window.removeEventListener('keydown', disableDevToolsShortcuts);
        };
    }, []);

    console.log(
        "%c   ██   ██  ██    ██  ██  ██████  ██████  ██    ██\n" +
        "   ██   ██  ████  ██  ██  ██      ██      ██    ██\n" +
        "   ██   ██  ██ ██ ██  ██  ██████  ██████  ██ ██ ██\n" +
        "   ██   ██  ██  ████  ██      ██  ██      ███  ███\n" +
        "    █████   ██    ██  ██  ██████  ██████  ██    ██\n\n" +
        "   Welcome to UniSew dev console",
        "color: lightblue; font-family: monospace; font-size: 16px; font-weight: bold;"

    );
}