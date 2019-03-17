const startButton = document.getElementById("start-button")
const instructions = document.getElementById("instructions-text")
const mainPlayArea = document.getElementById("main-play-area")
const shooter = document.getElementById("player-controlled-shooter")
const planeImgs = ['images/plane-1.png', 'images/plane-2.png', 'images/plane-3.png']
const scoreCounter = document.querySelector('#score span')
let planeInterval


startButton.addEventListener("click", (event) => {
  playGame()
})


function letShipMove(event) {
  if (event.key === "ArrowUp") {
    event.preventDefault()
    moveUp()
  } else if (event.key === "ArrowDown") {
    event.preventDefault()
    moveDown()
  } else if (event.key === " ") {
    event.preventDefault()
    fireBullet()
  }
}


function moveUp() {
  let topPosition = window.getComputedStyle(shooter).getPropertyValue('top')
  if (shooter.style.top === "-10px") {
    return
  } else {
    let position = parseInt(topPosition)
    position -= 10
    shooter.style.top = `${position}px`
  }
}


function moveDown() {
  let topPosition = window.getComputedStyle(shooter).getPropertyValue('top')
  if (shooter.style.top === "360px") {
    return
  } else {
    let position = parseInt(topPosition)
    position += 10
    shooter.style.top = `${position}px`
  }
}


function fireBullet() {
  let bullet = createBulletElement()
  mainPlayArea.appendChild(bullet)
  let bulletSFX = new Audio('audio/AAsounds.mov')
  bulletSFX.play()
  moveBullet(bullet)
}


function createBulletElement() {
  let xPosition = parseInt(window.getComputedStyle(shooter).getPropertyValue('left'))
  let yPosition = parseInt(window.getComputedStyle(shooter).getPropertyValue('top'))
  let newBullet = document.createElement('img')
  newBullet.src = 'images/bullet.png'
  newBullet.classList.add('bullet')
  newBullet.style.left = `${xPosition}px`
  newBullet.style.top = `${yPosition - 10}px`
  return newBullet
}


function moveBullet(bullet) {
  let bulletInterval = setInterval(() => {
    let xPosition = parseInt(bullet.style.left)
    let planes = document.querySelectorAll(".plane")
    planes.forEach(plane => {
      if (checkLaserCollision(bullet, plane)) {
        plane.src = "images/explosion.png"
        plane.classList.remove("plane")
        plane.classList.add("dead-plane")
        scoreCounter.innerText = parseInt(scoreCounter.innerText) + 100
      }
    })
    if (xPosition === 540) {
      bullet.remove()
    } else {
      bullet.style.left = `${xPosition + 4}px`
      console.log(xPosition)
    }
  }, 10)
}


function createPlane() {
  let newPlane = document.createElement('img')
  let planeSpriteImg = planeImgs[Math.floor(Math.random()*planeImgs.length)]
  newPlane.src = planeSpriteImg
  newPlane.classList.add('plane')
  newPlane.classList.add('plane-transition')
  newPlane.style.left = '570px'
  newPlane.style.top = `${Math.floor(Math.random() * 330) + 30}px`
  mainPlayArea.appendChild(newPlane)
  movePlane(newPlane)
}


function movePlane(plane) {
  let movePlaneInterval = setInterval(() => {
    let xPosition = parseInt(window.getComputedStyle(plane).getPropertyValue('left'))
    if (xPosition <= 50) {
      if (Array.from(plane.classList).includes("dead-plane")) {plane.remove()
      } else {
        gameOver()
      }
    } else {
      plane.style.left = `${xPosition - 4}px`
    }
  }, 40)
}


function checkLaserCollision(bullet, plane) {
  let bulletLeft = parseInt(bullet.style.left)
  let bulletTop = parseInt(bullet.style.top)
//   let bulletBottom = bulletTop - 20
  let planeTop = parseInt(plane.style.top)
  let planeBottom = planeTop - 30
  let planeLeft = parseInt(plane.style.left)
  if (bulletLeft != 340 && bulletLeft + 40 >= planeLeft) {
    if ( (bulletTop <= planeTop && bulletTop >= planeBottom) ) {
      return true
    } else {
      return false
    }
  } else {
    return false
  }
}


function gameOver() {
  window.removeEventListener("keydown", letShipMove)
  clearInterval(planeInterval)
  let planes = document.querySelectorAll(".plane")
  planes.forEach(plane => plane.remove())
  let lasers = document.querySelectorAll(".bullet")
  lasers.forEach(bullet => bullet.remove())
  setTimeout(() => {
    alert(`Game Over! The fleet has been badly damaged. Your final score is ${scoreCounter.innerText}!`)
    shooter.style.top = "180px"
    startButton.style.display = "block"
    instructions.style.display = "block"
    scoreCounter.innerText = 0
  }, 1100)
}

function playGame() {
  startButton.style.display = 'none'
  instructions.style.display = 'none'
  window.addEventListener("keydown", letShipMove)
  planeInterval = setInterval(() => { createPlane() }, 2100)
}