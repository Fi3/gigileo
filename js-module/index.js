import * as pdf from '/pdf-generator/fi3_wasm_pdf_generator.js'


const  fetch_template = async (name, surname) => {
    const template = await (await fetch('/template.json')).json()
    const image = await url_to_bytes( '/photo-archive/photo.jpeg')
    const font = await url_to_bytes('/fonts/examplefont.ttf')
    return {...template, font, image, name, surname}
}

const transform_template = (t) => {
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

const ticket_download = async (name, surname) => {
  const template = transform_template(await fetch_template())
  let pdf_ = pdf.Template.new(...template)
  pdf_.build()
  pdf_ = pdf_.get()
  const data = new Blob([pdf_], { type: 'application/pdf' })
  const file = document.createElement('a')
  file.download = 'ticket.pdf'
  file.href = URL.createObjectURL(data)
  file.click()
}

window.ticket_download = ticket_download
