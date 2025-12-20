import HeatMap from '@uiw/react-heat-map';

const workoutData = [
    { date: '2025/12/01', count: 2 },
    { date: '2025/12/02', count: 5 },
    { date: '2025/12/05', count: 3 },
];

const FitnessHeatmap = () => {
    return (
        <div className="w-full overflow-x-auto custom-scrollbar">
            <div className="min-w-fit p-4">
                <HeatMap
                    value={workoutData}
                    width={"100%"}
                    startDate={new Date('2025/01/01')}
                    panelColors={{
                        0: '#ebedf0',
                        2: '#9be9a8',
                        4: '#40c463',
                        8: '#216e39',
                    }}
                    rectSize={14}
                    space={3}
                    rectProps={{
                        rx: 3
                    }}
                />
            </div>
        </div>
    );
};

export default FitnessHeatmap;