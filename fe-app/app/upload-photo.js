import {get, set_attr, set_style} from '/app/utils.js'
import {setGlobal} from '/app/global-state.js'
const upload = get('upload')
const image = get('image')
const message = get('message')
const load_image = get('load-image')
const use_test_image = get('use-test-image')
const label = get('label')
const loading = get('loading')

const upload_photo = async (photo) => {
  let response = await fetch('upload-photo', {
    method: 'POST',
    mode: 'cors',
    cache: 'no-cache',
    credentials: 'include',
    headers: {
      'Content-Type': 'text/plain'
    },
    redirect: 'follow',
    referrefPolicy: 'no-referree',
    body: photo,
  })
  const text = await response.text()
  return [response.status, text]
}

const to_jpg = async (file, quality) => {

  const c = document.createElement('canvas')
  const ctx = c.getContext('2d')
  const reader = new FileReader()

  const waitForProcessedPhoto = new Promise(resolve => {
    reader.addEventListener('load', (evt) => {
      const img = new Image()
      img.onload = () => {
        c.width = img.width
        c.height = img.height
        ctx.drawImage(img, 0, 0)

        c.toBlob(blob => resolve(blob), 'image/jpeg', quality);
      }
      img.src = evt.target.result
      })
    reader.readAsDataURL(file)
  })

  const transformedPhoto = await waitForProcessedPhoto
  return transformedPhoto

}

const set_image = (file_name) => {
  set_attr(image, 'src', `photo-archive/${file_name}.jpeg`)
  set_style(loading, 'display', 'none')
  set_style(image, 'display', 'block')
  set_style(label, 'display', 'flex')
}

const on_change = async () => {
  const files = upload.files
  set_style(message, 'display', 'none')
  set_style(load_image, 'display', 'none')
  set_style(use_test_image, 'display', 'none')
  set_style(loading, 'display', 'block')
  for (const file of files) {
    let [res, file_name] = await upload_photo(await to_jpg(file, 0.45))
    if (res && file_name) {
      set_image(file_name)
    }
  }
}

const load_test = () => {
  set_style(message, 'display', 'none')
  set_style(load_image, 'display', 'none')
  set_style(use_test_image, 'display', 'none')
  set_style(loading, 'display', 'block')
  setGlobal('is_test_image', true)
  set_image('test-image')
}

upload.addEventListener('change', on_change)
load_image.addEventListener('click', () => load.click())
use_test_image.addEventListener('click', () => load_test())

const Uploader = {}

export {Uploader}
