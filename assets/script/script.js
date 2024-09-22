document.addEventListener('DOMContentLoaded', function() {
    fetch('https://itsectossp.github.io/jsonapi/csvjson.json')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            console.log('Fetched JSON data:', data);
            const tableBody = document.getElementById('table-body');

            // Pagination variables
            const itemsPerPage = 50;
            let currentPage = 1;

            // Function to display data
            const displayData = (data, page) => {
                tableBody.innerHTML = '';
                const start = (page - 1) * itemsPerPage;
                const end = page * itemsPerPage;
                const paginatedItems = data.slice(start, end);

                paginatedItems.forEach((item, index) => {
                    const row = document.createElement('tr');
                    row.innerHTML = `
                        <th style="display:none;" scope="row">${start + index + 1}</th>
                        <td>${item.Sp}</td>
                        <td>${item["PO No"]}</td>
                        <td>${item.Title}</td>
                        <td>

                        
                            <button class="btn btn-success" style="margin-left: 5px;" type="button" data-link="${item.Iframe}/edit">
                                <i class="glyphicon glyphicon-link" style="font-size: 30px;"></i>
                            </button>
                        </td>
                    `;
                    tableBody.appendChild(row);
                });

                document.querySelectorAll('.btn-success').forEach(button => {
                    button.addEventListener('click', function() {
                        const link = this.getAttribute('data-link');
                        window.open(link, '_blank');
                    });
                });
            };

            // Function to generate pagination
            const generatePagination = (data) => {
                const pagination = document.querySelector('.pagination');
                pagination.innerHTML = '';
                const pageCount = Math.ceil(data.length / itemsPerPage);

                const createPageItem = (page, label = page) => {
                    const listItem = document.createElement('li');
                    listItem.className = 'page-item';
                    listItem.innerHTML = `<a href="#" class="page-link">${label}</a>`;
                    if (page === currentPage) {
                        listItem.classList.add('active');
                    }
                    listItem.addEventListener('click', (e) => {
                        e.preventDefault();
                        currentPage = page;
                        displayData(data, currentPage);
                        generatePagination(data);
                    });
                    return listItem;
                };

                // First page button
                pagination.appendChild(createPageItem(1, 'First'));

                let startPage = Math.max(1, currentPage - 2);
                let endPage = Math.min(pageCount, currentPage + 2);

                if (currentPage <= 3) {
                    endPage = Math.min(5, pageCount);
                } else if (currentPage >= pageCount - 2) {
                    startPage = Math.max(1, pageCount - 4);
                }

                for (let i = startPage; i <= endPage; i++) {
                    pagination.appendChild(createPageItem(i));
                }

                // Last page button
                pagination.appendChild(createPageItem(pageCount, 'Last'));
            };

            // Initial display and pagination
            displayData(data, currentPage);
            generatePagination(data);

            // Search functionality
            const searchInput = document.querySelector('.search.form-control');
            searchInput.addEventListener('input', function() {
                const searchText = this.value.toLowerCase();
                const filteredData = data.filter(item =>
                    item.Sp.toLowerCase().includes(searchText) ||
                    item.Title.toLowerCase().includes(searchText) ||
                    item["PO No"].toLowerCase().includes(searchText)
                );
                currentPage = 1; // Reset to first page
                displayData(filteredData, currentPage);
                generatePagination(filteredData);
            });
        })
        .catch(error => console.error('Error fetching JSON:', error));
});
