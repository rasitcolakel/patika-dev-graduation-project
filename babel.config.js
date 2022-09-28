module.exports = function (api) {
    api.cache(true);
    return {
        presets: ['babel-preset-expo'],
        plugins: [
            [
                'module-resolver',
                {
                    root: ['.'],
                    alias: {
                        '@screens': './src/screens',
                        '@navigators': './src/navigators',
                        '@features': './src/features',
                        '@components': './src/components',
                        '@store': './src/store',
                        '@services': './src/services',
                    },
                },
            ],
            'react-native-reanimated/plugin',
        ],
    };
};
