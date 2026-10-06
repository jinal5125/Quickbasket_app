// QuickBasket Seller Panel JavaScript Logic

let categories = [
    { id: 1, name: 'Dairy', count: 45, status: 'Active' },
    { id: 2, name: 'Vegetables', count: 78, status: 'Active' },
    { id: 3, name: 'Fruits', count: 56, status: 'Active' },
    { id: 4, name: 'Grocery', count: 92, status: 'Active' },
    { id: 5, name: 'Bakery', count: 34, status: 'Active' }
];

let orders = [
    { id: 'ORD001', customer: 'John Doe', date: '2024-01-15', items: 3, total: 1234, status: 'Delivered' },
    { id: 'ORD002', customer: 'Jane Smith', date: '2024-01-16', items: 5, total: 2345, status: 'Processing' },
    { id: 'ORD003', customer: 'Bob Wilson', date: '2024-01-17', items: 1, total: 58, status: 'Pending' },
    { id: 'ORD004', customer: 'Alice Brown', date: '2024-01-18', items: 2, total: 120, status: 'Delivered' },
    { id: 'ORD005', customer: 'Charlie Davis', date: '2024-01-19', items: 4, total: 399, status: 'Processing' }
];

let users = [
    { id: 1, name: 'John Doe', email: 'john@email.com', phone: '9876543210', role: 'User', status: 'Active', joined: '2024-01-01' },
    { id: 2, name: 'Jane Smith', email: 'jane@email.com', phone: '9876543211', role: 'Manager', status: 'Active', joined: '2024-01-02' },
    { id: 3, name: 'Bob Wilson', email: 'bob@email.com', phone: '9876543212', role: 'User', status: 'Inactive', joined: '2024-01-03' },
    { id: 4, name: 'Alice Brown', email: 'alice@email.com', phone: '9876543213', role: 'Admin', status: 'Active', joined: '2024-01-04' },
    { id: 5, name: 'Charlie Davis', email: 'charlie@email.com', phone: '9876543214', role: 'User', status: 'Active', joined: '2024-01-05' }
];

let payments = [
    { id: 'PAY001', order: 'ORD001', customer: 'John Doe', amount: 1234, method: 'UPI', date: '2024-01-15', status: 'Paid' },
    { id: 'PAY002', order: 'ORD002', customer: 'Jane Smith', amount: 2345, method: 'Card', date: '2024-01-16', status: 'Paid' },
    { id: 'PAY003', order: 'ORD003', customer: 'Bob Wilson', amount: 58, method: 'Cash', date: '2024-01-17', status: 'Unpaid' },
    { id: 'PAY004', order: 'ORD004', customer: 'Alice Brown', amount: 120, method: 'UPI', date: '2024-01-18', status: 'Paid' },
    { id: 'PAY005', order: 'ORD005', customer: 'Charlie Davis', amount: 399, method: 'Card', date: '2024-01-19', status: 'Paid' }
];

window.onload = function() {
    updateStats();
    loadCategories();
    loadOrders();
    loadUsers();
    loadPayments();
};

function toggleSubmenu() {
    let submenu = document.getElementById('productsSubmenu');
    let icon = document.querySelector('.nav-link i.fa-chevron-down');
    submenu.classList.toggle('active');
    if(submenu.classList.contains('active')) {
        icon.style.transform = 'rotate(180deg)';
    } else {
        icon.style.transform = 'rotate(0deg)';
    }
}

function showSection(section) {
    document.querySelectorAll('.content-section').forEach(s => {
        s.classList.remove('active');
    });
    document.getElementById(section + '-section').classList.add('active');

    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
    });

    document.querySelectorAll('.nav-link').forEach(link => {
        if(link.innerHTML.includes('Products') && (section.includes('Product') || section === 'viewProducts' || section === 'addProduct')) {
            link.classList.add('active');
        } else if(link.innerHTML.includes('Dashboard') && section === 'dashboard') {
            link.classList.add('active');
        } else if(link.innerHTML.includes('Categories') && (section === 'categories' || section === 'addCategory' || section === 'editCategory' || section === 'deleteCategoryConfirm')) {
            link.classList.add('active');
        } else if(link.innerHTML.includes('Orders') && section === 'orders') {
            link.classList.add('active');
        } else if(link.innerHTML.includes('Users') && section === 'users') {
            link.classList.add('active');
        } else if(link.innerHTML.includes('Payments') && section === 'payments') {
            link.classList.add('active');
        } else if(link.innerHTML.includes('Settings') && section === 'settings') {
            link.classList.add('active');
        }
    });
}

function updateStats() {
    let totalCategories = document.getElementById('totalCategories');
    if(totalCategories) totalCategories.innerText = categories.length;

    let totalProducts = document.getElementById('totalProducts');
    if(totalProducts) {
        let cards = document.querySelectorAll('#productsGrid .product-card');
        totalProducts.innerText = cards.length;
    }
}

function loadAllProducts() {
    return;
}

function filterProducts() {
    let search = document.getElementById('searchInput').value.toLowerCase();
    let category = document.getElementById('categoryFilter').value;

    let cards = document.querySelectorAll('#productsGrid .product-card');
    cards.forEach(card => {
        let name = card.querySelector('h3').innerText.toLowerCase();
        let cat = card.getAttribute('data-category');
        let matchSearch = name.includes(search);
        let matchCat = category === 'all' || cat === category;
        card.style.display = (matchSearch && matchCat) ? 'block' : 'none';
    });
}

function loadCategories() {
    let tbody = document.getElementById('categoriesTableBody');
    if(!tbody) return;
    tbody.innerHTML = '';
    categories.forEach(cat => {
        tbody.innerHTML += `
            <tr>
                <td>${cat.id}</td>
                <td>${cat.name}</td>
                <td>${cat.count}</td>
                <td><span class="status-badge status-active">${cat.status}</span></td>
                <td>
                    <button class="edit-btn" onclick="editCategory(${cat.id})" style="background: #e0e7ff; color: #4f46e5; border-radius: 8px; padding: 6px 12px; border: none; margin-right: 5px; cursor: pointer; font-weight: 600;"><i class="fas fa-pencil-ruler"></i> Edit</button>
                    <button class="delete-btn" onclick="deleteCategory(${cat.id})" style="background: #fee2e2; color: #ef4444; border-radius: 8px; padding: 6px 12px; border: none; cursor: pointer; font-weight: 600;"><i class="fas fa-trash-can"></i> Delete</button>
                </td>
            </tr>
        `;
    });
}

function loadOrders(filteredOrders = orders) {
    let tbody = document.getElementById('ordersTableBody');
    if(!tbody) return;
    tbody.innerHTML = '';
    filteredOrders.forEach(order => {
        let statusClass = order.status.toLowerCase() === 'delivered' ? 'status-delivered' :
                         order.status.toLowerCase() === 'processing' ? 'status-processing' : 'status-pending';
        tbody.innerHTML += `
            <tr>
                <td>#${order.id}</td>
                <td>${order.customer}</td>
                <td>${order.date}</td>
                <td>${order.items} items</td>
                <td>₹${order.total}</td>
                <td><span class="status-badge ${statusClass}">${order.status}</span></td>
                <td>
                    <button class="view-btn" onclick="viewOrder('${order.id}')"><i class="fas fa-eye"></i></button>
                    <button class="edit-btn" onclick="editOrder('${order.id}')"><i class="fas fa-edit"></i></button>
                </td>
            </tr>
        `;
    });
}

function loadUsers(filteredUsers = users) {
    let tbody = document.getElementById('usersTableBody');
    if(!tbody) return;
    tbody.innerHTML = '';
    filteredUsers.forEach(user => {
        tbody.innerHTML += `
            <tr>
                <td>${user.id}</td>
                <td>${user.name}</td>
                <td>${user.email}</td>
                <td>${user.phone}</td>
                <td><span class="user-role">${user.role}</span></td>
                <td><span class="status-badge ${user.status === 'Active' ? 'status-active' : 'status-inactive'}">${user.status}</span></td>
                <td>${user.joined}</td>
                <td>
                    <button class="edit-btn" onclick="editUser(${user.id})"><i class="fas fa-edit"></i></button>
                    <button class="delete-btn" onclick="deleteUser(${user.id})"><i class="fas fa-trash"></i></button>
                </td>
            </tr>
        `;
    });
}

function loadPayments() {
    let tbody = document.getElementById('paymentsTableBody');
    if(!tbody) return;
    tbody.innerHTML = '';
    payments.forEach(payment => {
        tbody.innerHTML += `
            <tr>
                <td>${payment.id}</td>
                <td>#${payment.order}</td>
                <td>${payment.customer}</td>
                <td>₹${payment.amount}</td>
                <td>${payment.method}</td>
                <td>${payment.date}</td>
                <td><span class="status-badge ${payment.status === 'Paid' ? 'status-paid' : 'status-unpaid'}">${payment.status}</span></td>
            </tr>
        `;
    });
}

function filterOrders() {
    let filter = event.target.value;
    if(filter === 'all') {
        loadOrders(orders);
    } else {
        let filtered = orders.filter(o => o.status.toLowerCase() === filter);
        loadOrders(filtered);
    }
}

function searchUsers(query) {
    if(!query) {
        loadUsers(users);
    } else {
        let filtered = users.filter(u =>
            u.name.toLowerCase().includes(query.toLowerCase()) ||
            u.email.toLowerCase().includes(query.toLowerCase())
        );
        loadUsers(filtered);
    }
}

function updateImagePreview(url) {
    let preview = document.getElementById('imagePreview');
    if(preview && url) {
        preview.style.backgroundImage = `url('${url}')`;
        preview.style.backgroundSize = 'cover';
        preview.style.backgroundPosition = 'center';
        preview.innerHTML = '';
    }
}

// ─── PRODUCT DETAIL PAGE ─────────────────────────────────────────────────────
function showProductDetail(id, name, category, price, stock, weight, discount, brand, description, imageUrl) {
    document.querySelectorAll('.content-section').forEach(s => s.classList.remove('active'));
    document.getElementById('productDetails-section').classList.add('active');

    let container = document.getElementById('productDetailsContainer');
    container.innerHTML = `
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 25px;">
            <h2 style="font-size: 1.5rem; font-weight: 700; color: #1e293b; display: flex; align-items: center; gap: 12px;">
                <i class="fas fa-box" style="color: #2563eb;"></i> Product Detail
            </h2>
            <button onclick="goBackToViewProducts()" style="background: white; color: #1e293b; border: 1.5px solid #e2e8f0; padding: 10px 20px; border-radius: 12px; cursor: pointer; display: flex; align-items: center; gap: 8px; font-size: 0.95rem; font-weight: 600;">
                <i class="fas fa-arrow-left"></i> Back
            </button>
        </div>

        <div style="background: white; border-radius: 30px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.05); border: 1px solid #eef2f6; display: flex; min-height: 500px;">
            <div style="width: 40%; background: #f8fbff; padding: 40px; display: flex; flex-direction: column; align-items: center; justify-content: center; border-right: 1px solid #eef2f6;">
                <div style="width: 100%; aspect-ratio: 1; border-radius: 20px; overflow: hidden; box-shadow: 0 10px 25px rgba(0,0,0,0.1); margin-bottom: 25px;">
                    <img src="${imageUrl}" alt="${name}" style="width: 100%; height: 100%; object-fit: cover;">
                </div>
                <div style="background: #2563eb; color: white; padding: 8px 24px; border-radius: 30px; font-weight: 700; font-size: 0.85rem; margin-bottom: 20px; text-transform: uppercase; letter-spacing: 0.5px;">HOMEMADE</div>
                <div style="font-size: 2.5rem; font-weight: 800; color: #2563eb; margin-bottom: 15px;">₹${price}</div>
                <div style="background: #e6fffa; color: #059669; padding: 8px 20px; border-radius: 30px; display: flex; align-items: center; gap: 10px; font-weight: 600; border: 1px solid #b2f5ea;">
                    <i class="fas fa-box" style="font-size: 0.9rem;"></i> Stock: ${stock} units
                </div>
            </div>

            <div style="width: 60%; padding: 40px; display: flex; flex-direction: column; gap: 25px;">
                <div>
                    <h1 style="font-size: 2.2rem; font-weight: 800; color: #1e293b; margin-bottom: 8px;">${name}</h1>
                    <div style="display: flex; align-items: center; color: #2563eb; font-weight: 600; gap: 8px; text-transform: uppercase; font-size: 0.9rem; letter-spacing: 0.5px;">
                        <i class="fas fa-tag"></i> ${category}
                    </div>
                </div>

                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
                    <div style="background: #f8fafc; padding: 20px; border-radius: 18px; border: 1.5px solid #eef2f6;">
                        <p style="color: #64748b; font-size: 0.75rem; font-weight: 700; text-transform: uppercase; margin-bottom: 10px;">Weight / Unit</p>
                        <p style="font-size: 1.2rem; font-weight: 700; color: #1e293b;">${weight || '-'}</p>
                    </div>
                    <div style="background: #f8fafc; padding: 20px; border-radius: 18px; border: 1.5px solid #eef2f6;">
                        <p style="color: #64748b; font-size: 0.75rem; font-weight: 700; text-transform: uppercase; margin-bottom: 10px;">Discount</p>
                        <p style="font-size: 1.2rem; font-weight: 700; color: #1e293b;">${discount || '0'}%</p>
                    </div>
                    <div style="background: #f8fafc; padding: 20px; border-radius: 18px; border: 1.5px solid #eef2f6;">
                        <p style="color: #64748b; font-size: 0.75rem; font-weight: 700; text-transform: uppercase; margin-bottom: 10px;">Stock</p>
                        <p style="font-size: 1.2rem; font-weight: 700; color: #1e293b;">${stock} units</p>
                    </div>
                    <div style="background: #f8fafc; padding: 20px; border-radius: 18px; border: 1.5px solid #eef2f6;">
                        <p style="color: #64748b; font-size: 0.75rem; font-weight: 700; text-transform: uppercase; margin-bottom: 10px;">Brand</p>
                        <p style="font-size: 1.2rem; font-weight: 700; color: #1e293b;">${brand || 'Local'}</p>
                    </div>
                </div>

                <div style="background: #f8fafc; padding: 25px; border-radius: 18px; border: 1.5px solid #eef2f6;">
                    <p style="color: #64748b; font-size: 0.75rem; font-weight: 700; text-transform: uppercase; margin-bottom: 12px; display: flex; align-items: center; gap: 8px;">
                        <i class="fas fa-align-left" style="color: #2563eb;"></i> Description
                    </p>
                    <p style="color: #475569; line-height: 1.6; font-size: 1rem;">${description || 'No description available.'}</p>
                </div>

                <div style="display: flex; gap: 16px; margin-top: 5px;">
                    <button
                        onclick="prepareEditProduct('${id}', \`${name}\`, '${category}', '${price}', '${stock}', '${weight}', '${discount}', '${brand}', \`${description}\`, '${imageUrl}')"
                        style="flex: 1; background: #2563eb; color: white; border: none; padding: 16px; border-radius: 16px; font-weight: 700; font-size: 1rem; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 10px; box-shadow: 0 6px 18px rgba(37,99,235,0.25); transition: all 0.2s;"
                        onmouseover="this.style.background='#1d4ed8'; this.style.transform='translateY(-2px)';"
                        onmouseout="this.style.background='#2563eb'; this.style.transform='translateY(0)';">
                        <i class="fas fa-edit"></i> Edit Product
                    </button>
                    <button
                        onclick="prepareDeleteProduct('${id}', \`${name}\`, '${imageUrl}')"
                        style="flex: 1; background: #fff1f2; color: #e11d48; border: 1.5px solid #fecdd3; padding: 16px; border-radius: 16px; font-weight: 700; font-size: 1rem; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 10px; transition: all 0.2s;"
                        onmouseover="this.style.background='#ffe4e6'; this.style.transform='translateY(-2px)';"
                        onmouseout="this.style.background='#fff1f2'; this.style.transform='translateY(0)';">
                        <i class="fas fa-trash-alt"></i> Delete Product
                    </button>
                </div>
            </div>
        </div>
    `;
}

// ─── EDIT PRODUCT — form action JS se set hogi ───────────────────────────────
function prepareEditProduct(id, name, category, price, stock, weight, discount, brand, description, imageUrl) {
    document.querySelectorAll('.content-section').forEach(s => s.classList.remove('active'));
    document.getElementById('editSingleProduct-section').classList.add('active');

    // ✅ Form action dynamically set — sahi product ka URL milega
    document.getElementById('editProductForm').action = '/seller/edit_product/' + id;

    document.getElementById('edit_p_id').value = id;
    document.getElementById('edit_p_name').value = name;
    document.getElementById('edit_p_category').value = category;
    document.getElementById('edit_p_price').value = price;
    document.getElementById('edit_p_stock').value = stock;
    document.getElementById('edit_p_weight').value = weight || '';
    document.getElementById('edit_p_discount').value = discount || '0';
    document.getElementById('edit_p_brand').value = brand || '';
    document.getElementById('edit_p_description').value = description || '';
}

// ─── DELETE PRODUCT ───────────────────────────────────────────────────────────
function prepareDeleteProduct(id, name, imageUrl) {
    document.querySelectorAll('.content-section').forEach(s => s.classList.remove('active'));
    document.getElementById('deleteConfirm-section').classList.add('active');

    // ✅ Delete form action bhi dynamically set karo
    document.getElementById('deleteProductForm').action = '/seller/delete_product/' + id;

    document.getElementById('delete_p_id').value = id;
    document.getElementById('delete_p_name').innerText = name;
    document.getElementById('delete_p_img').src = imageUrl;
}

function goBackToViewProducts() {
    document.querySelectorAll('.content-section').forEach(s => {
        s.classList.remove('active');
    });
    document.getElementById('viewProducts-section').classList.add('active');
}

function goBackToCategories() {
    document.querySelectorAll('.content-section').forEach(s => {
        s.classList.remove('active');
    });
    document.getElementById('categories-section').classList.add('active');
    // Clear forms when going back
    document.getElementById('addCategoryForm') && document.getElementById('addCategoryForm').reset();
}

function addNewCategory() {
    document.querySelectorAll('.content-section').forEach(s => s.classList.remove('active'));
    document.getElementById('addCategory-section').classList.add('active');
}

function submitNewCategory(event) {
    event.preventDefault();
    let name = document.getElementById('add_c_name').value;
    
    if(name) {
        let newId = categories.length > 0 ? Math.max(...categories.map(c => c.id)) + 1 : 1;
        categories.push({ id: newId, name: name, count: 0, status: 'Active' });
        loadCategories();
        updateStats(); // Update dashboard stats if any
        goBackToCategories();
        alert('Category added successfully!');
    }
}

function editCategory(id) {
    let category = categories.find(c => c.id === id);
    if (!category) return;
    
    document.querySelectorAll('.content-section').forEach(s => s.classList.remove('active'));
    document.getElementById('editCategory-section').classList.add('active');
    
    document.getElementById('edit_c_id').value = category.id;
    document.getElementById('edit_c_name').value = category.name;
    // document.getElementById('edit_c_type').value = category.type || 'Other'; // If type were supported
    // document.getElementById('edit_c_description').value = category.description || ''; // If description was supported
}

function submitEditCategory(event) {
    event.preventDefault();
    let id = parseInt(document.getElementById('edit_c_id').value);
    let name = document.getElementById('edit_c_name').value;
    
    let categoryIndex = categories.findIndex(c => c.id === id);
    if (categoryIndex !== -1 && name) {
        categories[categoryIndex].name = name;
        loadCategories();
        goBackToCategories();
        alert('Category updated successfully!');
    }
}

function deleteCategory(id) {
    let category = categories.find(c => c.id === id);
    if (!category) return;

    document.querySelectorAll('.content-section').forEach(s => s.classList.remove('active'));
    document.getElementById('deleteCategoryConfirm-section').classList.add('active');
    
    document.getElementById('delete_c_id').value = id;
    document.getElementById('delete_c_name').innerText = category.name;
}

function confirmDeleteCategory() {
    let id = parseInt(document.getElementById('delete_c_id').value);
    categories = categories.filter(c => c.id !== id);
    loadCategories();
    updateStats(); // Update dashboard stats if any
    goBackToCategories();
    alert('Category deleted successfully!');
}

function viewOrder(id) {
    let order = orders.find(o => o.id === id);
    alert(`Order Details:\nID: ${order.id}\nCustomer: ${order.customer}\nDate: ${order.date}\nItems: ${order.items}\nTotal: ₹${order.total}\nStatus: ${order.status}`);
}

function editOrder(id) {
    alert('Edit order feature coming soon!');
}

function editUser(id) {
    alert('Edit user feature coming soon!');
}

function deleteUser(id) {
    if(confirm('Are you sure you want to delete this user?')) {
        users = users.filter(u => u.id !== id);
        loadUsers();
        alert('User deleted successfully!');
    }
}

function showAdminProfile() {
    document.querySelectorAll('.content-section').forEach(s => {
        s.classList.remove('active');
    });
    document.getElementById('adminProfile-section').classList.add('active');
}

function editAdminProfile() {
    document.querySelectorAll('.content-section').forEach(section => {
        section.classList.remove('active');
    });
    document.getElementById('editProfile-section').classList.add('active');
}

function closeModal() {
    document.getElementById('productModal').classList.remove('active');
}

function closeEditModal() {
    document.getElementById('editModal').classList.remove('active');
}

window.onclick = function(event) {
    let productModal = document.getElementById('productModal');
    let editModal = document.getElementById('editModal');
    if(event.target === productModal) {
        productModal.classList.remove('active');
    }
    if(event.target === editModal) {
        editModal.classList.remove('active');
    }
}