export const randomColorFromID = (id: string) => {
    const onlyNumbers = id.replace(/\D/g, '');
    const colors = [
        'amber',
        'emerald',
        'cyan',
        'rose',
        'violet',
        'fuchsia',
        'blue',
        'yellow',
        'red',
        'orange',
        'teal',
    ];

    return colors[parseInt(onlyNumbers, 10) % colors.length];
};
