const $ = require("jquery")
const m = require("./dictionary")
const obs = require("rx").Observable

const notepad = $("#notepad")
const view = $("#letter")

const kd = obs.fromEvent(document,'keydown').filter(e=>e.key==" ").publish()
const ku = obs.fromEvent(document,'keyup').filter(e=>e.key==" ").publish()

const k = kd.merge(ku).scan((a,x,i,s) => x.type=="keyup"?1:(a==1?0:-1),1).filter(v=>v>=0)

const back = obs.fromEvent(document,'keydown').filter(e=>e.key=="Backspace").publish()

back.subscribe(()=>notepad.text((i, t)=>t.slice(0,-1)))

obs.interval(1000).subscribe(()=>$("#cursor").toggle())

k.subscribe(e=>view.toggleClass("hold"))

const morse = k.timeInterval().filter(e=>e.value==1).map(e=>e.interval>200?"-":".")
const letterDone = k.debounce(200).filter(e=>e==1)
const wordDone = letterDone.merge(kd).merge(back).debounce(500).filter(e=>e==1).map(()=>" ")

morse.subscribe(e=>view.text(view.text()+(view.text().length>3?"":e) ))
letterDone.subscribe(e=>view.text(""))

const letters = morse.buffer(letterDone).map(b=>m.getLetter(b.join(""))).merge(wordDone)
letters.subscribe(e=>notepad.append(e))

kd.connect()
ku.connect()
back.connect()
