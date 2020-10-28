const tests = []

const max = Math.max
const min = Math.min
const abs = Math.abs

const is_some = (x) => {
  if (x.Some) {
    return true
  } else {
    false
  }
}

const thr = (msg) => {throw new Error(msg)}

const is_none = (x) => ! is_some(x)

const None = {None: ''}

const Some = (x) => ({Some: x})

const make_enum = (list) => (member) =>
    list.indexOf(member) > -1
        ? member
        : thr(`trying to set ${member} but not in ${list}`)

const make_struct = (default_) => (methods, new_) => {
  if (
        Object.keys(default_).concat(Object.keys(methods)).sort().join() 
    === Object.keys(new_).sort().join()) 
  {
      return {...methods, ...new_}
  } else {
    throw new Error('TODO')
  }
}

const test_make_struct = () => {
  const box_default = {width: 0, height: 0}
  const box_contructor = make_struct(box_default)
  const Box = {
      new: (new_) => box_contructor(Box, {...Box, ...new_})
    , set_w: (self_, w) => box_contructor(Box, {...self_, width: w})
    }
  const box1 = Box.new({width: 10, height: 13})
  console.assert(box1.width === 10 && box1.height === 13, "test struct 1")
  const box2 = box1.set_w(box1, 30)
  console.assert(box2.width === 30 && box2.height === 13, "test struct 2")
}
tests.push(test_make_struct)
    

// It center a quadrilater inside another
// The image is the quadrilater to be centered and the workspace is the container
const center = (image, workspace) => {
  let width
  let height
  let ratio
  if (image.width === workspace.width && image.height === workspace.height) {
    ratio = 1
    width = image.width
    height = image.height
  } else if (image.width <= workspace.width && image.height === workspace.height) {
    ratio = 1
    width = image.width
    height = image.height
  } else if (image.width === workspace.width && image.height <= workspace.height) {
    ratio = 1
    width = image.width
    height = image.height
  } else if (image.width < workspace.width && image.height < workspace.height) {
    const ratio1 = workspace.width / image.width
    const ratio2 = workspace.height / image.height
    ratio = min(ratio1, ratio2)
    width = image.width * ratio
    height = image.height * ratio
  } else if (image.width > workspace.width && image.height > workspace.height) {
    const ratio1 = workspace.width / image.width
    const ratio2 = workspace.height / image.height
    ratio = min(ratio1, ratio2)
    width = image.width * ratio
    height = image.height * ratio
  } else if (image.width > workspace.width) {
    ratio = workspace.width / image.width
    width = workspace.width
    height = image.height * ratio
  } else if (image.height > workspace.height) {
    ratio = workspace.height / image.height
    height = workspace.height
    width = image.width * ratio
  } else {
    console.error('Image: ', image)
    console.error('Workspace: ', workspace)
    throw new Error()
  }
  if (width && height && ratio) {
    return {width, height, ratio}
  } else {
    console.error('Image: ', image)
    console.error('Workspace: ', workspace)
    throw new Error()
  }
}

const test_center = () => {
  const r = () => Math.random()
  const is_very_close = (a, b) => (abs(a / b) - 1) < 0.0000001
  const is_not_much_bigger = (a, b) => (a/b) < 0 || ((a/b) - 1) < 0.0000001

  let counter = 0
  while (counter < 100000) {
    const image = {width: r(), height: r()}
    const workspace = {width: r(), height: r()}
    const result = center(image, workspace)

    // width and height are always bigger than 0
    console.assert(result.width > 0, {value: [image, workspace], result})
    console.assert(result.height > 0, {value: [image, workspace], result})

    // width and height are always smaller or equal to realtive workspace dimensions
    const result_width_contained = is_not_much_bigger(result.width, workspace.width)
    const result_height_contained = is_not_much_bigger(result.height, workspace.height)
    console.assert(result_width_contained, {value: [image, workspace], result})
    console.assert(result_height_contained, {value: [image, workspace], result})

    // at least on dimension is really close to the respective workspace's one
    const result_as_bis_as_possible = is_very_close(result.width, workspace.width)
      || is_very_close(result.height, workspace.height)
    console.assert(result_as_bis_as_possible, {value: [image, workspace], result})

    // preserve the image ratio
    const final_ratio_is_image_ratio = 
      is_very_close(result.width / result.height, image.width / image.height)
    console.assert(final_ratio_is_image_ratio, {value: [image, workspace], result})

    counter = counter + 1
  }
}
tests.push(test_center)

const inner = (a) => {
  if (is_none(a)) {
    return None
  } else if (is_some(a)) {
    return a.Some
  } else {
    console.alert(a)
    throw new Error('TODO')
  }
}

const get = (id) => document.getElementById(id)
const set_style = (element, attr, value) => {element.style[attr] = value}
const set_attr = (element, attr, value) => {element[attr] = value}
const write = (element, value) => {element.innerHTML = value}
const append = (element, val) => {element.innerHTML = element.innerHTML + val}
const is_focused = (element) => document.activeElement === element

export {
  is_some
  , is_none
  , None
  , Some
  , make_enum
  , tests
  , center
  , make_struct
  , inner
  , get
  , set_style
  , set_attr
  , write
  , is_focused
  , append
}
