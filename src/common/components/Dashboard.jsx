import React, { useEffect, useState } from "react";
import AdminService from "../../services/admin.service";
import OrderService from "../../services/order.service";
import ProductService from "../../services/product.service";
import CountUp from "react-countup";
import Card from "./Card";
import { FaBox, FaShoppingCart, FaUsers } from "react-icons/fa";
import { dataLine, dataBar } from "./chartData";
import { Line, Bar } from "react-chartjs-2";
import "../../assets/style/dashboard.css";
import {
  Chart as ChartJS,
  LineElement,
  BarElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
} from "chart.js";
import AuthService from "../../services/auth.service";
import InvoiceService from "../../services/invoices.service";
ChartJS.register(
  LineElement,
  BarElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend
);

const Dashboard = () => {
  const [categoryData, setCategoryData] = useState(null);
  const [data, setData] = useState({ orders: 0, products: 0, users: 0 });
  const [salesData, setSalesData] = useState(dataLine);

  const canFetchOrders = AuthService.hasAnyRole([
    "SALES_MANAGER",
    "ACCOUNTANT",
    "ADMIN",
  ]);
  const canFetchProducts = AuthService.hasAnyRole([
    "INVENTORY_MANAGER",
    "ACCOUNTANT",
    "ADMIN",
  ]);
  const canFetchUsers = AuthService.hasAnyRole(["ADMIN"]);



  useEffect(() => {
    const fetchSalesData = async () => {
      try {
        const response = await InvoiceService.getProductsSoldStats();
        const serverData = response.data;
        
        setSalesData({
          labels: serverData.months,
          datasets: [
            {
              ...dataLine.datasets[0],
              label: "Products Sold",
              data: serverData.counts,
              borderColor: '#10B981',
              backgroundColor: 'rgba(16, 185, 129, 0.1)',
            }
          ]
        });
      } catch (error) {
        console.error("Error fetching sales data:", error);
      }
    };

    if (canFetchOrders) {
      fetchSalesData();
    }
  }, [canFetchOrders]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const promises = [];

        if (canFetchUsers) {
          promises.push(AdminService.getUsersCount());
        }
        if (canFetchOrders) {
          promises.push(OrderService.getOrderCount());
        }
        if (canFetchProducts) {
          promises.push(ProductService.getProductCount());
        }

        const responses = await Promise.all(promises);

        const updatedData = { orders: 0, products: 0, users: 0 };
        let responseIndex = 0;

        if (canFetchUsers) {
          updatedData.users = responses[responseIndex++].data;
        }
        if (canFetchOrders) {
          updatedData.orders = responses[responseIndex++].data;
        }
        if (canFetchProducts) {
          updatedData.products = responses[responseIndex++].data;
        }

        setData(updatedData);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      }
    };

    fetchData();
  }, [canFetchUsers, canFetchOrders, canFetchProducts]);

  const showOrdersCard = AuthService.hasAnyRole([
    "SALES_MANAGER",
    "ACCOUNTANT",
    "ADMIN",
  ]);
  const showProductsCard = AuthService.hasAnyRole([
    "INVENTORY_MANAGER",
    "ACCOUNTANT",
    "ADMIN",
  ]);
  const showUsersCard = AuthService.hasAnyRole(["ADMIN"]);
  const showSalesChart = AuthService.hasAnyRole([
    "SALES_MANAGER",
    "ACCOUNTANT",
    "ADMIN",
  ]);

  const visibleCardsCount = [
    showOrdersCard,
    showProductsCard,
    showUsersCard,
  ].filter(Boolean).length;
  const visibleChartsCount = [showSalesChart, true].filter(Boolean).length;

  useEffect(() => {
    const fetchCategoryData = async () => {
      try {
        const response = await ProductService.getCategoryStats();
        const labels = Object.keys(response.data);
        const data = Object.values(response.data);

        setCategoryData({
          labels,
          datasets: [
            {
              label: "Products by Category",
              data,
              backgroundColor: [
                'rgba(138, 180, 248, 0.8)',  // Sofisticirana svetloplava
                'rgba(247, 143, 179, 0.8)',  // Pastelno roze sa malo više energije
                'rgba(172, 220, 178, 0.8)',  // Prirodna svetlo zelena
                'rgba(255, 194, 102, 0.8)'   // Topli medni ton
              ],
              borderColor: [
                '#8AB4F8',  // Svetloplava, inspirisana Google dizajnom
                '#F78FB3',  // Toplije pastelno roze
                '#ACDCB2',  // Sveža pastelno zelena
                '#FFC266'   // Medno zlatna nijansa
              ],
              borderWidth: 1,
              borderRadius: 10,  // Lagano povećan za moderniji izgled
              hoverBackgroundColor: [
                'rgba(138, 180, 248, 1)',  
                'rgba(247, 143, 179, 1)',
                'rgba(172, 220, 178, 1)',
                'rgba(255, 194, 102, 1)'
              ]
              
            },
          ],
        });
      } catch (error) {
        console.error("Error fetching category data:", error);
      }
    };

    if (canFetchProducts) {
      fetchCategoryData();
    }
  }, [canFetchProducts]);

  return (
    <div className="dashboard-container">
      <h1 className="dashboard-title">Dashboard Overview</h1>

      <div
        className={`row g-4 mb-4 ${
          visibleCardsCount <= 2 ? "justify-content-center" : ""
        }`}
      >
        {showOrdersCard && (
          <div
            className={`col-12 ${
              visibleCardsCount === 1
                ? "col-md-8 col-xl-6"
                : visibleCardsCount === 2
                ? "col-md-6 col-xl-4"
                : "col-md-6 col-xl-4"
            }`}
          >
            {canFetchOrders && (
              <Card
                icon={<FaShoppingCart />}
                title="Total Orders"
                value={<CountUp end={data.orders} duration={2} />}
                colorClass="card-orange"
              />
            )}
          </div>
        )}
        {showProductsCard && (
          <div
            className={`col-12 ${
              visibleCardsCount === 1
                ? "col-md-8 col-xl-6"
                : visibleCardsCount === 2
                ? "col-md-6 col-xl-4"
                : "col-md-6 col-xl-4"
            }`}
          >
            {canFetchProducts && (
              <Card
                icon={<FaBox />}
                title="Products"
                value={<CountUp end={data.products} duration={2} />}
                colorClass="card-blue"
              />
            )}
          </div>
        )}
        {showUsersCard && (
          <div
            className={`col-12 ${
              visibleCardsCount === 1
                ? "col-md-8 col-xl-6"
                : visibleCardsCount === 2
                ? "col-md-6 col-xl-4"
                : "col-md-6 col-xl-4"
            }`}
          >
            {canFetchUsers && (
              <Card
                icon={<FaUsers />}
                title="Active Users"
                value={<CountUp end={data.users} duration={2} />}
                colorClass="card-purple"
              />
            )}
          </div>
        )}
        ,
      </div>

      <div
        className={`row g-4 ${
          visibleChartsCount === 1 ? "justify-content-center" : ""
        }`}
      >
        {AuthService.hasAnyRole(["SALES_MANAGER", "ACCOUNTANT", "ADMIN"]) && (
          <div className="col-12 col-lg-6">
            <div className="chart-card">
              <h3 className="chart-title">Sales Analytics</h3>
              <div className="chart-wrapper">
              <Line
              data={salesData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: { 
                  legend: { 
                    position: "top",
                    labels: {
                      color: "#6B7280",
                      font: {
                        size: 14
                      }
                    }
                  } 
                },
                scales: {
                  y: { 
                    grid: { color: "#e5e7eb" },
                    ticks: {
                      color: "#6B7280",
                      precision: 0
                    }
                  },
                  x: { 
                    grid: { display: false },
                    ticks: {
                      color: "#6B7280"
                    }
                  },
                },
              }}
            />
              </div>
            </div>
          </div>
        )}
        <div
          className={`col-12 col-lg-6 ${
            visibleChartsCount === 1 ? "mx-auto" : ""
          }`}
        >
          <div className="chart-card">
            <h3 className="chart-title">Product Statistics</h3>
            <div className="chart-wrapper">
              <Bar
                data={categoryData || dataBar}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      position: "top",
                      labels: {
                        color: "#6B7280",
                        font: {
                          family: "'Inter', sans-serif",
                          weight: 500,
                          size: 14,
                        },
                        padding: 20,
                        usePointStyle: true,
                        pointStyle: "circle",
                      },
                    },
                    tooltip: {
                      backgroundColor: "rgba(255, 255, 255, 0.95)",
                      titleColor: "#111827",
                      bodyColor: "#374151",
                      borderColor: "#E5E7EB",
                      borderWidth: 1,
                      boxPadding: 6,
                      cornerRadius: 8,
                      displayColors: true,
                      bodyFont: {
                        family: "'Inter', sans-serif",
                        size: 14,
                      },
                      titleFont: {
                        family: "'Inter', sans-serif",
                        size: 16,
                        weight: 600,
                      },
                    },
                  },
                  scales: {
                    y: {
                      grid: {
                        color: "#E5E7EB",
                        borderDash: [4, 4],
                        drawTicks: false,
                      },
                      ticks: {
                        color: "#6B7280",
                        padding: 10,
                        font: {
                          family: "'Inter', sans-serif",
                          size: 12,
                        },
                      },
                      border: {
                        display: false,
                      },
                    },
                    x: {
                      grid: {
                        display: false,
                      },
                      ticks: {
                        color: "#6B7280",
                        font: {
                          family: "'Inter', sans-serif",
                          size: 14,
                          weight: 500,
                        },
                        padding: 15,
                      },
                      border: {
                        color: "#E5E7EB",
                      },
                    },
                  },
                  elements: {
                    bar: {
                      borderRadius: 12,
                      borderWidth: 0,
                      hoverBorderWidth: 2,
                      hoverBorderColor: "rgba(255, 255, 255, 0.8)",
                      hoverBackgroundColor: (context) => {
                        const bgColor =
                          context.dataset.backgroundColor[context.dataIndex];
                        return bgColor.replace("0.8", "1");
                      },
                    },
                  },
                  interaction: {
                    mode: "nearest",
                    intersect: false,
                  },
                  animation: {
                    duration: 800,
                    easing: "easeOutQuart",
                  },
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
