const config = {
  screens: {
    Login: {
      path: 'login?token=code',
      parse: {
        code: (code: string) => code,
      },
    },
  },
};

const linking = {
  prefixes: ['oncrm://'],
  config,
};

export default linking;
