// Function to create pagination controls
function createPaginationControls(block) {
    const container = document.getElementById('container');
    // Create unordered list element
    const ul = document.createElement('ul');
    ul.id = 'items-list';
    container.appendChild(ul);

    // Create Previous Page button
    const prevButton = document.createElement('button');
    prevButton.id = 'prevPage';
    prevButton.textContent = 'Previous Page';
    container.appendChild(prevButton);

    // Create Next Page button
    const nextButton = document.createElement('button');
    nextButton.id = 'nextPage';
    nextButton.textContent = 'Next Page';
    container.appendChild(nextButton);
}

// Function to fetch data with pagination
async function fetchData(endpoint, offset, limit) {
    try {
        const response = await fetch(`${endpoint}?offset=${offset}&limit=${limit}`);
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching data:', error);
    }
}

// Function to build and display the HTML for the items
function displayItems(data) {
    const itemsList = document.getElementById('items-list');
    itemsList.innerHTML = ''; // Clear previous items

    data.forEach(item => {
        const listItem = document.createElement('li');
        const content = `
        <strong>${item.Column1} : ${item.Column2} : ${item.column3}
      `;
        listItem.innerHTML = content;
        itemsList.appendChild(listItem);
    });
}

// Function to update pagination info
async function updatePaginationInfo(total, offset, limit) {
    const paginationInfo = document.getElementById('pagination-info');
    const currentPage = Math.floor(offset / limit) + 1;
    const totalPages = Math.ceil(total / limit);
    paginationInfo.textContent = `Page ${currentPage} of ${totalPages}`;
}

// Example usage
const endpoint = '/day5-assignment1.json';
const limit = 3; // Number of items per page
let offset = 0; // Starting offset
let totalItems = 0; // Total number of items

async function loadPage() {
    const data = await fetchData(endpoint, offset, limit);
    if (data && data.data) {
        totalItems = data.total;
        displayItems(data.data);
        await updatePaginationInfo(totalItems, data.offset, data.limit);
    }
}

export default async function decorate(block) {
    const listEndpoint = block.querySelector('a[href$=".json"]');
    var containerDiv = document.createElement('div');
    containerDiv.id = 'container';
    block.appendChild(containerDiv);

    listEndpoint.replaceWith(containerDiv);

    createPaginationControls(block);
    loadPage();

    // Load next page
    document.getElementById('container').addEventListener('click', (event) => {
        if (event.target.id === 'nextPage' && offset + limit < totalItems) {
            offset += limit;
            loadPage();
        } else if (event.target.id === 'prevPage' && offset >= limit) {
            offset -= limit;
            loadPage();
        }
    });
}