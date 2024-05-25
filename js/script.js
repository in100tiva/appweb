document.addEventListener('DOMContentLoaded', function() {
    if (!localStorage.getItem('loggedIn')) {
        window.location.href = 'login.html';
    }
    loadItems(); // Carrega os itens ao iniciar a página
});

document.getElementById('itemForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const itemName = document.getElementById('itemName').value.trim();
    const itemQuantity = document.getElementById('itemQuantity').value.trim();
    const itemExpiryDate = formatDate(document.getElementById('itemExpiryDate').value);
    const lastModified = getFormattedDateTime();
    const user = localStorage.getItem('username');

    if (itemName === '' || itemQuantity === '' || itemExpiryDate === '' || isNaN(itemQuantity) || itemQuantity <= 0) {
        alert('Por favor, insira um nome de item válido, uma quantidade positiva e uma data de validade.');
        return;
    }

    addItem(itemName, itemQuantity, itemExpiryDate, lastModified, user);
    document.getElementById('itemName').value = '';
    document.getElementById('itemQuantity').value = '';
    document.getElementById('itemExpiryDate').value = '';
    saveItems();
});

function loadItems() {
    const items = JSON.parse(localStorage.getItem('stockItems')) || [];
    items.forEach(item => {
        addItem(item.name, item.quantity, item.expiryDate, item.lastModified, item.user);
    });
    sortTable();
}

function addItem(name, quantity, expiryDate, lastModified, user) {
    const table = document.getElementById('stockTable').getElementsByTagName('tbody')[0];
    const newRow = table.insertRow();
    newRow.innerHTML = `
        <td>${name}</td>
        <td>${quantity}</td>
        <td>${expiryDate}</td>
        <td>${lastModified}</td>
        <td>
            <button class="button edit-button" onclick="editItem(this)">Editar</button>
            <button class="button" onclick="openDeleteModal(this)">Deletar</button>
        </td>
    `;
    logAudit('Adicionar', `${name} (${quantity})`, user, lastModified);
    sortTable();
}

function editItem(btn) {
    const modal = document.getElementById('editModal');
    modal.style.display = 'block';
    const row = btn.parentNode.parentNode;
    document.getElementById('editName').value = row.cells[0].innerHTML;
    document.getElementById('editQuantity').value = row.cells[1].innerHTML;
    document.getElementById('editExpiryDate').value = reverseFormatDate(row.cells[2].innerHTML);

    document.getElementById('editForm').onsubmit = function(e) {
        e.preventDefault();
        const user = localStorage.getItem('username');
        const lastModified = getFormattedDateTime();
        const oldName = row.cells[0].innerHTML;
        const oldQuantity = row.cells[1].innerHTML;
        const oldExpiryDate = row.cells[2].innerHTML;

        row.cells[0].innerHTML = document.getElementById('editName').value;
        row.cells[1].innerHTML = document.getElementById('editQuantity').value;
        row.cells[2].innerHTML = formatDate(document.getElementById('editExpiryDate').value);
        row.cells[3].innerHTML = lastModified;

        modal.style.display = 'none';
        saveItems(); // Salva os itens após a edição
        sortTable();

        logAudit('Editar', `De ${oldName} (${oldQuantity}, ${oldExpiryDate}) Para ${row.cells[0].innerHTML} (${row.cells[1].innerHTML}, ${row.cells[2].innerHTML})`, user, lastModified);
    }
}

function closeEditModal() {
    document.getElementById('editModal').style.display = 'none';
}

let rowToDelete;

function openDeleteModal(btn) {
    rowToDelete = btn.parentNode.parentNode;
    const modal = document.getElementById('deleteModal');
    modal.style.display = 'block';
}

function closeDeleteModal() {
    document.getElementById('deleteModal').style.display = 'none';
}

document.getElementById('confirmDeleteButton').onclick = function() {
    const user = localStorage.getItem('username');
    const lastModified = getFormattedDateTime();
    const itemName = rowToDelete.cells[0].innerHTML;
    const itemQuantity = rowToDelete.cells[1].innerHTML;

    rowToDelete.parentNode.removeChild(rowToDelete);
    closeDeleteModal();
    saveItems(); // Salva os itens após a exclusão

    logAudit('Deletar', `${itemName} (${itemQuantity})`, user, lastModified);
}

function saveItems() {
    const items = [];
    const rows = document.querySelectorAll('#stockTable tbody tr');
    rows.forEach(row => {
        const name = row.cells[0].textContent;
        const quantity = row.cells[1].textContent;
        const expiryDate = row.cells[2].textContent;
        const lastModified = row.cells[3].textContent;
        const user = localStorage.getItem('username');
        items.push({ name: name, quantity: quantity, expiryDate: expiryDate, lastModified: lastModified, user: user });
    });
    localStorage.setItem('stockItems', JSON.stringify(items));
}

function searchItems() {
    const searchTerm = document.getElementById('searchBar').value.toLowerCase();
    const rows = document.querySelectorAll('#stockTable tbody tr');
    rows.forEach(row => {
        const itemName = row.cells[0].textContent.toLowerCase();
        if (itemName.includes(searchTerm)) {
            row.style.display = '';
        } else {
            row.style.display = 'none';
        }
    });
}

function sortTable() {
    const table = document.getElementById('stockTable').getElementsByTagName('tbody')[0];
    const rows = Array.from(table.rows);
    rows.sort((a, b) => new Date(a.cells[2].textContent.split('/').reverse().join('-')) - new Date(b.cells[2].textContent.split('/').reverse().join('-')));
    rows.forEach(row => table.appendChild(row));
}

function formatDate(dateString) {
    const [year, month, day] = dateString.split('-');
    return `${day}/${month}/${year}`;
}

function reverseFormatDate(dateString) {
    const [day, month, year] = dateString.split('/');
    return `${year}-${month}-${day}`;
}

function getFormattedDateTime() {
    const now = new Date();
    const day = String(now.getDate()).padStart(2, '0');
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const year = now.getFullYear();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    return `${day}/${month}/${year} ${hours}:${minutes}`;
}

function logAudit(action, details, user, timestamp) {
    const logs = JSON.parse(localStorage.getItem('auditLogs')) || [];
    logs.push({ action, details, user, timestamp });
    localStorage.setItem('auditLogs', JSON.stringify(logs));
}
