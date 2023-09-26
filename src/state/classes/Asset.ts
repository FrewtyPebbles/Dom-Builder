
export const ASSET_TYPE_LIST = [
	"img",
	"video",
	"svg"
]

export default class Asset {
	file: File
	name: string
	element: HTMLElement
	development_src:string | ""

	constructor(element: HTMLElement, name:string = "", file:File = new File([],"")) {
		this.file = file
		this.name = name
		this.element = element
		if (Object.hasOwn(element, "src"))
			this.development_src = (element as any).src
	}

	export_prep() {
		(this.element as any).src = `assets/${this.name}`;
	}

	dev_prep() {
		(this.element as any).src = this.development_src;
	}
}