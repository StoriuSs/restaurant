// Biến toàn cục
let currentEditId = null;
let currentEditType = null;

// Khởi tạo khi trang load
document.addEventListener("DOMContentLoaded", function () {
	// Tải dữ liệu ban đầu
	loadCustomers();

	// Thiết lập form submissions
	setupFormSubmissions();
});

// ==================== TAB MANAGEMENT ====================
function showTab(tabName) {
	// Ẩn tất cả tab content
	const tabContents = document.querySelectorAll(".tab-content");
	tabContents.forEach((tab) => tab.classList.remove("active"));

	// Ẩn tất cả tab buttons active
	const tabButtons = document.querySelectorAll(".tab-button");
	tabButtons.forEach((button) => button.classList.remove("active"));

	// Hiển thị tab được chọn
	document.getElementById(tabName).classList.add("active");
	event.target.classList.add("active");

	// Tải dữ liệu tương ứng
	switch (tabName) {
		case "customers":
			loadCustomers();
			break;
		case "dishes":
			loadDishes();
			break;
		case "tables":
			loadTables();
			break;
		case "employees":
			loadEmployees();
			break;
	}
}

// ==================== FORM SETUP ====================
function setupFormSubmissions() {
	// Customer form
	document
		.getElementById("addCustomerForm")
		.addEventListener("submit", function (e) {
			e.preventDefault();
			if (currentEditId && currentEditType === "customer") {
				updateCustomer();
			} else {
				addCustomer();
			}
		});

	// Dish form
	document
		.getElementById("addDishForm")
		.addEventListener("submit", function (e) {
			e.preventDefault();
			if (currentEditId && currentEditType === "dish") {
				updateDish();
			} else {
				addDish();
			}
		});

	// Table form
	document
		.getElementById("addTableForm")
		.addEventListener("submit", function (e) {
			e.preventDefault();
			if (currentEditId && currentEditType === "table") {
				updateTable();
			} else {
				addTable();
			}
		});

	// Employee form
	document
		.getElementById("addEmployeeForm")
		.addEventListener("submit", function (e) {
			e.preventDefault();
			if (currentEditId && currentEditType === "employee") {
				updateEmployee();
			} else {
				addEmployee();
			}
		});
}

// ==================== CUSTOMER FUNCTIONS ====================
async function loadCustomers() {
	try {
		const response = await fetch("/api/customers");
		const customers = await response.json();

		const tbody = document.querySelector("#customersTable tbody");
		tbody.innerHTML = "";

		customers.forEach((customer) => {
			const row = tbody.insertRow();
			row.innerHTML = `
                <td>${customer.customer_id}</td>
                <td>${customer.f_name} ${customer.l_name}</td>
                <td>${customer.age}</td>
                <td>${customer.phones || "Chưa có"}</td>
                <td>${customer.emails || "Chưa có"}</td>
                <td class="action-buttons">
                    <button class="btn btn-warning btn-sm" onclick="editCustomer(${
						customer.customer_id
					})">Sửa</button>
                    <button class="btn btn-danger btn-sm" onclick="deleteCustomer(${
						customer.customer_id
					})">Xóa</button>
                </td>
            `;
		});
	} catch (error) {
		showAlert("Lỗi tải dữ liệu khách hàng: " + error.message, "error");
	}
}

function showAddCustomerForm() {
	document.getElementById("customerForm").style.display = "block";
	document.getElementById("addCustomerForm").reset();
	currentEditId = null;
	currentEditType = null;
}

function hideCustomerForm() {
	document.getElementById("customerForm").style.display = "none";
	currentEditId = null;
	currentEditType = null;
}

async function addCustomer() {
	const formData = {
		f_name: document.getElementById("customer_f_name").value,
		l_name: document.getElementById("customer_l_name").value,
		age: parseInt(document.getElementById("customer_age").value),
		phone: document.getElementById("customer_phone").value,
		email: document.getElementById("customer_email").value,
	};

	try {
		const response = await fetch("/api/customers", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(formData),
		});

		const result = await response.json();

		if (result.success) {
			showAlert("Thêm khách hàng thành công!", "success");
			hideCustomerForm();
			loadCustomers();
		} else {
			showAlert("Lỗi: " + result.error, "error");
		}
	} catch (error) {
		showAlert("Lỗi kết nối: " + error.message, "error");
	}
}

async function editCustomer(id) {
	try {
		const response = await fetch("/api/customers");
		const customers = await response.json();
		const customer = customers.find((c) => c.customer_id === id);

		if (customer) {
			document.getElementById("customer_f_name").value = customer.f_name;
			document.getElementById("customer_l_name").value = customer.l_name;
			document.getElementById("customer_age").value = customer.age;
			document.getElementById("customer_phone").value =
				customer.phones || "";
			document.getElementById("customer_email").value =
				customer.emails || "";

			currentEditId = id;
			currentEditType = "customer";
			document.getElementById("customerForm").style.display = "block";
		}
	} catch (error) {
		showAlert("Lỗi tải thông tin khách hàng: " + error.message, "error");
	}
}

async function updateCustomer() {
	const formData = {
		f_name: document.getElementById("customer_f_name").value,
		l_name: document.getElementById("customer_l_name").value,
		age: parseInt(document.getElementById("customer_age").value),
		phone: document.getElementById("customer_phone").value,
		email: document.getElementById("customer_email").value,
	};

	try {
		const response = await fetch(`/api/customers/${currentEditId}`, {
			method: "PUT",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(formData),
		});

		const result = await response.json();

		if (result.success) {
			showAlert("Cập nhật khách hàng thành công!", "success");
			hideCustomerForm();
			loadCustomers();
		} else {
			showAlert("Lỗi: " + result.error, "error");
		}
	} catch (error) {
		showAlert("Lỗi kết nối: " + error.message, "error");
	}
}

function deleteCustomer(id) {
	showDeleteModal(() => confirmDeleteCustomer(id));
}

async function confirmDeleteCustomer(id) {
	try {
		const response = await fetch(`/api/customers/${id}`, {
			method: "DELETE",
		});

		const result = await response.json();

		if (result.success) {
			showAlert("Xóa khách hàng thành công!", "success");
			loadCustomers();
		} else {
			showAlert("Lỗi: " + result.error, "error");
		}
	} catch (error) {
		showAlert("Lỗi kết nối: " + error.message, "error");
	}
	hideDeleteModal();
}

// ==================== DISH FUNCTIONS ====================
async function loadDishes() {
	try {
		const response = await fetch("/api/dishes");
		const dishes = await response.json();

		const tbody = document.querySelector("#dishesTable tbody");
		tbody.innerHTML = "";

		dishes.forEach((dish) => {
			const row = tbody.insertRow();
			row.innerHTML = `
                <td>${dish.dish_id}</td>
                <td>${dish.name}</td>
                <td>${dish.category || "Chưa phân loại"}</td>
                <td>${formatCurrency(dish.price)}</td>
                <td><span class="status-badge ${
					dish.availability ? "status-active" : "status-inactive"
				}">${dish.availability ? "Còn phục vụ" : "Hết món"}</span></td>
                <td class="action-buttons">
                    <button class="btn btn-warning btn-sm" onclick="editDish(${
						dish.dish_id
					})">Sửa</button>
                    <button class="btn btn-danger btn-sm" onclick="deleteDish(${
						dish.dish_id
					})">Xóa</button>
                </td>
            `;
		});
	} catch (error) {
		showAlert("Lỗi tải dữ liệu món ăn: " + error.message, "error");
	}
}

function showAddDishForm() {
	document.getElementById("dishForm").style.display = "block";
	document.getElementById("addDishForm").reset();
	document.getElementById("dish_availability").checked = true;
	currentEditId = null;
	currentEditType = null;
}

function hideDishForm() {
	document.getElementById("dishForm").style.display = "none";
	currentEditId = null;
	currentEditType = null;
}

async function addDish() {
	const formData = {
		name: document.getElementById("dish_name").value,
		category: document.getElementById("dish_category").value,
		price: parseInt(document.getElementById("dish_price").value),
		description: document.getElementById("dish_description").value,
		availability: document.getElementById("dish_availability").checked,
	};

	try {
		const response = await fetch("/api/dishes", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(formData),
		});

		const result = await response.json();

		if (result.success) {
			showAlert("Thêm món ăn thành công!", "success");
			hideDishForm();
			loadDishes();
		} else {
			showAlert("Lỗi: " + result.error, "error");
		}
	} catch (error) {
		showAlert("Lỗi kết nối: " + error.message, "error");
	}
}

async function editDish(id) {
	try {
		const response = await fetch("/api/dishes");
		const dishes = await response.json();
		const dish = dishes.find((d) => d.dish_id === id);

		if (dish) {
			document.getElementById("dish_name").value = dish.name;
			document.getElementById("dish_category").value =
				dish.category || "";
			document.getElementById("dish_price").value = dish.price;
			document.getElementById("dish_description").value =
				dish.description || "";
			document.getElementById("dish_availability").checked =
				dish.availability;

			currentEditId = id;
			currentEditType = "dish";
			document.getElementById("dishForm").style.display = "block";
		}
	} catch (error) {
		showAlert("Lỗi tải thông tin món ăn: " + error.message, "error");
	}
}

async function updateDish() {
	const formData = {
		name: document.getElementById("dish_name").value,
		category: document.getElementById("dish_category").value,
		price: parseInt(document.getElementById("dish_price").value),
		description: document.getElementById("dish_description").value,
		availability: document.getElementById("dish_availability").checked,
	};

	try {
		const response = await fetch(`/api/dishes/${currentEditId}`, {
			method: "PUT",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(formData),
		});

		const result = await response.json();

		if (result.success) {
			showAlert("Cập nhật món ăn thành công!", "success");
			hideDishForm();
			loadDishes();
		} else {
			showAlert("Lỗi: " + result.error, "error");
		}
	} catch (error) {
		showAlert("Lỗi kết nối: " + error.message, "error");
	}
}

function deleteDish(id) {
	showDeleteModal(() => confirmDeleteDish(id));
}

async function confirmDeleteDish(id) {
	try {
		const response = await fetch(`/api/dishes/${id}`, {
			method: "DELETE",
		});

		const result = await response.json();

		if (result.success) {
			showAlert("Xóa món ăn thành công!", "success");
			loadDishes();
		} else {
			showAlert("Lỗi: " + result.error, "error");
		}
	} catch (error) {
		showAlert("Lỗi kết nối: " + error.message, "error");
	}
	hideDeleteModal();
}

// ==================== TABLE FUNCTIONS ====================
async function loadTables() {
	try {
		const response = await fetch("/api/tables");
		const tables = await response.json();

		const tbody = document.querySelector("#tablesTable tbody");
		tbody.innerHTML = "";

		tables.forEach((table) => {
			const statusText = {
				available: "Trống",
				reserved: "Đã đặt",
				occupied: "Đang sử dụng",
			};

			const row = tbody.insertRow();
			row.innerHTML = `
                <td>${table.table_id}</td>
                <td>${table.num_seats} ghế</td>
                <td><span class="status-badge status-${table.status}">${
				statusText[table.status]
			}</span></td>
                <td class="action-buttons">
                    <button class="btn btn-warning btn-sm" onclick="editTable(${
						table.table_id
					})">Sửa</button>
                    <button class="btn btn-danger btn-sm" onclick="deleteTable(${
						table.table_id
					})">Xóa</button>
                </td>
            `;
		});
	} catch (error) {
		showAlert("Lỗi tải dữ liệu bàn ăn: " + error.message, "error");
	}
}

function showAddTableForm() {
	document.getElementById("tableForm").style.display = "block";
	document.getElementById("addTableForm").reset();
	currentEditId = null;
	currentEditType = null;
}

function hideTableForm() {
	document.getElementById("tableForm").style.display = "none";
	currentEditId = null;
	currentEditType = null;
}

async function addTable() {
	const formData = {
		num_seats: parseInt(document.getElementById("table_num_seats").value),
		status: document.getElementById("table_status").value,
	};

	try {
		const response = await fetch("/api/tables", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(formData),
		});

		const result = await response.json();

		if (result.success) {
			showAlert("Thêm bàn ăn thành công!", "success");
			hideTableForm();
			loadTables();
		} else {
			showAlert("Lỗi: " + result.error, "error");
		}
	} catch (error) {
		showAlert("Lỗi kết nối: " + error.message, "error");
	}
}

async function editTable(id) {
	try {
		const response = await fetch("/api/tables");
		const tables = await response.json();
		const table = tables.find((t) => t.table_id === id);

		if (table) {
			document.getElementById("table_num_seats").value = table.num_seats;
			document.getElementById("table_status").value = table.status;

			currentEditId = id;
			currentEditType = "table";
			document.getElementById("tableForm").style.display = "block";
		}
	} catch (error) {
		showAlert("Lỗi tải thông tin bàn ăn: " + error.message, "error");
	}
}

async function updateTable() {
	const formData = {
		num_seats: parseInt(document.getElementById("table_num_seats").value),
		status: document.getElementById("table_status").value,
	};

	try {
		const response = await fetch(`/api/tables/${currentEditId}`, {
			method: "PUT",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(formData),
		});

		const result = await response.json();

		if (result.success) {
			showAlert("Cập nhật bàn ăn thành công!", "success");
			hideTableForm();
			loadTables();
		} else {
			showAlert("Lỗi: " + result.error, "error");
		}
	} catch (error) {
		showAlert("Lỗi kết nối: " + error.message, "error");
	}
}

function deleteTable(id) {
	showDeleteModal(() => confirmDeleteTable(id));
}

async function confirmDeleteTable(id) {
	try {
		const response = await fetch(`/api/tables/${id}`, {
			method: "DELETE",
		});

		const result = await response.json();

		if (result.success) {
			showAlert("Xóa bàn ăn thành công!", "success");
			loadTables();
		} else {
			showAlert("Lỗi: " + result.error, "error");
		}
	} catch (error) {
		showAlert("Lỗi kết nối: " + error.message, "error");
	}
	hideDeleteModal();
}

// ==================== EMPLOYEE FUNCTIONS ====================
async function loadEmployees() {
	try {
		const response = await fetch("/api/employees");
		const employees = await response.json();

		const tbody = document.querySelector("#employeesTable tbody");
		tbody.innerHTML = "";

		employees.forEach((employee) => {
			const roleText = {
				waiter: "Phục vụ",
				chef: "Đầu bếp",
				cashier: "Thu ngân",
			};

			const row = tbody.insertRow();
			row.innerHTML = `
                <td>${employee.employee_id}</td>
                <td>${employee.f_name} ${employee.l_name}</td>
                <td>${formatDate(employee.DoB)}</td>
                <td>${roleText[employee.role]}</td>                <td>${
				employee.salary ? formatSalary(employee.salary) : "Chưa có"
			}</td>
                <td>${employee.phones || "Chưa có"}</td>
                <td class="action-buttons">
                    <button class="btn btn-warning btn-sm" onclick="editEmployee(${
						employee.employee_id
					})">Sửa</button>
                    <button class="btn btn-danger btn-sm" onclick="deleteEmployee(${
						employee.employee_id
					})">Xóa</button>
                </td>
            `;
		});
	} catch (error) {
		showAlert("Lỗi tải dữ liệu nhân viên: " + error.message, "error");
	}
}

function showAddEmployeeForm() {
	document.getElementById("employeeForm").style.display = "block";
	document.getElementById("addEmployeeForm").reset();
	currentEditId = null;
	currentEditType = null;
}

function hideEmployeeForm() {
	document.getElementById("employeeForm").style.display = "none";
	currentEditId = null;
	currentEditType = null;
}

async function addEmployee() {
	const formData = {
		f_name: document.getElementById("employee_f_name").value,
		l_name: document.getElementById("employee_l_name").value,
		DoB: document.getElementById("employee_dob").value,
		gender: document.getElementById("employee_gender").value,
		hired_date: document.getElementById("employee_hired_date").value,
		role: document.getElementById("employee_role").value,
		shift: document.getElementById("employee_shift").value,
		salary: document.getElementById("employee_salary").value
			? Math.round(
					parseFloat(
						document.getElementById("employee_salary").value
					) * 100
			  ) / 100
			: null,
		phone: document.getElementById("employee_phone").value,
		email: document.getElementById("employee_email").value,
	};

	try {
		const response = await fetch("/api/employees", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(formData),
		});

		const result = await response.json();

		if (result.success) {
			showAlert("Thêm nhân viên thành công!", "success");
			hideEmployeeForm();
			loadEmployees();
		} else {
			showAlert("Lỗi: " + result.error, "error");
		}
	} catch (error) {
		showAlert("Lỗi kết nối: " + error.message, "error");
	}
}

async function editEmployee(id) {
	try {
		const response = await fetch("/api/employees");
		const employees = await response.json();
		const employee = employees.find((e) => e.employee_id === id);

		if (employee) {
			document.getElementById("employee_f_name").value = employee.f_name;
			document.getElementById("employee_l_name").value = employee.l_name;
			document.getElementById("employee_dob").value = formatDateForInput(
				employee.DoB
			);
			document.getElementById("employee_gender").value = employee.gender;
			document.getElementById("employee_hired_date").value =
				formatDateForInput(employee.hired_date);
			document.getElementById("employee_role").value = employee.role;
			document.getElementById("employee_shift").value =
				employee.shift || "";
			document.getElementById("employee_salary").value =
				employee.salary || "";
			document.getElementById("employee_phone").value =
				employee.phones || "";
			document.getElementById("employee_email").value =
				employee.emails || "";

			currentEditId = id;
			currentEditType = "employee";
			document.getElementById("employeeForm").style.display = "block";
		}
	} catch (error) {
		showAlert("Lỗi tải thông tin nhân viên: " + error.message, "error");
	}
}

async function updateEmployee() {
	const formData = {
		f_name: document.getElementById("employee_f_name").value,
		l_name: document.getElementById("employee_l_name").value,
		DoB: document.getElementById("employee_dob").value,
		gender: document.getElementById("employee_gender").value,
		hired_date: document.getElementById("employee_hired_date").value,
		role: document.getElementById("employee_role").value,
		shift: document.getElementById("employee_shift").value,
		salary: document.getElementById("employee_salary").value
			? Math.round(
					parseFloat(
						document.getElementById("employee_salary").value
					) * 100
			  ) / 100
			: null,
		phone: document.getElementById("employee_phone").value,
		email: document.getElementById("employee_email").value,
	};

	try {
		const response = await fetch(`/api/employees/${currentEditId}`, {
			method: "PUT",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(formData),
		});

		const result = await response.json();

		if (result.success) {
			showAlert("Cập nhật nhân viên thành công!", "success");
			hideEmployeeForm();
			loadEmployees();
		} else {
			showAlert("Lỗi: " + result.error, "error");
		}
	} catch (error) {
		showAlert("Lỗi kết nối: " + error.message, "error");
	}
}

function deleteEmployee(id) {
	showDeleteModal(() => confirmDeleteEmployee(id));
}

async function confirmDeleteEmployee(id) {
	try {
		const response = await fetch(`/api/employees/${id}`, {
			method: "DELETE",
		});

		const result = await response.json();

		if (result.success) {
			showAlert("Xóa nhân viên thành công!", "success");
			loadEmployees();
		} else {
			showAlert("Lỗi: " + result.error, "error");
		}
	} catch (error) {
		showAlert("Lỗi kết nối: " + error.message, "error");
	}
	hideDeleteModal();
}

// ==================== UTILITY FUNCTIONS ====================
function formatCurrency(amount) {
	return new Intl.NumberFormat("vi-VN", {
		style: "currency",
		currency: "VND",
	}).format(amount);
}

function formatDate(dateString) {
	if (!dateString) return "Chưa có";
	const date = new Date(dateString);
	return date.toLocaleDateString("vi-VN");
}

function formatDateForInput(dateString) {
	if (!dateString) return "";
	const date = new Date(dateString);
	return date.toISOString().split("T")[0];
}

function showAlert(message, type) {
	// Xóa alert cũ nếu có
	const existingAlert = document.querySelector(".alert");
	if (existingAlert) {
		existingAlert.remove();
	}

	// Tạo alert mới
	const alertDiv = document.createElement("div");
	alertDiv.className = `alert alert-${
		type === "error" ? "error" : "success"
	}`;
	alertDiv.textContent = message;

	// Thêm vào container
	const container = document.querySelector(".container");
	container.insertBefore(alertDiv, container.firstChild);

	// Tự động ẩn sau 5 giây
	setTimeout(() => {
		alertDiv.remove();
	}, 5000);
}

function showDeleteModal(confirmCallback) {
	document.getElementById("deleteModal").style.display = "flex";
	document.getElementById("confirmDelete").onclick = confirmCallback;
}

function hideDeleteModal() {
	document.getElementById("deleteModal").style.display = "none";
}

function formatSalary(salary) {
	if (!salary) return "Chưa có";

	// Làm tròn đến 2 chữ số thập phân và loại bỏ số 0 thừa
	const roundedSalary = Math.round(parseFloat(salary) * 100) / 100;

	// Chuyển thành string và loại bỏ .00 nếu là số nguyên
	const salaryStr =
		roundedSalary % 1 === 0
			? roundedSalary.toString()
			: roundedSalary.toFixed(2);

	return salaryStr + " tr";
}
