import React from 'react';

const Dashboard = (props: any) => {
  const { user } = props;
  return (
    <div>
      {user.email}
    </div>
  );
};

export default Dashboard;
