import {tests as test1} from '/app/modalities.js'
import {tests as test2} from '/app/utils.js'
import {tests as test3} from '/app/pdf-template.js'
import {Window} from '/app/window.js'
import {SideBar} from '/app/sidebar.js'
import {Label} from '/app/label.js'
import {Workspace} from '/app/workspace.js'
import {Uploader} from '/app/upload-photo.js'
import {Login} from '/app/login.js'
import * as pdf from '/pdf-generator/fi3_wasm_pdf_generator.js'

if (location.hostname === "localhost" || location.hostname === "127.0.0.1") {
  const tests = test1.concat(test2).concat(test3)
  for (const test of tests) {
    test()
  }
}

Window.draw()
window.addEventListener('resize', Window.draw)

// expose api on wondows
