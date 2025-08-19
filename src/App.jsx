import { BrowserRouter, Routes, Route } from "react-router-dom";
import MainLayout from "./Layouts/MainLayout";
import Dashboard from "./Pages/Dashboard";
import AddPurchase from "./Pages/Purchase/AddPurchase";
import ListPurchase from "./Pages/Purchase/ListPurchase";
import AddSales from "./Pages/Sales/AddSales";
import ListSales from "./Pages/Sales/ListSales";
import AddExpense from "./Pages/Expenses/AddExpense";
import ListExpense from "./Pages/Expenses/ListExpense";
import Reports from "./Pages/Reports";
import AddEmployee from "./Pages/Employee/AddEmployee";
import ListEmployee from "./Pages/Employee/ListEmployee";
import ViewEmployee from "./Pages/Employee/ViewEmployee";
import AddPurchaseParty from "./Pages/Party/AddPurchaseParty";
import AddSaleParty from "./Pages/Party/AddSaleParty";
import ListPurchaseParties from "./Pages/Party/ListPurchaseParties";
import ListSaleParties from "./Pages/Party/ListSaleParties";
import Attendance from "./Pages/Attendance";
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="purchase/add" element={<AddPurchase />} />
          <Route path="purchase/list" element={<ListPurchase />} />
          <Route path="sales/add" element={<AddSales />} />
          <Route path="sales/list" element={<ListSales />} />
          <Route path="expenses/add" element={<AddExpense />} />
          <Route path="expenses/list" element={<ListExpense />} />
          <Route path="employee/add" element={<AddEmployee />} />
          <Route path="employee/list" element={<ListEmployee />} />
          <Route path="reports" element={<Reports />} />
          <Route path="party/purchaseparty/add" element={<AddPurchaseParty />} />
          <Route path="party/saleparty/add" element={<AddSaleParty />} />
          <Route path="party/purchase/list" element={<ListPurchaseParties />} />
          <Route path="party/sale/list" element={<ListSaleParties />} />
          <Route path="/employees/:id" element={<ViewEmployee />} />
          <Route path="/attendance" element={<Attendance/>} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
