export const APPLICATION_STATUS_KEY = [
	'sent',
	'reply',
	'interview',
	'ghosting',
	'offering',
] as const

export const APPLICATION_STATUS: Record<
	(typeof APPLICATION_STATUS_KEY)[number],
	string
> = {
	sent: 'Terkirim',
	offering: 'Offering',
	ghosting: 'Ghosting',
	interview: 'Interview',
	reply: 'Dibalas',
}

export const LIMIT = 10
export const SORT = 'created_at'
export type OrderQuery = 'ASC' | 'DESC'
export const ORDER: OrderQuery = 'DESC'
