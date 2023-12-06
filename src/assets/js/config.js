function loadConfig(successHandler) {
    fetch("config.json")
        .then(resp => resp.json())
        .then(config => {
            const api = `${config.host ? config.host + '/': ''}${config.year ? config.year + '/' : ''}${config.group ? config.group + '/' : ''}api/`;
            successHandler(api);
        });
}

export { loadConfig };
