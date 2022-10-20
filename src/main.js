import IMask from "imask"
import "./css/index.css"

// Bandeira do cartão
function setCardType(type) {
  const ccBgColor01 = document.querySelector(".cc-bg svg > g g:nth-child(1) path")
  const ccBgColor02 = document.querySelector(".cc-bg svg > g g:nth-child(2) path")
  const ccLogo = document.querySelector(".cc-logo span:nth-child(2) img")

  const colors = {
    visa: ["#436d99", "#2d57f2"],
    mastercard: ["#df6f29", "#c69347"],
    nubank: ["#820ad1", "#4b067a"],
    apple: ["#a6a6a6", "#999999"],
    default: ["black", "gray"]
  }

  ccBgColor01.setAttribute("fill", colors[type][0])
  ccBgColor02.setAttribute("fill", colors[type][1])
  ccLogo.setAttribute("src", `cc-${type}.svg`)
}

globalThis.setCardType = setCardType

// Número do cartão
const cardNumber = document.getElementById("card-number")

const cardNumberPattern = {
  mask: [
    {
      mask: "0000 0000 0000 0000",
      regex: /^4\d{0,15}/,
      cardType: "visa",
    },
    {
      mask: "0000 0000 0000 0000",
      regex: /(^5[1-5]\d{0,2}|^22[2-9]\d|^2[3-7]\d{0,2})\d{0,12}/,
      cardType: "mastercard",
    },
    {
      mask: "0000 0000 0000 0000",
      regex: /^5[7-8]\d{0,14}/,
      cardType: "nubank",
    },
    {
      mask: "0000 0000 0000 0000",
      regex: /^7[2-8]\d{0,14}/,
      cardType: "apple",
    },
    {
      mask: "0000 0000 0000 0000",
      cardType: "default",
    }
  ],
  dispatch: function (append, dynamicMasked) {
    const number = (dynamicMasked.value + append).replace(/\D/g, "")

    const foundMask = dynamicMasked.compiledMasks.find(function (item) {
      return number.match(item.regex)
    })

    // console.log(foundMask)

    return foundMask
  }
}

const cardNumberMasked = IMask(cardNumber, cardNumberPattern)

cardNumberMasked.on("accept", () => {
  const cardType = cardNumberMasked.masked.currentMask.cardType
  setCardType(cardType)

  updateCardNumber(cardNumberMasked.value)
})

function updateCardNumber(number) {
  const ccCardNumber = document.querySelector(".cc-info .cc-number")
  ccCardNumber.textContent = number ? number : "1234 5678 9012 3456"
}

// Nome do titular
const cardHolder = document.getElementById("card-holder")
cardHolder.addEventListener("input", () => {
  const ccHolder = document.querySelector(".cc-holder .value")

  ccHolder.textContent = cardHolder.value ? cardHolder.value : "fulano da silva"
})

// Expiração
const expirationDate = document.getElementById("expiration-date")

const expirationDatePattern = {
  mask: "MM{/}YY",
  blocks: {
    MM: {
      mask: IMask.MaskedRange,
      from: 1,
      to: 12
    },
    YY: {
      mask: IMask.MaskedRange,
      from: String(new Date().getFullYear()).slice(2),
      to: String(new Date().getFullYear() + 10).slice(2)
    }
  }
}

const expirationDateMasked = IMask(expirationDate, expirationDatePattern)

expirationDateMasked.on("accept", () => {
  updateExpirationDate(expirationDateMasked.value)
})

function updateExpirationDate(date) {
  const ccExpirationDate = document.querySelector(".cc-expiration .value")
  ccExpirationDate.textContent = date ? date : "02/32"
}

// CVC
const securityCode = document.getElementById("security-code")

const securityCodePattern = {
  mask: "0000"
}

const securityCodeMasked = IMask(securityCode, securityCodePattern)

securityCodeMasked.on("accept", () => {
  updateSecurityCode(securityCodeMasked.value)
})

function updateSecurityCode(code) {
  const ccSecurity = document.querySelector(".cc-security .value")
  ccSecurity.textContent = code ? code : "123"
}

// Botão
const addButton = document.getElementById("add-card")
addButton.addEventListener("click", () => {
  alert("Cartão adicionado!")
})

document.querySelector("form").addEventListener("submit", (event) => {
  event.preventDefault()
})