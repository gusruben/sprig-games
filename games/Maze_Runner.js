/*
@title: Maze Runner
@author: Alan Alwakeel, Samuel Sapatla, Suhaan Palakamshetty, Martin Beythoon
*/

const player = 'p'
const enemy = 'e'
const floor = 'f'
const wall = 'w'
const apple = 'a'
const heart = 'h'
const key = 'k'
const key_pedestal = 'j'
const home_floor = 'z'
const door_open = 'd'
const door_closed_horiz = 'c'

let key_inv = 0
let stored_keys = []
let health = 10
let maze_enter_time
let time_end
let health_degrading = false
let next_health_degrade
let gameEnd = false

setLegend(
    [player, bitmap`
................
................
................
.....LL112......
....LL11222.....
....L444442.....
....LL4442......
.....L1222......
.....L1121......
....L1LL122.....
....L112222.....
....L112222.....
...LL1112222....
...LLL111222....
...0LLL11120....
.....00.00......
`],
    [key, bitmap`
.........00000..
........0666660.
.......066999690
.......069900690
.......069020690
.......069006690
.......069666690
......0666666990
.....0666909990.
....066690.000..
...066690.......
..066690........
.06669660.......
.066006690......
..00..090.......
.......0........`],
    [enemy, bitmap`
.........L......
.........L......
...0L...L.......
.....0L.0.......
.......0L0L.....
.......0L..0L...
.....L01221.....
....LL022221....
....L1127772....
....L1227772....
....L1122222....
....LL123231....
...LLL1122111...
..L....33....1..
...L..3333..1...
.....333333.....
`],
    [floor, bitmap`
LLLLLLLLLLLLLLLL
LCCLLCLCLCLCLCCL
LCCLCLCLCLCLLCCL
LLLLLCLCLCLCLLLL
LLLLLLLLLLLLCLCL
LCLCLLLLLLLLLCLL
LLCLLLLLLLLLCLCL
LCLCLLLLLLLLLCLL
LLCLLLLLLLLLCLCL
LCLCLLLLLLLLLCLL
LLCLLLLLLLLLCLCL
LCLCLLLLLLLLLCLL
LLLLCLCLCLCLLLLL
LCCLLCLCLCLCLCCL
LCCLCLCLCLCLLCCL
LLLLLLLLLLLLLLLL
`],
    [apple, bitmap`
........CCC.....
....444CCCC.....
....444CC.......
....333CC333....
...3333333333...
..333333333333..
.33333333333333.
.33333333333333.
.33333333333333.
.33333333333333.
.33333333333333.
.33333333333333.
..333333333333..
...3333333333...
....333..333....
................
`],
    [heart, bitmap`
................
................
................
....33....33....
...3333..3333...
..333333333333..
.33333333333333.
.33333333333333.
.33333333333333.
..333333333333..
...3333333333...
....33333333....
.....333333.....
......3333......
.......33.......
................
`],
    [home_floor, bitmap`
CL1FF1LCCL1FF1LC
L1FCCF1LL1FCCF1L
1FC22CF11FC22CF1
FC2LL2CFFC2LL2CF
FC2LL2CFFC2LL2CF
1FC22CF11FC22CF1
L1FCCF1LL1FCCF1L
CL1FF1LCCL1FF1LC
CL1FF1LCCL1FF1LC
L1FCCF1LL1FCCF1L
1FC22CF11FC22CF1
FC2LL2CFFC2LL2CF
FC2LL2CFFC2LL2CF
1FC22CF11FC22CF1
L1FCCF1LL1FCCF1L
CL1FF1LCCL1FF1LC
`],
    [door_open, bitmap`
CCCCCCCCCCCCCCCC
CCCCCCCCCCCCCCCC
CCCCCCCCCCCCCCCC
LLCCCCCCCCCCCCLL
L6CCCCCCCCCCCC6L
69CCCCCCCCCCCC96
96CCCCCCCCCCCC69
6LCCCCCCCCCCCCL6
6LCCCCCCCCCCCCL6
96CCCCCCCCCCCC69
69CCCCCCCCCCCC96
L6CCCCCCCCCCCC6L
LLCCCCCCCCCCCCLL
CCCCCCCCCCCCCCCC
CCCCCCCCCCCCCCCC
CCCCCCCCCCCCCCCC`],
    [key_pedestal, bitmap`
FCCCC000000CCCFC
CCC0066611100CCF
CC066FF1LLLLL0CC
C06FF001LLL11L0C
C06F0001LL101L0C
06F00001LL11LL10
06F00001LLLLLL10
06F0001LLLLLLL10
06F001LLLL1LLL10
06F01LLLL10111F0
06F1LLLL100006F0
C01LLLL100006F0C
C0LLLLLL10066F0C
CC01L1LLL16FF0CC
FCC00F1L1FF00CCC
CFCCC000000CCCCF
`],
    [door_closed_horiz, bitmap`
................
................
................
L969LLLLLLLL969L
L699LLL66LLL996L
L6LLLL6996LLLL6L
L6LLL696696LLL6L
L6LL696LL696LL6L
L6LL696LL696LL6L
L6LLL696696LLL6L
L6LLLL6996LLLL6L
L699LLL66LLL996L
L969LLLLLLLL969L
................
................
................
`],
    [wall, bitmap`
1L1L1L1L1L1L1L1L
L0L0L0L0L0L0L0L1
1L2100000000120L
L0121000000121L1
1L0121000012100L
L0001210012100L1
1L0001211210000L
L0000012210000L1
1L0000122100000L
L0000121121000L1
1L0012100121000L
L0012100001210L1
1L1210000001210L
L0210000000012L1
1L0L0L0L0L0L0L0L
L1L1L1L1L1L1L1L1`]
)


setSolids([door_closed_horiz, wall, player])

let home = map`
.......
wwwdwww
wzzzzzw
wzjjjzw
wzzzzzw
wwwwwww`
let lev1 = map`
................................
wwwwwwwwwwwwwwwwwwwwwwwwwwwwwwww
wfffffffffffffwfffffwfwfwfwfffww
wfwwwwwwwwwwfwwwwwwffffffffwwffw
wffffffffffffwfwwffwfwwwfwffwfww
wfwfwwwwwwwwfwfwfwfwfwfwfwfwfffw
wffffwfffffffffffffwfwfwfwfwfwww
wwwwfwfwwwwwwwwwwwfwfwffffffffww
wwwffwwwwwwwwfwfwwfffffwwfwwwwww
wwfwfwfwffwwffwffwfwwwwwffwffffw
wwfffffwfwfffwfwfwfffffwwwwfwfww
wwfwwwwffwfwwwfffwwwwwfwwfffwwww
wfffwffffwffwwfwfwfffffwffwfwfww
wwwfwfwwwwfffwffwfwwfwwfwfwffffw
wfffffffwwwfwfwfwfffffffwfwfwfww
wfwfwwwwwfffwfffwfwwwwwwffffwfww
wfwfwfffffwwfwfwwffwwwwwfwwwwfww
wfwfwfwwwwfwfwfffwfffwwwfwwfwffw
wfffffwffffwffwfwfwfwfffffffwfww
wwwwwfwwfwwffwwfffwfwwwwwfwwfffw
wfwffffwfwffwfwfwwwffwfffffwfwfw
wfwfwwfffwfwffwffwffwffwwwwffwfw
wfffffwwwwfwfwfwfwfwfwfwfwwwffww
wfwwwffffffffffwfwfffwffffffwfww
wfffwfwwfwwwwwfwfwwffwfwwfwffffw
wwwffwfwfffwfwfwfwfffwfffwwwwwfw
wfwwfffwfwfwfwwffwwwfwfwfffffffw
wfwfffwfffffffffwffffwfwfwfwfwfw
wfwfwfffwfwwwwwfwfwwwfffwwfwffww
wfffwfwwwfwfffwfwfffwwfwwwfwfwfw
wfwwwfffffffwfwfffwffwffwwffwffw
wfffffwfwfwfffffwwwwfffwwwwfffww
wwwwwwwwwwwwwwwdwwwwwwwwwwwwwwww`
let end = map`
wwwwwww
w.....w
w.....w
w.....w
wwwwwww`

const bg = tune`
166.66666666666666: a4-166.66666666666666 + e5/166.66666666666666 + c5^166.66666666666666,
166.66666666666666: e4-166.66666666666666 + a4-166.66666666666666 + a5/166.66666666666666 + e5^166.66666666666666,
166.66666666666666: a4-166.66666666666666 + e5/166.66666666666666 + c5^166.66666666666666,
166.66666666666666: a4-166.66666666666666 + e4-166.66666666666666 + d5/166.66666666666666 + b4^166.66666666666666,
166.66666666666666: a4-166.66666666666666 + c5/166.66666666666666,
166.66666666666666: a4-166.66666666666666 + e4-166.66666666666666 + d5/166.66666666666666 + b4^166.66666666666666,
166.66666666666666: a4-166.66666666666666 + c5/166.66666666666666,
166.66666666666666: a4/166.66666666666666 + e4-166.66666666666666,
166.66666666666666: f4-166.66666666666666 + a4/166.66666666666666,
166.66666666666666: f4-166.66666666666666 + c4-166.66666666666666 + c5/166.66666666666666 + a4^166.66666666666666,
166.66666666666666: f4-166.66666666666666 + b4/166.66666666666666 + g4^166.66666666666666,
166.66666666666666: f4-166.66666666666666 + c4-166.66666666666666 + a4/166.66666666666666,
166.66666666666666: g4-166.66666666666666 + b4/166.66666666666666,
166.66666666666666: g4-166.66666666666666 + d4-166.66666666666666 + c5/166.66666666666666 + a4^166.66666666666666,
166.66666666666666: g4-166.66666666666666 + d5/166.66666666666666 + b4^166.66666666666666,
166.66666666666666: g4-166.66666666666666 + d4-166.66666666666666 + g5/166.66666666666666 + d5^166.66666666666666,
166.66666666666666: a4-166.66666666666666 + e5/166.66666666666666 + c5^166.66666666666666,
166.66666666666666: a4-166.66666666666666 + e4-166.66666666666666 + a5/166.66666666666666 + e5^166.66666666666666,
166.66666666666666: a4-166.66666666666666 + e5/166.66666666666666 + c5^166.66666666666666,
166.66666666666666: a4-166.66666666666666 + e4-166.66666666666666 + d5/166.66666666666666 + b4^166.66666666666666,
166.66666666666666: a4-166.66666666666666 + e5/166.66666666666666,
166.66666666666666: a4-166.66666666666666 + e4-166.66666666666666 + d5/166.66666666666666 + b4^166.66666666666666,
166.66666666666666: a4-166.66666666666666 + c5/166.66666666666666,
166.66666666666666: a4/166.66666666666666 + e4-166.66666666666666,
166.66666666666666: f4-166.66666666666666 + a4/166.66666666666666,
166.66666666666666: f4-166.66666666666666 + c4-166.66666666666666 + b4/166.66666666666666 + g4^166.66666666666666,
166.66666666666666: f4-166.66666666666666 + c5/166.66666666666666 + a4^166.66666666666666,
166.66666666666666: f4-166.66666666666666 + c4-166.66666666666666 + b4/166.66666666666666 + g4^166.66666666666666,
166.66666666666666: g4-166.66666666666666,
166.66666666666666: g4-166.66666666666666 + d4-166.66666666666666 + a4/166.66666666666666 + e4^166.66666666666666,
166.66666666666666: g4/166.66666666666666,
166.66666666666666: g4-166.66666666666666 + d4-166.66666666666666 + a4/166.66666666666666 + c4^166.66666666666666,
166.66666666666666: a4-166.66666666666666 + e5/166.66666666666666 + c5^166.66666666666666,
166.66666666666666: e4-166.66666666666666 + a4-166.66666666666666 + a5/166.66666666666666 + e5^166.66666666666666,
166.66666666666666: a4-166.66666666666666 + e5/166.66666666666666 + c5^166.66666666666666,
166.66666666666666: a4-166.66666666666666 + e4-166.66666666666666 + d5/166.66666666666666 + b4^166.66666666666666,
166.66666666666666: a4-166.66666666666666 + c5/166.66666666666666,
166.66666666666666: a4-166.66666666666666 + e4-166.66666666666666 + d5/166.66666666666666 + b4^166.66666666666666,
166.66666666666666: a4-166.66666666666666 + c5/166.66666666666666,
166.66666666666666: a4/166.66666666666666 + e4-166.66666666666666,
166.66666666666666: f4-166.66666666666666 + a4/166.66666666666666,
166.66666666666666: f4-166.66666666666666 + c4-166.66666666666666 + c5/166.66666666666666 + a4^166.66666666666666,
166.66666666666666: f4-166.66666666666666 + b4/166.66666666666666 + g4^166.66666666666666,
166.66666666666666: f4-166.66666666666666 + c4-166.66666666666666 + a4/166.66666666666666,
166.66666666666666: g4-166.66666666666666 + b4/166.66666666666666,
166.66666666666666: g4-166.66666666666666 + d4-166.66666666666666 + c5/166.66666666666666 + a4^166.66666666666666,
166.66666666666666: g4-166.66666666666666 + d5/166.66666666666666 + b4^166.66666666666666,
166.66666666666666: g4-166.66666666666666 + d4-166.66666666666666 + g5/166.66666666666666 + d5^166.66666666666666,
166.66666666666666: a4-166.66666666666666 + e5/166.66666666666666 + c5^166.66666666666666,
166.66666666666666: a4-166.66666666666666 + e4-166.66666666666666 + a5/166.66666666666666 + e5^166.66666666666666,
166.66666666666666: a4-166.66666666666666 + e5/166.66666666666666 + c5^166.66666666666666,
166.66666666666666: a4-166.66666666666666 + e4-166.66666666666666 + d5/166.66666666666666 + b4^166.66666666666666,
166.66666666666666: a4-166.66666666666666 + e5/166.66666666666666,
166.66666666666666: a4-166.66666666666666 + e4-166.66666666666666 + d5/166.66666666666666 + b4^166.66666666666666,
166.66666666666666: a4-166.66666666666666 + c5/166.66666666666666,
166.66666666666666: a4/166.66666666666666 + e4-166.66666666666666,
166.66666666666666: f4-166.66666666666666 + a4/166.66666666666666,
166.66666666666666: f4-166.66666666666666 + c4-166.66666666666666 + b4/166.66666666666666 + g4^166.66666666666666,
166.66666666666666: f4-166.66666666666666 + c5/166.66666666666666 + a4^166.66666666666666,
166.66666666666666: f4-166.66666666666666 + c4-166.66666666666666 + b4/166.66666666666666 + g4^166.66666666666666,
166.66666666666666: g4-166.66666666666666,
166.66666666666666: g4-166.66666666666666 + d4-166.66666666666666 + a4/166.66666666666666 + e4^166.66666666666666,
166.66666666666666: g4/166.66666666666666,
166.66666666666666: g4-166.66666666666666 + d4-166.66666666666666 + a4/166.66666666666666 + c4^166.66666666666666,
166.66666666666666: a4-166.66666666666666 + e5/166.66666666666666 + c5^166.66666666666666,
166.66666666666666: a4-166.66666666666666 + e4-166.66666666666666 + a5/166.66666666666666 + e5^166.66666666666666,
166.66666666666666: a4-166.66666666666666 + e5/166.66666666666666 + c5^166.66666666666666,
166.66666666666666: a4-166.66666666666666 + e4-166.66666666666666 + a5/166.66666666666666 + e5^166.66666666666666,
166.66666666666666: g5/166.66666666666666 + g4-166.66666666666666 + d5^166.66666666666666,
166.66666666666666: e5/166.66666666666666 + g4-166.66666666666666 + d4-166.66666666666666 + b4^166.66666666666666,
166.66666666666666: c5/166.66666666666666 + g4-166.66666666666666,
166.66666666666666: g5/166.66666666666666 + g4-166.66666666666666 + d4-166.66666666666666 + e5^166.66666666666666,
166.66666666666666: f4-166.66666666666666 + f5/166.66666666666666 + d5^166.66666666666666,
166.66666666666666: f4-166.66666666666666 + c4-166.66666666666666 + c5/166.66666666666666 + a4^166.66666666666666,
166.66666666666666: f4-166.66666666666666 + d5/166.66666666666666 + b4^166.66666666666666,
166.66666666666666: f4-166.66666666666666 + c4-166.66666666666666 + e5/166.66666666666666 + c5^166.66666666666666,
166.66666666666666: g4-166.66666666666666 + d5/166.66666666666666 + b4^166.66666666666666,
166.66666666666666: g4-166.66666666666666 + d4-166.66666666666666 + e5/166.66666666666666 + c5^166.66666666666666,
166.66666666666666: g4-166.66666666666666 + g5/166.66666666666666 + d5^166.66666666666666,
166.66666666666666: g4-166.66666666666666 + d4-166.66666666666666 + a5/166.66666666666666 + e5^166.66666666666666,
166.66666666666666: a4-166.66666666666666 + e5/166.66666666666666 + c5^166.66666666666666,
166.66666666666666: a4-166.66666666666666 + e4-166.66666666666666 + a5/166.66666666666666 + e5^166.66666666666666,
166.66666666666666: a4-166.66666666666666 + e5/166.66666666666666 + c5^166.66666666666666,
166.66666666666666: a4-166.66666666666666 + e4-166.66666666666666 + a5/166.66666666666666 + e5^166.66666666666666,
166.66666666666666: g5/166.66666666666666 + g4-166.66666666666666 + d5^166.66666666666666,
166.66666666666666: e5/166.66666666666666 + g4-166.66666666666666 + d4-166.66666666666666 + b4^166.66666666666666,
166.66666666666666: c5/166.66666666666666 + g4-166.66666666666666,
166.66666666666666: g5/166.66666666666666 + g4-166.66666666666666 + d4-166.66666666666666 + e5^166.66666666666666,
166.66666666666666: f4-166.66666666666666 + f5/166.66666666666666 + d5^166.66666666666666,
166.66666666666666: f4-166.66666666666666 + c4-166.66666666666666 + c5/166.66666666666666 + a4^166.66666666666666,
166.66666666666666: f4-166.66666666666666 + d5/166.66666666666666 + b4^166.66666666666666,
166.66666666666666: f4-166.66666666666666 + c4-166.66666666666666 + e5/166.66666666666666 + c5^166.66666666666666,
166.66666666666666: g4-166.66666666666666 + d5/166.66666666666666 + b4^166.66666666666666,
166.66666666666666: g4-166.66666666666666 + d4-166.66666666666666 + b4/166.66666666666666,
166.66666666666666: g4/166.66666666666666 + d4^166.66666666666666,
166.66666666666666: g4-166.66666666666666 + d4/166.66666666666666,
166.66666666666666: a4-166.66666666666666 + e5/166.66666666666666 + c5^166.66666666666666,
166.66666666666666: a4-166.66666666666666 + e4-166.66666666666666 + a5/166.66666666666666 + e5^166.66666666666666,
166.66666666666666: a4-166.66666666666666 + e5/166.66666666666666 + c5^166.66666666666666,
166.66666666666666: a4-166.66666666666666 + e4-166.66666666666666 + a5/166.66666666666666 + e5^166.66666666666666,
166.66666666666666: g5/166.66666666666666 + g4-166.66666666666666 + d5^166.66666666666666,
166.66666666666666: e5/166.66666666666666 + g4-166.66666666666666 + d4-166.66666666666666 + b4^166.66666666666666,
166.66666666666666: c5/166.66666666666666 + g4-166.66666666666666,
166.66666666666666: g5/166.66666666666666 + g4-166.66666666666666 + d4-166.66666666666666 + e5^166.66666666666666,
166.66666666666666: f4-166.66666666666666 + f5/166.66666666666666 + d5^166.66666666666666,
166.66666666666666: f4-166.66666666666666 + c4-166.66666666666666 + c5/166.66666666666666 + a4^166.66666666666666,
166.66666666666666: f4-166.66666666666666 + d5/166.66666666666666 + b4^166.66666666666666,
166.66666666666666: f4-166.66666666666666 + c4-166.66666666666666 + e5/166.66666666666666 + c5^166.66666666666666,
166.66666666666666: g4-166.66666666666666 + d5/166.66666666666666 + b4^166.66666666666666,
166.66666666666666: g4-166.66666666666666 + d4-166.66666666666666 + e5/166.66666666666666 + c5^166.66666666666666,
166.66666666666666: g4-166.66666666666666 + g5/166.66666666666666 + d5^166.66666666666666,
166.66666666666666: g4-166.66666666666666 + d4-166.66666666666666 + a5/166.66666666666666 + e5^166.66666666666666,
166.66666666666666: a4-166.66666666666666 + e5/166.66666666666666 + c5^166.66666666666666,
166.66666666666666: a4-166.66666666666666 + e4-166.66666666666666 + a5/166.66666666666666 + e5^166.66666666666666,
166.66666666666666: a4-166.66666666666666 + e5/166.66666666666666 + c5^166.66666666666666,
166.66666666666666: a4-166.66666666666666 + e4-166.66666666666666 + a5/166.66666666666666 + e5^166.66666666666666,
166.66666666666666: g5/166.66666666666666 + g4-166.66666666666666 + d5^166.66666666666666,
166.66666666666666: e5/166.66666666666666 + g4-166.66666666666666 + d4-166.66666666666666 + b4^166.66666666666666,
166.66666666666666: c5/166.66666666666666 + g4-166.66666666666666,
166.66666666666666: g5/166.66666666666666 + g4-166.66666666666666 + d4-166.66666666666666 + e5^166.66666666666666,
166.66666666666666: f4-166.66666666666666 + f5/166.66666666666666 + d5^166.66666666666666,
166.66666666666666: f4-166.66666666666666 + c4-166.66666666666666 + c5/166.66666666666666 + a4^166.66666666666666,
166.66666666666666: f4-166.66666666666666 + d5/166.66666666666666 + b4^166.66666666666666,
166.66666666666666: f4-166.66666666666666 + c4-166.66666666666666 + e5/166.66666666666666 + c5^166.66666666666666,
166.66666666666666: g4-166.66666666666666 + d5/166.66666666666666 + b4^166.66666666666666,
166.66666666666666: g4-166.66666666666666 + d4-166.66666666666666 + b4/166.66666666666666,
166.66666666666666: g4/166.66666666666666 + d4^166.66666666666666,
166.66666666666666: g4-166.66666666666666 + d4/166.66666666666666,
166.66666666666666: a4/166.66666666666666,
166.66666666666666: a4-166.66666666666666 + b4/166.66666666666666 + e4-166.66666666666666,
166.66666666666666: a4-166.66666666666666 + c5/166.66666666666666,
166.66666666666666: a4-166.66666666666666 + b4/166.66666666666666 + e4-166.66666666666666,
166.66666666666666: g4-166.66666666666666,
166.66666666666666: g4-166.66666666666666 + a4/166.66666666666666 + d4-166.66666666666666,
166.66666666666666: g4/166.66666666666666,
166.66666666666666: g4-166.66666666666666 + d4-166.66666666666666,
166.66666666666666: f4-166.66666666666666 + a4/166.66666666666666,
166.66666666666666: f4-166.66666666666666 + c4-166.66666666666666,
166.66666666666666: f4-166.66666666666666 + b4/166.66666666666666,
166.66666666666666: f4-166.66666666666666 + c5/166.66666666666666 + c4-166.66666666666666,
166.66666666666666: g4-166.66666666666666 + b4/166.66666666666666,
166.66666666666666: g4-166.66666666666666 + d4-166.66666666666666,
166.66666666666666: g4/166.66666666666666,
166.66666666666666: g4-166.66666666666666 + d4-166.66666666666666,
166.66666666666666: a4/166.66666666666666,
166.66666666666666: a4-166.66666666666666 + b4/166.66666666666666 + e4-166.66666666666666,
166.66666666666666: a4-166.66666666666666 + c5/166.66666666666666,
166.66666666666666: a4-166.66666666666666 + b4/166.66666666666666 + e4-166.66666666666666,
166.66666666666666: g4-166.66666666666666,
166.66666666666666: g4-166.66666666666666 + c5/166.66666666666666 + d4-166.66666666666666,
166.66666666666666: g4-166.66666666666666 + d5/166.66666666666666,
166.66666666666666: g4-166.66666666666666 + e5/166.66666666666666 + d4-166.66666666666666,
166.66666666666666: f4-166.66666666666666,
166.66666666666666: f4-166.66666666666666 + c5/166.66666666666666 + c4-166.66666666666666,
166.66666666666666: f4-166.66666666666666,
166.66666666666666: f4-166.66666666666666 + d5/166.66666666666666 + c4-166.66666666666666,
166.66666666666666: g4-166.66666666666666,
166.66666666666666: g4-166.66666666666666 + c5/166.66666666666666 + d4-166.66666666666666,
166.66666666666666: g4-166.66666666666666 + b4/166.66666666666666,
166.66666666666666: g4-166.66666666666666 + c5/166.66666666666666 + d4-166.66666666666666
166.66666666666666: a4/166.66666666666666,
166.66666666666666: a4-166.66666666666666 + b4/166.66666666666666 + e4-166.66666666666666,
166.66666666666666: a4-166.66666666666666 + c5/166.66666666666666,
166.66666666666666: a4-166.66666666666666 + b4/166.66666666666666 + e4-166.66666666666666,
166.66666666666666: g4-166.66666666666666,
166.66666666666666: g4-166.66666666666666 + a4/166.66666666666666 + d4-166.66666666666666,
166.66666666666666: g4/166.66666666666666,
166.66666666666666: g4-166.66666666666666 + d4-166.66666666666666,
166.66666666666666: f4-166.66666666666666 + a4/166.66666666666666,
166.66666666666666: f4-166.66666666666666 + c4-166.66666666666666,
166.66666666666666: f4-166.66666666666666 + b4/166.66666666666666,
166.66666666666666: f4-166.66666666666666 + c5/166.66666666666666 + c4-166.66666666666666,
166.66666666666666: g4-166.66666666666666 + b4/166.66666666666666,
166.66666666666666: g4-166.66666666666666 + d4-166.66666666666666,
166.66666666666666: g4/166.66666666666666,
166.66666666666666: g4-166.66666666666666 + d4-166.66666666666666,
166.66666666666666: a4/166.66666666666666,
166.66666666666666: a4-166.66666666666666 + b4/166.66666666666666 + e4-166.66666666666666,
166.66666666666666: a4-166.66666666666666 + c5/166.66666666666666,
166.66666666666666: a4-166.66666666666666 + b4/166.66666666666666 + e4-166.66666666666666,
166.66666666666666: g4-166.66666666666666,
166.66666666666666: g4-166.66666666666666 + c5/166.66666666666666 + d4-166.66666666666666,
166.66666666666666: g4-166.66666666666666 + d5/166.66666666666666,
166.66666666666666: g4-166.66666666666666 + e5/166.66666666666666 + d4-166.66666666666666,
166.66666666666666: f4-166.66666666666666,
166.66666666666666: f4-166.66666666666666 + c5/166.66666666666666 + c4-166.66666666666666,
166.66666666666666: f4-166.66666666666666,
166.66666666666666: f4-166.66666666666666 + d5/166.66666666666666 + c4-166.66666666666666,
166.66666666666666: g4-166.66666666666666,
166.66666666666666: g4-166.66666666666666 + c5/166.66666666666666 + d4-166.66666666666666,
166.66666666666666: g4-166.66666666666666 + b4/166.66666666666666,
166.66666666666666: g4-166.66666666666666 + c5/166.66666666666666 + d4-166.66666666666666,
166.66666666666666: a5/166.66666666666666 + a4-166.66666666666666 + e4-166.66666666666666,
166.66666666666666: b5/166.66666666666666 + a4-166.66666666666666,
166.66666666666666: a5/166.66666666666666 + a4-166.66666666666666,
166.66666666666666: g5/166.66666666666666 + d4-166.66666666666666 + g4-166.66666666666666,
166.66666666666666,
166.66666666666666: e5/166.66666666666666 + g4-166.66666666666666,
166.66666666666666,
166.66666666666666: c5/166.66666666666666 + g4-166.66666666666666,
166.66666666666666: d5/166.66666666666666 + f4-166.66666666666666 + c4-166.66666666666666,
166.66666666666666: e5/166.66666666666666 + f4-166.66666666666666,
166.66666666666666: d5/166.66666666666666 + f4-166.66666666666666,
166.66666666666666: c5/166.66666666666666 + f4-166.66666666666666 + c4-166.66666666666666,
166.66666666666666,
166.66666666666666: a4/166.66666666666666 + c4-166.66666666666666,
166.66666666666666: g4/166.66666666666666 + c4-166.66666666666666,
166.66666666666666: a4/166.66666666666666 + c4-166.66666666666666,
166.66666666666666: b4/166.66666666666666 + d4-166.66666666666666,
166.66666666666666: c5/166.66666666666666 + g4-166.66666666666666,
166.66666666666666: b4/166.66666666666666 + d4-166.66666666666666,
166.66666666666666: c5/166.66666666666666 + g4-166.66666666666666,
166.66666666666666: b4/166.66666666666666 + d4-166.66666666666666,
166.66666666666666: c5/166.66666666666666 + g4-166.66666666666666,
166.66666666666666: b4/166.66666666666666 + d4-166.66666666666666,
166.66666666666666: d5/166.66666666666666 + g4-166.66666666666666,
166.66666666666666: a4/166.66666666666666 + e4-166.66666666666666,
166.66666666666666: b4/166.66666666666666 + a4-166.66666666666666,
166.66666666666666: a4/166.66666666666666,
166.66666666666666: g4/166.66666666666666 + a4-166.66666666666666 + e4-166.66666666666666,
166.66666666666666,
166.66666666666666: e4/166.66666666666666 + a4-166.66666666666666,
166.66666666666666: g4/166.66666666666666 + a4-166.66666666666666,
166.66666666666666: a4/166.66666666666666 + e4-166.66666666666666
166.66666666666666: a5/166.66666666666666 + a4-166.66666666666666 + e4-166.66666666666666,
166.66666666666666: b5/166.66666666666666 + a4-166.66666666666666,
166.66666666666666: a5/166.66666666666666 + a4-166.66666666666666,
166.66666666666666: g5/166.66666666666666 + d4-166.66666666666666 + g4-166.66666666666666,
166.66666666666666,
166.66666666666666: e5/166.66666666666666 + g4-166.66666666666666,
166.66666666666666,
166.66666666666666: c5/166.66666666666666 + g4-166.66666666666666,
166.66666666666666: d5/166.66666666666666 + f4-166.66666666666666 + c4-166.66666666666666,
166.66666666666666: e5/166.66666666666666 + f4-166.66666666666666,
166.66666666666666: d5/166.66666666666666 + f4-166.66666666666666,
166.66666666666666: c5/166.66666666666666 + f4-166.66666666666666 + c4-166.66666666666666,
166.66666666666666,
166.66666666666666: a4/166.66666666666666 + c4-166.66666666666666,
166.66666666666666: g4/166.66666666666666 + c4-166.66666666666666,
166.66666666666666: a4/166.66666666666666 + c4-166.66666666666666,
166.66666666666666: b4/166.66666666666666 + d4-166.66666666666666,
166.66666666666666: c5/166.66666666666666 + g4-166.66666666666666,
166.66666666666666: b4/166.66666666666666 + d4-166.66666666666666,
166.66666666666666: c5/166.66666666666666 + g4-166.66666666666666,
166.66666666666666: b4/166.66666666666666 + d4-166.66666666666666,
166.66666666666666: c5/166.66666666666666 + g4-166.66666666666666,
166.66666666666666: b4/166.66666666666666 + d4-166.66666666666666,
166.66666666666666: d5/166.66666666666666 + g4-166.66666666666666,
166.66666666666666: a4/166.66666666666666 + e4-166.66666666666666,
166.66666666666666: b4/166.66666666666666 + a4-166.66666666666666,
166.66666666666666: a4/166.66666666666666,
166.66666666666666: g4/166.66666666666666 + a4-166.66666666666666 + e4-166.66666666666666,
166.66666666666666,
166.66666666666666: e4/166.66666666666666 + a4-166.66666666666666,
166.66666666666666: g4/166.66666666666666 + a4-166.66666666666666,
166.66666666666666: a4/166.66666666666666 + e4-166.66666666666666,
166.66666666666666: a5-166.66666666666666,
166.66666666666666: a4-166.66666666666666,
166.66666666666666: a4-166.66666666666666,
166.66666666666666: a5-166.66666666666666,
166.66666666666666: a4-166.66666666666666,
166.66666666666666: a4-166.66666666666666,
166.66666666666666: a5-166.66666666666666,
166.66666666666666: a4-166.66666666666666,
166.66666666666666: a4-166.66666666666666 + a5-166.66666666666666,
166.66666666666666,
166.66666666666666: a4-166.66666666666666,
166.66666666666666: a4-166.66666666666666 + a5-166.66666666666666,
166.66666666666666: c4/166.66666666666666 + c5/166.66666666666666 + g4^166.66666666666666 + g5^166.66666666666666,
166.66666666666666: a4-166.66666666666666 + e4/166.66666666666666 + e5/166.66666666666666 + g4^166.66666666666666 + g5^166.66666666666666,
166.66666666666666: a5/166.66666666666666 + a4/166.66666666666666 + g4^166.66666666666666 + g5^166.66666666666666,
166.66666666666666: a4-166.66666666666666 + b4/166.66666666666666 + b5/166.66666666666666 + g4^166.66666666666666 + g5^166.66666666666666,
`;

playTune(bg, Infinity)

function spawnKeys(n) {
    const tiles = getAll(floor)
    const indexes = []
    for (let i = 0; i < n; i++) {
        indexes.push(Math.floor(Math.random() * (tiles.length + 1)))
    }

    for (const index of indexes) {
        const key_tile = tiles[index]

        addSprite(key_tile.x, key_tile.y, key)
    }
}

function displayHearts() {
    for (let i = 0; i < 10; i++) {
        clearTile(i, 0)
    }
    for (let i = 0; i < health; i++) {
        addSprite(i, 0, heart)
    }
}

function displayKeys(offset = 0) {
    for (let i = offset; i < offset + 3; i++) {
        clearTile(i, 0)
    }
    for (let i = offset; i < offset + key_inv; i++) {
        addSprite(i, 0, key)
    }
}

setMap(home)
addSprite(3, 2, player)

onInput('w', () => {
  if(!getFirst(player)) return;
    getFirst(player).y -= 1
})

onInput('a', () => {
  if(!getFirst(player)) return;
    getFirst(player).x -= 1
})

onInput('s', () => {
  if(!getFirst(player)) return;
    getFirst(player).y += 1
})

onInput('d', () => {
  if(!getFirst(player)) return;
    getFirst(player).x += 1
})

afterInput(() => {
    if (stored_keys.length === 3) {
        gameEnd = true
        setMap(end)
        addText("You win!", {
            x: 6,
            y: 6,
            color: color`D`
        })
    }

    if (health === 0) {
        gameEnd = true
        setMap(end)
        addText("You lose.", {
            x: 6,
            y: 6,
            color: color`3`
        })
    }

    const door_tile = tilesWith(door_open, player)
    if (door_tile.length > 0) {
        if (width() !== 32) {
            setMap(lev1)
            const door_position = [getFirst(door_open).x, getFirst(door_open).y]
            addSprite(door_position[0], door_position[1] - 1, player)
            spawnKeys(3 - stored_keys.length)
            maze_enter_time = Date.now()
            time_end = maze_enter_time + 10 * 1000
        } else {
            setMap(home)
            const door_position = [getFirst(door_open).x, getFirst(door_open).y]
            addSprite(door_position[0], door_position[1] + 1, player)
            for (const key_pos of stored_keys) {
                addSprite(key_pos.x, key_pos.y, key)
            }
            clearText()
            health = 10
            health_degrading = false
        }
    }

    if (width() === 32) {
        displayHearts()
        displayKeys(11)

        if (Date.now() < time_end) {
            clearText()
            const seconds_left = Math.floor((time_end - Date.now()) / 1000)
            addText(seconds_left.toString(), {
                x: 18,
                color: color`2`
            })
        } else {
            clearText()
            addText("Run!", {
                x: 16,
                color: color`3`
            })

            if (!health_degrading) {
                health_degrading = true
                next_health_degrade = Date.now() + 2 * 1000
            }
        }

        if (health_degrading && Date.now() >= next_health_degrade) {
            health -= 1
            next_health_degrade = Date.now() + 2 * 1000
        }

        const key_player_tiles = tilesWith(key, player)
        const pos = [getFirst(player).x, getFirst(player).y]

        if (key_player_tiles.length > 0) {
            clearTile(pos[0], pos[1])
            addSprite(pos[0], pos[1], player)
            addSprite(pos[0], pos[1], floor)

            key_inv += 1
        }
    } else {
        if (!gameEnd) {
            displayKeys()

            const pedestal_player_tiles = tilesWith(key_pedestal, player)
            const pos = [getFirst(player).x, getFirst(player).y]

            if (pedestal_player_tiles.length > 0 && key_inv > 0) {
                const tile = getTile(pos[0], pos[1])
                for (const sprite of tile) {
                    if (sprite._type === key) return
                }

                addSprite(pos[0], pos[1], key)
                stored_keys.push({ x: pos[0], y: pos[1] })
                key_inv -= 1
            }
        }
    }
})