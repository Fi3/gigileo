import {get, set_style, write} from '/app/utils.js'
import {getGlobal, setGlobal} from '/app/global-state.js'
import {Modality} from '/app/modalities.js'

const max = Math.max
const min = Math.min
const abs = Math.abs

const label = get('label')
const spacing = get('spacing')
const name = get('name')
const surname = get('surname')

// take a point with position relative to window and an element id 
// and return the same point with position relative to the passed element
// id -> point -> point
const absolute_to_relative = (id) => (point) => {
  const element = get(id)
  const {x, y} = element.getBoundingClientRect()
  return {x: point.x - x, y: point.y - y}
}

// limit a point to grow over some bounds
// the bounds are computed based on two rect the inner and the outer
// the point is the upper left angle of the inner rectangle and this function
// do not let the point be in a position that put the inner rectangle out of the outer
// id -> id -> point -> point
const limit = (inner_id, outer_id) => point => {
  const inner = get(inner_id).getBoundingClientRect()
  const outer = get(outer_id).getBoundingClientRect()
  const min_x = outer.x
  const max_x = outer.x + outer.width - inner.width
  const min_y = outer.y
  const max_y = outer.y + outer.height - inner.height
  return {x: min(max(point.x, min_x), max_x), y: min(max(point.y, min_y), max_y)}
}

const onMouseMove = (e) => {
  const label = get('label')
  const workspace = get('real-workspace')
  if (getGlobal().modality === Modality('Dragging')) {
    let transformed_coord = limit('label', 'workspace')({x: e.clientX, y: e.clientY})
    transformed_coord = absolute_to_relative('real-workspace')(transformed_coord)
    set_style(label, 'top', `${transformed_coord.y}px`)
    set_style(label, 'left', `${transformed_coord.x}px`)
  }
}
window.addEventListener('mousemove', onMouseMove)

const update_font = (new_font) => {
  setGlobal('font_family', new_font)
  set_style(label, 'font-family', new_font)
}

const update_size = (new_size) => {
  setGlobal('font_size', new_size)
  set_style(label, 'font-size', `${new_size}px`)
}

const update_weight = (new_weight) => {
  setGlobal('font_weight', new_weight)
  set_style(label, 'font-weight', new_weight)
}

const update_interspace = (new_interspace) => {
  setGlobal('label_interspace', new_interspace)
  set_style(spacing, 'width', `${new_interspace}em`)
}

const update_max_name = (new_max) => {
  setGlobal('max_name', new_max)
  write(name, 'Name' + Array(new_max - 4).fill('_'))
}

name.addEventListener('keydown', (e) => {

  // arrows and backspace
  const permitted_keys = [37, 38, 39, 40, 8]
  const is_full = name.innerHTML.length === getGlobal().max_name
  const is_permitted = permitted_keys.indexOf((parseInt(e.keyCode))) > -1

  if (is_full && ! is_permitted) {
    e.preventDefault()
  }
})

const update_max_surname = (new_max) => {
  setGlobal('max_surname', new_max)
  write(surname, 'Surname' + Array(new_max - 7).fill('_'))
}

surname.addEventListener('keydown', (e) => {

  // arrows and backspace
  const permitted_keys = [37, 38, 39, 40, 8]
  const is_full = surname.innerHTML.length === getGlobal().max_surname
  const is_permitted = permitted_keys.indexOf((parseInt(e.keyCode))) > -1

  if (is_full && ! is_permitted) {
    e.preventDefault()
  }
})

const update_color = (new_color) => {
  setGlobal('font_color', new_color)
  set_style(label, 'color', new_color)
}

const label_default = {
}

const Label = {

  // Create a new label
  // FontSize -> MaxName -> MaxSurname -> Label
  new: (font_size, max_name, max_surname) => 'TODO',

  get_font_size_browser_px: () => {
    if (get('label').style.fontSize === "") {
      return 32
    } else {
      return get('label').style.fontSize
    }
  },

  get_font_size_pt: () => {
    // TODO check it
    get_font_size_browser_px() * (72 / 96)
  },

  get_font_family: () => getGlobal().font_family,

  get_name: () => get('name').innerHTML,

  get_surname: () => get('surname').innerHTML,

  name_x: () => get('name').getClientRect()[0].x,

  name_y: () => get('surname').getClientRect()[0].y,

  surname_x: () => get('surname').getClientRect()[0].x,

  surname_y: () => get('surname').getClientRect()[0].y,

  transform_x: (x, Workspace) => {
    return Workspace.get_x() - x
  },

  transform_y: (y, Workspace) => {
    return Workspace.get_height() - (Workspace.get_y() - y)
  },

}

export {
  Label
  , update_font
  , update_size
  , update_weight
  , update_interspace
  , update_max_name
  , update_max_surname
  , update_color
}
