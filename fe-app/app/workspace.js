import {get, set_style, write, url_to_bytes} from '/app/utils.js'
import {setGlobal, getGlobal} from '/app/global-state.js'
import {Modality} from '/app/modalities.js'
import {Label} from '/app/label.js'

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
  get_real_image_width_px: () => get('image').naturalWidth,

  // This are browser pixels not the real image resolution
  get_real_image_height_px: () => get('image').naturalHeight,

  // This are browser pixels not the real image resolution
  get_resized_image_width_browser_px: () => get('image').width,

  // This are browser pixels not the real image resolution
  get_resized_image_height_browser_px: () => get('image').height,

  get_image_bytes: async () => {
    return await url_to_bytes(Workspace.get_src())
  },

  get_height: () => get('real-workspace').getBoundingClientRect().height,

  get_x: () => get('real-workspace').getBoundingClientRect().x,

  get_y: () => get('real-workspace').getBoundingClientRect().y,

  get_template: async () => {
    return {
      image: await Workspace.get_image_bytes()
      , image_width_px: Workspace.get_real_image_width_px()
      , image_height_px: Workspace.get_real_image_height_px()
      , image_width_browser: Workspace.get_resized_image_width_browser_px()
      , image_height_browser: Workspace.get_resized_image_height_browser_px()
      , max_side_mm: 200
      , document_name: "Ticket"
      , font: await Label.get_font_bytes()
      , font_size_pt: Label.get_font_size_pt()
      , name: Label.get_name()
      , surname: Label.get_surname()
      , name_x_from_bottom_left_browser: Label.transformed_name_x()
      , name_y_from_bottom_left_browser: Label.transformed_name_y()
      , surname_x_from_bottom_left_browser: Label.transformed_surname_x()
      , surname_y_from_bottom_left_browser: Label.transformed_surname_y()
    }
  },

  fetch_template: async () => {
    const img_url = getGlobal().is_test_image
      ? 'photo-archive/test-image.jpeg'
      : 'photo-archive/photo.jpeg'
    const template = await (await fetch('template.json')).json()
    const image = await url_to_bytes(img_url)
    const font = await url_to_bytes('fonts/examplefont.ttf')
    return {...template, font, image, name: 'Name', surname: 'Surname'}
  },

  transform_template: (t) => {
    return [
      t.image
      , t.image_width_px
      , t.image_height_px
      , t.image_width_browser
      , t.image_height_browser
      , t.max_side_mm
      , t.document_name
      , t.font
      , BigInt(t.font_size_pt)
      , t.name
      , t.surname
      , t.name_x_from_bottom_left_browser
      , t.name_y_from_bottom_left_browser
      , t.surname_x_from_bottom_left_browser
      , t.surname_y_from_bottom_left_browser
    ]
  }
}
//        image: Vec<u8>,
//        image_width_px: f64,
//        image_height_px: f64,
//        max_side_mm: f64,
//        document_name: String,
//        font: Vec<u8>,
//        font_size_pt: i64,
//        name: String,
//        surname: String,
//        name_x_from_bottom_left_mm: f64,
//        name_y_from_bottom_left_mm: f64,
//        surname_x_from_bottom_left_mm: f64,
//        surname_y_from_bottom_left_mm: f64,
//

export {Workspace}
