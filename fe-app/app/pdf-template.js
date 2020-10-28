import {center, make_struct, None} from '/app/utils.js'
//import {label_default} from '/app/label.js'

const tests = []

const pdf_template_deafult = {
  width: 0
  , height: 0
  , ratio: 0
  , label: None
  , image: []
  , image_width_px: 0
  , image_height_px: 0
  , max_side_mm: 200
  , document_name: 'certificate'
  , font: []
  , font_size_pt: 24
  , name: 'Name'
  , surname: 'Surname'
  , name_x_from_bottom_left_mm: 0
  , name_y_from_bottom_left_mm: 0
  , surname_x_from_bottom_left_mm: 0
  , surname_y_from_bottom_left_mm: 0
}

const pdf_template_constructor = make_struct(pdf_template_deafult)

const PdfTemplate = {

  // Create a new PdfTemplate centered in the workspace
  // Image -> Workspace -> PdfTemplate
  new: (image, workspace) => {
    const {width, height, ratio} = center(image, workspace)
    return {...PdfTemplate, ...pdf_template_deafult, width, height, ratio}
  },

  // Serialize as template
  serialize: (self_) => {
    return JSON.stringify(self_)
  },

  from_workspace: () => {},
}

const test_can_create_template = () => {
  const image = {width: 10, height: 15}
  const workspace = {width: 10, height: 20}
  const template = PdfTemplate.new(image, workspace)
  const condition = (
    template.width === 10
    && template.height === 15
    && template.ratio === 1
  )
  console.assert(condition, {value: [image, workspace], result: template})
}
tests.push(test_can_create_template)

export {tests}
