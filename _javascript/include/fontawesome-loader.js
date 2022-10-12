export const fontAwesomeLoad = () => {
    const path = "https://maxcdn.bootstrapcdn.com/font-awesome/4.7.0/",
        key = btoa(path),
        saveCache = (data) => localStorage.setItem(key, data),
        getCache = () => localStorage.getItem(key),
        insertStyle = (css) => {
            if (document.getElementById(key)) {
                return;
            }
            const style = document.createElement("style");
            style.id = key;
            style.type = "text/css";
            style.textContent = css;
            document.body.appendChild(style);
        },
        prepareStyle = (css) =>
            css
                .replaceAll("font-style:normal", "font-style:normal;font-display:swap;")
                .replaceAll("../fonts/", `${path}fonts/`),
        load = (data) => {
            const style = prepareStyle(data);
            saveCache(style);
            insertStyle(style);
        };

    let fontData = getCache();
    if (fontData) {
        insertStyle(fontData);
        return;
    }

    fetch(`${path}css/font-awesome.min.css`)
        .then((response) => response.text())
        .then((data) => load(data));
};
