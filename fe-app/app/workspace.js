import {get, set_style, write} from '/app/utils.js'
import {setGlobal, getGlobal} from '/app/global-state.js'
import {Modality} from '/app/modalities.js'

const workspace = get('real-workspace')

const onMouseDown = (e) => {
  if (getGlobal().modality === Modality('Drag')) {
    set_style(workspace, 'cursor', 'grabbing')
    setGlobal('modality', Modality('Dragging'))
  }
}

const onMouseUp = (e) => {
  if (getGlobal().modality === Modality('Dragging')) {
    set_style(workspace, 'cursor', 'grab')
    setGlobal('modality', Modality('Drag'))
  }
}

window.addEventListener('mousedown', onMouseDown)
window.addEventListener('mouseup', onMouseUp)

const wrokspace_default = {
}

const Workspace = {

  // Create a new workspace
  // Width -> Height -> Workspace
  new: (width, height) => 'TODO',

  // Get relative coords of the image part of the template
  // Self -> PdfTemplate -> ()
  get_image_coords: (self_, PdfTemplate) => 'TODO',

  // ?? Get relative coords of the label part of the template
  get_label_coords: (self_, PdfTemplate) => 'TODO',

  get_src: () => get('image').src,

  // This are browser pixels not the real image resolution
  get_real_image_width_browser_px: () => get('image').realWidth,

  // This are browser pixels not the real image resolution
  get_real_image_height_browser_px: () => get('image').realHeight,

  // This are browser pixels not the real image resolution
  get_resized_image_width_browser_px: () => get('image').width,

  // This are browser pixels not the real image resolution
  get_resized_image_height_browser_px: () => get('image').height,

  get_image_bytes: async (self_) => {
    const src = self_.get_src()
    const body = (await fetch(src)).body
    const readable = body.getReader()
    let bytes = []
    let _ = await readable.then(({done, value}) => {bytes = value})
    return bytes
  },

  get_height: () => get('real-workspace').height,

  get_x: () => get('real-workspace').getClientRect()[0].x,

  get_y: () => get('real-workspace').getClientRect()[0].y,


}

export {Workspace}
