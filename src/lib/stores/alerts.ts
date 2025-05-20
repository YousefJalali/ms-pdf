import { v4 as uuidv4 } from 'uuid'
import { get, writable } from 'svelte/store'
import type { Alert, Icon } from '$lib/types'

function handleAlerts() {
	const { subscribe, set, update } = writable<Alert[]>([])

	function add(Icon: Icon, title: string, message: string) {
		let allAlerts = [...get(alerts)]

		if (allAlerts.length >= 3) allAlerts.shift()

		let id = uuidv4()

		allAlerts.push({
			id,
			Icon,
			title,
			message
		})

		set(allAlerts)

		return setTimeout(() => {
			clear(id)
		}, 3000)
	}

	function clear(id: string) {
		update((alerts) => alerts.filter((alert) => alert.id !== id))
	}

	return {
		subscribe,
		add,
		clear
	}
}

export const alerts = handleAlerts()
