export function loadXml(url) {

    return new Promise((resolve, reject) => {
        const xhttp = new XMLHttpRequest();
        xhttp.open("GET", url);
        xhttp.onload = () => resolve(xhttp.responseXML);
        xhttp.onerror = () => reject(xhttp.statusText);
        xhttp.send();
    });
};

