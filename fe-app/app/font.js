import {get, set_style} from '/app/utils.js'
import {getGlobal, setGlobal} from '/app/global-state.js'
import {Modality} from '/app/modalities.js'
import {update_font as update_font_label} from '/app/label.js'
import {update_size as update_font_size} from '/app/label.js'
import {update_weight as update_font_weight} from '/app/label.js'
import {update_interspace as update_label_interspace} from '/app/label.js'
import {update_max_name as update_label_max_name} from '/app/label.js'
import {update_max_surname as update_label_max_surname} from '/app/label.js'
import {update_color as update_label_color} from '/app/label.js'

const font = get('font')
const setfont_close = get('setfont-close')
const setfont_control = get('setfont-control')
const setfont = get('setfont')
const select_font_family = get('select-font-family')
const select_font_size = get('select-font-size')
const select_font_weight = get('select-font-weight')
const select_label_interspace = get('select-label-interspace')
const select_name_max = get('select-name-max')
const select_surname_max = get('select-surname-max')
const select_font_color = get('select-font-color')

const local_state = {
  dragging: false
  , last_global_mod: null
  , select_font_family: () => get('select-font-family')
}

const toogle_font = () => {
  if (! getGlobal().font_open) {
    set_style(font, 'background-color', '#8A4F7D')
    set_style(setfont, 'display', 'block')
    setGlobal('font_open', true)
  } else {
    set_style(font, 'background-color', '#887880')
    set_style(setfont, 'display', 'none')
    setGlobal('font_open', false)
  }
}
setfont_close.addEventListener('click', toogle_font)

window.addEventListener('mousedown', (e) => {
  const {x,y,width,height} = setfont_control.getBoundingClientRect()
  const cy = e.clientY
  const cx = e.clientX
  if (cx >= x && cx <= x + width && cy >= y && cy <= y + height) {
    local_state.last_global_mod = getGlobal().modality
    setGlobal('modality', Modality('Select'))
    set_style(setfont_control, 'cursor', 'grabbing')
    local_state.dragging = true
  }
})

window.addEventListener('mouseup', () => {
  if (local_state.dragging && local_state.last_global_mod) {
    set_style(setfont_control, 'cursor', 'grab')
    setGlobal('modality', local_state.last_global_mod)
    local_state.dragging = false
  }
})

//setfont_control.addEventListener('mouseout', () => {
//  set_style(setfont_control, 'cursor', 'grab')
//  local_state.dragging = false
//})

window.addEventListener('mousemove', (e) => {
  if (local_state.dragging) {
    set_style(setfont, 'top', e.clientY)
    set_style(setfont, 'left', e.clientX)
  }
})


select_font_family.addEventListener('input', e => {
  update_font_label(e.target.value)
})
select_font_family.addEventListener('change', e => {
  update_font_label(e.target.value)
})

select_font_size.addEventListener('input', e => {
  update_font_size(parseFloat(e.target.value))
})
select_font_size.addEventListener('change', e => {
  update_font_size(parseFloat(e.target.value))
})

select_font_weight.addEventListener('input', e => {
  update_font_weight(parseFloat(e.target.value))
})
select_font_weight.addEventListener('change', e => {
  update_font_weight(parseFloat(e.target.value))
})

select_label_interspace.addEventListener('input', e => {
  update_label_interspace(parseFloat(e.target.value))
})
select_label_interspace.addEventListener('change', e => {
  update_label_interspace(parseFloat(e.target.value))
})

select_name_max.addEventListener('input', e => {
  update_label_max_name(parseInt(e.target.value))
})
select_name_max.addEventListener('change', e => {
  update_label_max_name(parseInt(e.target.value))
})

select_surname_max.addEventListener('input', e => {
  update_label_max_surname(parseInt(e.target.value))
})
select_surname_max.addEventListener('change', e => {
  update_label_max_surname(parseInt(e.target.value))
})

select_font_color.addEventListener('input', e => {
  update_label_color(e.target.value)
})
select_font_color.addEventListener('change', e => {
  update_label_color(e.target.value)
})

const font_dafult = {
}

const Font = {

}

export {Font, toogle_font}
