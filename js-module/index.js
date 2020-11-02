import * as pdf from '/pdf-generator/fi3_wasm_pdf_generator.js'

const readable_to_bytes = async (readable) => {
  let bytes = []
  let cond = true
  while (cond) {
    let _ = await readable.read().then(({done, value}) => {
      if (done) {
        cond = false
      }
      if (value) {
        bytes = Uint8Array.from([...bytes, ...value])
      }
    })
  }
  return bytes
}

const url_to_bytes = async (url) => {
  const body = (await fetch(url)).body
  const readable = body.getReader()
  return await readable_to_bytes(readable)
}

const fetch_template = async (name, surname) => {
    const template = await (await fetch('/gigileo/template.json')).json()
    const image = await url_to_bytes( '/gigileo/photo-archive/photo.jpeg')
    const font = await url_to_bytes('/gigileo/fonts/examplefont.ttf')
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
  const template = transform_template(await fetch_template(name, surname))
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
