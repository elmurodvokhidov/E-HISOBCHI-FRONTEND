import React, { useEffect, useState } from 'react';
import ReactApexChart from 'react-apexcharts';
import moment from 'moment'; // Make sure you have moment installed
import { allGroupSuccess, groupFailure, groupStart } from '../../redux/slices/groupSlice';
import AuthService from '../../config/authService';
import { useDispatch } from 'react-redux';

const TimelineChart = () => {
    const [series, setSeries] = useState([]);
    const dispatch = useDispatch();

    useEffect(() => {
        const getAllGroups = async () => {
            try {
                dispatch(groupStart());
                const { data } = await AuthService.getAllGroups();
                dispatch(allGroupSuccess(data));
                const processedData = data.data.map(group => {
                    return {
                        data: [
                            {
                                x: group.name,
                                y: [
                                    new Date(group.start_date).getTime(),
                                    new Date(group.end_date).getTime()
                                ],
                                fillColor: group.color
                            }
                        ]
                    };
                });
                setSeries(processedData);
            } catch (error) {
                dispatch(groupFailure(error.message));
            }
        };

        getAllGroups();
    }, []);

    const [options] = useState({
        chart: {
            height: 350,
            type: 'rangeBar'
        },
        plotOptions: {
            bar: {
                horizontal: true,
                distributed: true,
                dataLabels: {
                    hideOverflowingLabels: false
                }
            }
        },
        dataLabels: {
            enabled: true,
            formatter: function (val, opts) {
                let label = opts.w.globals.labels[opts.dataPointIndex]
                let a = moment(val[0])
                let b = moment(val[1])
                let diff = b.diff(a, 'days')
                return label + ': ' + diff + (diff > 1 ? ' days' : ' day')
            },
            style: {
                colors: ['#f3f4f5', '#fff']
            }
        },
        xaxis: {
            type: 'datetime'
        },
        yaxis: {
            show: false
        },
        grid: {
            row: {
                colors: ['#f3f4f5', '#fff'],
                opacity: 1
            }
        }
    });

    return (
        <>
            <ReactApexChart options={options} series={series} type="rangeBar" height={350} />
        </>
    );
};

export default TimelineChart;
