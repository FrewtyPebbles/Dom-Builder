import CLIENT_STORAGE from "#state/client_storage";
import _DEV from "#state/gui_elements";
import Asset from "./Asset";


export default class History {
	body: Node;
	assets: Asset[];
	constructor(assets?:Asset[]) {
		//Create fragment to clean dev classes off of state
		let fragment = new DocumentFragment()
		let new_state = _DEV.body.cloneNode(true)
		fragment.append(new_state)
		fragment
		.querySelectorAll(":is(.dev-selected, .dev-hover-center, .dev-hover-top, .dev-hover-left, .dev-hover-bottom, .dev-hover-right)")
		.forEach(elem => {
			elem.classList.remove("dev-selected")
			elem.classList.remove("dev-hover-center")
			elem.classList.remove("dev-hover-top")
			elem.classList.remove("dev-hover-bottom")
			elem.classList.remove("dev-hover-left")
			elem.classList.remove("dev-hover-right")
		})

		// save the dev-classless state to this.body
		this.body = fragment.childNodes[0].cloneNode(true)
		// save the asset state
		this.assets = assets || [...CLIENT_STORAGE.assets.data]
	}
	
	apply() {
		_DEV.body.innerHTML = ""
		_DEV.body.append(...this.body.cloneNode(true).childNodes)
		console.log([...this.assets]);
		
		CLIENT_STORAGE.assets.data = [...this.assets]
	}
}