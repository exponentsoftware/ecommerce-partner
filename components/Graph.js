import Chart from "chart.js/auto";
import React, { useRef, useEffect } from "react";

export default function Graph({orders, delivered, newProducts}) {
    const canvas = useRef();

    useEffect(() => {
        const ctx = canvas.current;
        const myChart =  new Chart(ctx, {
            type: "pie",
            data: {
                labels: ["Orders", "Delivered", "New Products"],
                datasets: [
                    {
                        label: "Products",
                        data: [orders, delivered, newProducts],
                        backgroundColor: [
                            "rgba(239, 68, 68, 0.8)",
                            "rgba(54, 162, 235, 0.8)",
                            "rgba(255, 206, 86, 0.8)",
                        ],
                        borderColor: [
                            "rgba(239, 68, 68, 0.8)",
                            "rgba(54, 162, 235, 0.8)",
                            "rgba(255, 206, 86, 0.8)",
                        ],
                        borderWidth: 1
                    }
                ]
            },
            options: {
                responsive: true,
            }
        });
        return () => {
            myChart.destroy()
        }
    }, []);

    return (
        <div className="container">
            <canvas id="myChart" ref={canvas}></canvas>
        </div>
    );
}
