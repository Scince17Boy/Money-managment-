let bills = JSON.parse(localStorage.getItem("bills")) || [];

function saveBills() {
  localStorage.setItem("bills", JSON.stringify(bills));
}

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString();
}

function renderBills() {
  const search = document.getElementById("searchInput").value.toLowerCase();
  const table = document.getElementById("billTable");
  table.innerHTML = "";

  let paid = 0, unpaid = 0;

  bills.forEach((bill, i) => {
    if (
      bill.name.toLowerCase().includes(search) ||
      bill.month.includes(search)
    ) {
      bill.status === "Paid"
        ? paid += Number(bill.amount)
        : unpaid += Number(bill.amount);

      table.innerHTML += `
        <tr>
          <td>${bill.name}</td>
          <td>${bill.course}</td>
          <td>${formatDate(bill.month)}</td>
          <td>₹${bill.amount}</td>
          <td>${bill.status}</td>
          <td><button onclick="generatePDF(${i})">PDF</button></td>
        </tr>
      `;
    }
  });

  document.getElementById("totalBills").textContent = bills.length;
  document.getElementById("totalPaid").textContent = paid.toFixed(2);
  document.getElementById("totalUnpaid").textContent = unpaid.toFixed(2);
}

function addBill() {
  const bill = {
    name: studentName.value,
    course: course.value,
    month: month.value,
    amount: amount.value,
    status: status.value
  };

  if (!bill.name || !bill.course || !bill.month || !bill.amount) {
    alert("Fill all fields");
    return;
  }

  bills.push(bill);
  saveBills();
  renderBills();
}

function generatePDF(i) {
  const { jsPDF } = window.jspdf;
  const b = bills[i];
  const pdf = new jsPDF();

  pdf.setFontSize(18);
  pdf.text("Institute Fee Invoice", 20, 20);

  pdf.setFontSize(12);
  pdf.text(`Name: ${b.name}`, 20, 40);
  pdf.text(`Course: ${b.course}`, 20, 50);
  pdf.text(`Date: ${formatDate(b.month)}`, 20, 60);
  pdf.text(`Amount: ₹${b.amount}`, 20, 70);
  pdf.text(`Status: ${b.status}`, 20, 80);

  pdf.save(`${b.name}_Invoice.pdf`);
}

function login() {
  if (username.value === "admin" && password.value === "1234") {
    loginPage.style.display = "none";
    mainPage.style.display = "block";
    renderBills();
  } else {
    alert("Wrong credentials");
  }
}
