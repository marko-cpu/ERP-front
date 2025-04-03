export const dataLine = {
  labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
  datasets: [
    {
      label: "Monthly Sales",
      data: [],
      borderColor: "#6366f1",
      borderWidth: 2,
      pointRadius: 4,
      backgroundColor: "rgba(99, 102, 241, 0.1)",
      tension: 0.4,
    },
  ],
};

export const dataBar = {
  labels: ["Electronics", "Fashion", "Home", "Beauty"],
  datasets: [
    {
      label: "Inventory",
      data: [12, 19, 3, 5],
      backgroundColor: [
        "rgba(182, 206, 235, 0.8)", // Meki plavkasti
        "rgba(255, 182, 193, 0.8)", // Pastel rozi
        "rgba(204, 235, 197, 0.8)", // Svijetlo zeleni
        "rgba(255, 215, 180, 0.8)", // Topli peč
      ],
      borderColor: [
        "#b6ceeb", // Desaturirana plav
        "#ffb6c1", // Klasikni "Baby Pink"
        "#ccebc5", // Mint nijansa
        "#ffd7b4", // Sveži apricot
      ],
      borderWidth: 1,
      borderRadius: 8,
      hoverBackgroundColor: [
        "rgba(182, 206, 235, 1)", // Intenzivnije za hover
        "rgba(255, 182, 193, 1)",
        "rgba(204, 235, 197, 1)",
        "rgba(255, 215, 180, 1)",
      ],
    },
  ],
};
