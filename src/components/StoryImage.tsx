// @ts-ignore
import CachedImage, { CacheManager } from 'expo-cached-image';
import { Image } from 'native-base';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Dimensions, Image as RNImage } from 'react-native';

type Props = {
    image: string;
    cacheId?: string;
};

const StoryImage = ({ image, cacheId }: Props) => {
    const [size, setSize] = useState({
        width: 0,
        height: 0,
    });

    const getSize = async () => {
        const uri = await CacheManager.getCachedUri({ key: cacheId + 'story' });
        RNImage.getSize(uri && cacheId ? uri : image, (width, height) => {
            const { width: screenWidth } = Dimensions.get('window');
            const ratio = width / height;
            setSize({
                width: screenWidth,
                height: screenWidth / ratio,
            });
        });
    };
    useEffect(() => {
        getSize();
    }, [image]);
    return cacheId ? (
        <CachedImage
            placeholderContent={
                <ActivityIndicator
                    color="blue"
                    size="small"
                    style={{
                        flex: 1,
                        justifyContent: 'center',
                    }}
                />
            }
            source={{
                uri: image,
                expiresIn: 60 * 60 * 24 * 7,
            }}
            cacheKey={cacheId + 'story'}
            resizeMode="cover"
            style={{
                ...size,
            }}
        />
    ) : (
        <Image
            source={{ uri: image }}
            alt="image"
            width={size.width}
            height={size.height}
        />
    );
};

export default StoryImage;
