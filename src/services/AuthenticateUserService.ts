/**
 * receber code (string)
 * recuperar o access_token no github
 * recuperar infos do user no github
 * verificar se o usuario exist no DB
 * ----SIM = gera um token
 * ----NÃO = cria no DB, gera um token
 * retornar o token com as infos do user 
 */

import axios from 'axios';

//interface para pegar o access_token
interface IAccessTokenResponse {
    access_token: string
}

//interface para pegar dados do usuário logado
interface IUserResponse {
    avatar_url: string,
    login: string,
    id: number,
    name: string
}

class AuthenticateUserService{
    async execute(code: string){
        const url = "https://github.com/login/oauth/access_token";

        const {data: accessTokenResponse} = await axios.post<IAccessTokenResponse>(url, null, {
            params: {
                client_id: process.env.GITHUB_CLIENT_ID,
                client_secret: process.env.GITHUB_CLIENT_SECRET,
                code
            },
            headers: {
                "Accept": "application/json"
            }
        });

        //pega as infos do user que está logado no github
        const response = await axios.get<IUserResponse>("https://api.github.com/user", {
            headers: {
                //tipo bearer e o token
                authorization: `Bearer ${accessTokenResponse.access_token}`
            }
        });

        return response.data;
    }
}

export {AuthenticateUserService}