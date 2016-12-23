var $ = require("jquery")
var Rx = require("rx")
var m = require("./dictionary")

const notepad = $("#notepad")
const cursor = $("#cursor")
const view = $("#letter")

var p = false

var kd = Rx.Observable.fromEvent(document,'keydown').filter(()=>!p).filter(e=>e.key==" ").publish()
var ku = Rx.Observable.fromEvent(document,'keyup').filter(e=>e.key==" ").publish()

var back = Rx.Observable.fromEvent(document,'keydown').filter(e=>e.key=="Backspace").publish()

back.subscribe(()=>notepad.text((i, t)=>t.slice(0,-1)))

Rx.Observable.interval(1000).subscribe(()=>cursor.toggle())

kd.subscribe(e=>view.addClass("hold"))
ku.subscribe(e=>view.removeClass("hold"))
kd.subscribe(e=>p=true)
ku.subscribe(e=>p=false)

var morse = ku.withLatestFrom(kd,(u,d)=>(u.timeStamp>200+d.timeStamp)?"-":".")
var letterDone = ku.flatMap((x)=>Rx.Observable.timer(500).takeUntil(kd))
var space = letterDone.flatMap((x)=>Rx.Observable.timer(500).takeUntil(kd.merge(back))).map(()=>" ")

morse.subscribe(e=>view.text(view.text()+(view.text().length>3?"":e) ))
letterDone.subscribe(e=>view.text(""))

var letters = morse.buffer(letterDone).map(b=>m.getLetter(b.join(""))).merge(space)

letters.subscribe(e=>notepad.append(e))

kd.connect()
ku.connect()
back.connect()
