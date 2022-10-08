import { Image } from 'native-base';
import React, { useEffect, useState } from 'react';
import { Dimensions, Image as RNImage } from 'react-native';

type Props = {
    image: string;
};

const StoryImage = ({ image }: Props) => {
    const [size, setSize] = useState({
        width: 0,
        height: 0,
    });
    useEffect(() => {
        RNImage.getSize(image, (width, height) => {
            const { width: screenWidth } = Dimensions.get('window');
            const ratio = width / height;
            setSize({
                width: screenWidth,
                height: screenWidth / ratio,
            });
        });
    }, [image]);

    return (
        <Image
            bg="amber.600"
            source={{ uri: image }}
            alt="image"
            width={size.width}
            height={size.height}
        />
    );
};

export default StoryImage;
