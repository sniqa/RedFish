import { postData } from './fetch.ts'

const headers = new Headers()

headers.append('Content-Type', 'application/json')

export const get_info = async (authValue: string, url: string) => {
	headers.append('X-Auth-Token', authValue)

	return await postData(url, {
		method: 'GET',
		headers,
	})
}
