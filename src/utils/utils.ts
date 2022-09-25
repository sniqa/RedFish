import { get_info } from 'redfish/get_info.ts'
import { NEWLINE } from 'std/encoding/csv.ts'

const { writeTextFileSync } = Deno

interface IBMCInfo {
	ip?: string
	mac?: string
	sn?: string
	os?: string
	result_state?: string
}

const IBMC_result = ({
	ip = '',
	mac = '',
	sn = '',
	os = '',
	result_state = '',
}: IBMCInfo) => {
	return [ip, mac, sn, os, result_state]
}

// deno-lint-ignore require-await
export const getIBMCInfo = async (
	ip: string,
	username: string,
	password: string
): Promise<string[]> => {
	// 登录
	// const loginRes = await get_auth_value(ip, {
	// 	UserName: username,
	// 	Password: password,
	// })

	// if (!loginRes.state) {
	// 	return IBMC_result({ result_state: '登录失败' })
	// }

	const base_url = `http://${ip}/redfish/v1/Systems/437XR1138R2/`

	// 获取资源列表id
	const auth_value = ``
	// loginRes?.data

	// 获取
	const urls = [
		`${base_url}`, //sn
		`${base_url}EthernetInterfaces`, //网口
		// `${base_url}`
	]

	const infos = await Promise.all(urls.map((url) => get_info(auth_value, url)))

	const [sysInfo, etherInfo] = infos

	console.log('etherInfo', etherInfo)

	// 获取网口信息
	const networks = await Promise.all(
		etherInfo?.data.Members.map((member) =>
			get_info(
				auth_value,
				`http://${ip}${Reflect.get(member, '@odata.id') || ``}`
			)
		)
	)

	return IBMC_result({
		ip: networks
			.map(
				(network) =>
					`${network?.data.Name}=${network?.data.IPv4Addresses[0]?.Address}`
			)
			.join(';'),
		mac: networks
			.map((network) => `${network?.data.Name}=${network?.data.MACAddress}`)
			.join(';'),
		sn: sysInfo?.data.SystemSerialNumber,
		os: sysInfo?.data.OSVersion,
		result_state: '登录失败',
	})
}

export const get_and_write_IBMCs_info = async (infos: string[][]) => {
	let result = `业务IP,MAC,SN,OS,${NEWLINE}`

	for (const info of infos) {
		const [ip, username, password] = info

		const IBMC_info = await getIBMCInfo(ip, username, password)

		result += IBMC_info.join(',').concat(NEWLINE)
	}

	console.log('result', result)

	writeTextFileSync('./result.csv', result)
}
