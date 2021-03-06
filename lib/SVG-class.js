document.addEventListener("DOMContentLoaded", function () {
    //attribute name
    const ATTR_NAME = "data-src";
    //base64 encoded brocken image icon
    const ERROR_PLACEHOLDER =
        "<img src='data:image/gif;base64,R0lGODlhEQATAPcAAFKyOVGxOlOxPFSyPFSzPFSyPVSyPlWyPlWyP16kTViyRFmzRVm0RV+1T2GlUGKmUWG2U2K0VGO2V2e6UmW3Wm27X3C/XWyrYHKsaXW7ZHqwbHe7dnTAYnfBcH3EcISGhIWGhIWGhYeFh4aGhoeGh4aIhY6NjpORlJOSlJSSlJSSlZWTlZiYl5qYmpuZm5ubnp6cn5+dn4SqgIqqi56eoaGfoaGhoaKho6Kio6Oio6OhpKKipKShpKSjpKSipaSjpaajpqSlqqilqKmoqaysrL+/v4TEhY/DnpLEpJTEp5vLqaXGsaDJta3FvaXKvafKv7zhs8HjuMHjucfmv8bnv6jLwrDNz7zbyrXP17bO27jP3b3V373R5MfHyMnIycrJy8rKys3MzcTL38LP3MfO3cvR3tTW09DQ1NXV19TU2dDU39jY2dra29nd2N3d397e38rlx9jr2sfQ4cjQ4czT4crT58/X58HT6cLT6sTU6MPR7cPT7MPT7cTT78vV6dba49Tc7MXT8MXT8cbU8cbU8sfU8sbV8sfV8sfU88jW8snX88rY88vY88zZ8svY9MzZ9Mza9M3a9c3b9c7b9c3b9s7b9s/c9tDc8tPe9dPf9tDd+NHe+NPf+NLf+dvg6tvi8dXh+Nbi+Nbi+dfi+djj+drk+eDg4OHg4OHh5+Xl5uLi6Orq6uzs7OTn8eXp8ers9OHq++Tr+uXs+Obs++ft++fu++Tr/OTs/OXs/Ofu/enu+eju++jv++jv/enw/O3y/fT09Pb79PP3//r6+vr6+/v9+/r7/Pn7/vv8/vz8/Pz8/f3//P7//fz9/v79//3+//7+//7//////wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACH5BAAAAAAALAAAAAARABMAAAj+AGsAEUKwIEEeLdwQk8YwxxlVqCJKVJXGBZE3yhr+6YULly1bt3Dl8gTDS5c1GXHQIcVpVC1epVraobHKFBg2xnDI6cQp1jNpu0BtqvMizKkiQ9DoFDUrGkNptDT5CaLjh48YKXT6Ooasa7NYjy59auXqVZoVOkFlWrt2kiNLoUqVgqVmxQ45lQwZOsT3UCJFixgx4kTmxF1KgxIPIsRY8SBJgL7clZSYECI+d/YUIjRIEKZf0u5GGtSHixUnTJ5gwROokSyGdyHp0ZIkggIGDTZUyaMLWjJgsbMggYBgQIEDCyrEcSYtVQ8cc7YckXCggAEDAiZMCSZNWBkUN8ZKKKEw4LqBABakFJMG54oYFTaWdABAoH4ADlCkLaPiwUgTFCzIcIEDBD6QQRTSDNOGBglgMIMJIowQwgcUlmAGM9KwksKEIZAgQkAAOw==' >";
    let target = document.querySelectorAll(`[${ATTR_NAME}]`);
    //unsorted list
    let _filesList = [];
    target.forEach(function (item) {
        _filesList.push(item.getAttribute(ATTR_NAME).replace(/\\/g, "/"));
    });
    //sorted list
    let filesList = _filesList.filter(function (item, pos) {
        return _filesList.indexOf(item) == pos;
    });
    //ajax request
    filesList.forEach(function (item) {
        let ajax = new XMLHttpRequest();
        ajax.open("GET", item, true);

        ajax.onload = function () {
            document.querySelectorAll(`[${ATTR_NAME}="${item}"]`).forEach(item => {
                if (this.status >= 200 && this.status < 400) {
                    // Success!
                    item.innerHTML = this.response;
                } else {
                    // Error!
                    item.innerHTML = ERROR_PLACEHOLDER;
                }
            });
        };

        ajax.send();
    });
});