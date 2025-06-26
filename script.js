const produtosContainer = document.getElementById('lista-produtos');
const carrinhoBtn = document.getElementById('carrinho-btn');
const contadorCarrinho = document.getElementById('contador-carrinho');
const carrinhoModal = document.getElementById('carrinho');
const fecharCarrinho = document.getElementById('fechar-carrinho');
const listaCarrinho = document.getElementById('lista-carrinho');
const totalCarrinho = document.getElementById('total-carrinho');
const filtroCategoria = document.getElementById('filtro-categoria');
const buscaInput = document.getElementById('busca');
const darkModeToggle = document.getElementById('dark-mode-toggle');

let produtos = [];
let carrinho = JSON.parse(localStorage.getItem('usereuse_carrinho')) || [];

// DARK MODE
if (localStorage.getItem('modo_escuro') === 'true') {
  document.body.classList.add('dark');
}
darkModeToggle.addEventListener('click', () => {
  document.body.classList.toggle('dark');
  localStorage.setItem('modo_escuro', document.body.classList.contains('dark'));
});

// FETCH PRODUTOS
async function carregarProdutos() {
  const res = await fetch('https://fakestoreapi.com/products');
  const data = await res.json();
  produtos = data;
  preencherCategorias();
  renderizarProdutos(produtos);
  atualizarCarrinho();
}

function preencherCategorias() {
  const categorias = [...new Set(produtos.map(p => p.category))];
  categorias.forEach(cat => {
    const opt = document.createElement('option');
    opt.value = cat;
    opt.textContent = cat.charAt(0).toUpperCase() + cat.slice(1);
    filtroCategoria.appendChild(opt);
  });
}

// RENDERIZAÇÃO
function renderizarProdutos(lista) {
  produtosContainer.innerHTML = '';
  lista.forEach(produto => {
    const div = document.createElement('div');
    div.className = 'produto';
    div.innerHTML = `
      <img src="${produto.image}" alt="${produto.title}" height="120">
      <h3>${produto.title}</h3>
      <p>R$ ${produto.price.toFixed(2)}</p>
      <button onclick="adicionarAoCarrinho(${produto.id})">Adicionar</button>
    `;
    produtosContainer.appendChild(div);
  });
}

// BUSCA E FILTRO
function aplicarFiltros() {
  const termo = buscaInput.value.toLowerCase();
  const categoria = filtroCategoria.value;
  const listaFiltrada = produtos.filter(p =>
    p.title.toLowerCase().includes(termo) &&
    (categoria === '' || p.category === categoria)
  );
  renderizarProdutos(listaFiltrada);
}

buscaInput.addEventListener('input', aplicarFiltros);
filtroCategoria.addEventListener('change', aplicarFiltros);

// CARRINHO
function adicionarAoCarrinho(id) {
  const item = produtos.find(p => p.id === id);
  carrinho.push(item);
  salvarCarrinho();
  atualizarCarrinho();
}

function removerDoCarrinho(index) {
  carrinho.splice(index, 1);
  salvarCarrinho();
  atualizarCarrinho();
}

function salvarCarrinho() {
  localStorage.setItem('usereuse_carrinho', JSON.stringify(carrinho));
}

function atualizarCarrinho() {
  listaCarrinho.innerHTML = '';
  let total = 0;

  carrinho.forEach((item, index) => {
    total += item.price;
    const li = document.createElement('li');
    li.innerHTML = `
      ${item.title} - R$ ${item.price.toFixed(2)}
      <button onclick="removerDoCarrinho(${index})">Remover</button>
    `;
    listaCarrinho.appendChild(li);
  });

  contadorCarrinho.textContent = carrinho.length;
  totalCarrinho.textContent = total.toFixed(2);
}

// MODAL CARRINHO
carrinhoBtn.onclick = () => carrinhoModal.style.display = 'block';
fecharCarrinho.onclick = () => carrinhoModal.style.display = 'none';
window.onclick = (e) => {
  if (e.target === carrinhoModal) {
    carrinhoModal.style.display = 'none';
  }
};

// INICIALIZAÇÃO
carregarProdutos();
