import chroma from 'chroma-js'

// export function randomColor() {
// 	return '#' + (0x1000000 + Math.random() * 0xffffff).toString(16).substr(1, 6)
// }

export const randomColor = () => '' + chroma.random()
