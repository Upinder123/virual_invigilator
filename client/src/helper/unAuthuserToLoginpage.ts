const unAuthuserToLoginpage = (history: any, from: string) => {
  history.push('/admin/login', {
    error: 'Please log in to continue',
    from: { pathname: from },
  });
};

export default unAuthuserToLoginpage;
