import Chart from "chart.js/auto";
import React, { useRef, useEffect } from "react";

export default function Graph() {
    const canvas = useRef();

    useEffect(() => {
        const ctx = canvas.current;
        const myChart =  new Chart(ctx, {
            type: "pie",
            data: {
                labels: ["Orders", "Delivered", "Zebras", "Eagles", "Horses"],
                datasets: [
                    {
                        label: "Sale",
                        data: [12, 50, 3, 2, 3],
                        backgroundColor: [
                            "rgba(255, 99, 132, 1)",
                            "rgba(54, 162, 235, 1)",
                            "rgba(255, 206, 86, 1)",
                            "rgba(75, 192, 192, 1)",
                            "rgba(153, 102, 255, 1)",
                            "rgba(255, 159, 64, 1)"
                        ],
                        borderColor: [
                            "rgba(255, 99, 132, 1)",
                            "rgba(54, 162, 235, 1)",
                            "rgba(255, 206, 86, 1)",
                            "rgba(75, 192, 192, 1)",
                            "rgba(153, 102, 255, 1)",
                            "rgba(255, 159, 64, 1)"
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
