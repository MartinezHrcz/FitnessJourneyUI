import HeatMap from '@uiw/react-heat-map';
import {useTheme} from "../hooks/useTheme.ts";

interface HeatMapProps {
    data: {date: string, count: number}[];
}

const FitnessHeatmap = ({data}:HeatMapProps) => {
    const { isDark } = useTheme();
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
            <style>{`
                svg text {
                    fill: ${isDark ? 'white' : 'black'} !important;
                    font-size: 10px;
                    font-weight: 500;
                }
            `}</style>
        </div>
    );
};

export default FitnessHeatmap;