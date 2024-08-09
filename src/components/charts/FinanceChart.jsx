import React, { useState } from 'react';
import ReactApexChart from 'react-apexcharts';

const FinanceChart = ({ data }) => {
    const [series] = useState([
        {
            name: 'to\'lov',
            data: data?.map(item => item.amount)
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

export default FinanceChart;
