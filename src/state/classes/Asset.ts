import CLIENT_STORAGE from "#state/client_storage"

export const ASSET_TYPE_LIST = [
	"img",
	"video",
	"svg"
]

export default class Asset {
	file: File
	name: string
	development_src:string | ""
	export_src:string | ""

	constructor(name:string, file:File) {
		this.file = file
		this.name = name

		this.development_src = window.URL.createObjectURL(this.file);
		this.export_src = `assets/${this.file.name}`

		CLIENT_STORAGE.history.push();
	}

	update(name:string = "", file:File = new File([],"")) {
		this.file = file;
		this.name = name;
		window.URL.revokeObjectURL(this.development_src);
		
		this.development_src = window.URL.createObjectURL(this.file);
		this.export_src = `assets/${this.file.name}`
		
		CLIENT_STORAGE.history.push();
	}
}