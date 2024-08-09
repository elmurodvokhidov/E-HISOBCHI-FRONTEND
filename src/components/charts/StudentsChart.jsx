import React, { useState } from 'react';
import ReactApexChart from 'react-apexcharts';

const StudentsChart = ({ data }) => {
    const [series] = useState([
        {
            name: 'o\'quvchi',
            data: data?.map((_, index) => index + 1)
        }
    ]);

    const [options] = useState({
        chart: {
            height: 350,
            type: 'area'
        },
        dataLabels: {
            enabled: false
        },
        stroke: {
            curve: 'smooth'
        },
        xaxis: {
            type: 'datetime',
            categories: data?.map(item => item.createdAt)
        },
        tooltip: {
            x: {
                format: 'dd/MM/yy'
            }
        },
        colors: ['#4DACE4']
    });

    return (
        <>
            <ReactApexChart options={options} series={series} type="area" height={350} />
        </>
    );
};

export default StudentsChart;