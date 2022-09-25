import { faildRes, trueRes } from '../utils/response.ts'
import { Res } from './fetch.ts'

const path = `redfish/v1/SessionService/Sessions`

const headers: HeadersInit = new Headers()

headers.append('Content-Type', 'application/json')

interface UserInfo {
	UserName: string
	Password: string
}

const requestInit = (user: UserInfo): RequestInit => ({
	method: 'POST',
	headers,
	body: JSON.stringify(user),
})

export const get_auth_value = async (
	ip: string,
	user: UserInfo
): Promise<Res> => {
	console.log(`正在抓取${ip}的资料...`)

	const url = `https://${ip}/${path}`

	console.log(user)

	const auth_value = await fetch(url, requestInit(user))
		.then((res) => res.headers.get('X-Auth-Token') || '')
		.catch(() => '')

	return auth_value === '' ? faildRes(`获取AuthValue失败`) : trueRes(auth_value)
}
