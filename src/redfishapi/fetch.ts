import { faildRes, trueRes } from '../utils/response.ts'

export interface Res<T = any> {
	state: boolean
	errmsg?: string
	data?: T
}

export const postData = async (
	input: string | URL | Request,
	init?: RequestInit | undefined
): Promise<Res> => {
	const result = await fetch(input, init).catch(() => ({ ok: false }))

	if (result.ok) {
		return (result as Response).json().then((result) => trueRes(result))
	}

	return faildRes(`网络请求失败`)
}
