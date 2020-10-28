import {get, set_style, write} from '/app/utils.js'

let Window = {
  height: () => window.innerHeight
  , width: () => window.innerWidth
}


const showError = (message) => {
  const header = get('header')
  set_style(header, 'backgroundColor', 'red')
  set_style(header, 'height', '4vh')
  set_style(header, 'fontSize', '1.5em')
  write(header, message)
}

// () -> {x: num, y: num}
const center = () => {
  const workspace = get('workspace')
  const {width, height, bottom, right} = workspace.getBoundingClientRect()
  const center = {x: right - (width / 2), y: bottom - (height / 2)}
  return center
}

Window = {
  ...Window,

  // Draw the app
  draw: () => {
    if (Window.height() > Window.width()) {
      showError('This app should be used on a horizontal screen')
    }
  }

}

export {Window}
