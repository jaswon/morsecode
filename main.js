const $ = require("jquery")
const Rx = require("rx")
const m = require("./dictionary")

const obs = Rx.Observable

const notepad = $("#notepad")
const cursor = $("#cursor")
const view = $("#letter")

let p = false

const kd = obs.fromEvent(document,'keydown').filter(()=>!p).filter(e=>e.key==" ").publish()
const ku = obs.fromEvent(document,'keyup').filter(e=>e.key==" ").publish()

const back = obs.fromEvent(document,'keydown').filter(e=>e.key=="Backspace").publish()

back.subscribe(()=>notepad.text((i, t)=>t.slice(0,-1)))

obs.interval(1000).subscribe(()=>cursor.toggle())

kd.subscribe(e=>view.addClass("hold"))
ku.subscribe(e=>view.removeClass("hold"))
kd.subscribe(e=>p=true)
ku.subscribe(e=>p=false)

const morse = ku.withLatestFrom(kd,(u,d)=>(u.timeStamp>200+d.timeStamp)?"-":".")
const letterDone = ku.flatMap((x)=>obs.timer(500).takeUntil(kd))
const space = letterDone.flatMap((x)=>obs.timer(500).takeUntil(kd.merge(back))).map(()=>" ")

morse.subscribe(e=>view.text(view.text()+(view.text().length>3?"":e) ))
letterDone.subscribe(e=>view.text(""))

const letters = morse.buffer(letterDone).map(b=>m.getLetter(b.join(""))).merge(space)

letters.subscribe(e=>notepad.append(e))

kd.connect()
ku.connect()
back.connect()
