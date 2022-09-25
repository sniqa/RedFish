import { getStdin } from 'https://deno.land/x/get_stdin@v1.1.0/mod.ts'
import { parse } from 'std/encoding/csv.ts'
import { get_and_write_IBMCs_info } from 'utils/utils.ts'

const { readTextFileSync, writeTextFileSync } = Deno

interface FetchCondition {
	header: string
	url: string
	get_field?: string
}

interface Config {
	ip_start: string
	ip_end?: string
	fetch_get: FetchCondition[]
}

const startup = async () => {
	const str = `ip,用户名,密码`
	const path = `./userinfo.csv`
	// writeTextFileSync('test.csv', str)

	const userInfos = parse(readTextFileSync(path)).slice(1)

	get_and_write_IBMCs_info(userInfos)

	await getStdin()
}

// 开始
startup()

// const res = await fetch(
// 	`http://localhost:8000/redfish/v1/Systems/437XR1138R2`,
// 	{
// 		headers: {
// 			'Content-Type': 'applocarion/json',
// 		},
// 	}
// )
// 	.then((res) => res.json())
// 	.catch((err) => console.log(err))

// console.log(res)

// get_and_write_IBMCs_info([[`localhost:8000`, '', '']])
