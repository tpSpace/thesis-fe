export const varBgColor = (props) => {
  const colors = props?.colors || ['#19dcea', '#b22cff'];
  const duration = props?.duration || 5;
  const ease = props?.ease || 'linear';

  return {
    animate: {
      background: colors,
      transition: { duration, ease },
    },
  };
};

export const varBgKenburns = (props) => {
  const duration = props?.duration || 5;
  const ease = props?.ease || 'easeOut';

  return {
    top: {
      animate: {
        scale: [1, 1.25],
        y: [0, -15],
        transformOrigin: ['50% 16%', 'top'],
        transition: { duration, ease },
      },
    },
    right: {
      animate: {
        scale: [1, 1.25],
        x: [0, 20],
        y: [0, -15],
        transformOrigin: ['84% 50%', 'right'],
        transition: { duration, ease },
      },
    },
    bottom: {
      animate: {
        scale: [1, 1.25],
        y: [0, 15],
        transformOrigin: ['50% 84%', 'bottom'],
        transition: { duration, ease },
      },
    },
    left: {
      animate: {
        scale: [1, 1.25],
        x: [0, -20],
        y: [0, 15],
        transformOrigin: ['16% 50%', 'left'],
        transition: { duration, ease },
      },
    },
  };
};
