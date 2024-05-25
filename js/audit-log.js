document.addEventListener('DOMContentLoaded', function() {
    loadAuditLogs();
});

function loadAuditLogs() {
    const logs = JSON.parse(localStorage.getItem('auditLogs')) || [];
    const tableBody = document.getElementById('auditLogTable').getElementsByTagName('tbody')[0];

    // Limpar a tabela antes de adicionar os logs
    tableBody.innerHTML = '';

    logs.forEach(log => {
        const newRow = tableBody.insertRow();
        newRow.innerHTML = `
            <td>${log.timestamp}</td>
            <td>${log.user}</td>
            <td>${log.action}</td>
            <td>${log.details}</td>
        `;
    });
}
