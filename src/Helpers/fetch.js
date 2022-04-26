import HandleResponse from './handleResponse';

const Fetch = (url, body) => {
    return fetch( url, {
        method : 'GET',
        mode: 'cors', // no-cors, *cors, same-origin
        cache: 'default', // *default, no-cache, reload, force-cache, only-if-cached
        credentials: 'same-origin', // include, *same-origin, omit
        headers: {'Content-Type': 'application/json'},
        // body: JSON.stringify(body),
        redirect: 'follow', // manual, *follow, error
        referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
    }).then(HandleResponse)
    .catch( Err => {
        console.error(Err);
        return Err;
    });
}
export default Fetch;