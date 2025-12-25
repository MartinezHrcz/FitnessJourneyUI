import HeatMap from '@uiw/react-heat-map';

interface HeatMapProps {
    data: {date: string, count: number}[];
}

const FitnessHeatmap = ({data}:HeatMapProps) => {
    const thisYear = new Date().setMonth(0, 1);

    return (
        <div className="w-full overflow-x-auto custom-scrollbar">
            <div className="p-4">
                <HeatMap
                    value={data}
                    width={1000}
                    startDate={new Date(thisYear)}
                    endDate={new Date(new Date().setMonth(11))}
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