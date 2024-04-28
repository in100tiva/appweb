document.addEventListener('DOMContentLoaded', function() {
    loadItems(); // Carrega os itens ao iniciar a página
});

document.getElementById('itemForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const itemName = document.getElementById('itemName').value;
    const itemQuantity = document.getElementById('itemQuantity').value;
    addItem(itemName, itemQuantity);
    document.getElementById('itemName').value = '';
    document.getElementById('itemQuantity').value = '';
    saveItems();
});

function loadItems() {
    const items = JSON.parse(localStorage.getItem('stockItems')) || [];
    items.forEach(item => {
        addItem(item.name, item.quantity);
    });
}

function addItem(name, quantity) {
    const table = document.getElementById('stockTable').getElementsByTagName('tbody')[0];
    const newRow = table.insertRow();
    newRow.innerHTML = `
        <td>${name}</td>
        <td>${quantity}</td>
        <td>
            <button class="button edit-button" onclick="editItem(this)">Editar</button>
            <button class="button" onclick="deleteItem(this)">Deletar</button>
        </td>
    `;
}

function editItem(btn) {
    const modal = document.getElementById('editModal');
    modal.style.display = 'block';
    const row = btn.parentNode.parentNode;
    document.getElementById('editName').value = row.cells[0].innerHTML;
    document.getElementById('editQuantity').value = row.cells[1].innerHTML;

    document.getElementById('editForm').onsubmit = function(e) {
        e.preventDefault();
        row.cells[0].innerHTML = document.getElementById('editName').value;
        row.cells[1].innerHTML = document.getElementById('editQuantity').value;
        modal.style.display = 'none';
        saveItems(); // Salva os itens após a edição
    }
}

document.getElementsByClassName('close-button')[0].onclick = function() {
    document.getElementById('editModal').style.display = 'none';
}

window.onclick = function(event) {
    const modal = document.getElementById('editModal');
    if (event.target == modal) {
        modal.style.display = 'none';
    }
}

function deleteItem(btn) {
    const row = btn.parentNode.parentNode;
    row.parentNode.removeChild(row);
    saveItems(); // Salva os itens após a exclusão
}

function saveItems() {
    const items = [];
    const rows = document.querySelectorAll('#stockTable tbody tr');
    rows.forEach(row => {
        const name = row.cells[0].textContent;
        const quantity = row.cells[1].textContent;
        items.push({ name: name, quantity: quantity });
    });
    localStorage.setItem('stockItems', JSON.stringify(items));
}
