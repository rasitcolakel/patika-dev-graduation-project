import * as React from 'react';
import Svg, { Circle, CircleProps, SvgProps } from 'react-native-svg';

type Props = SvgProps & {
    circleProps?: CircleProps;
    count: number;
};

function StatusCircle(props: Props) {
    return (
        <Svg viewBox="0 0 100 100" {...props}>
            {props.count > 0 && (
                <Circle
                    cx={50}
                    cy={50}
                    r={48}
                    fill="none"
                    stroke="green"
                    strokeWidth={4}
                    strokeDashoffset={-2}
                    {...(props.count > 1 && {
                        strokeDasharray: [300 / props.count, 2],
                    })}
                    {...props.circleProps}
                />
            )}
            {props.children}
        </Svg>
    );
}

export default StatusCircle;
