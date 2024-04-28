document.getElementById('itemForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const itemName = document.getElementById('itemName').value;
    const itemQuantity = document.getElementById('itemQuantity').value;
    addItem(itemName, itemQuantity);
    document.getElementById('itemName').value = '';
    document.getElementById('itemQuantity').value = '';
});

function addItem(name, quantity) {
    const table = document.getElementById('stockTable').getElementsByTagName('tbody')[0];
    const newRow = table.insertRow(table.rows.length);
    newRow.innerHTML = `
        <td>${name}</td>
        <td>${quantity}</td>
        <td>
            <button class="button" onclick="editItem(this)">Editar</button>
            <button class="button" onclick="deleteItem(this)">Deletar</button>
        </td>
    `;
}

function editItem(btn) {
    const row = btn.parentNode.parentNode;
    const name = prompt("Atualize o nome do item:", row.cells[0].innerHTML);
    const quantity = prompt("Atualize a quantidade:", row.cells[1].innerHTML);
    if (name && quantity) {
        row.cells[0].innerHTML = name;
        row.cells[1].innerHTML = quantity;
    }
}

function deleteItem(btn) {
    const row = btn.parentNode.parentNode;
    row.parentNode.removeChild(row);
}
