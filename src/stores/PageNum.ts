import { derived, type Readable } from 'svelte/store'
import { pages } from './pages'

type PageNum = { [pageId: string]: number }

export const pageNum: Readable<PageNum> = derived(
	pages,
	($pages, set, update) => {
		let updatedPageNum: PageNum = {}
		let F = 0
		let L = 1

		while (L < $pages.length) {
			if (!$pages[L].pageVisible) {
				if ($pages[F].docId === $pages[L].docId) {
					L++
				} else {
					updatedPageNum[$pages[F].pageId] = L
					F = L
					L++
				}
			} else {
				updatedPageNum[$pages[F].pageId] = L
				F = L
				L++
			}
		}
		updatedPageNum[$pages[F].pageId] = L

		// console.log(updatedPageNum)

		set(updatedPageNum)
	},
	{}
)
