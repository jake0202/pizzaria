// Função auxiliar para selecionar UM elemento no DOM
const c = (el)=> document.querySelector(el)

// Função auxiliar para selecionar VÁRIOS elementos no DOM
const cs = (el)=> document.querySelectorAll(el)

// Quantidade padrão de pizzas no modal
let modalqt = 1

// Array que vai armazenar os itens do carrinho
let cart = []

// Guarda o índice da pizza atualmente aberta no modal
let modalKey= 0


// ==============================
// LISTAGEM DAS PIZZAS
// ==============================

// Percorre o array pizzaJson criando os cards das pizzas
pizzaJson.map((item, index) =>{

    // Clona o modelo de pizza escondido no HTML
    let pizzaItem = c('.models .pizza-item').cloneNode(true)

    // Define um atributo personalizado com o índice da pizza
    pizzaItem.setAttribute('dataKey', index)

    // Define a imagem da pizza
    pizzaItem.querySelector('.pizza-item--img img').src = item.img

    // Define o nome da pizza
    pizzaItem.querySelector('.pizza-item--name').innerHTML= item.name 

    // Define a descrição da pizza
    pizzaItem.querySelector('.pizza-item--desc').innerHTML= item.description

    // Define o preço formatado
    pizzaItem.querySelector('.pizza-item--price').innerHTML= `R$ ${item.price.toFixed(2)}`

    
    // Evento ao clicar na pizza
    pizzaItem.querySelector('a').addEventListener('click', (e)=>{

        // Impede o comportamento padrão do link
        e.preventDefault()

        // Pega o índice da pizza clicada
        let key = e.target.closest('.pizza-item').getAttribute('dataKey')

        // Reseta a quantidade do modal
        modalqt = 1

        // Salva a pizza atualmente selecionada
        modalKey = key

        // Atualiza imagem do modal
        c('.pizzaBig img').src = pizzaJson[key].img

        // Atualiza nome da pizza no modal
        c('.pizzaInfo h1').innerHTML = pizzaJson[key].name

        // Atualiza descrição
        c('.pizzaInfo--desc').innerHTML = pizzaJson[key].description

        // Atualiza preço
        c('.pizzaInfo--actualPrice').innerHTML =  `R${pizzaJson[key].price.toFixed(2)}`

        // Remove seleção antiga de tamanho
        c('.pizzaInfo--size').classList.remove('selected')

        // Percorre os tamanhos da pizza
        cs('.pizzaInfo--size').forEach((size, sizeIndex)=>{

            // Seleciona automaticamente o tamanho G
            if(sizeIndex == 2) {
                size.classList.add('selected')
            }

            // Atualiza texto do tamanho
            size.querySelector('span').innerHTML = pizzaJson[key].sizes[sizeIndex]
        })

        // Atualiza quantidade inicial no modal
        c('.pizzaInfo--qt').innerHTML = modalqt

        // Exibe o modal com efeito fade
        c('.pizzaWindowArea').style.opacity = 0
        c('.pizzaWindowArea').style.display = 'flex'

        setTimeout(()=>{
           c('.pizzaWindowArea').style.opacity = 1 
        }, 200)

    })

    // Adiciona o card da pizza na tela
    c('.pizza-area').append(pizzaItem)
})


// ==============================
// EVENTOS DO MODAL
// ==============================

// Função responsável por fechar o modal
function closeModal() {

    // Inicia fade out
    c('.pizzaWindowArea').style.opacity = 0

    // Esconde o modal após a animação
    setTimeout(()=>{
         c('.pizzaWindowArea').style.display = 'none'
    }, 500)
}


// Evento dos botões de cancelar/fechar modal
cs('.pizzaInfo--cancelButton, pizzaInfo--cancelMobileButton ').forEach((item)=>{

    item.addEventListener('click', closeModal)
})


// Botão de diminuir quantidade
c('.pizzaInfo--qtmenos').addEventListener('click', ()=>{

    // Só diminui se for maior que 1
    if (modalqt >1) {

        modalqt--

        // Atualiza valor visual
        c('.pizzaInfo--qt').innerHTML = modalqt
    }
})


// Botão de aumentar quantidade
c('.pizzaInfo--qtmais').addEventListener('click', ()=>{

    // Incrementa quantidade
    modalqt++

    // Atualiza valor visual
    c('.pizzaInfo--qt').innerHTML = modalqt
})


// Seleção de tamanho da pizza
cs('.pizzaInfo--size').forEach((size, sizeIndex)=>{

    size.addEventListener('click', (e)=>{

        // Remove seleção atual
        c('.pizzaInfo--size.selected').classList.remove('selected')

        // Adiciona seleção no tamanho clicado
        size.classList.add('selected')  
    })
})


// ==============================
// ADICIONAR AO CARRINHO
// ==============================

c('.pizzaInfo--addButton').addEventListener('click', ()=>{

    // Pega o tamanho selecionado
    let size = parseInt(c('.pizzaInfo--size.selected').getAttribute('data-key'))
    
    // Cria identificador único da pizza+tamanho
    let identifier = pizzaJson[modalKey].id+'@'+size

    // Procura se o item já existe no carrinho
    let key = cart.findIndex((item)=> item.identifier == identifier)

    
    // Se já existir, soma quantidade
    if (key > -1){

        // Aqui provavelmente deveria ser:
        // cart[key].qt += modalqt
        // porque modalKey é o índice da pizza, não a quantidade
        cart[key].qt += modalKey

    }else{

        // Se não existir, adiciona novo item
        cart.push({

            identifier,

            id:pizzaJson[modalKey].id,

            size,

            qt:modalqt
        })
    }

    // Atualiza carrinho
    updateCart()

    // Fecha modal
    closeModal()
})


// ==============================
// ABRIR E FECHAR CARRINHO MOBILE
// ==============================

// Abre o carrinho
c('.menu-openner').addEventListener('click', ()=> {

    // Só abre se tiver itens
    if (cart.length > 0){

        c('aside').style.left = '0'
    }
    
})


// Fecha o carrinho
c('.menu-closer').addEventListener('click', ()=> {
   
    c('aside').style.left = '100vw'
      
})


// ==============================
// ATUALIZAÇÃO DO CARRINHO
// ==============================

function updateCart() {

    // Atualiza contador do carrinho
    c('.menu-openner span').innerHTML = cart.length

    
    // Se houver itens no carrinho
    if (cart.length > 0 ) {

        // Exibe carrinho
        c('aside').classList.add('show')

        // Limpa itens antigos do HTML
        c('.cart').innerHTML = ''

        // Variáveis de cálculo
        let subtotal = 0
        let desconto = 0 
        let total = 0

        
        // Percorre itens do carrinho
        for (let i in cart) {

            // Procura dados completos da pizza
            let pizzaItem = pizzaJson.find((item)=> item.id == cart[i].id)

            // Soma subtotal
            subtotal += pizzaItem.price * cart[i].qt

            // Clona template do item do carrinho
            let cartItem = c('.models .cart--item').cloneNode(true)

            let pizzaSizeName 

            
            // Define nome do tamanho
            switch(cart[i].size) {

                case 0:
                    pizzaSizeName = 'P';
                    break

                case 1: 
                    pizzaSizeName = 'M';
                    break

                case 2: 
                    pizzaSizeName = 'G';
                    break;
            }

            // Monta nome final da pizza
            let pizzaName = `${pizzaItem.name} (${pizzaSizeName})`

            // Atualiza imagem
            cartItem.querySelector('img').src= pizzaItem.img

            // Atualiza nome
            cartItem.querySelector('.cart--item-nome').innerHTML = pizzaName

            // Atualiza quantidade
            cartItem.querySelector('.cart--item--qt').innerHTML = cart[i].qt

            
            // Botão menos
            cartItem.querySelector('.cart--item-qtmenos').addEventListener('click', ()=>{

                // Se tiver mais de 1, diminui
                if(cart[i].qt >1){

                    cart[i].qt--

                }else{

                    // Remove item do carrinho
                    cart.splice(i, 1)
                }

                // Atualiza carrinho
                updateCart()
            })


            // Botão mais
            cartItem.querySelector('.cart--item-qtmais').addEventListener('click', ()=>{

                // Incrementa quantidade
                cart[i].qt++

                // Atualiza carrinho
                updateCart()
            })

            
            // Adiciona item no HTML do carrinho
            c('.cart').append(cartItem)
        }

        
        // Calcula desconto de 10%
        desconto = subtotal * 0.1

        // Calcula total
        total = subtotal -desconto

        // Atualiza subtotal
        c('.subtotal span:last-child').innerHTML = `R$ ${subtotal.toFixed(2)}`

        // Atualiza desconto
        c('.desconto span:last-child').innerHTML = `R$ ${desconto.toFixed(2)}`

        // Atualiza total
        c('.total span:last-child').innerHTML = `R$ ${total.toFixed(2)}`
        
    }else{

        // Se carrinho vazio, esconde
        c('aside').classList.remove('show')

        // Move carrinho para fora da tela
        c('aside').style.left= '100vw'
    }
}