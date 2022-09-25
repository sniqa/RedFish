export const faildRes = (errmsg: string) => ({
	state: false,
	errmsg,
})

export const trueRes = (data: any) => ({ state: true, data })
