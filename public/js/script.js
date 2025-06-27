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
		case "reservations":
			loadReservations();
			break;
		case "customerOrders":
			loadCustomerOrders();
			break;
		case "handles":
			loadHandles();
			break;
		case "orderItems":
			loadOrderItems();
			break;
		case "discounts":
			loadDiscounts();
			break;
		case "invoices":
			loadInvoices();
			break;
		case "payments":
			loadPayments();
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

	// Reservation form
	document
		.getElementById("addReservationForm")
		.addEventListener("submit", function (e) {
			e.preventDefault();
			if (currentEditId && currentEditType === "reservation") {
				updateReservation();
			} else {
				addReservation();
			}
		});

	// CustomerOrder form
	document
		.getElementById("addCustomerOrderForm")
		.addEventListener("submit", function (e) {
			e.preventDefault();
			if (currentEditId && currentEditType === "customerOrder") {
				updateCustomerOrder();
			} else {
				addCustomerOrder();
			}
		});

	// Handles form
	document
		.getElementById("addHandleForm")
		.addEventListener("submit", function (e) {
			e.preventDefault();
			if (currentEditId && currentEditType === "handle") {
				updateHandle();
			} else {
				addHandle();
			}
		});

	// OrderItem form
	document
		.getElementById("addOrderItemForm")
		.addEventListener("submit", function (e) {
			e.preventDefault();
			if (currentEditId && currentEditType === "orderItem") {
				updateOrderItem();
			} else {
				addOrderItem();
			}
		});

	// Discount form
	document
		.getElementById("addDiscountForm")
		.addEventListener("submit", function (e) {
			e.preventDefault();
			if (currentEditId && currentEditType === "discount") {
				updateDiscount();
			} else {
				addDiscount();
			}
		});

	// Invoice form
	document
		.getElementById("addInvoiceForm")
		.addEventListener("submit", function (e) {
			e.preventDefault();
			if (currentEditId && currentEditType === "invoice") {
				updateInvoice();
			} else {
				addInvoice();
			}
		});

	// Payment form
	document
		.getElementById("addPaymentForm")
		.addEventListener("submit", function (e) {
			e.preventDefault();
			if (currentEditId && currentEditType === "payment") {
				updatePayment();
			} else {
				addPayment();
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
			scrollToForm("customerForm");
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
			scrollToForm("dishForm");
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
                <td>${table.num_seats}</td>
                <td>${renderStatusBadge("table", table.status)}</td>
                <td>
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
			scrollToForm("tableForm");
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
				<td>${roleText[employee.role]}</td>
				<td>${employee.salary ? formatSalary(employee.salary) : "Chưa có"}</td>
				<td>${employee.phones || "Chưa có"}</td>
				<td>${employee.emails || "Chưa có"}</td>
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
			scrollToForm("employeeForm");
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

// ==================== RESERVATION FUNCTIONS ====================
async function loadReservations() {
	try {
		const response = await fetch("/api/reservations");
		const reservations = await response.json();
		const tbody = document.querySelector("#reservationsTable tbody");
		tbody.innerHTML = "";
		reservations.forEach((r) => {
			const statusText = {
				pending: "Chờ xác nhận",
				confirmed: "Đã xác nhận",
				cancelled: "Đã hủy",
			};
			const row = tbody.insertRow();
			row.innerHTML = `
                <td>${r.reservation_id}</td>
                <td>${r.customer_id}</td>
                <td>${r.table_id}</td>
                <td>${formatDateTime(r.reservation_time)}</td>
                <td>${r.number_guests}</td>
                <td>${renderStatusBadge("reservation", r.status)}</td>
                <td>
                    <button class="btn btn-warning btn-sm" onclick="editReservation(${
						r.reservation_id
					})">Sửa</button>
                    <button class="btn btn-danger btn-sm" onclick="deleteReservation(${
						r.reservation_id
					})">Xóa</button>
                </td>
            `;
		});
	} catch (error) {
		showAlert("Lỗi tải dữ liệu đặt bàn: " + error.message, "error");
	}
}

function showAddReservationForm() {
	document.getElementById("reservationForm").style.display = "block";
	document.getElementById("addReservationForm").reset();
	currentEditId = null;
	currentEditType = null;
}

function hideReservationForm() {
	document.getElementById("reservationForm").style.display = "none";
	currentEditId = null;
	currentEditType = null;
}

async function addReservation() {
	const formData = {
		customer_id: parseInt(
			document.getElementById("reservation_customer_id").value
		),
		table_id: parseInt(
			document.getElementById("reservation_table_id").value
		),
		reservation_time: document.getElementById("reservation_time").value,
		number_guests: parseInt(
			document.getElementById("reservation_number_guests").value
		),
		status: document.getElementById("reservation_status").value,
	};
	try {
		const response = await fetch("/api/reservations", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(formData),
		});
		const result = await response.json();
		if (result.success) {
			showAlert("Thêm đặt bàn thành công!", "success");
			hideReservationForm();
			loadReservations();
		} else {
			showAlert("Lỗi: " + result.error, "error");
		}
	} catch (error) {
		showAlert("Lỗi kết nối: " + error.message, "error");
	}
}

async function editReservation(id) {
	try {
		const response = await fetch("/api/reservations");
		const reservations = await response.json();
		const r = reservations.find((r) => r.reservation_id === id);
		if (r) {
			document.getElementById("reservation_customer_id").value =
				r.customer_id;
			document.getElementById("reservation_table_id").value = r.table_id;
			document.getElementById("reservation_time").value =
				r.reservation_time ? r.reservation_time.slice(0, 16) : "";
			document.getElementById("reservation_number_guests").value =
				r.number_guests;
			document.getElementById("reservation_status").value = r.status;
			currentEditId = id;
			currentEditType = "reservation";
			document.getElementById("reservationForm").style.display = "block";
			scrollToForm("reservationForm");
		}
	} catch (error) {
		showAlert("Lỗi tải thông tin đặt bàn: " + error.message, "error");
	}
}

async function updateReservation() {
	const formData = {
		customer_id: parseInt(
			document.getElementById("reservation_customer_id").value
		),
		table_id: parseInt(
			document.getElementById("reservation_table_id").value
		),
		reservation_time: document.getElementById("reservation_time").value,
		number_guests: parseInt(
			document.getElementById("reservation_number_guests").value
		),
		status: document.getElementById("reservation_status").value,
	};
	try {
		const response = await fetch(`/api/reservations/${currentEditId}`, {
			method: "PUT",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(formData),
		});
		const result = await response.json();
		if (result.success) {
			showAlert("Cập nhật đặt bàn thành công!", "success");
			hideReservationForm();
			loadReservations();
		} else {
			showAlert("Lỗi: " + result.error, "error");
		}
	} catch (error) {
		showAlert("Lỗi kết nối: " + error.message, "error");
	}
}

function deleteReservation(id) {
	showDeleteModal(() => confirmDeleteReservation(id));
}

async function confirmDeleteReservation(id) {
	try {
		const response = await fetch(`/api/reservations/${id}`, {
			method: "DELETE",
		});
		const result = await response.json();
		if (result.success) {
			showAlert("Xóa đặt bàn thành công!", "success");
			loadReservations();
		} else {
			showAlert("Lỗi: " + result.error, "error");
		}
	} catch (error) {
		showAlert("Lỗi kết nối: " + error.message, "error");
	}
	hideDeleteModal();
}

// ==================== CUSTOMER ORDER FUNCTIONS ====================
async function loadCustomerOrders() {
	try {
		const response = await fetch("/api/customer-orders");
		const orders = await response.json();
		const tbody = document.querySelector("#customerOrdersTable tbody");
		tbody.innerHTML = "";
		orders.forEach((o) => {
			const statusText = {
				pending: "Chờ phục vụ",
				served: "Đã phục vụ",
				cancelled: "Đã hủy",
			};
			const row = tbody.insertRow();
			row.innerHTML = `
                <td>${o.order_id}</td>
                <td>${o.table_id}</td>
                <td>${formatDateTime(o.order_time)}</td>
                <td>${renderStatusBadge("order", o.status)}</td>
                <td>
                    <button class="btn btn-warning btn-sm" onclick="editCustomerOrder(${
						o.order_id
					})">Sửa</button>
                    <button class="btn btn-danger btn-sm" onclick="deleteCustomerOrder(${
						o.order_id
					})">Xóa</button>
                </td>
            `;
		});
	} catch (error) {
		showAlert("Lỗi tải dữ liệu đơn hàng: " + error.message, "error");
	}
}

function showAddCustomerOrderForm() {
	document.getElementById("customerOrderForm").style.display = "block";
	document.getElementById("addCustomerOrderForm").reset();
	currentEditId = null;
	currentEditType = null;
}

function hideCustomerOrderForm() {
	document.getElementById("customerOrderForm").style.display = "none";
	currentEditId = null;
	currentEditType = null;
}

async function addCustomerOrder() {
	const formData = {
		table_id: parseInt(document.getElementById("order_table_id").value),
		order_time: document.getElementById("order_time").value,
		status: document.getElementById("order_status").value,
	};
	try {
		const response = await fetch("/api/customer-orders", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(formData),
		});
		const result = await response.json();
		if (result.success) {
			showAlert("Thêm đơn hàng thành công!", "success");
			hideCustomerOrderForm();
			loadCustomerOrders();
		} else {
			showAlert("Lỗi: " + result.error, "error");
		}
	} catch (error) {
		showAlert("Lỗi kết nối: " + error.message, "error");
	}
}

async function editCustomerOrder(id) {
	try {
		const response = await fetch("/api/customer-orders");
		const orders = await response.json();
		const o = orders.find((o) => o.order_id === id);
		if (o) {
			document.getElementById("order_table_id").value = o.table_id;
			document.getElementById("order_time").value = o.order_time
				? o.order_time.slice(0, 16)
				: "";
			document.getElementById("order_status").value = o.status;
			currentEditId = id;
			currentEditType = "customerOrder";
			document.getElementById("customerOrderForm").style.display =
				"block";
			scrollToForm("customerOrderForm");
		}
	} catch (error) {
		showAlert("Lỗi tải thông tin đơn hàng: " + error.message, "error");
	}
}

async function updateCustomerOrder() {
	const formData = {
		table_id: parseInt(document.getElementById("order_table_id").value),
		order_time: document.getElementById("order_time").value,
		status: document.getElementById("order_status").value,
	};
	try {
		const response = await fetch(`/api/customer-orders/${currentEditId}`, {
			method: "PUT",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(formData),
		});
		const result = await response.json();
		if (result.success) {
			showAlert("Cập nhật đơn hàng thành công!", "success");
			hideCustomerOrderForm();
			loadCustomerOrders();
		} else {
			showAlert("Lỗi: " + result.error, "error");
		}
	} catch (error) {
		showAlert("Lỗi kết nối: " + error.message, "error");
	}
}

function deleteCustomerOrder(id) {
	showDeleteModal(() => confirmDeleteCustomerOrder(id));
}

async function confirmDeleteCustomerOrder(id) {
	try {
		const response = await fetch(`/api/customer-orders/${id}`, {
			method: "DELETE",
		});
		const result = await response.json();
		if (result.success) {
			showAlert("Xóa đơn hàng thành công!", "success");
			loadCustomerOrders();
		} else {
			showAlert("Lỗi: " + result.error, "error");
		}
	} catch (error) {
		showAlert("Lỗi kết nối: " + error.message, "error");
	}
	hideDeleteModal();
}

// ==================== HANDLES FUNCTIONS ====================
async function loadHandles() {
	try {
		const response = await fetch("/api/handles");
		const handles = await response.json();
		const tbody = document.querySelector("#handlesTable tbody");
		tbody.innerHTML = "";
		handles.forEach((h) => {
			const roleText = {
				waiter: "Phục vụ",
				chef: "Đầu bếp",
				cashier: "Thu ngân",
			};
			const row = tbody.insertRow();
			row.innerHTML = `
                <td>${h.f_name || ""} ${h.l_name || ""} (ID: ${
				h.employee_id
			})</td>
                <td>${h.order_id} (Bàn: ${h.table_id || "?"})</td>
                <td><span class="status-badge status-${h.role_in_order}">${
				roleText[h.role_in_order]
			}</span></td>
                <td class="action-buttons">
                    <button class="btn btn-warning btn-sm" onclick="editHandle(${
						h.employee_id
					},${h.order_id})">Sửa</button>
                    <button class="btn btn-danger btn-sm" onclick="deleteHandle(${
						h.employee_id
					},${h.order_id})">Xóa</button>
                </td>
            `;
		});
	} catch (error) {
		showAlert("Lỗi tải dữ liệu phân công: " + error.message, "error");
	}
}

function showAddHandleForm() {
	document.getElementById("handleForm").style.display = "block";
	document.getElementById("addHandleForm").reset();
	currentEditId = null;
	currentEditType = null;
}

function hideHandleForm() {
	document.getElementById("handleForm").style.display = "none";
	currentEditId = null;
	currentEditType = null;
}

async function addHandle() {
	const formData = {
		employee_id: parseInt(
			document.getElementById("handle_employee_id").value
		),
		order_id: parseInt(document.getElementById("handle_order_id").value),
		role_in_order: document.getElementById("handle_role_in_order").value,
	};
	try {
		const response = await fetch("/api/handles", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(formData),
		});
		const result = await response.json();
		if (result.success) {
			showAlert("Thêm phân công thành công!", "success");
			hideHandleForm();
			loadHandles();
		} else {
			showAlert("Lỗi: " + result.error, "error");
		}
	} catch (error) {
		showAlert("Lỗi kết nối: " + error.message, "error");
	}
}

async function editHandle(employee_id, order_id) {
	try {
		const response = await fetch("/api/handles");
		const handles = await response.json();
		const h = handles.find(
			(h) => h.employee_id === employee_id && h.order_id === order_id
		);
		if (h) {
			document.getElementById("handle_employee_id").value = h.employee_id;
			document.getElementById("handle_order_id").value = h.order_id;
			document.getElementById("handle_role_in_order").value =
				h.role_in_order;
			currentEditId = { employee_id, order_id };
			currentEditType = "handle";
			document.getElementById("handleForm").style.display = "block";
			scrollToForm("handleForm");
		}
	} catch (error) {
		showAlert("Lỗi tải thông tin phân công: " + error.message, "error");
	}
}

async function updateHandle() {
	const old = currentEditId;
	const newEmployeeId = parseInt(
		document.getElementById("handle_employee_id").value
	);
	const newOrderId = parseInt(
		document.getElementById("handle_order_id").value
	);
	const newRole = document.getElementById("handle_role_in_order").value;
	// Nếu thay đổi employee_id hoặc order_id thì xóa bản ghi cũ và thêm mới
	if (old.employee_id !== newEmployeeId || old.order_id !== newOrderId) {
		try {
			// Xóa bản ghi cũ
			await fetch(`/api/handles/${old.employee_id}/${old.order_id}`, {
				method: "DELETE",
			});
			// Thêm bản ghi mới
			const response = await fetch("/api/handles", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					employee_id: newEmployeeId,
					order_id: newOrderId,
					role_in_order: newRole,
				}),
			});
			const result = await response.json();
			if (result.success) {
				showAlert("Cập nhật phân công thành công!", "success");
				hideHandleForm();
				loadHandles();
			} else {
				showAlert("Lỗi: " + result.error, "error");
			}
		} catch (error) {
			showAlert("Lỗi kết nối: " + error.message, "error");
		}
	} else {
		// Nếu không đổi khóa chính thì chỉ update role_in_order
		try {
			const response = await fetch(
				`/api/handles/${old.employee_id}/${old.order_id}`,
				{
					method: "PUT",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({ role_in_order: newRole }),
				}
			);
			const result = await response.json();
			if (result.success) {
				showAlert("Cập nhật phân công thành công!", "success");
				hideHandleForm();
				loadHandles();
			} else {
				showAlert("Lỗi: " + result.error, "error");
			}
		} catch (error) {
			showAlert("Lỗi kết nối: " + error.message, "error");
		}
	}
}

function deleteHandle(employee_id, order_id) {
	showDeleteModal(() => confirmDeleteHandle(employee_id, order_id));
}

async function confirmDeleteHandle(employee_id, order_id) {
	try {
		const response = await fetch(
			`/api/handles/${employee_id}/${order_id}`,
			{
				method: "DELETE",
			}
		);
		const result = await response.json();
		if (result.success) {
			showAlert("Xóa phân công thành công!", "success");
			loadHandles();
		} else {
			showAlert("Lỗi: " + result.error, "error");
		}
	} catch (error) {
		showAlert("Lỗi kết nối: " + error.message, "error");
	}
	hideDeleteModal();
}

// ==================== ORDER ITEM FUNCTIONS ====================
async function loadOrderItems() {
	try {
		const response = await fetch("/api/order-items");
		const items = await response.json();
		const tbody = document.querySelector("#orderItemsTable tbody");
		tbody.innerHTML = "";
		items.forEach((item) => {
			const row = tbody.insertRow();
			row.innerHTML = `
                <td>${item.order_id}</td>
                <td>${item.dish_id}</td>
                <td>${item.dish_name || ""}</td>
                <td>${item.quantity}</td>
                <td>${item.note || ""}</td>
                <td class="action-buttons">
                    <button class="btn btn-warning btn-sm" onclick="editOrderItem(${
						item.order_id
					},${item.dish_id})">Sửa</button>
                    <button class="btn btn-danger btn-sm" onclick="deleteOrderItem(${
						item.order_id
					},${item.dish_id})">Xóa</button>
                </td>
            `;
		});
	} catch (error) {
		showAlert("Lỗi tải dữ liệu món trong đơn: " + error.message, "error");
	}
}

function showAddOrderItemForm() {
	document.getElementById("orderItemForm").style.display = "block";
	document.getElementById("addOrderItemForm").reset();
	currentEditId = null;
	currentEditType = null;
}

function hideOrderItemForm() {
	document.getElementById("orderItemForm").style.display = "none";
	currentEditId = null;
	currentEditType = null;
}

async function addOrderItem() {
	const formData = {
		order_id: parseInt(document.getElementById("orderitem_order_id").value),
		dish_id: parseInt(document.getElementById("orderitem_dish_id").value),
		quantity: parseInt(document.getElementById("orderitem_quantity").value),
		note: document.getElementById("orderitem_note").value,
	};
	try {
		const response = await fetch("/api/order-items", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(formData),
		});
		const result = await response.json();
		if (result.success) {
			showAlert("Thêm món vào đơn thành công!", "success");
			hideOrderItemForm();
			loadOrderItems();
		} else {
			showAlert("Lỗi: " + result.error, "error");
		}
	} catch (error) {
		showAlert("Lỗi kết nối: " + error.message, "error");
	}
}

async function editOrderItem(order_id, dish_id) {
	try {
		const response = await fetch("/api/order-items");
		const items = await response.json();
		const item = items.find(
			(i) => i.order_id === order_id && i.dish_id === dish_id
		);
		if (item) {
			document.getElementById("orderitem_order_id").value = item.order_id;
			document.getElementById("orderitem_dish_id").value = item.dish_id;
			document.getElementById("orderitem_quantity").value = item.quantity;
			document.getElementById("orderitem_note").value = item.note || "";
			currentEditId = { order_id, dish_id };
			currentEditType = "orderItem";
			document.getElementById("orderItemForm").style.display = "block";
			scrollToForm("orderItemForm");
		}
	} catch (error) {
		showAlert("Lỗi tải thông tin món trong đơn: " + error.message, "error");
	}
}

async function updateOrderItem() {
	const old = currentEditId;
	const newOrderId = parseInt(
		document.getElementById("orderitem_order_id").value
	);
	const newDishId = parseInt(
		document.getElementById("orderitem_dish_id").value
	);
	const newQuantity = parseInt(
		document.getElementById("orderitem_quantity").value
	);
	const newNote = document.getElementById("orderitem_note").value;
	// Nếu thay đổi order_id hoặc dish_id thì xóa bản ghi cũ và thêm mới
	if (old.order_id !== newOrderId || old.dish_id !== newDishId) {
		try {
			// Xóa bản ghi cũ
			await fetch(`/api/order-items/${old.order_id}/${old.dish_id}`, {
				method: "DELETE",
			});
			// Thêm bản ghi mới
			const response = await fetch("/api/order-items", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					order_id: newOrderId,
					dish_id: newDishId,
					quantity: newQuantity,
					note: newNote,
				}),
			});
			const result = await response.json();
			if (result.success) {
				showAlert("Cập nhật món trong đơn thành công!", "success");
				hideOrderItemForm();
				loadOrderItems();
			} else {
				showAlert("Lỗi: " + result.error, "error");
			}
		} catch (error) {
			showAlert("Lỗi kết nối: " + error.message, "error");
		}
	} else {
		// Nếu không đổi khóa chính thì chỉ update
		try {
			const response = await fetch(
				`/api/order-items/${old.order_id}/${old.dish_id}`,
				{
					method: "PUT",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({
						new_order_id: newOrderId,
						new_dish_id: newDishId,
						quantity: newQuantity,
						note: newNote,
					}),
				}
			);
			const result = await response.json();
			if (result.success) {
				showAlert("Cập nhật món trong đơn thành công!", "success");
				hideOrderItemForm();
				loadOrderItems();
			} else {
				showAlert("Lỗi: " + result.error, "error");
			}
		} catch (error) {
			showAlert("Lỗi kết nối: " + error.message, "error");
		}
	}
}

function deleteOrderItem(order_id, dish_id) {
	showDeleteModal(() => confirmDeleteOrderItem(order_id, dish_id));
}

async function confirmDeleteOrderItem(order_id, dish_id) {
	try {
		const response = await fetch(
			`/api/order-items/${order_id}/${dish_id}`,
			{
				method: "DELETE",
			}
		);
		const result = await response.json();
		if (result.success) {
			showAlert("Xóa món trong đơn thành công!", "success");
			loadOrderItems();
		} else {
			showAlert("Lỗi: " + result.error, "error");
		}
	} catch (error) {
		showAlert("Lỗi kết nối: " + error.message, "error");
	}
	hideDeleteModal();
}

// ==================== DISCOUNT FUNCTIONS ====================
async function loadDiscounts() {
	try {
		const response = await fetch("/api/discounts");
		const discounts = await response.json();
		const tbody = document.querySelector("#discountsTable tbody");
		tbody.innerHTML = "";
		discounts.forEach((d) => {
			const typeText = { percent: "%", amount: "VNĐ" };
			const activeText = {
				true: "Có",
				false: "Không",
				1: "Có",
				0: "Không",
			};
			const row = tbody.insertRow();
			row.innerHTML = `
                <td>${d.discount_id}</td>
                <td>${d.code}</td>
                <td>${d.description || ""}</td>
                <td>${typeText[d.type]}</td>
                <td>${d.value}</td>
                <td>${d.valid_from}</td>
                <td>${d.valid_to}</td>
                <td>${d.min_order_amount}</td>
                <td>${activeText[d.is_active]}</td>
                <td class="action-buttons">
                    <button class="btn btn-warning btn-sm" onclick="editDiscount(${
						d.discount_id
					})">Sửa</button>
                    <button class="btn btn-danger btn-sm" onclick="deleteDiscount(${
						d.discount_id
					})">Xóa</button>
                </td>
            `;
		});
	} catch (error) {
		showAlert("Lỗi tải dữ liệu giảm giá: " + error.message, "error");
	}
}

function showAddDiscountForm() {
	document.getElementById("discountForm").style.display = "block";
	document.getElementById("addDiscountForm").reset();
	currentEditId = null;
	currentEditType = null;
}

function hideDiscountForm() {
	document.getElementById("discountForm").style.display = "none";
	currentEditId = null;
	currentEditType = null;
}

async function addDiscount() {
	const formData = {
		code: document.getElementById("discount_code").value,
		description: document.getElementById("discount_description").value,
		type: document.getElementById("discount_type").value,
		value: parseInt(document.getElementById("discount_value").value),
		valid_from: document.getElementById("discount_valid_from").value,
		valid_to: document.getElementById("discount_valid_to").value,
		min_order_amount: parseInt(
			document.getElementById("discount_min_order_amount").value
		),
		is_active:
			document.getElementById("discount_is_active").value === "true",
	};
	try {
		const response = await fetch("/api/discounts", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(formData),
		});
		const result = await response.json();
		if (result.success) {
			showAlert("Thêm mã giảm giá thành công!", "success");
			hideDiscountForm();
			loadDiscounts();
		} else {
			showAlert("Lỗi: " + result.error, "error");
		}
	} catch (error) {
		showAlert("Lỗi kết nối: " + error.message, "error");
	}
}

async function editDiscount(id) {
	try {
		const response = await fetch("/api/discounts");
		const discounts = await response.json();
		const d = discounts.find((d) => d.discount_id === id);
		if (d) {
			document.getElementById("discount_code").value = d.code;
			document.getElementById("discount_description").value =
				d.description || "";
			document.getElementById("discount_type").value = d.type;
			document.getElementById("discount_value").value = d.value;
			document.getElementById("discount_valid_from").value = d.valid_from;
			document.getElementById("discount_valid_to").value = d.valid_to;
			document.getElementById("discount_min_order_amount").value =
				d.min_order_amount;
			document.getElementById("discount_is_active").value = d.is_active
				? "true"
				: "false";
			currentEditId = id;
			currentEditType = "discount";
			document.getElementById("discountForm").style.display = "block";
			scrollToForm("discountForm");
		}
	} catch (error) {
		showAlert("Lỗi tải thông tin giảm giá: " + error.message, "error");
	}
}

async function updateDiscount() {
	const formData = {
		code: document.getElementById("discount_code").value,
		description: document.getElementById("discount_description").value,
		type: document.getElementById("discount_type").value,
		value: parseInt(document.getElementById("discount_value").value),
		valid_from: document.getElementById("discount_valid_from").value,
		valid_to: document.getElementById("discount_valid_to").value,
		min_order_amount: parseInt(
			document.getElementById("discount_min_order_amount").value
		),
		is_active:
			document.getElementById("discount_is_active").value === "true",
	};
	try {
		const response = await fetch(`/api/discounts/${currentEditId}`, {
			method: "PUT",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(formData),
		});
		const result = await response.json();
		if (result.success) {
			showAlert("Cập nhật mã giảm giá thành công!", "success");
			hideDiscountForm();
			loadDiscounts();
		} else {
			showAlert("Lỗi: " + result.error, "error");
		}
	} catch (error) {
		showAlert("Lỗi kết nối: " + error.message, "error");
	}
}

function deleteDiscount(id) {
	showDeleteModal(() => confirmDeleteDiscount(id));
}

async function confirmDeleteDiscount(id) {
	try {
		const response = await fetch(`/api/discounts/${id}`, {
			method: "DELETE",
		});
		const result = await response.json();
		if (result.success) {
			showAlert("Xóa mã giảm giá thành công!", "success");
			loadDiscounts();
		} else {
			showAlert("Lỗi: " + result.error, "error");
		}
	} catch (error) {
		showAlert("Lỗi kết nối: " + error.message, "error");
	}
	hideDeleteModal();
}

// ==================== INVOICE FUNCTIONS ====================
async function loadInvoices() {
	try {
		const response = await fetch("/api/invoices");
		const invoices = await response.json();
		const tbody = document.querySelector("#invoicesTable tbody");
		tbody.innerHTML = "";
		invoices.forEach((inv) => {
			const row = tbody.insertRow();
			row.innerHTML = `
                <td>${inv.invoice_id}</td>
                <td>${inv.order_id}</td>
                <td>${inv.discount_id || ""}</td>
                <td>${formatCurrency(inv.total_amount)}</td>
                <td>${formatDateTime(inv.invoice_time)}</td>
                <td class="action-buttons">
                    <button class="btn btn-warning btn-sm" onclick="editInvoice(${
						inv.invoice_id
					})">Sửa</button>
                    <button class="btn btn-danger btn-sm" onclick="deleteInvoice(${
						inv.invoice_id
					})">Xóa</button>
                </td>
            `;
		});
	} catch (error) {
		showAlert("Lỗi tải dữ liệu hóa đơn: " + error.message, "error");
	}
}

function showAddInvoiceForm() {
	document.getElementById("invoiceForm").style.display = "block";
	document.getElementById("addInvoiceForm").reset();
	document.getElementById("invoice_total_amount").value = "";
	currentEditId = null;
	currentEditType = null;
}

function hideInvoiceForm() {
	document.getElementById("invoiceForm").style.display = "none";
	currentEditId = null;
	currentEditType = null;
}

async function addInvoice() {
	const formData = {
		order_id: parseInt(document.getElementById("invoice_order_id").value),
		discount_id: document.getElementById("invoice_discount_id").value
			? parseInt(document.getElementById("invoice_discount_id").value)
			: null,
	};
	try {
		const response = await fetch("/api/invoices", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(formData),
		});
		const result = await response.json();
		if (result.success) {
			showAlert("Tạo hóa đơn thành công!", "success");
			hideInvoiceForm();
			loadInvoices();
		} else {
			showAlert("Lỗi: " + result.error, "error");
		}
	} catch (error) {
		showAlert("Lỗi kết nối: " + error.message, "error");
	}
}

async function editInvoice(id) {
	try {
		const response = await fetch("/api/invoices");
		const invoices = await response.json();
		const inv = invoices.find((i) => i.invoice_id === id);
		if (inv) {
			document.getElementById("invoice_order_id").value = inv.order_id;
			document.getElementById("invoice_discount_id").value =
				inv.discount_id || "";
			document.getElementById("invoice_total_amount").value =
				inv.total_amount;
			currentEditId = id;
			currentEditType = "invoice";
			document.getElementById("invoiceForm").style.display = "block";
			scrollToForm("invoiceForm");
		}
	} catch (error) {
		showAlert("Lỗi tải thông tin hóa đơn: " + error.message, "error");
	}
}

async function updateInvoice() {
	const formData = {
		order_id: parseInt(document.getElementById("invoice_order_id").value),
		discount_id: document.getElementById("invoice_discount_id").value
			? parseInt(document.getElementById("invoice_discount_id").value)
			: null,
	};
	try {
		const response = await fetch(`/api/invoices/${currentEditId}`, {
			method: "PUT",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(formData),
		});
		const result = await response.json();
		if (result.success) {
			showAlert("Cập nhật hóa đơn thành công!", "success");
			hideInvoiceForm();
			loadInvoices();
		} else {
			showAlert("Lỗi: " + result.error, "error");
		}
	} catch (error) {
		showAlert("Lỗi kết nối: " + error.message, "error");
	}
}

function deleteInvoice(id) {
	showDeleteModal(() => confirmDeleteInvoice(id));
}

async function confirmDeleteInvoice(id) {
	try {
		const response = await fetch(`/api/invoices/${id}`, {
			method: "DELETE",
		});
		const result = await response.json();
		if (result.success) {
			showAlert("Xóa hóa đơn thành công!", "success");
			loadInvoices();
		} else {
			showAlert("Lỗi: " + result.error, "error");
		}
	} catch (error) {
		showAlert("Lỗi kết nối: " + error.message, "error");
	}
	hideDeleteModal();
}

// ==================== PAYMENT FUNCTIONS ====================
async function loadPayments() {
	const response = await fetch("/api/payments");
	const payments = await response.json();
	const tbody = document.querySelector("#paymentsTable tbody");
	tbody.innerHTML = "";
	payments.forEach((p) => {
		tbody.innerHTML += `
            <tr>
                <td>${p.payment_id}</td>
                <td>${p.invoice_id}</td>
                <td>${formatPaymentMethod(p.payment_method)}</td>
                <td>${renderStatusBadge("payment", p.status)}</td>
                <td>${formatCurrency(p.total_amount)}</td>
                <td>
                    <button class="btn btn-warning btn-sm" onclick="editPayment(${
						p.payment_id
					})">Sửa</button>
                    <button class="btn btn-danger btn-sm" onclick="deletePayment(${
						p.payment_id
					})">Xóa</button>
                </td>
            </tr>
        `;
	});
}

function showAddPaymentForm() {
	document.getElementById("paymentForm").style.display = "block";
	document.getElementById("addPaymentForm").reset();
	currentEditId = null;
	currentEditType = null;
}

function hidePaymentForm() {
	document.getElementById("paymentForm").style.display = "none";
}

async function addPayment() {
	const invoice_id = document.getElementById("payment_invoice_id").value;
	const payment_method = document.getElementById("payment_method").value;
	const status = document.getElementById("payment_status").value;
	const res = await fetch("/api/payments", {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({ invoice_id, payment_method, status }),
	});
	const data = await res.json();
	if (data.success) {
		hidePaymentForm();
		loadPayments();
	} else {
		alert(data.error || "Lỗi khi thêm thanh toán!");
	}
}

async function editPayment(id) {
	const res = await fetch(`/api/payments/${id}`);
	const p = await res.json();
	document.getElementById("paymentForm").style.display = "block";
	document.getElementById("payment_invoice_id").value = p.invoice_id;
	document.getElementById("payment_method").value = p.payment_method;
	document.getElementById("payment_status").value = p.status;
	currentEditId = id;
	currentEditType = "payment";
}

async function updatePayment() {
	const invoice_id = document.getElementById("payment_invoice_id").value;
	const payment_method = document.getElementById("payment_method").value;
	const status = document.getElementById("payment_status").value;
	const res = await fetch(`/api/payments/${currentEditId}`, {
		method: "PUT",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({ invoice_id, payment_method, status }),
	});
	const data = await res.json();
	if (data.success) {
		hidePaymentForm();
		loadPayments();
	} else {
		alert(data.error || "Lỗi khi cập nhật thanh toán!");
	}
}

async function deletePayment(id) {
	if (!confirm("Bạn có chắc muốn xóa thanh toán này?")) return;
	const res = await fetch(`/api/payments/${id}`, { method: "DELETE" });
	const data = await res.json();
	if (data.success) {
		loadPayments();
	} else {
		alert(data.error || "Lỗi khi xóa thanh toán!");
	}
}

function formatPaymentMethod(method) {
	switch (method) {
		case "cash":
			return "Tiền mặt";
		case "card":
			return "Thẻ";
		case "online-transfer":
			return "Chuyển khoản";
		default:
			return method;
	}
}
function formatPaymentStatus(status) {
	switch (status) {
		case "pending":
			return "Chờ xử lý";
		case "success":
			return "Thành công";
		case "failure":
			return "Thất bại";
		default:
			return status;
	}
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

function formatDateTime(dt) {
	if (!dt) return "";
	const d = new Date(dt);
	return d.toLocaleString("vi-VN");
}

// ========== STATUS BADGE HELPERS ==========
function renderStatusBadge(type, value) {
	// type: 'table', 'reservation', 'order', 'payment', ...
	let text = value;
	let cls = "";
	switch (type) {
		case "table":
			if (value === "available") {
				text = "TRỐNG";
				cls = "status-available";
			} else if (value === "reserved") {
				text = "ĐÃ ĐẶT";
				cls = "status-reserved";
			} else if (value === "occupied") {
				text = "ĐANG SỬ DỤNG";
				cls = "status-occupied";
			}
			break;
		case "reservation":
			if (value === "pending") {
				text = "CHỜ XÁC NHẬN";
				cls = "status-available";
			} else if (value === "confirmed") {
				text = "ĐÃ XÁC NHẬN";
				cls = "status-reserved";
			} else if (value === "cancelled") {
				text = "ĐÃ HỦY";
				cls = "status-inactive";
			}
			break;
		case "order":
			if (value === "pending") {
				text = "CHỜ PHỤC VỤ";
				cls = "status-available";
			} else if (value === "served") {
				text = "ĐÃ PHỤC VỤ";
				cls = "status-reserved";
			} else if (value === "cancelled") {
				text = "ĐÃ HỦY";
				cls = "status-inactive";
			}
			break;
		case "payment":
			if (value === "pending") {
				text = "CHỜ XỬ LÝ";
				cls = "status-available";
			} else if (value === "success") {
				text = "THÀNH CÔNG";
				cls = "status-reserved";
			} else if (value === "failure") {
				text = "THẤT BẠI";
				cls = "status-inactive";
			}
			break;
		default:
			cls = "";
	}
	return `<span class="status-badge ${cls}">${text}</span>`;
}

function scrollToForm(formId) {
	const form = document.getElementById(formId);
	if (form) {
		form.scrollIntoView({ behavior: "smooth", block: "center" });
	}
}
