import {make_enum, is_some, is_none} from '/app/utils.js'

const tests = []

const Modality = make_enum(["Drag", "Select", "Iter", "Dragging"])

export {Modality, tests}
