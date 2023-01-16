const api = axios.create({
    baseURL: 'https://tmdb-proxy.cubos-academy.workers.dev/3/',
    timeOut: 10000,
    headers: {'content-Type': 'Application/json'}
});