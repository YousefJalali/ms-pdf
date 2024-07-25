import { derived, type Readable } from 'svelte/store'
import { pages } from './pages'

type PageNum = { [pageId: string]: number | number[] }

export const pageNum: Readable<PageNum> = derived(
	pages,
	($pages, set, update) => {
		let updatedPageNum: PageNum = {}
		let last = $pages.length - 1
		let countOfHiddenPages = 0

		while (last >= 0) {
			if (!$pages[last].pageVisible) {
				countOfHiddenPages++
				updatedPageNum[$pages[last].pageId] = last + 1
			} else {
				if (last === $pages.length - 1 || countOfHiddenPages === 0) {
					updatedPageNum[$pages[last].pageId] = last + 1
				} else {
					updatedPageNum[$pages[last].pageId] = [last + 1, last + 1 + countOfHiddenPages]
					countOfHiddenPages = 0
				}
			}
			last--
		}

		set(updatedPageNum)
	},
	{}
)
