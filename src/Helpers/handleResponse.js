/**
 * Checks the response, throwing rejections if error occured.
 * @param {*} response 
 */
const HandleResponse = (Response) => {
    return Response.text().then(Text => {
        const Data = Text && JSON.parse(Text);
        // console.log("handle", Data, Response);
        if (!Response.ok) {
            const error = (Data) || Response.statusText;
            console.error(error);
            return Promise.reject(error);
        }
        return Data;
    });
}

export default HandleResponse;