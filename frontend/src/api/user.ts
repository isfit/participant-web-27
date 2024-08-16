import axios from 'axios';


export const register = async (fullName: string, email: string, password: string) => {
    let data = JSON.stringify({
        "fullName": fullName,
        "email": email,
        "password": password,
    });
    let config = {
        method: 'post',
        maxBodyLength: Infinity,
        url: 'http://localhost:4000/auth/register',
        headers: {
            'Content-Type': 'application/json'
        },
        data: data
    };

    axios.request(config)
        .then((response) => {
            console.log(JSON.stringify(response.data));
        })
        .catch((error) => {
            console.log(error);
        });
}
