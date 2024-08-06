export const fetchApi = async (url: string, method: string, body: any, jwt : string, redictHook ?: any) => {

    try {

        const response = await fetch(process.env.EXPO_PUBLIC_API_URL + url, {
            method,
            headers: {
                'Content-Type': 'application/json',
                "Authorization": `Bearer ${jwt}`,
            },
            body: method === "post" && JSON.stringify(body),
        });
        const data = await response.json();
        if (data.message === "Unauthorized") {
            redictToAuth(redictHook);
        }
        return data;
    } catch (error) {
        console.log(error);
    }


};

const redictToAuth = (hook : any) => {
    hook.replace("auth");
}