import {get, set_style, set_attr} from '/app/utils.js'
import {getGlobal, setGlobal} from '/app/global-state.js'
import {Modality} from '/app/modalities.js'
import {toogle_font} from '/app/font.js'

const dragdrop = get('dragdrop')
const select = get('select')
const font = get('font')
const iterator = get('iterator')
const load = get('load')
const try_ = get('try')
const save = get('save')
// const dragdrop_icon = get('dragdrop-icon')
// const select_icon = get('select-icon')
// const font_icon = get('font-icon')
// const iterator_icon = get('iterator-icon')
// const load_icon = get('try-icon')
// const save_icon = get('save-icon')
const name = get('name')
const surname = get('surname')
const workspace = get('real-workspace')
const upload = get('upload')

load.addEventListener('click', () => upload.click())

const wait = (action) => setTimeout(action, 100)
const clean = (elements) => () => {
  for (const element of elements) {
    set_style(element, 'background-color', '#887880')
  }
}
const clean_all =
  clean([dragdrop, select, iterator, load, save])


dragdrop.addEventListener('click', () => {
  clean_all()
  set_style(dragdrop, 'background-color', '#8A4F7D')
  set_style(workspace, 'cursor', 'grab')
  setGlobal('modality', Modality('Drag'))
  if (getGlobal().font_open) {
    toogle_font()
  }
})

const on_select = () => {
  set_style(select, 'background-color', '#8A4F7D')
  set_style(workspace, 'cursor', 'text')
  set_attr(name, 'contentEditable', 'true')
  set_attr(surname, 'contentEditable', 'true')
  setGlobal('modality', Modality('Select'))
}
select.addEventListener('click', () => {
  clean_all()
  on_select()
})

const on_font_open = () => {
  console.log(getGlobal().modality, Modality('Drag'))
  if (getGlobal().modality === Modality('Drag')) {
    clean([dragdrop])()
    on_select()
  }
  toogle_font()
}
font.addEventListener('click', on_font_open)

const side_bar_dafult = {}

const SideBar = {

}

export {SideBar}
