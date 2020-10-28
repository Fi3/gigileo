import {Modality} from '/app/modalities.js'
import {None} from '/app/utils.js'

export const global = {
  font_family: 'playfair',
  font_size: '12',
  font_thikness: '12',
  font_color: 'Black',
  label_interspace: '2em',
  max_name: 4,
  max_surname: 7,
  modality: Modality('Drag'),
  font_open: false,
  logged: false,
}

const setGlobal = (field, value) => {
  global[field] = value
}

const getGlobal = () => global

export {setGlobal, getGlobal}
